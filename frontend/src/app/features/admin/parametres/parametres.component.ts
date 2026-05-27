import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <div class="animate-fade-in">
      <h2 class="mb-6 text-xl font-semibold text-slate-900">Paramètres</h2>
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      } @else {
        <div class="card max-w-lg">
          <h3 class="mb-4 font-medium">Montants d'inscription (FCFA)</h3>
          <div class="space-y-4">
            <div><label class="mb-1 block text-sm font-medium">6ème</label><input class="input-field" type="number" [(ngModel)]="montantSixieme" /></div>
            <div><label class="mb-1 block text-sm font-medium">5ème</label><input class="input-field" type="number" [(ngModel)]="montantCinquieme" /></div>
            <div><label class="mb-1 block text-sm font-medium">4ème</label><input class="input-field" type="number" [(ngModel)]="montantQuatrieme" /></div>
            <div><label class="mb-1 block text-sm font-medium">3ème</label><input class="input-field" type="number" [(ngModel)]="montantTroisieme" /></div>
          </div>
          @if (message()) {
            <p class="mt-4 text-sm" [class]="success() ? 'text-emerald-600' : 'text-red-600'">{{ message() }}</p>
          }
          <button class="btn-primary mt-6" (click)="save()" [disabled]="saving()">
            @if (saving()) { <app-icon name="loader" [size]="16" class="animate-spin" /> }
            @else { <app-icon name="save" [size]="16" /> }
            Enregistrer
          </button>
        </div>
      }
    </div>
  `,
})
export class ParametresComponent implements OnInit {
  private adminService = inject(AdminService);
  loading = signal(true);
  saving = signal(false);
  message = signal<string | null>(null);
  success = signal(false);
  montantSixieme = 25000;
  montantCinquieme = 25000;
  montantQuatrieme = 25000;
  montantTroisieme = 30000;

  ngOnInit(): void {
    this.adminService.getConfiguration().subscribe({
      next: (config) => {
        this.montantSixieme = config.montantSixieme;
        this.montantCinquieme = config.montantCinquieme;
        this.montantQuatrieme = config.montantQuatrieme;
        this.montantTroisieme = config.montantTroisieme;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  save(): void {
    this.saving.set(true);
    this.message.set(null);
    this.adminService.updateConfiguration({
      montantSixieme: this.montantSixieme,
      montantCinquieme: this.montantCinquieme,
      montantQuatrieme: this.montantQuatrieme,
      montantTroisieme: this.montantTroisieme,
    }).subscribe({
      next: () => { this.saving.set(false); this.success.set(true); this.message.set('Configuration enregistrée.'); },
      error: () => { this.saving.set(false); this.success.set(false); this.message.set("Erreur lors de l'enregistrement."); },
    });
  }
}
