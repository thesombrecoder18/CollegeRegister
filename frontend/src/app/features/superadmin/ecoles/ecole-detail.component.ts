import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { SuperadminService } from '../../../core/services/superadmin.service';
import { ToastService } from '../../../core/services/toast.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { IconComponent } from '../../../shared/icon/icon.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { formatMontant } from '../../../core/models';

@Component({
  selector: 'app-ecole-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  template: `
    <div class="max-w-5xl mx-auto space-y-6 animate-fade-in">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-slate-400">
        <a routerLink="/superadmin/dashboard" class="hover:text-primary transition-colors font-medium">Dashboard</a>
        <app-icon name="chevron-right" [size]="14" />
        <span class="text-slate-600 font-medium">{{ ecole()?.nom ?? 'Chargement...' }}</span>
      </nav>

      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      } @else if (!ecole()) {
        <div class="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <app-icon name="alert-circle" [size]="32" class="text-red-400 mx-auto mb-3" />
          <p class="text-red-700 font-bold">Établissement introuvable.</p>
          <a routerLink="/superadmin/dashboard" class="mt-4 inline-block text-sm text-primary hover:underline">
            Retour au dashboard
          </a>
        </div>
      } @else {

        <!-- Header -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-4">
              <!-- Avatar couleur -->
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg"
                [style.background-color]="ecole()!.couleurPrimaire">
                {{ ecole()!.nom[0].toUpperCase() }}
              </div>
              <div>
                <h1 class="text-2xl font-black text-slate-900 tracking-tight">{{ ecole()!.nom }}</h1>
                <div class="flex items-center gap-3 mt-1">
                  <!-- Slug avec copie -->
                  <button
                    (click)="copySlug()"
                    class="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 hover:bg-slate-100 transition-all group"
                    title="Copier le slug">
                    <span>/{{ ecole()!.slug }}</span>
                    <app-icon name="save" [size]="12" class="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <!-- Statut -->
                  <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                    [class]="ecole()!.statut === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'">
                    {{ ecole()!.statut }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Actions statut -->
            <div class="flex items-center gap-2 shrink-0">
              @if (ecole()!.statut === 'ACTIVE') {
                <button (click)="suspend()" [disabled]="actionLoading()"
                  class="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-all disabled:opacity-50">
                  <app-icon name="pause-circle" [size]="16" />
                  Suspendre
                </button>
              } @else {
                <button (click)="activate()" [disabled]="actionLoading()"
                  class="flex items-center gap-2 px-4 py-2 text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all disabled:opacity-50">
                  <app-icon name="play-circle" [size]="16" />
                  Réactiver
                </button>
              }
            </div>
          </div>

          <!-- Stats inscriptions -->
          @if (stats()) {
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div class="text-center">
                <p class="text-2xl font-black text-amber-600">{{ stats()!.enAttente }}</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">En attente</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-black text-emerald-600">{{ stats()!.valide }}</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Validées</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-black text-red-500">{{ stats()!.rejete }}</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Rejetées</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-black text-slate-900">{{ formatMontant(stats()!.montantCollecte) }}</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Collecté</p>
              </div>
            </div>
          }
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
          @for (tab of tabs; track tab.id) {
            <button
              (click)="activeTab.set(tab.id)"
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              [class]="activeTab() === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'">
              <app-icon [name]="tab.icon" [size]="15" />
              {{ tab.label }}
            </button>
          }
        </div>

        <!-- Tab: Thème -->
        @if (activeTab() === 'theme') {
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Personnalisation White-Label</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wide">Couleur primaire</label>
                <div class="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <input type="color" class="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer"
                    [(ngModel)]="editForm.couleurPrimaire" />
                  <div>
                    <p class="text-sm font-mono font-bold text-slate-700">{{ editForm.couleurPrimaire }}</p>
                    <p class="text-[10px] text-slate-400">Sidebar, boutons principaux</p>
                  </div>
                </div>
              </div>
              <div>
                <label class="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wide">Couleur secondaire</label>
                <div class="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <input type="color" class="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer"
                    [(ngModel)]="editForm.couleurSecondaire" />
                  <div>
                    <p class="text-sm font-mono font-bold text-slate-700">{{ editForm.couleurSecondaire }}</p>
                    <p class="text-[10px] text-slate-400">Accents, badges</p>
                  </div>
                </div>
              </div>

              <!-- Aperçu -->
              <div class="sm:col-span-2">
                <label class="mb-2 block text-xs font-bold text-slate-500 uppercase tracking-wide">Aperçu</label>
                <div class="rounded-xl overflow-hidden border border-slate-200 flex h-16">
                  <div class="w-1/2 flex items-center justify-center text-white text-sm font-bold"
                    [style.background-color]="editForm.couleurPrimaire">
                    Primaire
                  </div>
                  <div class="w-1/2 flex items-center justify-center text-white text-sm font-bold"
                    [style.background-color]="editForm.couleurSecondaire">
                    Secondaire
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 flex items-center gap-3">
              <button (click)="saveTheme()" [disabled]="savingTheme()"
                class="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-black text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                @if (savingTheme()) {
                  <app-icon name="loader" [size]="16" class="animate-spin" />
                } @else {
                  <app-icon name="save" [size]="16" />
                }
                Enregistrer le thème
              </button>
              <button (click)="resetTheme()" class="px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
                Annuler
              </button>
            </div>
          </div>
        }

        <!-- Tab: Informations -->
        @if (activeTab() === 'info') {
          <div class="space-y-4">

            <!-- Infos générales -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest">Informations générales</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="bg-slate-50 rounded-xl p-4">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Identifiant technique</p>
                  <p class="font-mono text-slate-600 text-xs break-all select-all">{{ ecole()!.id }}</p>
                </div>
                <div class="bg-slate-50 rounded-xl p-4">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date de création</p>
                  <p class="font-bold text-slate-700">{{ ecole()!.dateCreation | date:'dd MMMM yyyy à HH:mm':'':'fr' }}</p>
                </div>
                <div class="bg-slate-50 rounded-xl p-4">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">URL publique</p>
                  <p class="font-mono text-primary text-xs">localhost:4200/{{ ecole()!.slug }}</p>
                </div>
                <div class="bg-slate-50 rounded-xl p-4">
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total inscriptions</p>
                  <p class="font-black text-slate-900 text-2xl">{{ stats()?.total ?? '—' }}</p>
                </div>
              </div>
            </div>

            <!-- Compte gérant -->
            <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">
                Compte gérant
              </h3>
              @if (ecole()!.utilisateurs && ecole()!.utilisateurs!.length > 0) {
                <div class="space-y-3">
                  @for (gerant of ecole()!.utilisateurs!; track gerant.id) {
                    <div class="border border-slate-200 rounded-xl overflow-hidden">
                      <!-- Ligne gérant -->
                      <div class="flex items-center justify-between p-4 bg-slate-50">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm shrink-0">
                            {{ gerant.email.substring(0, 2).toUpperCase() }}
                          </div>
                          <div>
                            <p class="font-bold text-slate-900 text-sm">{{ gerant.email }}</p>
                            <div class="flex items-center gap-2 mt-0.5">
                              <span class="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">
                                {{ gerant.role }}
                              </span>
                              <span class="text-[10px] text-slate-400 font-mono">{{ gerant.id }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center gap-2">
                          <button (click)="copyEmail(gerant.email)"
                            class="p-2 text-slate-400 hover:text-primary transition-colors hover:bg-white rounded-lg"
                            title="Copier l'email">
                            <app-icon name="save" [size]="15" />
                          </button>
                          <button (click)="toggleEditGerant(gerant.id)"
                            class="p-2 transition-colors rounded-lg"
                            [class]="editingGerantId() === gerant.id
                              ? 'text-primary bg-primary/10'
                              : 'text-slate-400 hover:text-primary hover:bg-white'"
                            title="Modifier">
                            <app-icon name="settings" [size]="15" />
                          </button>
                        </div>
                      </div>

                      <!-- Formulaire d'édition inline -->
                      @if (editingGerantId() === gerant.id) {
                        <div class="p-4 border-t border-slate-200 bg-white space-y-4">
                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label class="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">Nouvel email</label>
                              <input type="email" [(ngModel)]="gerantForm.email"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                            </div>
                            <div>
                              <label class="mb-1.5 block text-xs font-bold text-slate-500 uppercase tracking-wide">
                                Nouveau mot de passe
                                <span class="text-slate-400 normal-case font-normal">(optionnel)</span>
                              </label>
                              <input type="password" [(ngModel)]="gerantForm.motDePasse"
                                placeholder="Laisser vide pour ne pas changer"
                                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                            </div>
                          </div>

                          <!-- Résumé changements -->
                          @if (gerantForm.email !== gerant.email || gerantForm.motDePasse) {
                            <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                              <p class="text-xs font-bold text-amber-700 mb-1 flex items-center gap-1.5">
                                <app-icon name="alert-circle" [size]="13" />
                                Modifications à confirmer
                              </p>
                              <ul class="text-xs text-amber-600 space-y-0.5 ml-5 list-disc">
                                @if (gerantForm.email !== gerant.email) {
                                  <li>Email : <span class="font-mono">{{ gerant.email }}</span> → <span class="font-mono font-bold">{{ gerantForm.email }}</span></li>
                                }
                                @if (gerantForm.motDePasse) {
                                  <li>Mot de passe : sera modifié</li>
                                }
                              </ul>
                            </div>
                          }

                          <div class="flex items-center gap-3">
                            <button
                              (click)="saveGerant(gerant.id, gerant.email)"
                              [disabled]="savingGerant() || (gerantForm.email === gerant.email && !gerantForm.motDePasse)"
                              class="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-black text-sm hover:brightness-110 transition-all shadow-lg shadow-primary/20 disabled:opacity-50">
                              @if (savingGerant()) {
                                <app-icon name="loader" [size]="15" class="animate-spin" />
                              } @else {
                                <app-icon name="check" [size]="15" />
                              }
                              Confirmer les modifications
                            </button>
                            <button (click)="editingGerantId.set(null)"
                              class="px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
                              Annuler
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              } @else {
                <div class="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <app-icon name="alert-circle" [size]="18" class="text-amber-500 shrink-0" />
                  <p class="text-sm text-amber-700 font-medium">Aucun gérant associé à cet établissement.</p>
                </div>
              }
            </div>

          </div>
        }

        <!-- Tab: Audit -->
        @if (activeTab() === 'audit') {
          <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 class="font-bold text-slate-900">Journal d'audit de l'établissement</h3>
              <button (click)="loadAudit()" class="p-2 text-slate-400 hover:text-primary transition-all bg-slate-50 rounded-xl border border-slate-200">
                <app-icon name="refresh-cw" [size]="16" [class]="loadingAudit() ? 'animate-spin' : ''" />
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th class="px-6 py-4">Date</th>
                    <th class="px-6 py-4">Utilisateur</th>
                    <th class="px-6 py-4">Action</th>
                    <th class="px-6 py-4">Détails</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  @if (loadingAudit()) {
                    <tr><td colspan="4" class="px-6 py-12 text-center text-slate-400 italic">Chargement...</td></tr>
                  } @else if (auditLogs().length === 0) {
                    <tr><td colspan="4" class="px-6 py-12 text-center text-slate-400 italic">Aucun log pour cet établissement.</td></tr>
                  } @else {
                    @for (log of auditLogs(); track log.id) {
                      <tr class="hover:bg-slate-50/50 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500">
                          {{ log.date | date:'dd/MM/yy HH:mm' }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-700">
                          {{ log.acteur?.email }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="text-xs font-medium text-slate-600 px-2 py-1 bg-slate-100 rounded">
                            {{ log.action }}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-[10px] text-slate-400 font-mono truncate max-w-[200px]" [title]="log.details">
                          {{ log.details || '—' }}
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

      }
    </div>
  `,
})
export class EcoleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(SuperadminService);
  private toast = inject(ToastService);
  private utilisateurSvc = inject(UtilisateurService);
  private http = inject(HttpClient);

  ecoleId = '';
  loading = signal(true);
  loadingAudit = signal(false);
  actionLoading = signal(false);
  savingTheme = signal(false);
  savingGerant = signal(false);
  editingGerantId = signal<string | null>(null);

  ecole = signal<any>(null);
  stats = signal<any>(null);
  auditLogs = signal<any[]>([]);
  activeTab = signal<'info' | 'theme' | 'audit'>('info');

  gerantForm: { email: string; motDePasse: string } = { email: '', motDePasse: '' };

  editForm = { couleurPrimaire: '#1e293b', couleurSecondaire: '#059669' };

  formatMontant = formatMontant;

  tabs = [
    { id: 'info' as const,  label: 'Informations', icon: 'info' },
    { id: 'theme' as const, label: 'Thème',         icon: 'palette' },
    { id: 'audit' as const, label: 'Audit',         icon: 'shield' },
  ];

  ngOnInit(): void {
    this.ecoleId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.ecoleId) {
      this.loadAll();
    }
  }

  loadAll(): void {
    this.loading.set(true);
    forkJoin({
      ecole: this.svc.getEcole(this.ecoleId),
      stats: this.svc.getEcoleStats(this.ecoleId),
    }).subscribe({
      next: ({ ecole, stats }) => {
        this.ecole.set(ecole);
        this.stats.set(stats);
        this.editForm = {
          couleurPrimaire: ecole.couleurPrimaire,
          couleurSecondaire: ecole.couleurSecondaire,
        };
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Impossible de charger les données de cet établissement.');
        this.loading.set(false);
      },
    });
  }

  loadAudit(): void {
    this.loadingAudit.set(true);
    this.http.get<any[]>(`${environment.apiUrl}/audit?ecoleId=${this.ecoleId}`).subscribe({
      next: (logs) => { this.auditLogs.set(logs); this.loadingAudit.set(false); },
      error: () => { this.toast.error('Impossible de charger les logs.'); this.loadingAudit.set(false); },
    });
  }

  // Charge l'audit au premier clic sur l'onglet
  onTabChange(tab: 'info' | 'theme' | 'audit'): void {
    this.activeTab.set(tab);
    if (tab === 'audit' && this.auditLogs().length === 0) {
      this.loadAudit();
    }
  }

  saveTheme(): void {
    this.savingTheme.set(true);
    this.http.patch(`${environment.apiUrl}/ecoles/${this.ecoleId}`, this.editForm).subscribe({
      next: () => {
        this.toast.success('Thème mis à jour avec succès.');
        this.savingTheme.set(false);
        this.loadAll();
      },
      error: () => {
        this.toast.error('Erreur lors de la mise à jour du thème.');
        this.savingTheme.set(false);
      },
    });
  }

  resetTheme(): void {
    const e = this.ecole();
    if (e) {
      this.editForm = { couleurPrimaire: e.couleurPrimaire, couleurSecondaire: e.couleurSecondaire };
    }
  }

  suspend(): void {
    this.actionLoading.set(true);
    this.svc.suspendEcole(this.ecoleId).subscribe({
      next: () => {
        this.toast.warning(`${this.ecole()?.nom} suspendu.`);
        this.actionLoading.set(false);
        this.loadAll();
      },
      error: () => {
        this.toast.error('Impossible de suspendre cet établissement.');
        this.actionLoading.set(false);
      },
    });
  }

  activate(): void {
    this.actionLoading.set(true);
    this.svc.activateEcole(this.ecoleId).subscribe({
      next: () => {
        this.toast.success(`${this.ecole()?.nom} réactivé.`);
        this.actionLoading.set(false);
        this.loadAll();
      },
      error: () => {
        this.toast.error('Impossible de réactiver cet établissement.');
        this.actionLoading.set(false);
      },
    });
  }

  toggleEditGerant(gerantId: string): void {
    if (this.editingGerantId() === gerantId) {
      this.editingGerantId.set(null);
      return;
    }
    const gerant = this.ecole()?.utilisateurs?.find((u: any) => u.id === gerantId);
    if (gerant) {
      this.gerantForm = { email: gerant.email, motDePasse: '' };
    }
    this.editingGerantId.set(gerantId);
  }

  saveGerant(gerantId: string, originalEmail: string): void {
    const payload: Record<string, string> = {};
    if (this.gerantForm.email !== originalEmail) payload['email'] = this.gerantForm.email;
    if (this.gerantForm.motDePasse) payload['motDePasse'] = this.gerantForm.motDePasse;
    if (Object.keys(payload).length === 0) return;

    this.savingGerant.set(true);
    this.utilisateurSvc.update(gerantId, payload).subscribe({
      next: () => {
        this.toast.success('Compte gérant mis à jour.');
        this.savingGerant.set(false);
        this.editingGerantId.set(null);
        this.loadAll();
      },
      error: (err) => {
        this.toast.error(err?.error?.message ?? 'Erreur lors de la mise à jour.');
        this.savingGerant.set(false);
      },
    });
  }

  copySlug(): void {
    const slug = this.ecole()?.slug;
    if (!slug) return;
    navigator.clipboard.writeText(slug).then(() => {
      this.toast.info(`Slug "/${slug}" copié.`);
    });
  }

  copyEmail(email: string): void {
    navigator.clipboard.writeText(email).then(() => {
      this.toast.info(`Email "${email}" copié.`);
    });
  }
}
