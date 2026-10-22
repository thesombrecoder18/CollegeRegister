import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-superadmin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="flex min-h-[100dvh] bg-cream font-sans">

      <!-- Sidebar (desktop) -->
      <aside class="sticky top-0 hidden h-[100dvh] w-[260px] flex-shrink-0 flex-col bg-ink text-white md:flex">
        <div class="border-b border-white/10 p-6">
          <div class="flex items-center gap-2.5">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-ink">
              <app-icon name="shield-check" [size]="18" />
            </div>
            <h1 class="font-display text-lg font-bold">EduRegister</h1>
          </div>
          <p class="mt-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">Console superadmin</p>
        </div>

        <nav class="flex-1 space-y-1 px-3 py-4">
          @for (item of navItems; track item.path) {
            @if (item.section) {
              <p class="px-3 pb-2 pt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">{{ item.section }}</p>
            }
            <a [routerLink]="item.path" routerLinkActive="!bg-white/10 !text-white" #rla="routerLinkActive"
               [routerLinkActiveOptions]="{ exact: false }"
               class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/55 transition-colors hover:bg-white/5 hover:text-white">
              <div class="rounded-lg p-1.5" [class]="rla.isActive ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/40'">
                <app-icon [name]="item.icon" [size]="16" />
              </div>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>

        <div class="space-y-1 border-t border-white/10 p-4">
          <div class="mb-2 flex items-center gap-3 px-3 py-2.5">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-ink">
              {{ userInitials() }}
            </div>
            <div class="min-w-0">
              <p class="truncate text-xs font-semibold text-white">{{ auth.user()?.email }}</p>
              <p class="text-[10px] font-bold uppercase tracking-wider text-gold">Superadmin</p>
            </div>
          </div>
          <button (click)="auth.logout()"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/55 transition-colors hover:bg-terracotta/15 hover:text-white">
            <div class="rounded-lg bg-white/5 p-1.5"><app-icon name="log-out" [size]="16" /></div>
            Déconnexion
          </button>
        </div>
      </aside>

      <!-- Contenu principal -->
      <div class="flex min-w-0 flex-1 flex-col">
        <!-- Top bar (mobile) -->
        <header class="sticky top-0 z-30 flex items-center justify-between bg-ink px-4 py-3 text-white md:hidden">
          <div class="flex items-center gap-2.5">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-gold text-ink">
              <app-icon name="shield-check" [size]="18" />
            </div>
            <span class="font-display font-bold">EduRegister</span>
          </div>
          <button class="flex h-9 w-9 items-center justify-center rounded-xl text-white/70 hover:bg-white/10" (click)="auth.logout()">
            <app-icon name="log-out" [size]="20" />
          </button>
        </header>
        <nav class="sticky top-[57px] z-20 flex gap-1.5 overflow-x-auto border-b border-line bg-cream/85 px-3 py-2.5 backdrop-blur-md md:hidden">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="!bg-primary/10 !text-primary"
               class="whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-sand">{{ item.label }}</a>
          }
        </nav>

        <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class SuperadminLayoutComponent {
  auth = inject(AuthService);
  toast = inject(ToastService);

  readonly navItems = [
    { path: '/superadmin/dashboard', icon: 'building-2', label: 'Établissements', section: '' },
    { path: '/superadmin/provisionnement', icon: 'database', label: 'Provisionnement', section: '' },
    { path: '/superadmin/audit', icon: 'shield', label: 'Audit & Sécurité', section: 'Sécurité' },
    { path: '/superadmin/utilisateurs', icon: 'users', label: 'Utilisateurs', section: '' },
  ];

  userInitials(): string {
    const email = this.auth.user()?.email ?? '';
    return email.substring(0, 2).toUpperCase();
  }

  showHelp(): void {
    this.toast.info('Documentation : consultez le README du projet ou contactez le support.');
  }
}
