import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ecole-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in" *ngIf="ecole()">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">{{ ecole()?.nom }}</h2>
          <p class="text-sm text-slate-500">{{ ecole()?.slug }}.plateforme.sn</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-slate-200">
        <nav class="-mb-px flex space-x-6">
          <button 
            (click)="activeTab.set('config')" 
            [class]="activeTab() === 'config' ? 'border-primary text-primary border-b-2 py-2 font-medium' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 border-b-2 py-2 font-medium'">
            Configurations
          </button>
          <button 
            (click)="activeTab.set('audit')" 
            [class]="activeTab() === 'audit' ? 'border-primary text-primary border-b-2 py-2 font-medium' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 border-b-2 py-2 font-medium'">
            Historique (Audit)
          </button>
        </nav>
      </div>

      <div *ngIf="activeTab() === 'config'" class="grid gap-6 md:grid-cols-2">
        <div class="card">
          <h3 class="mb-4 font-medium text-slate-800">Personnalisation (Thème)</h3>
          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium">Couleur primaire</label>
              <input type="color" class="input-field w-full h-10 p-1" [(ngModel)]="editForm.couleurPrimaire" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium">Couleur secondaire</label>
              <input type="color" class="input-field w-full h-10 p-1" [(ngModel)]="editForm.couleurSecondaire" />
            </div>
            <button class="btn-primary" (click)="saveConfig()">Enregistrer les modifications</button>
          </div>
        </div>
      </div>

      <div *ngIf="activeTab() === 'audit'" class="card">
        <h3 class="mb-4 font-medium text-slate-800">Journal d'audit de l'établissement</h3>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th class="px-4 py-3">Date</th>
                <th class="px-4 py-3">Utilisateur</th>
                <th class="px-4 py-3">Action</th>
                <th class="px-4 py-3">Détails</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 bg-white">
              <tr *ngFor="let log of auditLogs()">
                <td class="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{{ log.date | date:'short' }}</td>
                <td class="px-4 py-3">{{ log.acteur?.email }} ({{ log.acteur?.role }})</td>
                <td class="px-4 py-3">{{ log.action }}</td>
                <td class="px-4 py-3 text-xs text-slate-400 truncate max-w-xs">{{ log.details }}</td>
              </tr>
              <tr *ngIf="auditLogs().length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-slate-500">Aucun log trouvé pour cet établissement.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
    
    <div *ngIf="loading()" class="flex justify-center py-12">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  `
})
export class EcoleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  ecoleId = '';
  loading = signal(true);
  ecole = signal<any>(null);
  activeTab = signal<'config' | 'audit'>('config');
  auditLogs = signal<any[]>([]);

  editForm = { couleurPrimaire: '', couleurSecondaire: '' };

  ngOnInit() {
    this.ecoleId = this.route.snapshot.paramMap.get('id') || '';
    if (this.ecoleId) {
      this.loadData();
    }
  }

  loadData() {
    this.loading.set(true);
    // Load ecole details (since superadmin sees all, let's use the list and find it, or we need a GET /ecoles/:id)
    // Actually, backend ecole controller does not have GET /ecoles/:id for superadmin! Wait, it has GET public/:slug but let's just use listEcoles for now
    this.http.get<any[]>(`${this.baseUrl}/ecoles`).subscribe(ecoles => {
      const found = ecoles.find(e => e.id === this.ecoleId);
      if (found) {
        this.ecole.set(found);
        this.editForm = { couleurPrimaire: found.couleurPrimaire, couleurSecondaire: found.couleurSecondaire };
      }
      this.loading.set(false);
    });

    // Load audit logs specific to this ecole
    this.http.get<any[]>(`${this.baseUrl}/audit?ecoleId=${this.ecoleId}`).subscribe(logs => {
      this.auditLogs.set(logs);
    });
  }

  saveConfig() {
    this.http.patch(`${this.baseUrl}/ecoles/${this.ecoleId}`, this.editForm).subscribe(() => {
      alert('Configuration mise à jour');
      this.loadData();
    });
  }
}
