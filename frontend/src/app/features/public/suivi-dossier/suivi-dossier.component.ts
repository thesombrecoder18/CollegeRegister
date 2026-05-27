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
    <div class="card animate-fade-in">
      <div class="mb-4 flex items-center gap-2">
        <app-icon name="search" [size]="20" class="text-primary" />
        <h2 class="text-lg font-semibold">Suivi de dossier</h2>
      </div>
      <p class="mb-4 text-sm text-slate-600">
        Recherchez votre dossier par numéro de téléphone ou référence de paiement.
      </p>
      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Téléphone</label>
          <input class="input-field" [(ngModel)]="telephone" placeholder="77 123 45 67" type="tel" />
        </div>
        <div class="text-center text-xs text-slate-400">ou</div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Référence</label>
          <input class="input-field" [(ngModel)]="reference" placeholder="WAVE-20260526-XYZ" />
        </div>
      </div>
      @if (error()) {
        <div class="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error() }}</div>
      }
      <button class="btn-primary mt-6 w-full" (click)="rechercher()" [disabled]="loading()">
        @if (loading()) { <app-icon name="loader" [size]="16" class="animate-spin" /> }
        Rechercher
      </button>
      @if (result()) {
        <div class="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 animate-fade-in">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold">{{ result()!.prenom }} {{ result()!.nom }}</p>
              <p class="text-sm text-slate-500">{{ result()!.niveau }} — {{ result()!.reference }}</p>
            </div>
            <span class="rounded-full px-3 py-1 text-xs font-medium" [class]="statutClass(result()!.statut!)">
              {{ statutLabel(result()!.statut!) }}
            </span>
          </div>
          @if (result()!.classe) {
            <p class="mt-2 text-sm text-slate-600">Classe assignée : <strong>{{ result()!.classe }}</strong></p>
          }
          @if (result()!.adminNotes && result()!.statut === 'REJETE') {
            <p class="mt-2 text-sm text-red-600">Motif : {{ result()!.adminNotes }}</p>
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
