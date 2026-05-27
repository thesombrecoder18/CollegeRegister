import {
  IsString,
  IsOptional,
  IsHexColor,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateEcoleDto {
  @IsString()
  nom: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Le slug ne peut contenir que des minuscules, chiffres et tirets',
  })
  slug: string;

  @IsOptional()
  @IsHexColor()
  couleurPrimaire?: string;

  @IsOptional()
  @IsHexColor()
  couleurSecondaire?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsEmail()
  emailGerant: string;

  @IsString()
  @MinLength(8)
  motDePasseGerant: string;
}

export class UpdateEcoleDto {
  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsHexColor()
  couleurPrimaire?: string;

  @IsOptional()
  @IsHexColor()
  couleurSecondaire?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}
