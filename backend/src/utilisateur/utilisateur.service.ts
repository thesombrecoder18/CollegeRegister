import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateGerantDto, CreateUtilisateurDto } from './dto/utilisateur.dto';

@Injectable()
export class UtilisateurService {
  constructor(private readonly prisma: PrismaService) {}

  /** Liste tous les utilisateurs (SUPERADMIN) */
  async findAll() {
    return this.prisma.utilisateur.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        ecoleId: true,
        ecole: { select: { id: true, nom: true, slug: true, statut: true } },
      },
      orderBy: { email: 'asc' },
    });
  }

  /** Récupère un utilisateur par ID */
  async findById(id: string) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        ecoleId: true,
        ecole: { select: { id: true, nom: true, slug: true, statut: true } },
      },
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  /** Met à jour l'email et/ou le mot de passe d'un gérant */
  async updateGerant(id: string, dto: UpdateGerantDto) {
    const user = await this.prisma.utilisateur.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    // Vérifier unicité email si changement
    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.utilisateur.findUnique({
        where: { email: dto.email },
      });
      if (existing) throw new ConflictException('Cet email est déjà utilisé');
    }

    const data: Record<string, string> = {};
    if (dto.email) data['email'] = dto.email;
    if (dto.motDePasse) {
      data['motDePasse'] = await bcrypt.hash(dto.motDePasse, 10);
    }

    return this.prisma.utilisateur.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        ecoleId: true,
      },
    });
  }

  /** Crée un nouvel utilisateur (SUPERADMIN) */
  async create(dto: CreateUtilisateurDto) {
    const existing = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Cet email est déjà utilisé');

    const hashed = await bcrypt.hash(dto.motDePasse, 10);

    return this.prisma.utilisateur.create({
      data: {
        email: dto.email,
        motDePasse: hashed,
        role: dto.role,
        ecoleId: dto.ecoleId ?? null,
      },
      select: {
        id: true,
        email: true,
        role: true,
        ecoleId: true,
      },
    });
  }

  /** Supprime un utilisateur (SUPERADMIN) — ne peut pas supprimer le dernier gérant d'une école */
  async delete(id: string) {
    const user = await this.prisma.utilisateur.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    // Sécurité : ne pas supprimer le dernier gérant d'une école
    if (user.role === 'GERANT' && user.ecoleId) {
      const count = await this.prisma.utilisateur.count({
        where: { ecoleId: user.ecoleId, role: 'GERANT' },
      });
      if (count <= 1) {
        throw new ConflictException(
          'Impossible de supprimer le seul gérant de cet établissement',
        );
      }
    }

    await this.prisma.utilisateur.delete({ where: { id } });
    return { success: true };
  }
}
