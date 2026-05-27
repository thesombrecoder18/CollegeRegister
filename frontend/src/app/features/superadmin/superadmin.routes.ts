import { Routes } from '@angular/router';

export const SUPERADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./superadmin-layout/superadmin-layout.component').then(
        (m) => m.SuperadminLayoutComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/superadmin-dashboard.component').then(
            (m) => m.SuperadminDashboardComponent,
          ),
      },
      {
        path: 'ecoles',
        loadComponent: () =>
          import('./ecoles/ecoles.component').then((m) => m.EcolesComponent),
      },
      {
        path: 'ecoles/:id',
        loadComponent: () =>
          import('./ecoles/ecole-detail.component').then((m) => m.EcoleDetailComponent),
      },
      {
        path: 'provisionnement',
        loadComponent: () =>
          import('./provisionnement/provisionnement.component').then((m) => m.ProvisionnementComponent),
      },
      {
        path: 'audit',
        loadComponent: () =>
          import('./audit/audit-logs.component').then((m) => m.AuditLogsComponent),
      },
    ],
  },
];
