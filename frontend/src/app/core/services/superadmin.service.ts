import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ecole, GlobalStats } from '../models';

export interface CreateEcolePayload {
  nom: string;
  slug: string;
  couleurPrimaire?: string;
  couleurSecondaire?: string;
  logoUrl?: string;
  emailGerant: string;
  motDePasseGerant: string;
}

@Injectable({ providedIn: 'root' })
export class SuperadminService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}`;

  getGlobalStats(): Observable<GlobalStats> {
    return this.http.get<GlobalStats>(`${this.baseUrl}/superadmin/stats`);
  }

  listEcoles(): Observable<Ecole[]> {
    return this.http.get<Ecole[]>(`${this.baseUrl}/ecoles`);
  }

  createEcole(payload: CreateEcolePayload): Observable<Ecole> {
    return this.http.post<Ecole>(`${this.baseUrl}/ecoles`, payload);
  }

  suspendEcole(id: string): Observable<Ecole> {
    return this.http.patch<Ecole>(`${this.baseUrl}/ecoles/${id}/suspendre`, {});
  }

  activateEcole(id: string): Observable<Ecole> {
    return this.http.patch<Ecole>(`${this.baseUrl}/ecoles/${id}/activer`, {});
  }

  getAuditLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/superadmin/audit-logs`);
  }
}
