import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleUser } from '@prisma/client';
import { JwtPayload } from '../decorators/current-user.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload | undefined;

    const ecoleIdParam =
      request.params?.ecoleId ||
      request.body?.ecoleId ||
      request.query?.ecoleId;

    if (!user || user.role === RoleUser.SUPERADMIN) {
      request.tenantEcoleId = ecoleIdParam || (user ? user.ecoleId : null);
      return true;
    }

    if (ecoleIdParam && ecoleIdParam !== user.ecoleId) {
      throw new ForbiddenException(
        'Accès interdit aux données de cet établissement',
      );
    }

    request.tenantEcoleId = user.ecoleId;
    return true;
  }
}
