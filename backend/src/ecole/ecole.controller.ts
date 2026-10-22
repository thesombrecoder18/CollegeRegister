import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { EcoleService } from './ecole.service';
import { CreateEcoleDto, UpdateEcoleDto } from './dto/ecole.dto';
import { Public, Roles } from '../common/decorators/roles.decorator';
import { RoleUser } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';

@Controller('ecoles')
export class EcoleController {
  constructor(private ecoleService: EcoleService) {}

  // Route publique : throttle modéré
  @Public()
  @Throttle({ public: { ttl: 60_000, limit: 30 } })
  @Get('public/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.ecoleService.findBySlug(slug);
  }

  @SkipThrottle()
  @Roles(RoleUser.SUPERADMIN)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.ecoleService.findById(id);
  }

  @SkipThrottle()
  @Roles(RoleUser.SUPERADMIN)
  @Get(':id/stats')
  getEcoleStats(@Param('id') id: string) {
    return this.ecoleService.getStatsForEcole(id);
  }

  @SkipThrottle()
  @Roles(RoleUser.SUPERADMIN)
  @Get()
  findAll() {
    return this.ecoleService.findAll();
  }

  @SkipThrottle()
  @Roles(RoleUser.SUPERADMIN)
  @Post()
  create(@Body() dto: CreateEcoleDto) {
    return this.ecoleService.create(dto);
  }

  @SkipThrottle()
  @Roles(RoleUser.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEcoleDto) {
    return this.ecoleService.update(id, dto);
  }

  @SkipThrottle()
  @Roles(RoleUser.SUPERADMIN)
  @Patch(':id/suspendre')
  suspend(@Param('id') id: string) {
    return this.ecoleService.suspend(id);
  }

  @SkipThrottle()
  @Roles(RoleUser.SUPERADMIN)
  @Patch(':id/activer')
  activate(@Param('id') id: string) {
    return this.ecoleService.activate(id);
  }

  @SkipThrottle()
  @Roles(RoleUser.GERANT)
  @Get('stats/dashboard')
  getDashboardStats(@CurrentUser() user: JwtPayload) {
    return this.ecoleService.getStats(user.ecoleId!);
  }
}
