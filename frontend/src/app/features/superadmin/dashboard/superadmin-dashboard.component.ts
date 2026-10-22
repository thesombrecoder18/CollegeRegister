import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SuperadminService } from '../../../core/services/superadmin.service';
import { ToastService } from '../../../core/services/toast.service';
import { GlobalStats, Ecole, formatMontant } from '../../../core/models';
import { IconComponent } from '../../../shared/icon/icon.component';
import { ProvisionnementComponent } from '../provisionnement/provisionnement.component';

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [IconComponent, CommonModule, ProvisionnementComponent, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-8 animate-fade-in">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-black tracking-tight text-slate-900">Dashboard Global</h2>
          <p class="text-slate-500 mt-1 text-sm">Plateforme SaaS multi-tenant EduRegister</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="load()"
            class="p-2 text-slate-400 hover:text-primary transition-all bg-white rounded-xl border border-slate-200 shadow-sm"
            title="Actualiser">
            <app-icon name="refresh-cw" [size]="18" [class]="(loadingStats() || loadingEcoles()) ? 'animate-spin' : ''" />
          </button>
          <div class="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Live
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      @if (loadingStats()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (i of [1,2,3]; track i) {
            <div class="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
          }
        </div>
      } @else if (stats()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <!-- Établissements actifs -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Établissements actifs</p>
                <h3 class="text-4xl font-black text-slate-900 tracking-tight">{{ stats()!.ecolesActives }}</h3>
                @if (stats()!.ecolesSuspendues > 0) {
                  <p class="text-xs text-red-500 font-bold mt-1">
                    {{ stats()!.ecolesSuspendues }} suspendu(s)
                  </p>
                }
              </div>
              <div class="p-4 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20">
                <app-icon name="building-2" [size]="24" />
              </div>
            </div>
          </div>

          <!-- Inscriptions -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Inscriptions totales</p>
                <h3 class="text-4xl font-black text-slate-900 tracking-tight">{{ formatNumber(stats()!.totalInscriptions) }}</h3>
                @if (stats()!.inscriptionsParStatut['EN_ATTENTE']) {
                  <p class="text-xs text-amber-600 font-bold mt-1">
                    {{ stats()!.inscriptionsParStatut['EN_ATTENTE'] }} en attente
                  </p>
                }
              </div>
              <div class="p-4 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
                <app-icon name="users" [size]="24" />
              </div>
            </div>
          </div>

          <!-- Revenus -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Revenus traités</p>
                <h3 class="text-4xl font-black text-slate-900 tracking-tight">
                  {{ formatCompact(stats()!.montantGlobalCollecte) }}
                  <span class="text-lg font-bold text-slate-500">FCFA</span>
                </h3>
                <p class="text-xs text-slate-400 mt-1">{{ stats()!.totalGerants }} gérant(s)</p>
              </div>
              <div class="p-4 bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-900/20">
                <app-icon name="banknote" [size]="24" />
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Table des établissements -->
      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <!-- En-tête table -->
        <div class="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-black text-slate-900">Établissements provisionnés</h3>
            <span class="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-widest">
              {{ filteredEcoles().length }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative">
              <input
                class="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-56 transition-all"
                placeholder="Rechercher..."
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearchChange()"
              />
              <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <app-icon name="search" [size]="15" />
              </div>
            </div>
            <button
              (click)="showProvisionModal.set(true)"
              class="flex items-center gap-2 px-5 py-2 text-sm font-black text-white bg-primary rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20 whitespace-nowrap">
              <app-icon name="plus" [size]="16" />
              Provisionner
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50/50">
                <th class="px-6 py-3">École</th>
                <th class="px-6 py-3">Slug</th>
                <th class="px-6 py-3">Inscriptions</th>
                <th class="px-6 py-3">Statut</th>
                <th class="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @if (loadingEcoles()) {
                @for (i of [1,2,3]; track i) {
                  <tr>
                    <td colspan="5" class="px-6 py-4">
                      <div class="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                    </td>
                  </tr>
                }
              } @else if (paginatedEcoles().length === 0) {
                <tr>
                  <td colspan="5" class="px-6 py-16 text-center">
                    <app-icon name="building-2" [size]="32" class="text-slate-200 mx-auto mb-3" />
                    <p class="text-slate-400 font-medium">Aucun établissement trouvé.</p>
                    @if (searchQuery) {
                      <button (click)="searchQuery = ''" class="mt-2 text-sm text-primary hover:underline">
                        Effacer la recherche
                      </button>
                    }
                  </td>
                </tr>
              } @else {
                @for (ecole of paginatedEcoles(); track ecole.id) {
                  <tr class="hover:bg-slate-50/50 transition-colors group">

                    <!-- École -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-3 cursor-pointer" (click)="goToDetail(ecole.id)">
                        <div class="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-sm transition-transform group-hover:scale-105"
                          [style.background-color]="ecole.couleurPrimaire">
                          {{ getInitials(ecole.nom) }}
                        </div>
                        <div>
                          <p class="font-bold text-slate-900 group-hover:text-primary transition-colors">{{ ecole.nom }}</p>
                          <p class="text-[10px] text-slate-400">Créé le {{ ecole.dateCreation | date:'dd/MM/yyyy' }}</p>
                        </div>
                      </div>
                    </td>

                    <!-- Slug -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                        /{{ ecole.slug }}
                      </span>
                    </td>

                    <!-- Inscriptions avec barre de progression réelle -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex flex-col gap-1">
                        <span class="text-sm font-black text-slate-700">
                          {{ formatNumber(ecole._count?.inscriptions ?? 0) }}
                        </span>
                        <div class="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div class="h-full bg-emerald-500 rounded-full transition-all"
                            [style.width.%]="getProgressPercent(ecole._count?.inscriptions ?? 0)">
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Statut -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                        [class]="ecole.statut === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'">
                        {{ ecole.statut === 'ACTIVE' ? 'Actif' : 'Suspendu' }}
                      </span>
                    </td>

                    <!-- Actions -->
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button (click)="goToDetail(ecole.id)"
                          class="p-2 text-slate-400 hover:text-primary transition-all bg-slate-50 rounded-lg border border-slate-200 hover:border-primary/30"
                          title="Voir la fiche">
                          <app-icon name="eye" [size]="15" />
                        </button>

                        @if (ecole.statut === 'ACTIVE') {
                          <!-- Confirmation inline suspension -->
                          @if (confirmSuspendId() === ecole.id) {
                            <div class="flex items-center gap-1">
                              <button (click)="confirmSuspend(ecole.id)"
                                class="px-2 py-1 text-[10px] font-black text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                                Confirmer
                              </button>
                              <button (click)="confirmSuspendId.set(null)"
                                class="px-2 py-1 text-[10px] font-black text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                                Annuler
                              </button>
                            </div>
                          } @else {
                            <button (click)="confirmSuspendId.set(ecole.id)"
                              class="p-2 text-slate-400 hover:text-red-600 transition-all bg-slate-50 rounded-lg border border-slate-200 hover:border-red-200"
                              title="Suspendre">
                              <app-icon name="pause-circle" [size]="15" />
                            </button>
                          }
                        } @else {
                          <button (click)="activate(ecole.id)"
                            class="p-2 text-slate-400 hover:text-emerald-600 transition-all bg-slate-50 rounded-lg border border-slate-200 hover:border-emerald-200"
                            title="Réactiver">
                            <app-icon name="play-circle" [size]="15" />
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p class="text-xs text-slate-400">
            Page <span class="font-bold text-slate-600">{{ currentPage() }}</span>
            sur <span class="font-bold text-slate-600">{{ totalPages() || 1 }}</span>
            · <span class="font-bold text-slate-600">{{ filteredEcoles().length }}</span> résultat(s)
          </p>
          <div class="flex items-center gap-2">
            <button (click)="prevPage()" [disabled]="currentPage() === 1"
              class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
              <app-icon name="chevron-left" [size]="15" />
            </button>
            <button (click)="nextPage()" [disabled]="currentPage() >= totalPages()"
              class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
              <app-icon name="chevron-right" [size]="15" />
            </button>
          </div>
        </div>
      </div>

      <!-- Modal provisionnement -->
      @if (showProvisionModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          (click)="showProvisionModal.set(false)">
          <div class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            (click)="$event.stopPropagation()">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 class="text-xl font-black text-slate-900">Nouveau Tenant</h3>
                <p class="text-sm text-slate-500 mt-0.5">Déployer un nouvel établissement sur la plateforme</p>
              </div>
              <button (click)="showProvisionModal.set(false)"
                class="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600">
                <app-icon name="x" [size]="20" />
              </button>
            </div>
            <div class="p-6">
              <app-provisionnement (onSuccess)="onProvisionSuccess()" />
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class SuperadminDashboardComponent implements OnInit {
  private superadminService = inject(SuperadminService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  stats = signal<GlobalStats | null>(null);
  ecoles = signal<Ecole[]>([]);
  loadingStats = signal(true);
  loadingEcoles = signal(true);
  showProvisionModal = signal(false);
  confirmSuspendId = signal<string | null>(null);
  currentPage = signal(1);
  readonly pageSize = 8;

  // searchQuery comme propriété simple (compatible ngModel)
  searchQuery = '';

  filteredEcoles = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.ecoles();
    return this.ecoles().filter(e =>
      e.nom.toLowerCase().includes(q) ||
      e.slug.toLowerCase().includes(q),
    );
  });

  paginatedEcoles = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredEcoles().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filteredEcoles().length / this.pageSize));

  // Max inscriptions pour la barre de progression relative
  maxInscriptions = computed(() =>
    Math.max(1, ...this.ecoles().map(e => e._count?.inscriptions ?? 0)),
  );

  ngOnInit(): void {
    // Récupère le terme de recherche depuis la navbar globale
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
      }
    });
    this.load();
  }

  load(): void {
    this.loadingStats.set(true);
    this.loadingEcoles.set(true);

    this.superadminService.getGlobalStats().subscribe({
      next: (data) => { this.stats.set(data); this.loadingStats.set(false); },
      error: () => { this.toast.error('Impossible de charger les statistiques.'); this.loadingStats.set(false); },
    });

    this.superadminService.listEcoles().subscribe({
      next: (data) => { this.ecoles.set(data); this.loadingEcoles.set(false); },
      error: () => { this.toast.error('Impossible de charger les établissements.'); this.loadingEcoles.set(false); },
    });
  }

  onSearchChange(): void {
    this.currentPage.set(1);
  }

  onProvisionSuccess(): void {
    this.showProvisionModal.set(false);
    this.toast.success('Tenant déployé avec succès.');
    this.load();
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

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1);
  }

  prevPage(): void {
    if (this.currentPage() > 1) this.currentPage.update(p => p - 1);
  }

  getProgressPercent(count: number): number {
    const max = this.maxInscriptions();
    return max > 0 ? Math.round((count / max) * 100) : 0;
  }

  formatNumber = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

  formatCompact(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K';
    return n.toString();
  }

  getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  }
}
