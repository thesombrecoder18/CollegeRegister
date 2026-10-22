import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperadminService } from '../../../core/services/superadmin.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, IconComponent, FormsModule],
  template: `
    <div class="animate-fade-in space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Audit Log & Sécurité</h2>
          <p class="text-slate-500 text-sm">Traçabilité complète des actions sur la plateforme EduRegister.</p>
        </div>
        <button (click)="load()" class="p-2 text-slate-400 hover:text-primary transition-all bg-white rounded-xl border border-slate-200 shadow-sm" title="Actualiser">
          <app-icon name="refresh-cw" [size]="18" [class]="loading() ? 'animate-spin' : ''" />
        </button>
      </div>

      <!-- Security Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">État Système</p>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="font-bold text-slate-900 text-sm">Opérationnel</span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Isolation Tenants</p>
          <div class="flex items-center gap-2">
            <app-icon name="shield-check" [size]="16" class="text-emerald-500" />
            <span class="font-bold text-slate-900 text-sm">Stricte (VPC)</span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Auth JWT</p>
          <div class="flex items-center gap-2">
            <app-icon name="key" [size]="16" class="text-emerald-500" />
            <span class="font-bold text-slate-900 text-sm">RS256 Actif</span>
          </div>
        </div>
        <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Flux TLS</p>
          <div class="flex items-center gap-2">
            <app-icon name="lock" [size]="16" class="text-emerald-500" />
            <span class="font-bold text-slate-900 text-sm">v1.3 chiffré</span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h3 class="font-bold text-slate-900">Journal des évènements</h3>
            <span class="px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[10px] font-black">
              {{ meta()?.total ?? 0 }} EVENTS
            </span>
          </div>
          <div class="relative">
            <input class="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
              placeholder="Filtrer par action ou email..." [(ngModel)]="searchQuery" />
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <app-icon name="search" [size]="16" />
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th class="px-6 py-4">Horodatage</th>
                <th class="px-6 py-4">Utilisateur</th>
                <th class="px-6 py-4">Action</th>
                <th class="px-6 py-4">Tenant</th>
                <th class="px-6 py-4">Détails</th>
                <th class="px-6 py-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @if (loading()) {
                <tr><td colspan="6" class="px-6 py-12 text-center text-slate-400 italic">Chargement du journal...</td></tr>
              } @else if (filteredLogs().length === 0) {
                <tr><td colspan="6" class="px-6 py-12 text-center text-slate-400 italic">Aucun évènement trouvé.</td></tr>
              } @else {
                @for (log of filteredLogs(); track log.id) {
                  <tr class="hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500">
                      {{ log.date | date:'dd/MM HH:mm:ss' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-700">
                      {{ log.acteur?.email }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-xs font-medium text-slate-600 px-2 py-1 bg-slate-100 rounded">
                        {{ log.action }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-xs text-primary font-bold">
                      {{ log.ecole?.nom || 'Global' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-[10px] text-slate-400 font-mono truncate max-w-[150px]" [title]="log.details">
                      {{ log.details }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-1.5 text-emerald-600">
                        <app-icon name="check-circle" [size]="14" />
                        <span class="text-[10px] font-black uppercase">Success</span>
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
            Page {{ currentPage() }} sur {{ meta()?.totalPages || 1 }}
            <span class="ml-2 text-slate-300">·</span>
            <span class="ml-2">{{ meta()?.total ?? 0 }} entrées</span>
          </p>
          <div class="flex items-center gap-2">
            <button (click)="prevPage()" [disabled]="currentPage() === 1"
              class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
              <app-icon name="chevron-left" [size]="16" />
            </button>
            <button (click)="nextPage()" [disabled]="currentPage() >= (meta()?.totalPages || 1)"
              class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
              <app-icon name="chevron-right" [size]="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuditLogsComponent implements OnInit {
  private svc = inject(SuperadminService);
  private toast = inject(ToastService);

  logs = signal<any[]>([]);
  meta = signal<{ total: number; page: number; limit: number; totalPages: number } | null>(null);
  loading = signal(true);
  searchQuery = signal('');
  currentPage = signal(1);
  readonly pageSize = 50;

  filteredLogs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.logs();
    return this.logs().filter(log =>
      log.action.toLowerCase().includes(query) ||
      log.acteur?.email?.toLowerCase().includes(query) ||
      log.ecole?.nom?.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.svc.getAuditLogs(this.currentPage(), this.pageSize).subscribe({
      next: (res) => {
        this.logs.set(res.data);
        this.meta.set(res.meta);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Impossible de charger les logs d\'audit.');
        this.loading.set(false);
      },
    });
  }

  nextPage(): void {
    const total = this.meta()?.totalPages ?? 1;
    if (this.currentPage() < total) {
      this.currentPage.update(p => p + 1);
      this.load();
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.load();
    }
  }
}
