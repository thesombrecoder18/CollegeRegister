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
    <div class="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div class="card w-full max-w-md animate-fade-in">
        <div class="mb-6 text-center">
          <h1 class="text-2xl font-bold text-slate-900">EduRegister</h1>
          <p class="mt-1 text-sm text-slate-500">Connexion administration</p>
        </div>

        @if (error()) {
          <div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {{ error() }}
          </div>
        }

        <form (ngSubmit)="login()" class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input class="input-field" type="email" [(ngModel)]="email" name="email" required />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700">Mot de passe</label>
            <input class="input-field" type="password" [(ngModel)]="motDePasse" name="motDePasse" required />
          </div>
          <button type="submit" class="btn-primary w-full" [disabled]="loading()">
            @if (loading()) {
              <app-icon name="loader" [size]="16" class="animate-spin" />
            } @else {
              <app-icon name="log-in" [size]="16" />
            }
            Se connecter
          </button>
        </form>
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
