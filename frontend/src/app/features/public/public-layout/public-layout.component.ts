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
      <div class="flex min-h-screen items-center justify-center">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    } @else if (error()) {
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="card max-w-md text-center">
          <p class="text-red-600">{{ error() }}</p>
        </div>
      </div>
    } @else {
      <div class="min-h-screen bg-slate-50">
        <header class="border-b border-slate-200 bg-white">
          <div class="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <div class="flex items-center gap-3">
              @if (theme.ecole()?.logoUrl) {
                <img [src]="theme.ecole()!.logoUrl!" alt="Logo" class="h-10 w-10 rounded-lg object-cover" />
              } @else {
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                  <app-icon name="graduation-cap" [size]="20" />
                </div>
              }
              <div>
                <h1 class="text-lg font-semibold text-slate-900">{{ theme.ecole()?.nom }}</h1>
                <p class="text-xs text-slate-500">Inscriptions en ligne</p>
              </div>
            </div>
            <nav class="flex gap-2">
              <a routerLink="." routerLinkActive="bg-primary/10 text-primary" [routerLinkActiveOptions]="{ exact: true }"
                 class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
                Inscription
              </a>
              <a routerLink="suivi" routerLinkActive="bg-primary/10 text-primary"
                 class="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
                <app-icon name="search" [size]="16" />
                Suivi
              </a>
            </nav>
          </div>
        </header>
        <main class="mx-auto max-w-3xl px-4 py-6">
          <router-outlet />
        </main>
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
