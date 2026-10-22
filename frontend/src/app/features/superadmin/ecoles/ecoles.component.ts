import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SuperadminService } from '../../../core/services/superadmin.service';
import { ToastService } from '../../../core/services/toast.service';
import { Ecole } from '../../../core/models';
import { IconComponent } from '../../../shared/icon/icon.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ecoles',
  standalone: true,
  imports: [FormsModule, IconComponent, CommonModule],
  template: `
    <div class="animate-fade-in space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Gestion des établissements</h2>
        <button class="btn-primary" (click)="showForm.set(true)">
          <app-icon name="plus" [size]="18" /> Ajouter
        </button>
      </div>

      @if (showForm()) {
        <div class="card border-primary/20 bg-primary/5 animate-fade-in">
          <h3 class="mb-4 font-black text-slate-900 uppercase text-xs tracking-widest">Nouvel établissement</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div><label class="mb-1.5 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom</label><input class="input-field" [(ngModel)]="form.nom" /></div>
            <div><label class="mb-1.5 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Slug URL</label><input class="input-field" [(ngModel)]="form.slug" placeholder="lycee-blaise-diagne" /></div>
            <div>
              <label class="mb-1.5 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Couleur primaire</label>
              <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2">
                <input type="color" class="w-8 h-8 rounded border-none bg-transparent cursor-pointer" [(ngModel)]="form.couleurPrimaire" />
                <span class="text-xs font-mono font-bold">{{ form.couleurPrimaire }}</span>
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Couleur secondaire</label>
              <div class="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-2">
                <input type="color" class="w-8 h-8 rounded border-none bg-transparent cursor-pointer" [(ngModel)]="form.couleurSecondaire" />
                <span class="text-xs font-mono font-bold">{{ form.couleurSecondaire }}</span>
              </div>
            </div>
            <div><label class="mb-1.5 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Email gérant</label><input class="input-field" type="email" [(ngModel)]="form.emailGerant" /></div>
            <div><label class="mb-1.5 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot de passe temporaire</label><input class="input-field" type="password" [(ngModel)]="form.motDePasseGerant" /></div>
          </div>
          @if (createError()) {
            <p class="mt-3 text-xs font-bold text-red-600 flex items-center gap-1.5">
              <app-icon name="alert-circle" [size]="14" /> {{ createError() }}
            </p>
          }
          <div class="mt-6 flex gap-3">
            <button class="btn-primary px-8" (click)="create()" [disabled]="creating()">
              @if (creating()) { <app-icon name="loader" [size]="18" class="animate-spin" /> }
              @else { Déployer }
            </button>
            <button class="btn-secondary" (click)="cancelForm()">Annuler</button>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (ecole of ecoles(); track ecole.id) {
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <app-icon name="school" [size]="60" />
              </div>

              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white shadow-lg"
                  [style.background-color]="ecole.couleurPrimaire">
                  {{ ecole.nom[0].toUpperCase() }}
                </div>
                <div>
                  <h3 class="font-bold text-slate-900 group-hover:text-primary transition-colors cursor-pointer"
                    (click)="goToDetail(ecole.id)">{{ ecole.nom }}</h3>
                  <p class="text-xs font-mono text-slate-400">/{{ ecole.slug }}</p>
                </div>
              </div>

              <!-- Confirmation inline de suspension -->
              @if (confirmSuspendId() === ecole.id) {
                <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs">
                  <p class="font-bold text-red-700 mb-2">Confirmer la suspension ?</p>
                  <div class="flex gap-2">
                    <button (click)="confirmSuspend(ecole.id)"
                      class="flex-1 py-1.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
                      Oui, suspendre
                    </button>
                    <button (click)="confirmSuspendId.set(null)"
                      class="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-colors">
                      Annuler
                    </button>
                  </div>
                </div>
              }

              <div class="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                  [ngClass]="{
                    'bg-emerald-100 text-emerald-700': ecole.statut === 'ACTIVE',
                    'bg-red-100 text-red-700': ecole.statut === 'SUSPENDUE'
                  }">
                  {{ ecole.statut }}
                </span>

                <div class="flex items-center gap-2">
                  <button (click)="goToDetail(ecole.id)"
                    class="p-2 text-slate-400 hover:text-primary transition-all bg-slate-50 rounded-lg border border-slate-200"
                    title="Voir les détails">
                    <app-icon name="eye" [size]="16" />
                  </button>
                  @if (ecole.statut === 'ACTIVE') {
                    <button (click)="confirmSuspendId.set(ecole.id)"
                      class="p-2 text-slate-400 hover:text-red-600 transition-all bg-slate-50 rounded-lg border border-slate-200"
                      title="Suspendre">
                      <app-icon name="pause-circle" [size]="16" />
                    </button>
                  } @else {
                    <button (click)="activate(ecole.id)"
                      class="p-2 text-slate-400 hover:text-emerald-600 transition-all bg-slate-50 rounded-lg border border-slate-200"
                      title="Réactiver">
                      <app-icon name="play-circle" [size]="16" />
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class EcolesComponent implements OnInit {
  private superadminService = inject(SuperadminService);
  private router = inject(Router);
  private toast = inject(ToastService);

  ecoles = signal<Ecole[]>([]);
  loading = signal(true);
  showForm = signal(false);
  creating = signal(false);
  createError = signal<string | null>(null);
  confirmSuspendId = signal<string | null>(null);

  form = {
    nom: '', slug: '',
    couleurPrimaire: '#1e293b', couleurSecondaire: '#059669',
    emailGerant: '', motDePasseGerant: '',
  };

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.superadminService.listEcoles().subscribe({
      next: (data) => { this.ecoles.set(data); this.loading.set(false); },
      error: () => {
        this.toast.error('Impossible de charger les établissements.');
        this.loading.set(false);
      },
    });
  }

  create(): void {
    if (!this.form.nom || !this.form.slug) return;
    this.creating.set(true);
    this.createError.set(null);
    this.superadminService.createEcole(this.form).subscribe({
      next: () => {
        this.toast.success(`Établissement "${this.form.nom}" créé avec succès.`);
        this.creating.set(false);
        this.cancelForm();
        this.load();
      },
      error: (err) => {
        this.createError.set(err?.error?.message ?? 'Erreur lors de la création.');
        this.creating.set(false);
      },
    });
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.createError.set(null);
    this.form = {
      nom: '', slug: '',
      couleurPrimaire: '#1e293b', couleurSecondaire: '#059669',
      emailGerant: '', motDePasseGerant: '',
    };
  }

  goToDetail(id: string): void {
    this.router.navigate(['/superadmin/ecoles', id]);
  }

  confirmSuspend(id: string): void {
    const ecole = this.ecoles().find(e => e.id === id);
    this.superadminService.suspendEcole(id).subscribe({
      next: () => {
        this.toast.warning(`${ecole?.nom ?? 'Établissement'} suspendu.`);
        this.confirmSuspendId.set(null);
        this.load();
      },
      error: () => {
        this.toast.error('Impossible de suspendre cet établissement.');
        this.confirmSuspendId.set(null);
      },
    });
  }

  activate(id: string): void {
    const ecole = this.ecoles().find(e => e.id === id);
    this.superadminService.activateEcole(id).subscribe({
      next: () => {
        this.toast.success(`${ecole?.nom ?? 'Établissement'} réactivé.`);
        this.load();
      },
      error: () => this.toast.error('Impossible de réactiver cet établissement.'),
    });
  }
}
