import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { RoleUser } from '@prisma/client';

export class UpdateGerantDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  motDePasse?: string;
}

export class CreateUtilisateurDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  motDePasse: string;

  @IsEnum(RoleUser)
  role: RoleUser;

  @IsOptional()
  @IsString()
  ecoleId?: string;
}
