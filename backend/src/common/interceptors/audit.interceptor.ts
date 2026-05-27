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

    // Only log mutations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(() => {
          const user = request.user;
          if (user) {
            // Determine action name based on route and method
            const action = `${method} ${request.route.path}`;
            
            // Extract entityId from params if available
            const entityId = request.params.id || null;

            this.auditService.createLog({
              userId: user.id,
              ecoleId: user.ecoleId, // Depending on the user or the body
              action,
              entityId,
              details: JSON.stringify(request.body || {}),
            }).catch(err => console.error('Failed to create audit log', err));
          }
        }),
      );
    }

    return next.handle();
  }
}
