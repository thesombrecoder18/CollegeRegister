import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RoleUser } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: RoleUser;
  ecoleId: string | null;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    if (request.user) {
      return {
        ...request.user,
        ecoleId: request.tenantEcoleId || request.user.ecoleId,
      };
    }
    return request.user;
  },
);
