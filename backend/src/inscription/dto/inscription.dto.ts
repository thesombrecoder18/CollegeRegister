import {
  IsString,
  IsIn,
  IsInt,
  IsOptional,
  Min,
  Matches,
  IsEnum,
} from 'class-validator';
import { OperateurPaiement } from '@prisma/client';
import { NIVEAUX } from '../../common/constants';

export class CreateInscriptionDto {
  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsIn([...NIVEAUX])
  niveau: string;

  @IsString()
  @Matches(/^(\+221|221)?[67]\d{8}$/, {
    message: 'Numéro de téléphone sénégalais invalide',
  })
  telephone: string;

  @IsEnum(OperateurPaiement)
  operateur: OperateurPaiement;

  @IsOptional()
  @IsString()
  preuveImage?: string;
}

export class ValiderInscriptionDto {
  @IsInt()
  @Min(0)
  montantRecu: number;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}

export class RejeterInscriptionDto {
  @IsString()
  adminNotes: string;
}

export class DeplacerEleveDto {
  @IsString()
  classe: string;
}

export class SuiviDossierDto {
  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
