import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent],
  template: `
    <div class="flex flex-col items-center">
      <section class="w-full max-w-3xl px-4 py-6 text-center">
        <div class="w-20 h-20 mb-4 rounded-full bg-surface-container-high flex items-center justify-center shadow-sm">
          <app-icon name="graduation-cap" [size]="28" />
        </div>
        <h1 class="text-2xl font-semibold text-slate-800 mb-2">Inscriptions Scolaires 2026-2027</h1>
        <p class="text-base text-slate-600 mb-6">Bienvenue sur le portail d'inscription. Sélectionnez une action pour commencer ou suivre votre dossier.</p>
      </section>

      <section class="w-full max-w-md px-4 grid gap-4">
        <a routerLink="inscription" class="block bg-primary text-white rounded-xl p-5 shadow-sm hover:bg-primary/90 transition-colors">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-md bg-white/10">
              <app-icon name="user-plus" [size]="20" />
            </div>
            <div>
              <h2 class="font-semibold">Nouvelle Inscription</h2>
              <p class="text-sm text-primary/90">Commencer un nouveau dossier d'inscription pour l'année 2026-2027.</p>
            </div>
          </div>
        </a>

        <a routerLink="suivi" class="block bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:bg-surface-container-low transition-colors text-slate-800">
          <div class="flex items-start gap-4">
            <div class="p-3 rounded-md bg-surface-container-high">
              <app-icon name="search" [size]="20" />
            </div>
            <div>
              <h2 class="font-semibold">Suivre mon dossier / Renvoyer une preuve</h2>
              <p class="text-sm text-slate-600">Consulter l'état de votre demande, ajouter des documents manquants ou mettre à jour vos informations.</p>
            </div>
          </div>
        </a>
      </section>

      <section class="w-full max-w-3xl px-4 mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-surface-container rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <app-icon name="calendar" [size]="16" />
            <h3 class="font-medium">Dates clés</h3>
          </div>
          <ul class="text-sm text-slate-600 space-y-2">
            <li class="flex justify-between border-b border-slate-100 pb-1"> <span>Ouverture</span> <span class="font-medium">15 Janvier</span> </li>
            <li class="flex justify-between border-b border-slate-100 pb-1"> <span>Clôture Phase 1</span> <span class="font-medium">30 Mars</span> </li>
            <li class="flex justify-between"> <span>Résultats</span> <span class="font-medium">15 Mai</span> </li>
          </ul>
        </div>

        <div class="bg-surface-container rounded-xl p-4 md:col-span-2">
          <h3 class="font-semibold mb-2">Documents requis</h3>
          <p class="text-sm text-slate-600">Préparez une copie numérique de l'acte de naissance, les bulletins scolaires de l'année précédente, et un justificatif de domicile récent.</p>
        </div>
      </section>

      <footer class="w-full max-w-3xl px-4 mt-8 py-4 text-sm text-slate-500 flex justify-between">
        <div>© 2026 {{ theme.ecole()?.nom || 'AcademicPortal' }}. Tous droits réservés.</div>
        <div class="space-x-4">
          <a class="hover:text-primary" href="#">Politique</a>
          <a class="hover:text-primary" href="#">Support</a>
        </div>
      </footer>
    </div>
  `,
})
export class AccueilComponent {
  theme = inject(ThemeService);
}
