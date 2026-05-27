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
    <div class="animate-fade-in max-w-lg mx-auto px-4 py-6">
      @if (submitted()) {
        <!-- ÉTAPE SUCCÈS -->
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 animate-slide-in">
          <div class="bg-emerald-600 p-8 text-center text-white">
            <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
              <app-icon name="check" [size]="40" class="text-white" />
            </div>
            <h2 class="text-2xl font-bold">Inscription Réussie !</h2>
            <p class="opacity-90 mt-1">Votre dossier est en cours de traitement</p>
          </div>
          
          <div class="p-6 space-y-6">
            <div class="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-5">
                <app-icon name="school" [size]="80" />
              </div>
              <div class="space-y-4">
                <div class="flex justify-between items-center pb-3 border-b border-slate-200/60">
                  <span class="text-slate-500 text-sm">Référence</span>
                  <span class="font-mono font-bold text-primary text-lg">{{ reference() }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-500 text-sm">Élève</span>
                  <span class="font-semibold text-slate-900">{{ prenom }} {{ nom }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-500 text-sm">Niveau</span>
                  <span class="font-semibold text-slate-900">{{ niveau }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-500 text-sm">Montant</span>
                  <span class="font-bold text-emerald-600">{{ montantFormatted() }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <button (click)="downloadReceipt()" class="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/20">
                <app-icon name="download" [size]="20" /> Télécharger mon reçu (PDF)
              </button>
              <button (click)="goToSuivi()" class="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-semibold hover:bg-slate-50 transition-all">
                Suivre mon dossier
              </button>
            </div>
          </div>
        </div>
      } @else {
        <!-- INDICATEUR DE PROGRESSION -->
        <div class="mb-8 flex items-center justify-between px-2">
          @for (s of [1, 2, 3]; track s) {
            <div class="flex flex-col items-center gap-2 relative z-10">
              <div class="h-10 w-10 flex items-center justify-center rounded-full font-bold transition-all duration-500"
                [class]="step() === s ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : (step() > s ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400')">
                @if (step() > s) { <app-icon name="check" [size]="20" /> } @else { {{ s }} }
              </div>
              <span class="text-[10px] font-bold uppercase tracking-wider" [class]="step() >= s ? 'text-primary' : 'text-slate-400'">
                {{ s === 1 ? 'Infos' : (s === 2 ? 'Paiement' : 'Preuve') }}
              </span>
            </div>
            @if (s < 3) {
              <div class="flex-1 h-1 mx-2 -mt-6 rounded-full bg-slate-200 relative overflow-hidden">
                <div class="absolute inset-0 bg-primary transition-all duration-500" [style.width.%]="step() > s ? 100 : (step() === s ? 50 : 0)"></div>
              </div>
            }
          }
        </div>

        @if (error()) {
          <div class="mb-6 rounded-2xl border-l-4 border-red-500 bg-red-50 px-4 py-4 text-sm text-red-700 shadow-sm animate-shake">
            <div class="flex items-center gap-2">
              <app-icon name="alert-circle" [size]="18" />
              <span class="font-semibold">{{ error() }}</span>
            </div>
          </div>
        }

        <!-- ÉTAPE 1 : INFOS ÉLÈVE -->
        @if (step() === 1) {
          <div class="bg-white rounded-3xl shadow-xl p-6 border border-slate-100 animate-slide-in">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-slate-900">Informations de l'élève</h2>
              <p class="text-slate-500 text-sm">Veuillez renseigner les détails de l'inscription.</p>
            </div>
            
            <div class="space-y-5">
              <div class="group">
                <label class="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Prénom de l'élève</label>
                <input class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 font-medium placeholder:text-slate-300" 
                  [(ngModel)]="prenom" placeholder="Ex: Amadou" />
              </div>
              <div class="group">
                <label class="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Nom de famille</label>
                <input class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 font-medium placeholder:text-slate-300" 
                  [(ngModel)]="nom" placeholder="Ex: Diop" />
              </div>
              <div class="group">
                <label class="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Numéro de téléphone (Tuteur)</label>
                <div class="relative">
                  <input class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 font-medium placeholder:text-slate-300" 
                    [(ngModel)]="telephone" type="tel" placeholder="77 123 45 67" />
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <app-icon name="phone" [size]="20" />
                  </div>
                </div>
              </div>
              <div class="group">
                <label class="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Niveau scolaire</label>
                <select class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 font-medium appearance-none" 
                  [(ngModel)]="niveau">
                  @for (n of niveaux; track n) { <option [value]="n">{{ n }}</option> }
                </select>
              </div>
            </div>

            <button (click)="nextStep1()" [disabled]="!canStep1()" 
              class="w-full mt-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:grayscale">
              Suivant <app-icon name="arrow-right" [size]="20" />
            </button>
          </div>
        }

        <!-- ÉTAPE 2 : PAIEMENT -->
        @if (step() === 2) {
          <div class="bg-white rounded-3xl shadow-xl p-6 border border-slate-100 animate-slide-in">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-slate-900">Paiement Mobile</h2>
              <p class="text-slate-500 text-sm">Frais d'inscription pour la classe de <span class="font-bold text-primary">{{ niveau }}</span>.</p>
            </div>

            <div class="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-8 text-center">
              <p class="text-sm text-primary font-medium mb-1">Montant à régler</p>
              <h3 class="text-3xl font-black text-primary">{{ montantFormatted() }} <span class="text-sm">FCFA</span></h3>
            </div>

            <div class="space-y-4">
              <button (click)="operateur = 'WAVE'" 
                class="w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all"
                [class]="operateur === 'WAVE' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-[#1DA1F2] rounded-xl flex items-center justify-center text-white font-black text-lg">W</div>
                  <div class="text-left">
                    <p class="font-bold text-slate-900">Wave</p>
                    <p class="text-xs text-slate-500">Simple, rapide, sans frais</p>
                  </div>
                </div>
                <div class="h-6 w-6 rounded-full border-2 flex items-center justify-center" 
                  [class]="operateur === 'WAVE' ? 'border-primary bg-primary' : 'border-slate-200'">
                  @if (operateur === 'WAVE') { <div class="h-2 w-2 rounded-full bg-white"></div> }
                </div>
              </button>

              <button (click)="operateur = 'ORANGEMONEY'" 
                class="w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all"
                [class]="operateur === 'ORANGEMONEY' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-[#FF7900] rounded-xl flex items-center justify-center text-white font-black text-lg">OM</div>
                  <div class="text-left">
                    <p class="font-bold text-slate-900">Orange Money</p>
                    <p class="text-xs text-slate-500">Partout au Sénégal</p>
                  </div>
                </div>
                <div class="h-6 w-6 rounded-full border-2 flex items-center justify-center" 
                  [class]="operateur === 'ORANGEMONEY' ? 'border-primary bg-primary' : 'border-slate-200'">
                  @if (operateur === 'ORANGEMONEY') { <div class="h-2 w-2 rounded-full bg-white"></div> }
                </div>
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4 mt-8">
              <button (click)="step.set(1)" class="py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2">
                <app-icon name="arrow-left" [size]="18" /> Retour
              </button>
              <button (click)="nextStep2()" class="py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2">
                Suivant <app-icon name="arrow-right" [size]="18" />
              </button>
            </div>
          </div>
        }

        <!-- ÉTAPE 3 : PREUVE -->
        @if (step() === 3) {
          <div class="bg-white rounded-3xl shadow-xl p-6 border border-slate-100 animate-slide-in">
            <div class="mb-6">
              <h2 class="text-xl font-bold text-slate-900">Preuve de Paiement</h2>
              <p class="text-slate-500 text-sm">Veuillez envoyer le montant de <span class="font-bold">{{ montantFormatted() }}</span> au numéro de l'établissement, puis téléversez la capture d'écran du reçu.</p>
            </div>

            <div (click)="fileInput.click()" class="relative group cursor-pointer aspect-video rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden hover:border-primary hover:bg-primary/5 transition-all">
              @if (preview()) {
                <img [src]="preview()" alt="Preuve" class="w-full h-full object-contain p-2" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <div class="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold text-sm">Changer l'image</div>
                </div>
              } @else {
                <div class="flex flex-col items-center gap-3">
                  <div class="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-all">
                    <app-icon name="image-plus" [size]="32" />
                  </div>
                  <div class="text-center">
                    <p class="font-bold text-slate-900">Appuyez pour téléverser</p>
                    <p class="text-xs text-slate-400">JPG, PNG (max 5 Mo)</p>
                  </div>
                </div>
              }
              <input #fileInput type="file" accept="image/*" class="hidden" (change)="onFileSelected($event)" />
            </div>

            @if (compressing()) {
              <div class="mt-4 flex items-center justify-center gap-2 text-primary font-bold animate-pulse text-sm">
                <app-icon name="loader" [size]="16" class="animate-spin" /> Optimisation de l'image...
              </div>
            }

            <div class="grid grid-cols-2 gap-4 mt-8">
              <button (click)="step.set(2)" class="py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2">
                <app-icon name="arrow-left" [size]="18" /> Retour
              </button>
              <button (click)="submit()" [disabled]="!preuveImage() || submitting()" 
                class="py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50">
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
