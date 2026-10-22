import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  UtilisateurService,
  Utilisateur,
} from '../../../core/services/utilisateur.service';
import { SuperadminService } from '../../../core/services/superadmin.service';
import { ToastService } from '../../../core/services/toast.service';
import { Ecole } from '../../../core/models';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [FormsModule, CommonModule, IconComponent],
  template: `
    <div class="animate-fade-in space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Gestion des utilisateurs</h2>
        <button class="btn-primary" (click)="openCreate()">
          <app-icon name="user-plus" [size]="18" /> Ajouter
        </button>
      </div>

      <!-- Formulaire de création -->
      @if (showForm()) {
        <div class="card border-primary/20 bg-primary/5 animate-fade-in">
          <h3 class="mb-4 font-black text-slate-900 uppercase text-xs tracking-widest">Nouvel utilisateur</h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
              <input class="input-field" type="email" [(ngModel)]="form.email" placeholder="gerant@ecole.sn" />
            </div>
            <div>
              <label class="mb-1.5 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot de passe</label>
              <input class="input-field" type="password" [(ngModel)]="form.motDePasse" placeholder="8 caractères min." />
            </div>
            <div>
              <label class="mb-1.5 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Rôle</label>
              <select class="input-field" [(ngModel)]="form.role">
                <option value="GERANT">Gérant</option>
                <option value="SUPERADMIN">Super-administrateur</option>
              </select>
            </div>
            @if (form.role === 'GERANT') {
              <div>
                <label class="mb-1.5 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Établissement</label>
                <select class="input-field" [(ngModel)]="form.ecoleId">
                  <option value="">— Sélectionner —</option>
                  @for (ecole of ecoles(); track ecole.id) {
                    <option [value]="ecole.id">{{ ecole.nom }}</option>
                  }
                </select>
              </div>
            }
          </div>
          @if (createError()) {
            <p class="mt-3 text-xs font-bold text-red-600 flex items-center gap-1.5">
              <app-icon name="alert-circle" [size]="14" /> {{ createError() }}
            </p>
          }
          <div class="mt-6 flex gap-3">
            <button class="btn-primary px-8" (click)="create()" [disabled]="creating()">
              @if (creating()) { <app-icon name="loader" [size]="18" class="animate-spin" /> }
              @else { Créer le compte }
            </button>
            <button class="btn-secondary" (click)="cancelForm()">Annuler</button>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      } @else if (utilisateurs().length === 0) {
        <div class="card flex flex-col items-center justify-center py-16 text-center">
          <app-icon name="users" [size]="48" class="text-slate-300" />
          <p class="mt-4 font-bold text-slate-500">Aucun utilisateur pour le moment.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (u of utilisateurs(); track u.id) {
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <app-icon [name]="u.role === 'SUPERADMIN' ? 'shield-check' : 'user'" [size]="60" />
              </div>

              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white shadow-lg shrink-0"
                  [ngClass]="u.role === 'SUPERADMIN' ? 'bg-[#1e293b]' : 'bg-emerald-600'">
                  {{ u.email[0].toUpperCase() }}
                </div>
                <div class="min-w-0">
                  <h3 class="font-bold text-slate-900 truncate" [title]="u.email">{{ u.email }}</h3>
                  <p class="text-xs font-medium text-slate-400 truncate">
                    {{ u.ecole?.nom ?? 'Plateforme' }}
                  </p>
                </div>
              </div>

              <!-- Édition inline -->
              @if (editId() === u.id) {
                <div class="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-xl space-y-3 animate-fade-in">
                  <div>
                    <label class="mb-1 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                    <input class="input-field" type="email" [(ngModel)]="editForm.email" />
                  </div>
                  <div>
                    <label class="mb-1 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Nouveau mot de passe</label>
                    <input class="input-field" type="password" [(ngModel)]="editForm.motDePasse" placeholder="Laisser vide pour ne pas changer" />
                  </div>
                  <div class="flex gap-2">
                    <button (click)="saveEdit(u.id)" [disabled]="saving()"
                      class="flex-1 py-1.5 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                      @if (saving()) { <app-icon name="loader" [size]="14" class="animate-spin" /> }
                      @else { <app-icon name="save" [size]="14" /> Enregistrer }
                    </button>
                    <button (click)="editId.set(null)"
                      class="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-colors">
                      Annuler
                    </button>
                  </div>
                </div>
              }

              <!-- Confirmation suppression -->
              @if (confirmDeleteId() === u.id) {
                <div class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs animate-fade-in">
                  <p class="font-bold text-red-700 mb-2">Supprimer ce compte ?</p>
                  <div class="flex gap-2">
                    <button (click)="confirmDelete(u.id)" [disabled]="saving()"
                      class="flex-1 py-1.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
                      Oui, supprimer
                    </button>
                    <button (click)="confirmDeleteId.set(null)"
                      class="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-colors">
                      Annuler
                    </button>
                  </div>
                </div>
              }

              <div class="flex items-center justify-between mt-6 pt-6 border-t border-slate-100">
                <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                  [ngClass]="u.role === 'SUPERADMIN' ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-700'">
                  {{ u.role === 'SUPERADMIN' ? 'Super-admin' : 'Gérant' }}
                </span>

                <div class="flex items-center gap-2">
                  <button (click)="openEdit(u)"
                    class="p-2 text-slate-400 hover:text-primary transition-all bg-slate-50 rounded-lg border border-slate-200"
                    title="Modifier">
                    <app-icon name="settings" [size]="16" />
                  </button>
                  <button (click)="confirmDeleteId.set(u.id)"
                    class="p-2 text-slate-400 hover:text-red-600 transition-all bg-slate-50 rounded-lg border border-slate-200"
                    title="Supprimer">
                    <app-icon name="x-circle" [size]="16" />
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class UtilisateursComponent implements OnInit {
  private utilisateurService = inject(UtilisateurService);
  private superadminService = inject(SuperadminService);
  private toast = inject(ToastService);

  utilisateurs = signal<Utilisateur[]>([]);
  ecoles = signal<Ecole[]>([]);
  loading = signal(true);
  showForm = signal(false);
  creating = signal(false);
  saving = signal(false);
  createError = signal<string | null>(null);
  editId = signal<string | null>(null);
  confirmDeleteId = signal<string | null>(null);

  form: { email: string; motDePasse: string; role: 'GERANT' | 'SUPERADMIN'; ecoleId: string } = {
    email: '', motDePasse: '', role: 'GERANT', ecoleId: '',
  };
  editForm = { email: '', motDePasse: '' };

  ngOnInit(): void {
    this.load();
    this.superadminService.listEcoles().subscribe({
      next: (data) => this.ecoles.set(data),
      error: () => {},
    });
  }

  load(): void {
    this.loading.set(true);
    this.utilisateurService.findAll().subscribe({
      next: (data) => { this.utilisateurs.set(data); this.loading.set(false); },
      error: () => {
        this.toast.error('Impossible de charger les utilisateurs.');
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editId.set(null);
    this.confirmDeleteId.set(null);
    this.showForm.set(true);
  }

  create(): void {
    if (!this.form.email || !this.form.motDePasse) {
      this.createError.set('Email et mot de passe sont requis.');
      return;
    }
    if (this.form.role === 'GERANT' && !this.form.ecoleId) {
      this.createError.set('Sélectionnez un établissement pour ce gérant.');
      return;
    }
    this.creating.set(true);
    this.createError.set(null);
    this.utilisateurService.create({
      email: this.form.email,
      motDePasse: this.form.motDePasse,
      role: this.form.role,
      ecoleId: this.form.role === 'GERANT' ? this.form.ecoleId : undefined,
    }).subscribe({
      next: () => {
        this.toast.success(`Compte "${this.form.email}" créé avec succès.`);
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
    this.form = { email: '', motDePasse: '', role: 'GERANT', ecoleId: '' };
  }

  openEdit(u: Utilisateur): void {
    this.showForm.set(false);
    this.confirmDeleteId.set(null);
    this.editForm = { email: u.email, motDePasse: '' };
    this.editId.set(u.id);
  }

  saveEdit(id: string): void {
    const payload: { email?: string; motDePasse?: string } = {};
    if (this.editForm.email) payload.email = this.editForm.email;
    if (this.editForm.motDePasse) payload.motDePasse = this.editForm.motDePasse;
    if (!payload.email && !payload.motDePasse) {
      this.editId.set(null);
      return;
    }
    this.saving.set(true);
    this.utilisateurService.update(id, payload).subscribe({
      next: () => {
        this.toast.success('Utilisateur mis à jour.');
        this.saving.set(false);
        this.editId.set(null);
        this.load();
      },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Échec de la mise à jour.');
        this.saving.set(false);
      },
    });
  }

  confirmDelete(id: string): void {
    this.saving.set(true);
    this.utilisateurService.delete(id).subscribe({
      next: () => {
        this.toast.warning('Utilisateur supprimé.');
        this.saving.set(false);
        this.confirmDeleteId.set(null);
        this.load();
      },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Suppression impossible.');
        this.saving.set(false);
        this.confirmDeleteId.set(null);
      },
    });
  }
}
