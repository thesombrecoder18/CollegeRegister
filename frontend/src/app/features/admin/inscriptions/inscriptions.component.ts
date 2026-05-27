import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InscriptionService } from '../../../core/services/inscription.service';
import { Inscription, statutLabel, statutClass, formatMontant } from '../../../core/models';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-inscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="animate-fade-in">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-xl font-semibold text-slate-900">Validation des paiements</h2>
        <div class="flex items-center gap-3">
          <select class="input-field w-auto" [(ngModel)]="filtreStatut" (ngModelChange)="load()">
            <option value="">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="VALIDE">Validées</option>
            <option value="REJETE">Rejetées</option>
          </select>
          <button class="btn-secondary !px-3 !py-2" (click)="exportCsv()">
            <app-icon name="save" [size]="14" /> Exporter CSV
          </button>
        </div>
      </div>

      <ng-container *ngIf="loading()">
        <div class="flex justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </ng-container>

      <ng-container *ngIf="!loading() && inscriptions().length === 0">
        <div class="card text-center text-slate-500">Aucune inscription trouvée.</div>
      </ng-container>

      <div *ngIf="!loading() && inscriptions().length > 0" class="space-y-3">
        <div *ngFor="let ins of inscriptions()" class="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="font-medium">{{ ins.prenom }} {{ ins.nom }}</p>
            <p class="text-sm text-slate-500">{{ ins.niveau }} — {{ ins.reference }}</p>
            <p class="text-xs text-slate-400">{{ ins.telephone }} · {{ formatMontant(ins.montantAttendu) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="rounded-full px-3 py-1 text-xs font-medium" [class]="statutClass(ins.statut)">
              {{ statutLabel(ins.statut) }}
            </span>
            <button class="btn-secondary !px-3 !py-2" (click)="openModal(ins)">
              <app-icon name="eye" [size]="16" />
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="selected()" class="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" (click)="closeModal()">
        <div class="card w-full max-w-4xl animate-fade-in" (click)="$event.stopPropagation()">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="flex items-center justify-center p-2">
              <ng-container *ngIf="selected()!.preuveImage; else noPreuve">
                <img [src]="selected()!.preuveImage!" alt="Preuve" class="max-h-96 w-full rounded-lg object-contain bg-slate-100" />
              </ng-container>
              <ng-template #noPreuve>
                <div class="flex h-64 w-full items-center justify-center rounded-lg bg-slate-50 text-slate-400">Aucune preuve</div>
              </ng-template>
            </div>
            <div class="p-2">
              <h3 class="mb-2 text-lg font-semibold">{{ selected()!.prenom }} {{ selected()!.nom }}</h3>
              <div class="mb-4 space-y-2 text-sm">
                <p><span class="text-slate-500">Référence :</span> {{ selected()!.reference }}</p>
                <p><span class="text-slate-500">Montant attendu :</span> {{ formatMontant(selected()!.montantAttendu) }}</p>
                <p><span class="text-slate-500">Opérateur :</span> {{ selected()!.operateur }}</p>
              </div>
              <ng-container *ngIf="selected()!.statut === 'EN_ATTENTE'">
                <div class="space-y-3">
                  <div>
                    <label class="mb-1 block text-sm font-medium">Montant reçu (FCFA)</label>
                    <input class="input-field" type="number" [(ngModel)]="montantRecu" />
                  </div>
                  <div>
                    <label class="mb-1 block text-sm font-medium">Notes (optionnel)</label>
                    <textarea class="input-field" rows="2" [(ngModel)]="notes"></textarea>
                  </div>
                  <div class="flex gap-2">
                    <button class="btn-primary flex-1" (click)="valider()" [disabled]="actionLoading()">
                      <app-icon name="check" [size]="16" /> Valider
                    </button>
                    <button class="btn-secondary flex-1 !text-red-600" (click)="showReject = true" [disabled]="actionLoading()">
                      <app-icon name="x" [size]="16" /> Rejeter
                    </button>
                  </div>
                </div>
              </ng-container>
              <ng-container *ngIf="showReject">
                <div class="mt-4 space-y-3 border-t border-slate-200 pt-4">
                  <label class="block text-sm font-medium text-red-700">Motif de rejet (obligatoire)</label>
                  <textarea class="input-field" rows="2" [(ngModel)]="motifRejet"></textarea>
                  <button class="btn-primary w-full !bg-red-600" (click)="rejeter()" [disabled]="!motifRejet.trim() || actionLoading()">
                    Confirmer le rejet
                  </button>
                </div>
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class InscriptionsComponent implements OnInit {
  private inscriptionService = inject(InscriptionService);
  inscriptions = signal<Inscription[]>([]);
  loading = signal(true);
  selected = signal<Inscription | null>(null);
  actionLoading = signal(false);
  filtreStatut = '';
  montantRecu = 0;
  notes = '';
  motifRejet = '';
  showReject = false;
  statutLabel = statutLabel;
  statutClass = statutClass;
  formatMontant = formatMontant;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.inscriptionService.list(this.filtreStatut || undefined).subscribe({
      next: (data) => { this.inscriptions.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openModal(ins: Inscription): void {
    this.selected.set(ins);
    this.montantRecu = ins.montantAttendu;
    this.notes = '';
    this.motifRejet = '';
    this.showReject = false;
  }

  closeModal(): void { this.selected.set(null); }

  valider(): void {
    const ins = this.selected()!;
    this.actionLoading.set(true);
    this.inscriptionService.valider(ins.id, this.montantRecu, this.notes || undefined).subscribe({
      next: () => { this.actionLoading.set(false); this.closeModal(); this.load(); },
      error: () => this.actionLoading.set(false),
    });
  }

  rejeter(): void {
    const ins = this.selected()!;
    this.actionLoading.set(true);
    this.inscriptionService.rejeter(ins.id, this.motifRejet).subscribe({
      next: () => { this.actionLoading.set(false); this.closeModal(); this.load(); },
      error: () => this.actionLoading.set(false),
    });
  }

  exportCsv(): void {
    const rows = this.inscriptions().map(i => ({
      id: i.id,
      prenom: i.prenom,
      nom: i.nom,
      telephone: i.telephone,
      niveau: i.niveau,
      reference: i.reference,
      statut: i.statut,
      montantAttendu: i.montantAttendu,
    }));
    if (rows.length === 0) return;
    const header = Object.keys(rows[0]);
    const csv = [header.join(','), ...rows.map(r => header.map(h => String((r as any)[h] ?? '')).map(v => '"' + v.replace(/"/g, '""') + '"').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscriptions_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}
