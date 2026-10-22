import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <div class="grid min-h-[100dvh] bg-cream lg:grid-cols-2">
      <!-- Panneau décoratif (desktop) -->
      <div class="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12 lg:text-white">
        <div class="absolute inset-0 bg-teranga-pattern opacity-50"></div>
        <div class="absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
        <div class="relative flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 ring-2 ring-white/25">
            <app-icon name="graduation-cap" [size]="22" />
          </div>
          <span class="font-display text-lg font-bold">EduRegister</span>
        </div>
        <div class="relative max-w-sm">
          <h2 class="font-display text-3xl font-bold leading-tight">La gestion des inscriptions, simplifiée.</h2>
          <p class="mt-3 text-white/80">Validez les paiements, répartissez les classes et suivez vos effectifs depuis un seul espace.</p>
        </div>
        <p class="relative text-sm text-white/60">© {{ year }} EduRegister</p>
      </div>

      <!-- Formulaire -->
      <div class="flex items-center justify-center p-4 sm:p-8">
        <div class="w-full max-w-md animate-fade-in">
          <div class="mb-8 text-center lg:text-left">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary lg:mx-0">
              <app-icon name="lock" [size]="26" />
            </div>
            <h1 class="font-display text-2xl font-bold text-ink">Espace administration</h1>
            <p class="mt-1 text-sm text-ink-soft">Connectez-vous pour gérer votre établissement.</p>
          </div>

          @if (error()) {
            <div class="mb-4 flex items-center gap-2 rounded-xl border border-terracotta/20 bg-terracotta/8 px-4 py-3 text-sm font-medium text-terracotta">
              <app-icon name="alert-circle" [size]="16" /> {{ error() }}
            </div>
          }

          <form (ngSubmit)="login()" class="space-y-4">
            <div>
              <label class="field-label">Email</label>
              <input class="input-field" type="email" [(ngModel)]="email" name="email" required placeholder="vous@etablissement.sn" />
            </div>
            <div>
              <label class="field-label">Mot de passe</label>
              <input class="input-field" type="password" [(ngModel)]="motDePasse" name="motDePasse" required placeholder="••••••••" />
            </div>
            <button type="submit" class="btn-primary w-full" [disabled]="loading()">
              @if (loading()) {
                <app-icon name="loader" [size]="18" class="animate-spin" />
              } @else {
                <app-icon name="log-in" [size]="18" />
              }
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  motDePasse = '';
  loading = signal(false);
  error = signal<string | null>(null);
  readonly year = new Date().getFullYear();

  login(): void {
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.email, this.motDePasse).subscribe({
      next: () => {
        this.loading.set(false);
        if (this.auth.isSuperAdmin()) {
          this.router.navigate(['/superadmin']);
        } else {
          this.router.navigate(['/admin']);
        }
      },
      error: () => {
        this.error.set('Identifiants invalides.');
        this.loading.set(false);
      },
    });
  }
}
