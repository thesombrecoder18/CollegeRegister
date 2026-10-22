import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 — session expirée ou token invalide
      if (error.status === 401) {
        // Ne pas afficher de toast sur la page de connexion
        const isLoginRequest = req.url.includes('/auth/login');
        if (!isLoginRequest) {
          toast.warning('Votre session a expiré. Veuillez vous reconnecter.');
          auth.logout();
        }
        return throwError(() => error);
      }

      // 403 — accès interdit
      if (error.status === 403) {
        toast.error('Accès refusé. Vous n\'avez pas les droits nécessaires.');
        return throwError(() => error);
      }

      // 429 — rate limit dépassé
      if (error.status === 429) {
        toast.warning('Trop de requêtes. Veuillez patienter quelques secondes.');
        return throwError(() => error);
      }

      // 0 / réseau — serveur injoignable
      if (error.status === 0) {
        toast.error('Impossible de contacter le serveur. Vérifiez votre connexion.');
        return throwError(() => error);
      }

      // 500+ — erreur serveur
      if (error.status >= 500) {
        toast.error('Une erreur serveur est survenue. Réessayez dans un moment.');
        return throwError(() => error);
      }

      // Autres erreurs (400, 404, etc.) — laisser le composant gérer
      return throwError(() => error);
    }),
  );
};
