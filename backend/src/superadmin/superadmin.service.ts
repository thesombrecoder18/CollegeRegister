import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuperadminService {
  constructor(private prisma: PrismaService) {}

  async getGlobalStats() {
    const [totalEcoles, ecolesActives, totalInscriptions, totalUtilisateurs] =
      await Promise.all([
        this.prisma.ecole.count(),
        this.prisma.ecole.count({ where: { statut: 'ACTIVE' } }),
        this.prisma.inscription.count(),
        this.prisma.utilisateur.count({ where: { role: 'GERANT' } }),
      ]);

    const montantGlobal = await this.prisma.inscription.aggregate({
      where: { statut: 'VALIDE' },
      _sum: { montantRecu: true },
    });

    const inscriptionsParStatut = await this.prisma.inscription.groupBy({
      by: ['statut'],
      _count: { id: true },
    });

    return {
      totalEcoles,
      ecolesActives,
      ecolesSuspendues: totalEcoles - ecolesActives,
      totalInscriptions,
      totalGerants: totalUtilisateurs,
      montantGlobalCollecte: montantGlobal._sum.montantRecu ?? 0,
      inscriptionsParStatut: inscriptionsParStatut.reduce(
        (acc, item) => {
          acc[item.statut] = item._count.id;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      take: 50,
      orderBy: { date: 'desc' },
      include: {
        acteur: {
          select: { email: true },
        },
        ecole: {
          select: { nom: true },
        },
      },
    });
  }
}
