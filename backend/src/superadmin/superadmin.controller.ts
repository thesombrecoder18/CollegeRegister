import { Controller, Get } from '@nestjs/common';
import { SuperadminService } from './superadmin.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleUser } from '@prisma/client';

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
  getAuditLogs() {
    return this.superadminService.getAuditLogs();
  }
}
