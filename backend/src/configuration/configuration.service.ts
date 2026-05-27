import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateConfigurationDto } from './dto/configuration.dto';
import { JwtPayload } from '../common/decorators/current-user.decorator';

@Injectable()
export class ConfigurationService {
  constructor(private prisma: PrismaService) {}

  async getForEcole(user: JwtPayload) {
    const config = await this.prisma.configuration.findUnique({
      where: { ecoleId: user.ecoleId! },
    });

    if (!config) {
      throw new NotFoundException('Configuration introuvable');
    }

    return config;
  }

  async update(user: JwtPayload, dto: UpdateConfigurationDto) {
    return this.prisma.configuration.update({
      where: { ecoleId: user.ecoleId! },
      data: dto,
    });
  }
}
