import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./accueil/accueil.component').then((m) => m.AccueilComponent),
      },
      {
        path: 'inscription',
        loadComponent: () =>
          import('./inscription-wizard/inscription-wizard.component').then(
            (m) => m.InscriptionWizardComponent,
          ),
      },
      {
        path: 'suivi',
        loadComponent: () =>
          import('./suivi-dossier/suivi-dossier.component').then(
            (m) => m.SuiviDossierComponent,
          ),
      },
    ],
  },
];
