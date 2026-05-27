import { Component, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SuperadminService, CreateEcolePayload } from '../../../core/services/superadmin.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-provisionnement',
  standalone: true,
  imports: [FormsModule, CommonModule, IconComponent],
  template: `
    <div class="animate-fade-in">
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Section Identité -->
          <div class="space-y-4">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <app-icon name="info" [size]="14" /> Identité de l'établissement
            </h4>
            
            <div>
              <label class="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">Nom complet</label>
              <input class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                [(ngModel)]="payload.nom" placeholder="Ex: CEM Mermoz" />
            </div>
            
            <div>
              <label class="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">Slug URL (minuscules, sans espace)</label>
              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-mono">/</div>
                <input class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono text-sm" 
                  [(ngModel)]="payload.slug" placeholder="cem-mermoz" />
              </div>
            </div>
          </div>

          <!-- Section White-Label -->
          <div class="space-y-4">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <app-icon name="palette" [size]="14" /> Personnalisation (White-Label)
            </h4>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">Primaire</label>
                <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <input type="color" class="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer" [(ngModel)]="payload.couleurPrimaire" />
                  <span class="text-xs font-mono font-bold">{{ payload.couleurPrimaire }}</span>
                </div>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">Secondaire</label>
                <div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
                  <input type="color" class="w-8 h-8 rounded-lg border-none bg-transparent cursor-pointer" [(ngModel)]="payload.couleurSecondaire" />
                  <span class="text-xs font-mono font-bold">{{ payload.couleurSecondaire }}</span>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col items-center justify-center gap-2">
              <p class="text-[10px] font-bold text-slate-400 uppercase">Aperçu Thème</p>
              <div class="flex gap-2">
                <div class="w-12 h-6 rounded-md shadow-sm" [style.background-color]="payload.couleurPrimaire"></div>
                <div class="w-12 h-6 rounded-md shadow-sm" [style.background-color]="payload.couleurSecondaire"></div>
              </div>
            </div>
          </div>

          <!-- Section Gérant -->
          <div class="md:col-span-2 space-y-4 pt-4 border-t border-slate-100">
            <h4 class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <app-icon name="user" [size]="14" /> Compte Administrateur (Gérant)
            </h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">Email professionnel</label>
                <input class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                  type="email" [(ngModel)]="payload.emailGerant" placeholder="gerant@ecole.sn" />
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">Mot de passe temporaire</label>
                <input class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" 
                  type="password" [(ngModel)]="payload.motDePasseGerant" placeholder="••••••••" />
              </div>
            </div>
          </div>
        </div>

        @if (error()) {
          <div class="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 flex items-center gap-2">
            <app-icon name="alert-circle" [size]="14" /> {{ error() }}
          </div>
        }

        <div class="flex justify-end pt-4">
          <button (click)="create()" [disabled]="loading() || !canSubmit()" 
            class="px-8 py-3 bg-primary text-white rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
            @if (loading()) { <app-icon name="loader" [size]="18" class="animate-spin" /> }
            @else { Déployer le tenant }
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProvisionnementComponent {
  private svc = inject(SuperadminService);
  onSuccess = output<void>();

  payload: CreateEcolePayload = { 
    nom: '', 
    slug: '', 
    couleurPrimaire: '#1e293b', 
    couleurSecondaire: '#059669', 
    emailGerant: '', 
    motDePasseGerant: '' 
  };
  
  loading = signal(false);
  error = signal<string | null>(null);

  canSubmit(): boolean {
    return !!(this.payload.nom && this.payload.slug && this.payload.emailGerant && this.payload.motDePasseGerant);
  }

  create(): void {
    if (!this.canSubmit()) return;
    this.loading.set(true);
    this.error.set(null);
    
    this.svc.createEcole(this.payload).subscribe({
      next: () => { 
        this.loading.set(false); 
        this.onSuccess.emit();
      },
      error: (err) => { 
        this.error.set(err.error?.message || 'Erreur lors du déploiement.');
        this.loading.set(false); 
      },
    });
  }
}
