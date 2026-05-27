import { Routes } from '@angular/router';
import { authGuard, gerantGuard, superadminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'connexion',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, gerantGuard],
    loadChildren: () =>
      import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'superadmin',
    canActivate: [authGuard, superadminGuard],
    loadChildren: () =>
      import('./features/superadmin/superadmin.routes').then((m) => m.SUPERADMIN_ROUTES),
  },
  {
    path: ':slug',
    loadChildren: () =>
      import('./features/public/public.routes').then((m) => m.PUBLIC_ROUTES),
  },
  {
    path: '',
    redirectTo: 'cem-mermoz',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'cem-mermoz',
  },
];
