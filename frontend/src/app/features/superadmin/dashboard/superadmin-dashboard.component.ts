import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SuperadminService } from '../../../core/services/superadmin.service';
import { GlobalStats, Ecole, formatMontant } from '../../../core/models';
import { IconComponent } from '../../../shared/icon/icon.component';
import { ProvisionnementComponent } from '../provisionnement/provisionnement.component';

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [IconComponent, CommonModule, ProvisionnementComponent, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto space-y-8 animate-fade-in relative">
      
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-3xl font-black tracking-tight text-slate-900">Dashboard Global</h2>
          <p class="text-slate-500 mt-1 font-medium italic">Plateforme SaaS multi-tenant EduRegister</p>
        </div>
        <div class="flex items-center gap-2">
          <button (click)="load()" class="p-2 text-slate-400 hover:text-primary transition-all bg-white rounded-xl border border-slate-200 shadow-sm" title="Actualiser">
            <app-icon name="refresh-cw" [size]="18" [class]="loadingEcoles() ? 'animate-spin' : ''" />
          </button>
          <div class="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Live Data
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      @if (loadingStats()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          @for (i of [1,2,3]; track i) {
            <div class="h-32 bg-slate-100 rounded-2xl"></div>
          }
        </div>
      } @else if (stats()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Établissements</p>
                <h3 class="text-4xl font-black text-slate-900 tracking-tight">{{ stats()!.ecolesActives }}</h3>
              </div>
              <div class="p-4 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20">
                <app-icon name="building-2" [size]="24" />
              </div>
            </div>
          </div>

          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Inscriptions</p>
                <h3 class="text-4xl font-black text-slate-900 tracking-tight">{{ formatNumber(stats()!.totalInscriptions) }}</h3>
              </div>
              <div class="p-4 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
                <app-icon name="users" [size]="24" />
              </div>
            </div>
          </div>

          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Revenus Traités</p>
                <h3 class="text-4xl font-black text-slate-900 tracking-tight">{{ formatCompactMontant(stats()!.montantGlobalCollecte) }} <span class="text-lg">FCFA</span></h3>
              </div>
              <div class="p-4 bg-slate-900 rounded-2xl text-white shadow-lg shadow-slate-900/20">
                <app-icon name="banknote" [size]="24" />
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Table Section -->
      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        <!-- Table Header -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-black text-slate-900">Établissements Provisionnés</h3>
            <span class="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-widest">
              {{ filteredEcoles().length }} affichés
            </span>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative hidden sm:block">
              <input class="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64" 
                placeholder="Rechercher par nom ou slug..." [(ngModel)]="searchQuery" />
              <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <app-icon name="search" [size]="16" />
              </div>
            </div>
            <button (click)="showProvisionModal.set(true)" class="flex items-center gap-2 px-5 py-2.5 text-sm font-black text-white bg-primary rounded-xl hover:brightness-110 transition-all shadow-lg shadow-primary/20">
              <app-icon name="plus" [size]="18" /> Provisionner
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th class="px-6 py-4">École</th>
                <th class="px-6 py-4">Slug / Identifiant</th>
                <th class="px-6 py-4">Effectif</th>
                <th class="px-6 py-4">Statut</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @if (loadingEcoles()) {
                <tr><td colspan="5" class="px-6 py-12 text-center text-slate-400 italic">Chargement des données...</td></tr>
              } @else if (paginatedEcoles().length === 0) {
                <tr><td colspan="5" class="px-6 py-12 text-center text-slate-400 italic">Aucun établissement correspondant.</td></tr>
              } @else {
                @for (ecole of paginatedEcoles(); track ecole.id) {
                  <tr class="hover:bg-slate-50/50 transition-colors group">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all cursor-pointer" (click)="goToDetail(ecole.id)">
                          {{ getInitials(ecole.nom) }}
                        </div>
                        <div class="cursor-pointer" (click)="goToDetail(ecole.id)">
                          <p class="font-bold text-slate-900">{{ ecole.nom }}</p>
                          <div class="flex items-center gap-1.5 mt-0.5">
                            <div class="w-2 h-2 rounded-full" [style.background-color]="ecole.couleurPrimaire"></div>
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">White-label Actif</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">/{{ ecole.slug }}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex flex-col">
                        <span class="text-sm font-black text-slate-700">{{ formatNumber(ecole._count?.inscriptions || 0) }}</span>
                        <div class="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                          <div class="h-full bg-emerald-500" [style.width.%]="45"></div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                        [ngClass]="{
                          'bg-emerald-100 text-emerald-700': ecole.statut === 'ACTIVE',
                          'bg-red-100 text-red-700': ecole.statut === 'SUSPENDUE'
                        }">
                        {{ ecole.statut }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button (click)="goToDetail(ecole.id)" class="p-2 text-slate-400 hover:text-primary transition-all bg-slate-50 rounded-lg border border-slate-200" title="Voir détails">
                          <app-icon name="eye" [size]="16" />
                        </button>
                        @if (ecole.statut === 'ACTIVE') {
                          <button (click)="suspend(ecole.id)" class="p-2 text-slate-400 hover:text-red-600 transition-all bg-slate-50 rounded-lg border border-slate-200" title="Suspendre">
                            <app-icon name="pause-circle" [size]="16" />
                          </button>
                        } @else {
                          <button (click)="activate(ecole.id)" class="p-2 text-slate-400 hover:text-emerald-600 transition-all bg-slate-50 rounded-lg border border-slate-200" title="Activer">
                            <app-icon name="play-circle" [size]="16" />
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
        <div class="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-between">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Page {{ currentPage() }} sur {{ totalPages() || 1 }}
          </p>
          <div class="flex items-center gap-2">
            <button (click)="prevPage()" [disabled]="currentPage() === 1" class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:grayscale transition-all">
              <app-icon name="chevron-left" [size]="16" />
            </button>
            <button (click)="nextPage()" [disabled]="currentPage() >= totalPages()" class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:grayscale transition-all">
              <app-icon name="chevron-right" [size]="16" />
            </button>
          </div>
        </div>
      </div>

      <!-- PROVISIONING MODAL -->
      @if (showProvisionModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" (click)="showProvisionModal.set(false)">
          <div class="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden" (click)="$event.stopPropagation()">
            <div class="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 class="text-xl font-black text-slate-900">Nouveau Tenant</h3>
              <button (click)="showProvisionModal.set(false)" class="p-2 hover:bg-slate-100 rounded-xl transition-all">
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

  stats = signal<GlobalStats | null>(null);
  ecoles = signal<Ecole[]>([]);
  searchQuery = signal('');
  currentPage = signal(1);
  pageSize = 5;

  loadingStats = signal(true);
  loadingEcoles = signal(true);
  showProvisionModal = signal(false);

  filteredEcoles = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.ecoles();
    return this.ecoles().filter(e => 
      e.nom.toLowerCase().includes(query) || 
      e.slug.toLowerCase().includes(query)
    );
  });

  paginatedEcoles = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredEcoles().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filteredEcoles().length / this.pageSize));

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loadingStats.set(true);
    this.loadingEcoles.set(true);

    this.superadminService.getGlobalStats().subscribe({
      next: (data) => { this.stats.set(data); this.loadingStats.set(false); },
      error: () => this.loadingStats.set(false),
    });

    this.superadminService.listEcoles().subscribe({
      next: (data) => { this.ecoles.set(data); this.loadingEcoles.set(false); },
      error: () => this.loadingEcoles.set(false),
    });
  }

  onProvisionSuccess(): void {
    this.showProvisionModal.set(false);
    this.load();
  }

  goToDetail(id: string): void {
    this.router.navigate(['/superadmin/ecoles', id]);
  }

  suspend(id: string): void {
    if (confirm('Voulez-vous vraiment suspendre cet établissement ?')) {
      this.superadminService.suspendEcole(id).subscribe(() => this.load());
    }
  }

  activate(id: string): void {
    this.superadminService.activateEcole(id).subscribe(() => this.load());
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  formatNumber = (num: number) => new Intl.NumberFormat('fr-FR').format(num);

  formatCompactMontant(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}
