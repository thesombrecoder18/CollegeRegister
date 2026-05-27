import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateInscriptionDto,
  ValiderInscriptionDto,
  RejeterInscriptionDto,
  DeplacerEleveDto,
} from './dto/inscription.dto';
import {
  generateReference,
  getMontantForNiveau,
  getClassesForNiveau,
  CLASSES_SUFFIXES,
} from '../common/constants';
import { StatutInscription } from '@prisma/client';
import { JwtPayload } from '../common/decorators/current-user.decorator';

@Injectable()
export class InscriptionService {
  constructor(private prisma: PrismaService) {}

  async createPublic(slug: string, dto: CreateInscriptionDto) {
    const ecole = await this.prisma.ecole.findUnique({
      where: { slug },
      include: { configuration: true },
    });

    if (!ecole || ecole.statut !== 'ACTIVE') {
      throw new NotFoundException('Établissement introuvable');
    }

    if (!ecole.configuration) {
      throw new BadRequestException('Configuration manquante');
    }

    const montantAttendu = getMontantForNiveau(
      dto.niveau,
      ecole.configuration,
    );
    const reference = generateReference(dto.operateur);

    return this.prisma.inscription.create({
      data: {
        ecoleId: ecole.id,
        nom: dto.nom,
        prenom: dto.prenom,
        niveau: dto.niveau,
        telephone: dto.telephone,
        operateur: dto.operateur,
        reference,
        montantAttendu,
        preuveImage: dto.preuveImage,
      },
    });
  }

  async suiviDossier(slug: string, telephone?: string, reference?: string) {
    if (!telephone && !reference) {
      throw new BadRequestException(
        'Téléphone ou référence requis pour le suivi',
      );
    }

    const ecole = await this.prisma.ecole.findUnique({ where: { slug } });
    if (!ecole) {
      throw new NotFoundException('Établissement introuvable');
    }

    const inscription = await this.prisma.inscription.findFirst({
      where: {
        ecoleId: ecole.id,
        ...(reference ? { reference } : { telephone }),
      },
      select: {
        reference: true,
        nom: true,
        prenom: true,
        niveau: true,
        classe: true,
        statut: true,
        montantAttendu: true,
        dateInscrit: true,
        adminNotes: true,
      },
    });

    if (!inscription) {
      throw new NotFoundException('Dossier introuvable');
    }

    return inscription;
  }

  async findAllForEcole(ecoleId: string, statut?: StatutInscription) {
    return this.prisma.inscription.findMany({
      where: {
        ecoleId,
        ...(statut ? { statut } : {}),
      },
      orderBy: { dateInscrit: 'desc' },
    });
  }

  async findOne(id: string, user: JwtPayload) {
    const inscription = await this.prisma.inscription.findUnique({
      where: { id },
    });

    if (!inscription) {
      throw new NotFoundException('Inscription introuvable');
    }

    this.assertTenantAccess(inscription.ecoleId, user);
    return inscription;
  }

  async valider(id: string, dto: ValiderInscriptionDto, user: JwtPayload) {
    const inscription = await this.findOne(id, user);

    if (inscription.statut !== 'EN_ATTENTE') {
      throw new BadRequestException('Cette inscription a déjà été traitée');
    }

    const classe = await this.assignClasseRoundRobin(
      inscription.ecoleId,
      inscription.niveau,
    );

    return this.prisma.inscription.update({
      where: { id },
      data: {
        statut: 'VALIDE',
        montantRecu: dto.montantRecu,
        adminNotes: dto.adminNotes,
        valideParId: user.sub,
        dateValide: new Date(),
        classe,
      },
    });
  }

  async rejeter(id: string, dto: RejeterInscriptionDto, user: JwtPayload) {
    const inscription = await this.findOne(id, user);

    if (inscription.statut !== 'EN_ATTENTE') {
      throw new BadRequestException('Cette inscription a déjà été traitée');
    }

    return this.prisma.inscription.update({
      where: { id },
      data: {
        statut: 'REJETE',
        adminNotes: dto.adminNotes,
        valideParId: user.sub,
        dateValide: new Date(),
      },
    });
  }

  async deplacerEleve(id: string, dto: DeplacerEleveDto, user: JwtPayload) {
    const inscription = await this.findOne(id, user);

    if (inscription.statut !== 'VALIDE') {
      throw new BadRequestException(
        'Seuls les élèves validés peuvent être déplacés',
      );
    }

    const classesValides = getClassesForNiveau(inscription.niveau);
    if (!classesValides.includes(dto.classe)) {
      throw new BadRequestException('Classe invalide pour ce niveau');
    }

    return this.prisma.inscription.update({
      where: { id },
      data: { classe: dto.classe },
    });
  }

  async repartirEquitablement(ecoleId: string, niveau: string) {
    const inscriptions = await this.prisma.inscription.findMany({
      where: { ecoleId, niveau, statut: 'VALIDE' },
      orderBy: { dateInscrit: 'asc' },
    });

    const classes = getClassesForNiveau(niveau);
    const updates = inscriptions.map((inscription, index) =>
      this.prisma.inscription.update({
        where: { id: inscription.id },
        data: { classe: classes[index % classes.length] },
      }),
    );

    await this.prisma.$transaction(updates);
    return { repartis: inscriptions.length, niveau };
  }

  async getRepartition(ecoleId: string) {
    const inscriptions = await this.prisma.inscription.findMany({
      where: { ecoleId, statut: 'VALIDE' },
      select: { niveau: true, classe: true },
    });

    const repartition: Record<string, Record<string, number>> = {};

    for (const ins of inscriptions) {
      if (!repartition[ins.niveau]) {
        repartition[ins.niveau] = {};
        for (const suffix of CLASSES_SUFFIXES) {
          repartition[ins.niveau][`${ins.niveau} ${suffix}`] = 0;
        }
      }
      if (ins.classe) {
        repartition[ins.niveau][ins.classe] =
          (repartition[ins.niveau][ins.classe] ?? 0) + 1;
      }
    }

    return repartition;
  }

  private async assignClasseRoundRobin(
    ecoleId: string,
    niveau: string,
  ): Promise<string> {
    const classes = getClassesForNiveau(niveau);
    const counts = await Promise.all(
      classes.map((classe) =>
        this.prisma.inscription.count({
          where: { ecoleId, niveau, classe, statut: 'VALIDE' },
        }),
      ),
    );

    const minIndex = counts.indexOf(Math.min(...counts));
    return classes[minIndex];
  }

  private assertTenantAccess(ecoleId: string, user: JwtPayload) {
    if (user.role !== 'SUPERADMIN' && user.ecoleId !== ecoleId) {
      throw new ForbiddenException(
        'Accès interdit aux données de cet établissement',
      );
    }
  }
}
