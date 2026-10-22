import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { InscriptionService } from './inscription.service';
import {
  CreateInscriptionDto,
  ValiderInscriptionDto,
  RejeterInscriptionDto,
  DeplacerEleveDto,
} from './dto/inscription.dto';
import { Public, Roles } from '../common/decorators/roles.decorator';
import { RoleUser, StatutInscription } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../common/decorators/current-user.decorator';

@Controller('inscriptions')
export class InscriptionController {
  constructor(private inscriptionService: InscriptionService) {}

  // Route publique : throttle strict — 5 inscriptions / 60s par IP
  @Public()
  @Throttle({ public: { ttl: 60_000, limit: 5 } })
  @Post('public/:slug')
  createPublic(
    @Param('slug') slug: string,
    @Body() dto: CreateInscriptionDto,
  ) {
    return this.inscriptionService.createPublic(slug, dto);
  }

  // Route publique : throttle modéré — 10 suivis / 60s par IP
  @Public()
  @Throttle({ public: { ttl: 60_000, limit: 10 } })
  @Get('public/:slug/suivi')
  suivi(
    @Param('slug') slug: string,
    @Query('telephone') telephone?: string,
    @Query('reference') reference?: string,
  ) {
    return this.inscriptionService.suiviDossier(slug, telephone, reference);
  }

  // Routes authentifiées : pas de throttle
  @SkipThrottle()
  @Roles(RoleUser.GERANT)
  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query('statut') statut?: StatutInscription,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = Math.max(1, parseInt(page ?? '1', 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit ?? '50', 10) || 50));
    return this.inscriptionService.findAllForEcole(user.ecoleId!, statut, pageNum, limitNum);
  }

  @SkipThrottle()
  @Roles(RoleUser.GERANT)
  @Get('repartition')
  getRepartition(@CurrentUser() user: JwtPayload) {
    return this.inscriptionService.getRepartition(user.ecoleId!);
  }

  @SkipThrottle()
  @Roles(RoleUser.GERANT)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.inscriptionService.findOne(id, user);
  }

  @SkipThrottle()
  @Roles(RoleUser.GERANT)
  @Patch(':id/valider')
  valider(
    @Param('id') id: string,
    @Body() dto: ValiderInscriptionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.inscriptionService.valider(id, dto, user);
  }

  @SkipThrottle()
  @Roles(RoleUser.GERANT)
  @Patch(':id/rejeter')
  rejeter(
    @Param('id') id: string,
    @Body() dto: RejeterInscriptionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.inscriptionService.rejeter(id, dto, user);
  }

  @SkipThrottle()
  @Roles(RoleUser.GERANT)
  @Patch(':id/deplacer')
  deplacer(
    @Param('id') id: string,
    @Body() dto: DeplacerEleveDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.inscriptionService.deplacerEleve(id, dto, user);
  }

  @SkipThrottle()
  @Roles(RoleUser.GERANT)
  @Post('repartir/:niveau')
  repartir(
    @Param('niveau') niveau: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.inscriptionService.repartirEquitablement(
      user.ecoleId!,
      decodeURIComponent(niveau),
    );
  }
}
