import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { UtilisateurService } from './utilisateur.service';
import { UpdateGerantDto, CreateUtilisateurDto } from './dto/utilisateur.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleUser } from '@prisma/client';

@SkipThrottle()
@Roles(RoleUser.SUPERADMIN)
@Controller('utilisateurs')
export class UtilisateurController {
  constructor(private readonly utilisateurService: UtilisateurService) {}

  @Get()
  findAll() {
    return this.utilisateurService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.utilisateurService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGerantDto) {
    return this.utilisateurService.updateGerant(id, dto);
  }

  @Post()
  create(@Body() dto: CreateUtilisateurDto) {
    return this.utilisateurService.create(dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.utilisateurService.delete(id);
  }
}
