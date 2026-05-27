import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardStats, formatMontant } from '../../../core/models';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="animate-fade-in">
      <h2 class="mb-6 text-xl font-semibold text-slate-900">Tableau de bord</h2>
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      } @else if (stats()) {
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div class="card">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <app-icon name="clock" [size]="20" class="text-amber-600" />
              </div>
              <div>
                <p class="text-2xl font-bold">{{ stats()!.enAttente }}</p>
                <p class="text-xs text-slate-500">En attente</p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <app-icon name="check-circle" [size]="20" class="text-emerald-600" />
              </div>
              <div>
                <p class="text-2xl font-bold">{{ stats()!.valide }}</p>
                <p class="text-xs text-slate-500">Validées</p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <app-icon name="x-circle" [size]="20" class="text-red-600" />
              </div>
              <div>
                <p class="text-2xl font-bold">{{ stats()!.rejete }}</p>
                <p class="text-xs text-slate-500">Rejetées</p>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <app-icon name="banknote" [size]="20" class="text-blue-600" />
              </div>
              <div>
                <p class="text-lg font-bold">{{ formatMontant(stats()!.montantCollecte) }}</p>
                <p class="text-xs text-slate-500">Collecté</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  stats = signal<DashboardStats | null>(null);
  loading = signal(true);
  formatMontant = formatMontant;

  ngOnInit(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => { this.stats.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
