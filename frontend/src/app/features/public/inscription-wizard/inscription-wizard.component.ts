import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { InscriptionService } from '../../../core/services/inscription.service';
import { NIVEAUX, getMontantForNiveau, formatMontant } from '../../../core/models';
import { compressImage, validateSenegalPhone } from '../../../core/utils/image-compression';
import { IconComponent } from '../../../shared/icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscription-wizard',
  standalone: true,
  imports: [FormsModule, CommonModule, IconComponent],
  template: `
    <div class="animate-fade-in mx-auto max-w-xl">
      @if (submitted()) {
        <!-- ÉTAPE SUCCÈS -->
        <div class="overflow-hidden rounded-3xl border border-line bg-white shadow-soft animate-slide-in">
          <div class="relative overflow-hidden bg-leaf p-8 text-center text-white">
            <div class="absolute inset-0 bg-teranga-pattern opacity-50"></div>
            <div class="relative">
              <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                <app-icon name="check" [size]="40" class="text-white" />
              </div>
              <h2 class="font-display text-2xl font-bold">Inscription réussie !</h2>
              <p class="mt-1 text-white/85">Votre dossier est en cours de traitement.</p>
            </div>
          </div>

          <div class="space-y-6 p-6">
            <div class="relative overflow-hidden rounded-2xl border border-line bg-sand/40 p-6">
              <div class="absolute right-0 top-0 p-4 opacity-[0.06]">
                <app-icon name="school" [size]="80" />
              </div>
              <div class="relative space-y-4">
                <div class="flex items-center justify-between border-b border-line pb-3">
                  <span class="text-sm text-ink-soft">Référence</span>
                  <span class="font-mono text-lg font-bold text-primary">{{ reference() }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-ink-soft">Élève</span>
                  <span class="font-semibold text-ink">{{ prenom }} {{ nom }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-ink-soft">Niveau</span>
                  <span class="font-semibold text-ink">{{ niveau }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-ink-soft">Montant</span>
                  <span class="font-bold text-leaf">{{ montantFormatted() }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <button (click)="downloadReceipt()" class="btn-primary w-full">
                <app-icon name="download" [size]="20" /> Télécharger mon reçu (PDF)
              </button>
              <button (click)="goToSuivi()" class="btn-secondary w-full">
                Suivre mon dossier <app-icon name="arrow-right" [size]="18" />
              </button>
            </div>
          </div>
        </div>
      } @else {
        <!-- INDICATEUR DE PROGRESSION -->
        <div class="mb-8 flex items-center justify-between px-1">
          @for (s of [1, 2, 3]; track s) {
            <div class="relative z-10 flex flex-col items-center gap-2">
              <div class="flex h-11 w-11 items-center justify-center rounded-full font-display font-bold transition-all duration-500"
                [class]="step() === s ? 'bg-primary text-white scale-110 shadow-soft' : (step() > s ? 'bg-leaf text-white' : 'bg-sand text-ink-soft')">
                @if (step() > s) { <app-icon name="check" [size]="20" /> } @else { {{ s }} }
              </div>
              <span class="text-[11px] font-semibold uppercase tracking-wide" [class]="step() >= s ? 'text-ink' : 'text-ink-soft/60'">
                {{ s === 1 ? 'Infos' : (s === 2 ? 'Paiement' : 'Preuve') }}
              </span>
            </div>
            @if (s < 3) {
              <div class="relative -mt-6 mx-2 h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                <div class="absolute inset-0 bg-primary transition-all duration-500" [style.width.%]="step() > s ? 100 : (step() === s ? 50 : 0)"></div>
              </div>
            }
          }
        </div>

        @if (error()) {
          <div class="animate-shake mb-6 flex items-center gap-2 rounded-2xl border-l-4 border-terracotta bg-terracotta/8 px-4 py-4 text-sm font-semibold text-terracotta">
            <app-icon name="alert-circle" [size]="18" /> {{ error() }}
          </div>
        }

        <!-- ÉTAPE 1 : INFOS ÉLÈVE -->
        @if (step() === 1) {
          <div class="animate-slide-in rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-7">
            <div class="mb-6">
              <h2 class="font-display text-xl font-bold text-ink">Informations de l'élève</h2>
              <p class="text-sm text-ink-soft">Renseignez les détails de l'inscription.</p>
            </div>

            <div class="space-y-5">
              <div>
                <label class="field-label">Prénom de l'élève</label>
                <input class="input-field" [(ngModel)]="prenom" placeholder="Ex : Amadou" />
              </div>
              <div>
                <label class="field-label">Nom de famille</label>
                <input class="input-field" [(ngModel)]="nom" placeholder="Ex : Diop" />
              </div>
              <div>
                <label class="field-label">Numéro de téléphone (tuteur)</label>
                <div class="relative">
                  <input class="input-field pr-12" [(ngModel)]="telephone" type="tel" placeholder="77 123 45 67" />
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft">
                    <app-icon name="phone" [size]="20" />
                  </div>
                </div>
              </div>
              <div>
                <label class="field-label">Niveau scolaire</label>
                <div class="relative">
                  <select class="input-field appearance-none pr-10" [(ngModel)]="niveau">
                    @for (n of niveaux; track n) { <option [value]="n">{{ n }}</option> }
                  </select>
                  <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft">
                    <app-icon name="chevron-down" [size]="18" />
                  </div>
                </div>
              </div>
            </div>

            <button (click)="nextStep1()" [disabled]="!canStep1()" class="btn-primary mt-8 w-full">
              Continuer <app-icon name="arrow-right" [size]="20" />
            </button>
          </div>
        }

        <!-- ÉTAPE 2 : PAIEMENT -->
        @if (step() === 2) {
          <div class="animate-slide-in rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-7">
            <div class="mb-6">
              <h2 class="font-display text-xl font-bold text-ink">Paiement mobile</h2>
              <p class="text-sm text-ink-soft">Frais d'inscription pour la classe de <span class="font-semibold text-primary">{{ niveau }}</span>.</p>
            </div>

            <div class="mb-8 rounded-2xl border border-primary/15 bg-primary/5 p-5 text-center">
              <p class="mb-1 text-sm font-medium text-primary">Montant à régler</p>
              <h3 class="font-display text-3xl font-extrabold text-primary">{{ montantFormatted() }}</h3>
            </div>

            <div class="space-y-4">
              <button (click)="operateur = 'WAVE'"
                class="flex w-full items-center justify-between rounded-2xl border-2 p-4 transition-all"
                [class]="operateur === 'WAVE' ? 'border-primary bg-primary/5 shadow-card' : 'border-line bg-white hover:border-ink-soft/30'">
                <div class="flex items-center gap-4">
                  <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1DA1F2] font-display text-lg font-bold text-white">W</div>
                  <div class="text-left">
                    <p class="font-semibold text-ink">Wave</p>
                    <p class="text-xs text-ink-soft">Simple, rapide, sans frais</p>
                  </div>
                </div>
                <div class="flex h-6 w-6 items-center justify-center rounded-full border-2"
                  [class]="operateur === 'WAVE' ? 'border-primary bg-primary' : 'border-line'">
                  @if (operateur === 'WAVE') { <div class="h-2 w-2 rounded-full bg-white"></div> }
                </div>
              </button>

              <button (click)="operateur = 'ORANGEMONEY'"
                class="flex w-full items-center justify-between rounded-2xl border-2 p-4 transition-all"
                [class]="operateur === 'ORANGEMONEY' ? 'border-primary bg-primary/5 shadow-card' : 'border-line bg-white hover:border-ink-soft/30'">
                <div class="flex items-center gap-4">
                  <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF7900] font-display text-lg font-bold text-white">OM</div>
                  <div class="text-left">
                    <p class="font-semibold text-ink">Orange Money</p>
                    <p class="text-xs text-ink-soft">Partout au Sénégal</p>
                  </div>
                </div>
                <div class="flex h-6 w-6 items-center justify-center rounded-full border-2"
                  [class]="operateur === 'ORANGEMONEY' ? 'border-primary bg-primary' : 'border-line'">
                  @if (operateur === 'ORANGEMONEY') { <div class="h-2 w-2 rounded-full bg-white"></div> }
                </div>
              </button>
            </div>

            <div class="mt-8 grid grid-cols-2 gap-4">
              <button (click)="step.set(1)" class="btn-secondary">
                <app-icon name="arrow-left" [size]="18" /> Retour
              </button>
              <button (click)="nextStep2()" class="btn-primary">
                Continuer <app-icon name="arrow-right" [size]="18" />
              </button>
            </div>
          </div>
        }

        <!-- ÉTAPE 3 : PREUVE -->
        @if (step() === 3) {
          <div class="animate-slide-in rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-7">
            <div class="mb-6">
              <h2 class="font-display text-xl font-bold text-ink">Preuve de paiement</h2>
              <p class="text-sm text-ink-soft">Envoyez <span class="font-semibold text-ink">{{ montantFormatted() }}</span> au numéro de l'établissement, puis téléversez la capture du reçu.</p>
            </div>

            <div (click)="fileInput.click()" class="group relative flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-line bg-sand/40 transition-all hover:border-primary hover:bg-primary/5">
              @if (preview()) {
                <img [src]="preview()" alt="Preuve" class="h-full w-full object-contain p-2" />
                <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-all group-hover:opacity-100">
                  <div class="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">Changer l'image</div>
                </div>
              } @else {
                <div class="flex flex-col items-center gap-3">
                  <div class="flex h-16 w-16 items-center justify-center rounded-2xl border border-line bg-white text-ink-soft shadow-card transition-all group-hover:text-primary">
                    <app-icon name="image-plus" [size]="32" />
                  </div>
                  <div class="text-center">
                    <p class="font-semibold text-ink">Appuyez pour téléverser</p>
                    <p class="text-xs text-ink-soft">JPG, PNG (max 5 Mo)</p>
                  </div>
                </div>
              }
              <input #fileInput type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)" />
            </div>

            @if (compressing()) {
              <div class="mt-4 flex animate-pulse items-center justify-center gap-2 text-sm font-semibold text-primary">
                <app-icon name="loader" [size]="16" class="animate-spin" /> Optimisation de l'image…
              </div>
            }

            <div class="mt-8 grid grid-cols-2 gap-4">
              <button (click)="step.set(2)" class="btn-secondary">
                <app-icon name="arrow-left" [size]="18" /> Retour
              </button>
              <button (click)="submit()" [disabled]="!preuveImage() || submitting()" class="btn-primary">
                @if (submitting()) { <app-icon name="loader" [size]="20" class="animate-spin" /> }
                @else { <app-icon name="check-circle" [size]="20" /> }
                Terminer
              </button>
            </div>
          </div>
        }
      }
    </div>

    <!-- REÇU CACHÉ POUR L'IMPRESSION -->
    <div id="receipt-print" class="hidden print:block p-12 bg-white text-black font-sans">
      <div class="text-center border-b-2 border-slate-900 pb-8 mb-8">
        <h1 class="text-4xl font-black uppercase mb-2">REÇU D'INSCRIPTION</h1>
        <p class="text-xl font-bold">{{ theme.ecole()?.nom }}</p>
        <p class="text-slate-600 mt-2">Année Scolaire 2026-2027</p>
      </div>
      <div class="grid grid-cols-2 gap-y-6 text-lg">
        <div class="text-slate-500 uppercase text-sm font-bold tracking-widest">Référence</div>
        <div class="font-mono font-bold">{{ reference() }}</div>
        
        <div class="text-slate-500 uppercase text-sm font-bold tracking-widest">Date</div>
        <div class="font-bold">{{ today | date:'dd/MM/yyyy HH:mm' }}</div>
        
        <div class="text-slate-500 uppercase text-sm font-bold tracking-widest">Élève</div>
        <div class="font-bold">{{ prenom }} {{ nom }}</div>
        
        <div class="text-slate-500 uppercase text-sm font-bold tracking-widest">Classe/Niveau</div>
        <div class="font-bold">{{ niveau }}</div>
        
        <div class="text-slate-500 uppercase text-sm font-bold tracking-widest">Montant</div>
        <div class="font-black text-2xl">{{ montantFormatted() }} FCFA</div>
        
        <div class="text-slate-500 uppercase text-sm font-bold tracking-widest">Statut</div>
        <div class="font-bold">PAIEMENT EN ATTENTE DE VALIDATION</div>
      </div>
      <div class="mt-20 pt-8 border-t border-slate-200 text-center text-slate-400 text-xs italic">
        Ce document est généré numériquement par EduRegister.
      </div>
    </div>
  `,
  styles: [`
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
  `]
})
export class InscriptionWizardComponent {
  private route = inject(ActivatedRoute);
  theme = inject(ThemeService);
  private inscriptionService = inject(InscriptionService);

