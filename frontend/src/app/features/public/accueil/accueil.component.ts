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
    <div class="animate-fade-in space-y-14 sm:space-y-20">
      <!-- ───────── HERO ───────── -->
      <section class="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div class="order-2 lg:order-1">
          <span class="inline-flex items-center gap-2 rounded-full bg-leaf/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-leaf">
            <app-icon name="sparkles" [size]="14" /> Rentrée 2026 · 2027
          </span>
          <h1 class="mt-5 font-display text-4xl font-extrabold leading-[1.08] text-ink text-balance sm:text-5xl lg:text-[3.4rem]">
            Inscrivez votre enfant en quelques minutes.
          </h1>
          <p class="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Un parcours simple et sécurisé pour déposer le dossier, payer en ligne et suivre la validation, sans vous déplacer.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a routerLink="inscription" class="btn-primary px-8 text-base">
              Commencer l'inscription <app-icon name="arrow-right" [size]="18" />
            </a>
            <a routerLink="suivi" class="btn-secondary px-8 text-base">
              <app-icon name="search" [size]="18" /> Suivre mon dossier
            </a>
          </div>
        </div>

        <!-- Panneau de marque illustré (couleur de l'école + texture wax) -->
        <div class="order-1 lg:order-2">
          <div class="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl bg-primary shadow-lift lg:max-w-none">
            <div class="absolute inset-0 bg-gradient-to-br from-white/15 to-black/10"></div>
            <div class="absolute inset-0 bg-teranga-pattern opacity-60"></div>
            <!-- blobs décoratifs -->
            <div class="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
            <div class="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-black/10 blur-2xl"></div>
            <!-- contenu : monogramme / logo de l'école -->
            <div class="relative flex h-full flex-col items-center justify-center gap-5 p-8 text-center text-white">
              @if (theme.ecole()?.logoUrl) {
                <img [src]="theme.ecole()!.logoUrl!" alt="Logo" class="h-24 w-24 rounded-3xl object-cover shadow-lift ring-4 ring-white/30" />
              } @else {
                <div class="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 font-display text-5xl font-bold ring-4 ring-white/25 backdrop-blur-sm">
                  {{ (theme.ecole()?.nom)?.[0] || 'E' }}
                </div>
              }
              <div>
                <p class="font-display text-2xl font-bold">{{ theme.ecole()?.nom }}</p>
                <p class="mt-1 text-sm text-white/80">Portail officiel d'inscription</p>
              </div>
            </div>
            <!-- carte flottante "validation" -->
            <div class="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl bg-white/95 p-3 shadow-lift backdrop-blur sm:left-auto sm:right-6 sm:w-56">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf/12 text-leaf">
                <app-icon name="shield-check" [size]="20" />
              </div>
              <div class="leading-tight">
                <p class="text-sm font-semibold text-ink">Paiement sécurisé</p>
                <p class="text-xs text-ink-soft">Wave & Orange Money</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ───────── BANDEAU RÉASSURANCE ───────── -->
      <section class="grid gap-4 sm:grid-cols-3">
        @for (r of reassurances; track r.label) {
          <div class="flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4 shadow-card">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sand text-ink">
              <app-icon [name]="r.icon" [size]="20" />
            </div>
            <div class="leading-tight">
              <p class="font-semibold text-ink">{{ r.label }}</p>
              <p class="text-sm text-ink-soft">{{ r.sub }}</p>
            </div>
          </div>
        }
      </section>

      <!-- ───────── COMMENT ÇA MARCHE ───────── -->
      <section>
        <h2 class="text-2xl font-bold text-ink sm:text-3xl">Comment ça marche</h2>
        <p class="mt-2 max-w-2xl text-ink-soft">Trois étapes, et le dossier est entre les mains de l'établissement.</p>
        <div class="mt-8 grid gap-5 md:grid-cols-3">
          @for (s of steps; track s.n) {
            <div class="relative rounded-2xl border border-line bg-white p-6 shadow-card">
              <span class="font-display text-5xl font-bold text-sand">0{{ s.n }}</span>
              <div class="-mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <app-icon [name]="s.icon" [size]="22" />
              </div>
              <h3 class="mt-4 text-lg font-semibold text-ink">{{ s.title }}</h3>
              <p class="mt-1.5 text-sm leading-relaxed text-ink-soft">{{ s.desc }}</p>
            </div>
          }
        </div>
      </section>

      <!-- ───────── INFOS PRATIQUES (bento) ───────── -->
      <section class="grid gap-5 md:grid-cols-3">
        <div class="card md:row-span-1">
          <div class="mb-4 flex items-center gap-2.5 text-primary">
            <app-icon name="calendar" [size]="20" />
            <h3 class="text-base font-semibold text-ink">Dates clés</h3>
          </div>
          <ul class="space-y-3 text-sm">
            @for (d of dates; track d.label) {
              <li class="flex items-center justify-between border-b border-line/70 pb-2.5 last:border-0 last:pb-0">
                <span class="text-ink-soft">{{ d.label }}</span>
                <span class="font-semibold text-ink">{{ d.value }}</span>
              </li>
            }
          </ul>
        </div>

        <div class="card relative overflow-hidden md:col-span-2">
          <div class="absolute -right-6 -top-6 opacity-[0.06]">
            <app-icon name="file-text" [size]="140" />
          </div>
          <div class="relative">
            <div class="mb-4 flex items-center gap-2.5 text-primary">
              <app-icon name="file-text" [size]="20" />
              <h3 class="text-base font-semibold text-ink">Documents à préparer</h3>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              @for (doc of documents; track doc) {
                <div class="flex items-start gap-2.5 text-sm text-ink-soft">
                  <app-icon name="check-circle" [size]="18" class="mt-0.5 shrink-0 text-leaf" />
                  <span>{{ doc }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- ───────── BANDEAU AIDE ───────── -->
      <section class="flex flex-col items-center justify-between gap-4 rounded-3xl bg-ink p-7 text-center sm:flex-row sm:p-8 sm:text-left">
        <div class="flex items-center gap-4">
          <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-gold">
            <app-icon name="phone" [size]="22" />
          </div>
          <div>
            <h3 class="font-display text-lg font-semibold text-white">Une question sur l'inscription ?</h3>
            <p class="text-sm text-white/70">Notre équipe administrative vous répond du lundi au vendredi.</p>
          </div>
        </div>
        <a href="tel:+221338000000" class="btn-accent shrink-0 px-7">
          <app-icon name="phone" [size]="18" /> +221 33 800 00 00
        </a>
      </section>
    </div>
  `,
})
export class AccueilComponent {
  theme = inject(ThemeService);

  readonly reassurances = [
    { icon: 'clock', label: 'Moins de 5 minutes', sub: 'Un formulaire court et guidé' },
    { icon: 'wallet', label: 'Wave & Orange Money', sub: 'Paiement mobile sécurisé' },
    { icon: 'phone', label: '100% sur mobile', sub: 'Depuis votre téléphone' },
  ];

  readonly steps = [
    { n: 1, icon: 'user', title: "Infos de l'élève", desc: "Renseignez le nom, le niveau et le téléphone du tuteur." },
    { n: 2, icon: 'wallet', title: 'Paiement mobile', desc: 'Réglez les frais via Wave ou Orange Money en toute sécurité.' },
    { n: 3, icon: 'shield-check', title: 'Preuve & validation', desc: "Téléversez le reçu : l'établissement valide votre dossier." },
  ];

  readonly dates = [
    { label: 'Ouverture', value: '15 Janvier' },
    { label: 'Clôture phase 1', value: '30 Mars' },
    { label: 'Résultats', value: '15 Mai' },
  ];

  readonly documents = [
    "Acte de naissance de l'élève",
    "Bulletins de l'année précédente",
    'Justificatif de domicile récent',
    "Photo d'identité (facultatif)",
  ];
}
