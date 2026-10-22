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
      <div class="mb-7">
        <h2 class="font-display text-2xl font-bold text-ink">Paramètres</h2>
        <p class="mt-1 text-sm text-ink-soft">Définissez les frais d'inscription par niveau.</p>
      </div>
      @if (loading()) {
        <div class="card h-80 max-w-lg animate-pulse"><div class="h-full w-full rounded-lg bg-sand/60"></div></div>
      } @else {
        <div class="card max-w-lg">
          <div class="mb-5 flex items-center gap-2.5 text-primary">
            <app-icon name="wallet" [size]="20" />
            <h3 class="font-semibold text-ink">Montants d'inscription (FCFA)</h3>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div><label class="field-label">6ème</label><input class="input-field" type="number" [(ngModel)]="montantSixieme" /></div>
            <div><label class="field-label">5ème</label><input class="input-field" type="number" [(ngModel)]="montantCinquieme" /></div>
            <div><label class="field-label">4ème</label><input class="input-field" type="number" [(ngModel)]="montantQuatrieme" /></div>
            <div><label class="field-label">3ème</label><input class="input-field" type="number" [(ngModel)]="montantTroisieme" /></div>
          </div>
          @if (message()) {
            <p class="mt-4 flex items-center gap-1.5 text-sm font-medium" [class]="success() ? 'text-leaf' : 'text-terracotta'">
              <app-icon [name]="success() ? 'check-circle' : 'alert-circle'" [size]="15" /> {{ message() }}
            </p>
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
