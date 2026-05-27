import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'inscriptions',
        loadComponent: () =>
          import('./inscriptions/inscriptions.component').then((m) => m.InscriptionsComponent),
      },
      {
        path: 'effectifs',
        loadComponent: () =>
          import('./effectifs/effectifs.component').then((m) => m.EffectifsComponent),
      },
      {
        path: 'parametres',
        loadComponent: () =>
          import('./parametres/parametres.component').then((m) => m.ParametresComponent),
      },
    ],
  },
];
