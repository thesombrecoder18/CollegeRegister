import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../common/decorators/current-user.decorator';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { email: dto.email },
      include: { ecole: true },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const valid = await bcrypt.compare(dto.motDePasse, user.motDePasse);
    if (!valid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (user.ecole?.statut === 'SUSPENDUE') {
      throw new UnauthorizedException('Établissement suspendu');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      ecoleId: user.ecoleId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ecoleId: user.ecoleId,
        ecole: user.ecole
          ? {
              id: user.ecole.id,
              nom: user.ecole.nom,
              slug: user.ecole.slug,
            }
          : null,
      },
    };
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.prisma.utilisateur.findUnique({
      where: { id: payload.sub },
      include: { ecole: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      sub: user.id,
      email: user.email,
      role: user.role,
      ecoleId: user.ecoleId,
    } satisfies JwtPayload;
  }
}
