import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="flex min-h-[100dvh] bg-cream">
      <aside class="sticky top-0 hidden h-[100dvh] w-64 flex-shrink-0 flex-col border-r border-line bg-sand/50 md:flex">
        <div class="flex items-center gap-3 border-b border-line p-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
            <app-icon name="school" [size]="20" />
          </div>
          <div class="min-w-0 leading-tight">
            <h1 class="truncate font-display font-bold text-ink">{{ auth.user()?.ecole?.nom ?? 'Administration' }}</h1>
            <p class="text-xs text-ink-soft">Espace gérant</p>
          </div>
        </div>
        <nav class="flex-1 space-y-1 p-3">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="!bg-primary/10 !text-primary"
               class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-white hover:text-ink">
              <app-icon [name]="item.icon" [size]="18" />
              {{ item.label }}
            </a>
          }
        </nav>
        <div class="border-t border-line p-3">
          <button class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta/8" (click)="auth.logout()">
            <app-icon name="log-out" [size]="18" /> Déconnexion
          </button>
        </div>
      </aside>
      <div class="flex min-w-0 flex-1 flex-col">
        <header class="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-cream/85 px-4 py-3 backdrop-blur-md md:hidden">
          <div class="flex items-center gap-2.5">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <app-icon name="school" [size]="18" />
            </div>
            <h1 class="truncate font-display font-bold text-ink">{{ auth.user()?.ecole?.nom }}</h1>
          </div>
          <button class="flex h-9 w-9 items-center justify-center rounded-xl text-terracotta hover:bg-terracotta/8" (click)="auth.logout()">
            <app-icon name="log-out" [size]="20" />
          </button>
        </header>
        <nav class="sticky top-[57px] z-20 flex gap-1.5 overflow-x-auto border-b border-line bg-cream/85 px-3 py-2.5 backdrop-blur-md md:hidden">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="!bg-primary/10 !text-primary"
               class="whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-sand">{{ item.label }}</a>
          }
        </nav>
        <main class="flex-1 p-4 sm:p-6 lg:p-8"><router-outlet /></main>
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
