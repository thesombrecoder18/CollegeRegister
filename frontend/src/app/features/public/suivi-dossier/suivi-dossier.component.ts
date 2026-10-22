import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InscriptionService } from '../../../core/services/inscription.service';
import { statutLabel, statutClass } from '../../../core/models';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-suivi-dossier',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <div class="mx-auto max-w-xl animate-fade-in">
      <div class="mb-6 text-center">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <app-icon name="search" [size]="26" />
        </div>
        <h2 class="font-display text-2xl font-bold text-ink">Suivi de dossier</h2>
        <p class="mt-1.5 text-ink-soft">Retrouvez votre dossier par téléphone ou par référence de paiement.</p>
      </div>

      <div class="card">
        <div class="space-y-4">
          <div>
            <label class="field-label">Téléphone</label>
            <input class="input-field" [(ngModel)]="telephone" placeholder="77 123 45 67" type="tel" />
          </div>
          <div class="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-ink-soft/60">
            <span class="h-px flex-1 bg-line"></span> ou <span class="h-px flex-1 bg-line"></span>
          </div>
          <div>
            <label class="field-label">Référence</label>
            <input class="input-field" [(ngModel)]="reference" placeholder="WAVE-20260526-XYZ" />
          </div>
        </div>
        @if (error()) {
          <div class="mt-4 flex items-center gap-2 rounded-xl border border-terracotta/20 bg-terracotta/8 px-4 py-3 text-sm font-medium text-terracotta">
            <app-icon name="alert-circle" [size]="16" /> {{ error() }}
          </div>
        }
        <button class="btn-primary mt-6 w-full" (click)="rechercher()" [disabled]="loading()">
          @if (loading()) { <app-icon name="loader" [size]="18" class="animate-spin" /> }
          Rechercher mon dossier
        </button>
      </div>

      @if (result()) {
        <div class="card mt-5 animate-fade-in">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="font-semibold text-ink">{{ result()!.prenom }} {{ result()!.nom }}</p>
              <p class="text-sm text-ink-soft">{{ result()!.niveau }} · {{ result()!.reference }}</p>
            </div>
            <span class="rounded-full px-3 py-1 text-xs font-semibold" [class]="statutClass(result()!.statut!)">
              {{ statutLabel(result()!.statut!) }}
            </span>
          </div>
          @if (result()!.classe) {
            <p class="mt-3 border-t border-line pt-3 text-sm text-ink-soft">Classe assignée : <strong class="text-ink">{{ result()!.classe }}</strong></p>
          }
          @if (result()!.adminNotes && result()!.statut === 'REJETE') {
            <p class="mt-3 rounded-xl bg-terracotta/8 px-3 py-2 text-sm text-terracotta">Motif : {{ result()!.adminNotes }}</p>
          }
        </div>
      }
    </div>
  `,
})
export class SuiviDossierComponent {
  private route = inject(ActivatedRoute);
  private inscriptionService = inject(InscriptionService);

  telephone = '';
  reference = '';
  loading = signal(false);
  error = signal<string | null>(null);
  result = signal<{ nom?: string; prenom?: string; niveau?: string; classe?: string; reference?: string; statut?: string; adminNotes?: string | null } | null>(null);

  statutLabel = statutLabel;
  statutClass = statutClass;

  rechercher(): void {
    if (!this.telephone.trim() && !this.reference.trim()) {
      this.error.set('Veuillez saisir un téléphone ou une référence.');
      return;
    }
    const slug = this.route.parent!.snapshot.paramMap.get('slug')!;
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.inscriptionService.suivi(slug, {
      telephone: this.telephone.replace(/\s/g, '') || undefined,
      reference: this.reference.trim() || undefined,
    }).subscribe({
      next: (res) => { this.result.set(res); this.loading.set(false); },
      error: () => { this.error.set('Aucun dossier trouvé.'); this.loading.set(false); },
    });
  }
}