  step = signal(1);
  submitted = signal(false);
  submitting = signal(false);
  compressing = signal(false);
  error = signal<string | null>(null);
  reference = signal('');
  preview = signal<string | null>(null);
  preuveImage = signal<string | null>(null);
  today = new Date();

  nom = '';
  prenom = '';
  telephone = '';
  niveau = '6ème';
  operateur: 'WAVE' | 'ORANGEMONEY' = 'WAVE';
  readonly niveaux = NIVEAUX;

  montantFormatted = computed(() => {
    const config = this.theme.ecole()?.configuration;
    if (!config) return '';
    return formatMontant(getMontantForNiveau(this.niveau, config));
  });

  canStep1(): boolean {
    return !!(this.nom.trim() && this.prenom.trim() && validateSenegalPhone(this.telephone));
  }

  nextStep1(): void {
    if (!this.canStep1()) {
      this.error.set('Veuillez remplir tous les champs avec un numéro sénégalais valide.');
      return;
    }
    this.error.set(null);
    this.step.set(2);
  }

  nextStep2(): void {
    this.error.set(null);
    this.step.set(3);
  }

  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.compressing.set(true);
    try {
      const compressed = await compressImage(file);
      this.preuveImage.set(compressed);
      this.preview.set(compressed);
    } catch {
      this.error.set("Erreur lors du traitement de l'image.");
    } finally {
      this.compressing.set(false);
    }
  }

  submit(): void {
    const slug = this.route.parent!.snapshot.paramMap.get('slug')!;
    this.submitting.set(true);
    this.error.set(null);
    this.inscriptionService.create(slug, {
      nom: this.nom.trim(),
      prenom: this.prenom.trim(),
      niveau: this.niveau,
      telephone: this.telephone.replace(/\s/g, ''),
      operateur: this.operateur,
      preuveImage: this.preuveImage() ?? undefined,
    }).subscribe({
      next: (res) => {
        this.reference.set(res.reference);
        this.submitted.set(true);
        this.submitting.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message ?? "Erreur lors de l'inscription.");
        this.submitting.set(false);
      },
    });
  }

  downloadReceipt(): void {
    window.print();
  }

  goToSuivi(): void {
    const slug = this.route.parent!.snapshot.paramMap.get('slug')!;
    window.location.href = `/${slug}/suivi?ref=${this.reference()}`;
  }
}
