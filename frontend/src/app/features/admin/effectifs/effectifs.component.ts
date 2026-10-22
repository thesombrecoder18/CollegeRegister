import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InscriptionService } from '../../../core/services/inscription.service';
import { NIVEAUX } from '../../../core/models';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-effectifs',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="animate-fade-in space-y-8">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 class="font-display text-2xl font-bold text-ink">Répartition des classes</h2>
          <p class="text-sm text-ink-soft">Gestion des effectifs par niveau et équilibrage automatique.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex rounded-full bg-sand p-1">
            @for (n of niveaux; track n) {
              <button (click)="selectedNiveau.set(n)"
                class="rounded-full px-4 py-2 text-sm font-semibold transition-all"
                [class]="selectedNiveau() === n ? 'bg-white text-primary shadow-card' : 'text-ink-soft hover:text-ink'">
                {{ n }}
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Kanban View -->
      @if (loading()) {
        <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
          @for (i of [1,2,3,4]; track i) {
            <div class="h-72 animate-pulse rounded-2xl border border-line bg-sand/50"></div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
          @for (classeSuffix of ['A', 'B', 'C', 'D']; track classeSuffix) {
            @let classeFull = selectedNiveau() + ' ' + classeSuffix;
            @let count = (repartition()[selectedNiveau()] && repartition()[selectedNiveau()][classeFull]) || 0;

            <div class="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-sand/40">
              <!-- Column Header -->
              <div class="flex items-center justify-between border-b border-line bg-white p-4">
                <div class="flex items-center gap-2">
                  <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                    {{ classeSuffix }}
                  </span>
                  <h3 class="font-semibold text-ink">Classe {{ classeSuffix }}</h3>
                </div>
                <span class="rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold text-ink-soft">
                  {{ count }} ÉL.
                </span>
              </div>

              <!-- Column Body -->
              <div class="max-h-[400px] flex-1 space-y-2.5 overflow-y-auto p-3">
                @if (count === 0) {
                  <div class="flex flex-col items-center justify-center py-12 text-sm italic text-ink-soft/50">
                    <app-icon name="user-plus" [size]="24" class="mb-2" />
                    Aucun élève
                  </div>
                } @else {
                  @for (i of [].constructor(count > 10 ? 10 : count); track $index) {
                    <div class="flex animate-slide-in items-center gap-3 rounded-xl border border-line bg-white p-3 shadow-card">
                      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-sand text-[10px] font-bold text-ink-soft">
                        #{{ $index + 1 }}
                      </div>
                      <div class="flex-1">
                        <div class="mb-1 h-2 w-20 rounded-full bg-sand"></div>
                        <div class="h-1.5 w-12 rounded-full bg-sand/60"></div>
                      </div>
                    </div>
                  }
                  @if (count > 10) {
                    <p class="pt-2 text-center text-[10px] font-bold uppercase tracking-wide text-ink-soft">
                      + {{ count - 10 }} autres élèves
                    </p>
                  }
                }
              </div>
            </div>
          }
        </div>

        <!-- Action Bar -->
        <div class="flex flex-col items-center justify-between gap-6 rounded-3xl bg-ink p-6 text-white shadow-lift md:flex-row">
          <div class="flex items-center gap-4 text-center md:text-left">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-ink">
              <app-icon name="sparkles" [size]="24" />
            </div>
            <div>
              <h3 class="font-display text-lg font-semibold">Répartition intelligente</h3>
              <p class="text-sm text-white/70">Équilibre automatiquement les effectifs pour le niveau {{ selectedNiveau() }}.</p>
            </div>
          </div>
          <button (click)="repartir(selectedNiveau())"
            [disabled]="repartirLoading() === selectedNiveau()"
            class="btn-accent w-full px-8 md:w-auto">
            @if (repartirLoading() === selectedNiveau()) {
              <app-icon name="loader" [size]="20" class="animate-spin" /> Répartition…
            } @else {
              <app-icon name="shuffle" [size]="20" /> Lancer la répartition
            }
          </button>
        </div>
      }
    </div>
  `,
})
export class EffectifsComponent implements OnInit {
  private inscriptionService = inject(InscriptionService);
  repartition = signal<Record<string, Record<string, number>>>({});
  loading = signal(true);
  repartirLoading = signal<string | null>(null);
  selectedNiveau = signal('6ème');
  readonly niveaux = NIVEAUX;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.inscriptionService.getRepartition().subscribe({
      next: (data) => { this.repartition.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  repartir(niveau: string): void {
    this.repartirLoading.set(niveau);
    this.inscriptionService.repartir(niveau).subscribe({
      next: () => {
        this.repartirLoading.set(null);
        this.load();
      },
      error: () => this.repartirLoading.set(null),
    });
  }
}
