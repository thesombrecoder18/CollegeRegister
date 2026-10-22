import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { EcoleService } from '../../../core/services/ecole.service';
import { ThemeService } from '../../../core/services/theme.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    @if (loading()) {
      <div class="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-cream">
        <div class="h-9 w-9 animate-spin rounded-full border-[3px] border-primary border-t-transparent"></div>
        <p class="text-sm font-medium text-ink-soft">Chargement de l'établissement…</p>
      </div>
    } @else if (error()) {
      <div class="flex min-h-[100dvh] items-center justify-center bg-cream p-4">
        <div class="card max-w-md text-center">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
            <app-icon name="alert-circle" [size]="26" />
          </div>
          <h2 class="mb-1 text-lg font-semibold text-ink">Établissement introuvable</h2>
          <p class="text-sm text-ink-soft">{{ error() }}</p>
        </div>
      </div>
    } @else {
      <div class="flex min-h-[100dvh] flex-col bg-cream">
        <header class="sticky top-0 z-40 border-b border-line/70 bg-cream/85 backdrop-blur-md">
          <div class="h-1 w-full bg-gradient-to-r from-leaf via-gold to-terracotta"></div>
          <div class="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
            <a routerLink="." class="flex items-center gap-3">
              @if (theme.ecole()?.logoUrl) {
                <img [src]="theme.ecole()!.logoUrl!" alt="Logo" class="h-11 w-11 rounded-2xl object-cover shadow-card" />
              } @else {
                <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-soft">
                  <app-icon name="graduation-cap" [size]="22" />
                </div>
              }
              <div class="leading-tight">
                <h1 class="font-display text-base font-bold text-ink sm:text-lg">{{ theme.ecole()?.nom }}</h1>
                <p class="text-xs text-ink-soft">Inscriptions en ligne</p>
              </div>
            </a>
            <nav class="flex items-center gap-1.5">
              <a routerLink="." routerLinkActive="!bg-primary/10 !text-primary" [routerLinkActiveOptions]="{ exact: true }"
                 class="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-sand hover:text-ink">
                Inscription
              </a>
              <a routerLink="suivi" routerLinkActive="!bg-primary/10 !text-primary"
                 class="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:bg-sand hover:text-ink">
                <app-icon name="search" [size]="16" />
                <span class="hidden sm:inline">Suivi</span>
              </a>
            </nav>
          </div>
        </header>

        <main class="mx-auto w-full max-w-content flex-1 px-4 py-8 sm:px-6 sm:py-10">
          <router-outlet />
        </main>

        <footer class="border-t border-line/70 bg-sand/40">
          <div class="mx-auto flex max-w-content flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-ink-soft sm:flex-row sm:px-6">
            <p>© {{ year }} {{ theme.ecole()?.nom }}. Tous droits réservés.</p>
            <div class="flex items-center gap-2">
              <app-icon name="shield-check" [size]="15" class="text-leaf" />
              <span>Données protégées (conformité CDP Sénégal)</span>
            </div>
          </div>
        </footer>
      </div>
    }
  `,
})
export class PublicLayoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ecoleService = inject(EcoleService);
  theme = inject(ThemeService);

  loading = signal(true);
  error = signal<string | null>(null);
  readonly year = new Date().getFullYear();

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.ecoleService.getBySlug(slug).subscribe({
      next: (ecole) => {
        this.theme.setEcole(ecole);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Établissement introuvable ou indisponible.');
        this.loading.set(false);
      },
    });
  }
}
