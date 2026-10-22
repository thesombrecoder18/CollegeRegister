import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { DashboardStats, formatMontant } from '../../../core/models';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="animate-fade-in">
      <div class="mb-7">
        <h2 class="font-display text-2xl font-bold text-ink">Tableau de bord</h2>
        <p class="mt-1 text-sm text-ink-soft">Vue d'ensemble des inscriptions de votre établissement.</p>
      </div>
      @if (loading()) {
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          @for (i of [1,2,3,4]; track i) {
            <div class="card h-[88px] animate-pulse"><div class="h-full w-full rounded-lg bg-sand/60"></div></div>
          }
        </div>
      } @else if (stats()) {
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          @for (c of cards(); track c.label) {
            <div class="card transition-shadow hover:shadow-soft">
              <div class="flex items-center gap-3.5">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" [class]="c.bg">
                  <app-icon [name]="c.icon" [size]="22" [class]="c.fg" />
                </div>
                <div class="min-w-0">
                  <p class="font-display text-2xl font-bold text-ink" [class.!text-lg]="c.money">{{ c.value }}</p>
                  <p class="text-xs font-medium text-ink-soft">{{ c.label }}</p>
                </div>
              </div>
            </div>
          }
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

  cards = computed(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { label: 'En attente', value: String(s.enAttente), icon: 'clock', bg: 'bg-gold/15', fg: 'text-[#9a6a14]', money: false },
      { label: 'Validées', value: String(s.valide), icon: 'check-circle', bg: 'bg-leaf/12', fg: 'text-leaf', money: false },
      { label: 'Rejetées', value: String(s.rejete), icon: 'x-circle', bg: 'bg-terracotta/12', fg: 'text-terracotta', money: false },
      { label: 'Collecté', value: formatMontant(s.montantCollecte), icon: 'wallet', bg: 'bg-primary/10', fg: 'text-primary', money: true },
    ];
  });

  ngOnInit(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => { this.stats.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
