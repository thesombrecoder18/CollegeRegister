import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Uniquement les mutations
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const user = request.user;

        // Le JWT payload expose `sub` comme identifiant utilisateur
        const userId: string | undefined = user?.sub;

        // Skip si pas d'utilisateur authentifié (routes publiques)
        if (!userId) return;

        const action = `${method} ${request.route?.path ?? request.url}`;
        const entityId: string | undefined = request.params?.id ?? undefined;

        this.auditService
          .createLog({
            userId,
            ecoleId: user.ecoleId ?? null,
            action,
            entityId,
            details: JSON.stringify(request.body ?? {}),
          })
          .catch((err) => console.error('Failed to create audit log', err));
      }),
    );
  }
}
