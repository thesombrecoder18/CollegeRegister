import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateAuditLogDto {
  userId: string;
  ecoleId?: string;
  action: string;
  entityId?: string;
  details?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(data: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data,
    });
  }

  async getLogs(ecoleId?: string) {
    const where = ecoleId ? { ecoleId } : {};
    return this.prisma.auditLog.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        acteur: { select: { email: true, role: true } },
        ecole: { select: { nom: true } },
      },
    });
  }
}
