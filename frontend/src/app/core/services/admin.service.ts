import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Configuration, DashboardStats } from '../models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/ecoles/stats/dashboard`);
  }

  getConfiguration(): Observable<Configuration> {
    return this.http.get<Configuration>(`${environment.apiUrl}/configuration`);
  }

  updateConfiguration(config: Omit<Configuration, 'id' | 'ecoleId'>): Observable<Configuration> {
    return this.http.patch<Configuration>(`${environment.apiUrl}/configuration`, config);
  }
}
