import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEcoleDto, UpdateEcoleDto } from './dto/ecole.dto';
import { StatutEcole } from '@prisma/client';

@Injectable()
export class EcoleService {
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string) {
    const ecole = await this.prisma.ecole.findUnique({
      where: { slug },
      include: { configuration: true },
    });

    if (!ecole) {
      throw new NotFoundException('Établissement introuvable');
    }

    if (ecole.statut === StatutEcole.SUSPENDUE) {
      throw new NotFoundException('Établissement temporairement indisponible');
    }

    return {
      id: ecole.id,
      nom: ecole.nom,
      slug: ecole.slug,
      couleurPrimaire: ecole.couleurPrimaire,
      couleurSecondaire: ecole.couleurSecondaire,
      logoUrl: ecole.logoUrl,
      configuration: ecole.configuration,
    };
  }

  async findAll() {
    return this.prisma.ecole.findMany({
      include: {
        configuration: true,
        _count: { select: { inscriptions: true, utilisateurs: true } },
      },
      orderBy: { dateCreation: 'desc' },
    });
  }

  async create(dto: CreateEcoleDto) {
    const existing = await this.prisma.ecole.findFirst({
      where: { OR: [{ nom: dto.nom }, { slug: dto.slug }] },
    });

    if (existing) {
      throw new ConflictException('Nom ou slug déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(dto.motDePasseGerant, 10);

    return this.prisma.$transaction(async (tx) => {
      const ecole = await tx.ecole.create({
        data: {
          nom: dto.nom,
          slug: dto.slug,
          couleurPrimaire: dto.couleurPrimaire ?? '#1e293b',
          couleurSecondaire: dto.couleurSecondaire ?? '#059669',
          logoUrl: dto.logoUrl,
        },
      });

      await tx.configuration.create({ data: { ecoleId: ecole.id } });

      await tx.utilisateur.create({
        data: {
          email: dto.emailGerant,
          motDePasse: hashedPassword,
          role: 'GERANT',
          ecoleId: ecole.id,
        },
      });

      return ecole;
    });
  }

  async update(id: string, dto: UpdateEcoleDto) {
    await this.ensureExists(id);
    return this.prisma.ecole.update({ where: { id }, data: dto });
  }

  async suspend(id: string) {
    await this.ensureExists(id);
    return this.prisma.ecole.update({
      where: { id },
      data: { statut: StatutEcole.SUSPENDUE },
    });
  }

  async activate(id: string) {
    await this.ensureExists(id);
    return this.prisma.ecole.update({
      where: { id },
      data: { statut: StatutEcole.ACTIVE },
    });
  }

  async getStats(ecoleId: string) {
    const [enAttente, valide, rejete, montantCollecte] = await Promise.all([
      this.prisma.inscription.count({
        where: { ecoleId, statut: 'EN_ATTENTE' },
      }),
      this.prisma.inscription.count({
        where: { ecoleId, statut: 'VALIDE' },
      }),
      this.prisma.inscription.count({
        where: { ecoleId, statut: 'REJETE' },
      }),
      this.prisma.inscription.aggregate({
        where: { ecoleId, statut: 'VALIDE' },
        _sum: { montantRecu: true },
      }),
    ]);

    return {
      enAttente,
      valide,
      rejete,
      total: enAttente + valide + rejete,
      montantCollecte: montantCollecte._sum.montantRecu ?? 0,
    };
  }

  private async ensureExists(id: string) {
    const ecole = await this.prisma.ecole.findUnique({ where: { id } });
    if (!ecole) {
      throw new NotFoundException('Établissement introuvable');
    }
    return ecole;
  }
}
