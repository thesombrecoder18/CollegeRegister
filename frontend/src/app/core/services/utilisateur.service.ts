import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Utilisateur {
  id: string;
  email: string;
  role: 'GERANT' | 'SUPERADMIN';
  ecoleId: string | null;
  ecole: { id: string; nom: string; slug: string; statut: string } | null;
}

export interface UpdateGerantPayload {
  email?: string;
  motDePasse?: string;
}

export interface CreateUtilisateurPayload {
  email: string;
  motDePasse: string;
  role: 'GERANT' | 'SUPERADMIN';
  ecoleId?: string;
}

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/utilisateurs`;

  findAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.base);
  }

  findById(id: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.base}/${id}`);
  }

  update(id: string, payload: UpdateGerantPayload): Observable<Utilisateur> {
    return this.http.patch<Utilisateur>(`${this.base}/${id}`, payload);
  }

  create(payload: CreateUtilisateurPayload): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(this.base, payload);
  }

  delete(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.base}/${id}`);
  }
}
