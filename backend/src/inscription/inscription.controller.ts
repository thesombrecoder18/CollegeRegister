import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
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

  @Public()
  @Post('public/:slug')
  createPublic(
    @Param('slug') slug: string,
    @Body() dto: CreateInscriptionDto,
  ) {
    return this.inscriptionService.createPublic(slug, dto);
  }

  @Public()
  @Get('public/:slug/suivi')
  suivi(
    @Param('slug') slug: string,
    @Query('telephone') telephone?: string,
    @Query('reference') reference?: string,
  ) {
    return this.inscriptionService.suiviDossier(slug, telephone, reference);
  }

  @Roles(RoleUser.GERANT)
  @Get()
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query('statut') statut?: StatutInscription,
  ) {
    return this.inscriptionService.findAllForEcole(user.ecoleId!, statut);
  }

  @Roles(RoleUser.GERANT)
  @Get('repartition')
  getRepartition(@CurrentUser() user: JwtPayload) {
    return this.inscriptionService.getRepartition(user.ecoleId!);
  }

  @Roles(RoleUser.GERANT)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.inscriptionService.findOne(id, user);
  }

  @Roles(RoleUser.GERANT)
  @Patch(':id/valider')
  valider(
    @Param('id') id: string,
    @Body() dto: ValiderInscriptionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.inscriptionService.valider(id, dto, user);
  }

  @Roles(RoleUser.GERANT)
  @Patch(':id/rejeter')
  rejeter(
    @Param('id') id: string,
    @Body() dto: RejeterInscriptionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.inscriptionService.rejeter(id, dto, user);
  }

  @Roles(RoleUser.GERANT)
  @Patch(':id/deplacer')
  deplacer(
    @Param('id') id: string,
    @Body() dto: DeplacerEleveDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.inscriptionService.deplacerEleve(id, dto, user);
  }

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
