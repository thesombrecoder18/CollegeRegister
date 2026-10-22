import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InscriptionService } from '../../../core/services/inscription.service';
import { ToastService } from '../../../core/services/toast.service';
import { Inscription, statutLabel, statutClass, formatMontant } from '../../../core/models';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-inscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="animate-fade-in">
      <div class="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="font-display text-2xl font-bold text-ink">Validation des paiements</h2>
          @if (meta()) {
            <p class="mt-1 text-sm text-ink-soft">{{ meta()!.total }} inscription(s) au total</p>
          }
        </div>
        <div class="flex items-center gap-3">
          <div class="relative">
            <select class="input-field w-auto appearance-none pr-9" [(ngModel)]="filtreStatut" (ngModelChange)="onFilterChange()">
              <option value="">Tous les statuts</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="VALIDE">Validées</option>
              <option value="REJETE">Rejetées</option>
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft">
              <app-icon name="chevron-down" [size]="16" />
            </div>
          </div>
          <button class="btn-secondary" (click)="exportCsv()">
            <app-icon name="download" [size]="16" /> <span class="hidden sm:inline">Exporter</span> CSV
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3,4]; track i) {
            <div class="card h-[76px] animate-pulse"><div class="h-full w-full rounded-lg bg-sand/60"></div></div>
          }
        </div>
      } @else if (inscriptions().length === 0) {
        <div class="card flex flex-col items-center justify-center py-16 text-center">
          <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-sand text-ink-soft">
            <app-icon name="clipboard-list" [size]="26" />
          </div>
          <p class="font-semibold text-ink-soft">Aucune inscription trouvée.</p>
        </div>
      } @else {
        <div class="space-y-3">
          @for (ins of inscriptions(); track ins.id) {
            <div class="card flex flex-col gap-3 transition-shadow hover:shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-3.5">
                <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 font-display font-bold text-primary">
                  {{ ins.prenom[0] }}{{ ins.nom[0] }}
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-ink">{{ ins.prenom }} {{ ins.nom }}</p>
                  <p class="text-sm text-ink-soft">{{ ins.niveau }} · {{ ins.reference }}</p>
                  <p class="text-xs text-ink-soft/80">{{ ins.telephone }} · {{ formatMontant(ins.montantAttendu) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 self-end sm:self-auto">
                <span class="rounded-full px-3 py-1 text-xs font-semibold" [class]="statutClass(ins.statut)">
                  {{ statutLabel(ins.statut) }}
                </span>
                <button class="btn-secondary !px-3" (click)="openModal(ins)" title="Examiner">
                  <app-icon name="eye" [size]="16" />
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (meta() && meta()!.totalPages > 1) {
          <div class="mt-6 flex items-center justify-between">
            <p class="text-sm text-ink-soft">Page {{ currentPage() }} / {{ meta()!.totalPages }}</p>
            <div class="flex items-center gap-2">
              <button (click)="prevPage()" [disabled]="currentPage() === 1"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-all hover:bg-sand disabled:opacity-40">
                <app-icon name="chevron-left" [size]="16" />
              </button>
              <button (click)="nextPage()" [disabled]="currentPage() >= meta()!.totalPages"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-all hover:bg-sand disabled:opacity-40">
                <app-icon name="chevron-right" [size]="16" />
              </button>
            </div>
          </div>
        }
      }

      @if (selected()) {
        <div class="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center" (click)="closeModal()">
          <div class="w-full max-w-4xl animate-slide-in overflow-hidden rounded-3xl border border-line bg-white shadow-lift" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between border-b border-line px-5 py-4">
              <div class="flex items-center gap-2.5">
                <app-icon name="shield-check" [size]="20" class="text-primary" />
                <h3 class="font-display text-lg font-bold text-ink">Validation du paiement</h3>
              </div>
              <button class="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-sand" (click)="closeModal()">
                <app-icon name="x" [size]="18" />
              </button>
            </div>
            <div class="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              <div class="flex items-center justify-center">
                @if (selected()!.preuveImage) {
                  <img [src]="selected()!.preuveImage!" alt="Preuve" class="max-h-[26rem] w-full rounded-2xl border border-line bg-sand/40 object-contain" />
                } @else {
                  <div class="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl bg-sand/40 text-ink-soft">
                    <app-icon name="image-plus" [size]="28" /> <span class="text-sm">Aucune preuve fournie</span>
                  </div>
                }
              </div>
              <div>
                <h3 class="font-display text-lg font-bold text-ink">{{ selected()!.prenom }} {{ selected()!.nom }}</h3>
                <span class="mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold" [class]="statutClass(selected()!.statut)">{{ statutLabel(selected()!.statut) }}</span>
                <dl class="mt-4 space-y-2.5 rounded-2xl bg-sand/40 p-4 text-sm">
                  <div class="flex justify-between gap-3"><dt class="text-ink-soft">Référence</dt><dd class="font-mono font-semibold text-ink">{{ selected()!.reference }}</dd></div>
                  <div class="flex justify-between gap-3"><dt class="text-ink-soft">Niveau</dt><dd class="font-semibold text-ink">{{ selected()!.niveau }}</dd></div>
                  <div class="flex justify-between gap-3"><dt class="text-ink-soft">Montant attendu</dt><dd class="font-semibold text-ink">{{ formatMontant(selected()!.montantAttendu) }}</dd></div>
                  <div class="flex justify-between gap-3"><dt class="text-ink-soft">Opérateur</dt><dd class="font-semibold text-ink">{{ selected()!.operateur }}</dd></div>
                </dl>
                @if (selected()!.statut === 'EN_ATTENTE') {
                  <div class="mt-4 space-y-3">
                    <div>
                      <label class="field-label">Montant reçu (FCFA)</label>
                      <input class="input-field" type="number" [(ngModel)]="montantRecu" />
                    </div>
                    <div>
                      <label class="field-label">Notes (optionnel)</label>
                      <textarea class="input-field" rows="2" [(ngModel)]="notes"></textarea>
                    </div>
                    <div class="flex gap-2">
                      <button class="btn-primary flex-1" (click)="valider()" [disabled]="actionLoading()">
                        <app-icon name="check" [size]="16" /> Valider
                      </button>
                      <button class="btn-secondary flex-1 !border-terracotta/30 !text-terracotta" (click)="showReject = true" [disabled]="actionLoading()">
                        <app-icon name="x" [size]="16" /> Rejeter
                      </button>
                    </div>
                  </div>
                }
                @if (showReject) {
                  <div class="mt-4 space-y-3 border-t border-line pt-4">
                    <label class="field-label !text-terracotta">Motif de rejet (obligatoire)</label>
                    <textarea class="input-field" rows="2" [(ngModel)]="motifRejet"></textarea>
                    <button class="btn-primary w-full !bg-terracotta" (click)="rejeter()" [disabled]="!motifRejet.trim() || actionLoading()">
                      Confirmer le rejet
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class InscriptionsComponent implements OnInit {
  private inscriptionService = inject(InscriptionService);
  private toast = inject(ToastService);

  inscriptions = signal<Inscription[]>([]);
  meta = signal<{ total: number; page: number; limit: number; totalPages: number } | null>(null);
  loading = signal(true);
  selected = signal<Inscription | null>(null);
  actionLoading = signal(false);
  currentPage = signal(1);
  readonly pageSize = 50;

  filtreStatut = '';
  montantRecu = 0;
  notes = '';
  motifRejet = '';
  showReject = false;

  statutLabel = statutLabel;
  statutClass = statutClass;
  formatMontant = formatMontant;

  ngOnInit(): void { this.load(); }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.inscriptionService.list(this.filtreStatut || undefined, this.currentPage(), this.pageSize).subscribe({
      next: (res) => {
        this.inscriptions.set(res.data);
        this.meta.set(res.meta);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Impossible de charger les inscriptions.');
        this.loading.set(false);
      },
    });
  }

  nextPage(): void {
    if (this.currentPage() < (this.meta()?.totalPages ?? 1)) {
      this.currentPage.update(p => p + 1);
      this.load();
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.load();
    }
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
      next: () => {
        this.toast.success(`Paiement de ${ins.prenom} ${ins.nom} validé.`);
        this.actionLoading.set(false);
        this.closeModal();
        this.load();
      },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Erreur lors de la validation.');
        this.actionLoading.set(false);
      },
    });
  }

  rejeter(): void {
    const ins = this.selected()!;
    this.actionLoading.set(true);
    this.inscriptionService.rejeter(ins.id, this.motifRejet).subscribe({
      next: () => {
        this.toast.warning(`Dossier de ${ins.prenom} ${ins.nom} rejeté.`);
        this.actionLoading.set(false);
        this.closeModal();
        this.load();
      },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Erreur lors du rejet.');
        this.actionLoading.set(false);
      },
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
    if (rows.length === 0) {
      this.toast.info('Aucune donnée à exporter.');
      return;
    }
    const header = Object.keys(rows[0]);
    const csv = [
      header.join(','),
      ...rows.map(r =>
        header.map(h => '"' + String((r as any)[h] ?? '').replace(/"/g, '""') + '"').join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscriptions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    this.toast.success(`${rows.length} inscription(s) exportée(s).`);
  }
}
