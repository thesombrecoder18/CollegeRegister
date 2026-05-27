import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EcolePublic } from '../models';

@Injectable({ providedIn: 'root' })
export class EcoleService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/ecoles`;

  getBySlug(slug: string): Observable<EcolePublic> {
    return this.http.get<EcolePublic>(`${this.baseUrl}/public/${slug}`);
  }
}
