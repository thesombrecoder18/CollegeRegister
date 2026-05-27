import { IsInt, Min } from 'class-validator';

export class UpdateConfigurationDto {
  @IsInt()
  @Min(0)
  montantSixieme: number;

  @IsInt()
  @Min(0)
  montantCinquieme: number;

  @IsInt()
  @Min(0)
  montantQuatrieme: number;

  @IsInt()
  @Min(0)
  montantTroisieme: number;
}
