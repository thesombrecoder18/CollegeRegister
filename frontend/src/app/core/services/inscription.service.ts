import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Inscription, PaginatedResponse } from '../models';

export interface CreateInscriptionPayload {
  nom: string;
  prenom: string;
  niveau: string;
  telephone: string;
  operateur: 'WAVE' | 'ORANGEMONEY';
  preuveImage?: string;
}

@Injectable({ providedIn: 'root' })
export class InscriptionService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/inscriptions`;

  create(slug: string, payload: CreateInscriptionPayload): Observable<Inscription> {
    return this.http.post<Inscription>(`${this.baseUrl}/public/${slug}`, payload);
  }

  suivi(slug: string, params: { telephone?: string; reference?: string }): Observable<Partial<Inscription>> {
    const query = new URLSearchParams();
    if (params.telephone) query.set('telephone', params.telephone);
    if (params.reference) query.set('reference', params.reference);
    return this.http.get<Partial<Inscription>>(`${this.baseUrl}/public/${slug}/suivi?${query}`);
  }

  list(statut?: string, page = 1, limit = 50): Observable<PaginatedResponse<Inscription>> {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (statut) params.set('statut', statut);
    return this.http.get<PaginatedResponse<Inscription>>(`${this.baseUrl}?${params}`);
  }

  getOne(id: string): Observable<Inscription> {
    return this.http.get<Inscription>(`${this.baseUrl}/${id}`);
  }

  valider(id: string, montantRecu: number, adminNotes?: string): Observable<Inscription> {
    return this.http.patch<Inscription>(`${this.baseUrl}/${id}/valider`, { montantRecu, adminNotes });
  }

  rejeter(id: string, adminNotes: string): Observable<Inscription> {
    return this.http.patch<Inscription>(`${this.baseUrl}/${id}/rejeter`, { adminNotes });
  }

  deplacer(id: string, classe: string): Observable<Inscription> {
    return this.http.patch<Inscription>(`${this.baseUrl}/${id}/deplacer`, { classe });
  }

  repartir(niveau: string): Observable<{ repartis: number; niveau: string }> {
    return this.http.post<{ repartis: number; niveau: string }>(
      `${this.baseUrl}/repartir/${encodeURIComponent(niveau)}`,
      {},
    );
  }

  getRepartition(): Observable<Record<string, Record<string, number>>> {
    return this.http.get<Record<string, Record<string, number>>>(`${this.baseUrl}/repartition`);
  }
}
