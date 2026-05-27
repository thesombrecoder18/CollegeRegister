import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { EcoleService } from './ecole.service';
import { CreateEcoleDto, UpdateEcoleDto } from './dto/ecole.dto';
import { Public, Roles } from '../common/decorators/roles.decorator';
import { RoleUser } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';

@Controller('ecoles')
export class EcoleController {
  constructor(private ecoleService: EcoleService) {}

  @Public()
  @Get('public/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.ecoleService.findBySlug(slug);
  }

  @Roles(RoleUser.SUPERADMIN)
  @Get()
  findAll() {
    return this.ecoleService.findAll();
  }

  @Roles(RoleUser.SUPERADMIN)
  @Post()
  create(@Body() dto: CreateEcoleDto) {
    return this.ecoleService.create(dto);
  }

  @Roles(RoleUser.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEcoleDto) {
    return this.ecoleService.update(id, dto);
  }

  @Roles(RoleUser.SUPERADMIN)
  @Patch(':id/suspendre')
  suspend(@Param('id') id: string) {
    return this.ecoleService.suspend(id);
  }

  @Roles(RoleUser.SUPERADMIN)
  @Patch(':id/activer')
  activate(@Param('id') id: string) {
    return this.ecoleService.activate(id);
  }

  @Roles(RoleUser.GERANT)
  @Get('stats/dashboard')
  getDashboardStats(@CurrentUser() user: JwtPayload) {
    return this.ecoleService.getStats(user.ecoleId!);
  }
}
