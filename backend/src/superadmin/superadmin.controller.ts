import { Controller, Get, Query } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { SuperadminService } from './superadmin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleUser } from '@prisma/client';

@SkipThrottle()
@Controller('superadmin')
export class SuperadminController {
  constructor(private superadminService: SuperadminService) {}

  @Roles(RoleUser.SUPERADMIN)
  @Get('stats')
  getStats() {
    return this.superadminService.getGlobalStats();
  }

  @Roles(RoleUser.SUPERADMIN)
  @Get('audit-logs')
  getAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page ?? '1', 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit ?? '50', 10) || 50));
    return this.superadminService.getAuditLogs(pageNum, limitNum);
  }
}
