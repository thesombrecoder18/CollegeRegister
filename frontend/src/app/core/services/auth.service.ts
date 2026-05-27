import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthUser, LoginResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private userSignal = signal<AuthUser | null>(this.loadUser());
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());
  readonly isSuperAdmin = computed(() => this.userSignal()?.role === 'SUPERADMIN');
  readonly isGerant = computed(() => this.userSignal()?.role === 'GERANT');

  private get token(): string | null {
    return localStorage.getItem('accessToken');
  }

  login(email: string, motDePasse: string) {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, motDePasse })
      .pipe(
        tap((res) => {
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.userSignal.set(res.user);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    this.userSignal.set(null);
    this.router.navigate(['/connexion']);
  }

  getAccessToken(): string | null {
    return this.token;
  }

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
