import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleUser } from '@prisma/client';

@SkipThrottle()
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleUser.SUPERADMIN)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  getLogs(@Query('ecoleId') ecoleId?: string) {
    return this.auditService.getLogs(ecoleId);
  }
}
