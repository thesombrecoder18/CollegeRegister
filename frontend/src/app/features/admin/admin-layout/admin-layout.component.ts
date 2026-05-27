import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="flex min-h-screen bg-slate-100">
      <aside class="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white md:block">
        <div class="border-b border-slate-200 p-4">
          <h1 class="font-semibold text-slate-900">{{ auth.user()?.ecole?.nom ?? 'Administration' }}</h1>
          <p class="text-xs text-slate-500">Espace gérant</p>
        </div>
        <nav class="space-y-1 p-3">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="bg-primary/10 text-primary"
               class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
              <app-icon [name]="item.icon" [size]="18" />
              {{ item.label }}
            </a>
          }
        </nav>
        <div class="absolute bottom-0 w-64 border-t border-slate-200 p-3">
          <button class="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50" (click)="auth.logout()">
            <app-icon name="log-out" [size]="18" /> Déconnexion
          </button>
        </div>
      </aside>
      <div class="flex flex-1 flex-col">
        <header class="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <h1 class="font-semibold">{{ auth.user()?.ecole?.nom }}</h1>
          <button class="text-red-600" (click)="auth.logout()">
            <app-icon name="log-out" [size]="20" />
          </button>
        </header>
        <nav class="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-2 py-2 md:hidden">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="bg-primary/10 text-primary"
               class="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600">{{ item.label }}</a>
          }
        </nav>
        <main class="flex-1 p-4 md:p-6"><router-outlet /></main>
      </div>
    </div>
  `,
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  navItems = [
    { path: '/admin/dashboard', icon: 'layout-dashboard', label: 'Tableau de bord' },
    { path: '/admin/inscriptions', icon: 'clipboard-list', label: 'Inscriptions' },
    { path: '/admin/effectifs', icon: 'users', label: 'Effectifs' },
    { path: '/admin/parametres', icon: 'settings', label: 'Paramètres' },
  ];
}
