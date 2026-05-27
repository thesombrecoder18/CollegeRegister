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
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Répartition des Classes</h2>
          <p class="text-slate-500 text-sm">Gestion des effectifs par niveau et répartition Round-Robin.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex bg-slate-100 p-1 rounded-xl">
            @for (n of niveaux; track n) {
              <button (click)="selectedNiveau.set(n)" 
                class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                [class]="selectedNiveau() === n ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'">
                {{ n }}
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Kanban View -->
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          @for (classeSuffix of ['A', 'B', 'C', 'D']; track classeSuffix) {
            @let classeFull = selectedNiveau() + ' ' + classeSuffix;
            @let count = (repartition()[selectedNiveau()] && repartition()[selectedNiveau()][classeFull]) || 0;
            
            <div class="flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-200/60 overflow-hidden">
              <!-- Column Header -->
              <div class="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    {{ classeSuffix }}
                  </span>
                  <h3 class="font-bold text-slate-900">Classe {{ classeSuffix }}</h3>
                </div>
                <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black">
                  {{ count }} ÉLÈVES
                </span>
              </div>

              <!-- Column Body (Simulated Pupils) -->
              <div class="p-3 space-y-3 flex-1 overflow-y-auto max-h-[400px]">
                @if (count === 0) {
                  <div class="flex flex-col items-center justify-center py-12 opacity-30 italic text-sm text-slate-400">
                    <app-icon name="user-plus" [size]="24" class="mb-2" />
                    Aucun élève
                  </div>
                } @else {
                  @for (i of [].constructor(count > 10 ? 10 : count); track $index) {
                    <div class="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 animate-slide-in">
                      <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        #{{ $index + 1 }}
                      </div>
                      <div class="flex-1">
                        <div class="h-2 w-20 bg-slate-100 rounded-full mb-1"></div>
                        <div class="h-1.5 w-12 bg-slate-50 rounded-full"></div>
                      </div>
                    </div>
                  }
                  @if (count > 10) {
                    <p class="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                      + {{ count - 10 }} autres élèves
                    </p>
                  }
                }
              </div>

              <!-- Column Footer -->
              <div class="p-3 bg-white/50 border-t border-slate-200">
                <button class="w-full py-2 text-[10px] font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-widest">
                  Voir la liste complète
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Action Bar -->
        <div class="bg-[#0f172a] rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-900/20">
          <div class="flex items-center gap-4 text-center md:text-left">
            <div class="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <app-icon name="sparkles" [size]="24" />
            </div>
            <div>
              <h3 class="font-bold text-lg">Répartition Intelligente</h3>
              <p class="text-slate-400 text-sm">Équilibre automatiquement les effectifs pour le niveau {{ selectedNiveau() }}.</p>
            </div>
          </div>
          <button (click)="repartir(selectedNiveau())" 
            [disabled]="repartirLoading() === selectedNiveau()"
            class="w-full md:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
            @if (repartirLoading() === selectedNiveau()) {
              <app-icon name="loader" [size]="20" class="animate-spin" /> Répartition...
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
