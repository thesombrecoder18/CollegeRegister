import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  // ── Chargement / état ──────────────────────────────────────────────────────
  LucideLoader,
  LucideRefreshCw,
  // ── Auth ──────────────────────────────────────────────────────────────────
  LucideLogIn,
  LucideLogOut,
  // ── Validation / statut ───────────────────────────────────────────────────
  LucideCheck,
  LucideCheckCircle,
  LucideXCircle,
  LucideX,
  LucideAlertCircle,
  LucideInfo,
  // ── Navigation ────────────────────────────────────────────────────────────
  LucideArrowRight,
  LucideArrowLeft,
  LucideChevronLeft,
  LucideChevronRight,
  // ── Médias / fichiers ─────────────────────────────────────────────────────
  LucideDownload,
  LucideImagePlus,
  LucideSave,
  // ── Sécurité ──────────────────────────────────────────────────────────────
  LucideShieldCheck,
  LucideShield,
  LucideKey,
  LucideLock,
  // ── Recherche / UI ────────────────────────────────────────────────────────
  LucideSearch,
  LucideEye,
  LucideBell,
  LucideGrid,
  LucideSettings,
  LucideHelpCircle,
  // ── Utilisateurs / personnes ──────────────────────────────────────────────
  LucideUser,
  LucideUsers,
  LucideUserPlus,
  LucideGraduationCap,
  // ── Établissements / SaaS ─────────────────────────────────────────────────
  LucideSchool,
  LucideBuilding2,
  LucideDatabase,
  // ── Finances ──────────────────────────────────────────────────────────────
  LucideBanknote,
  // ── Actions ───────────────────────────────────────────────────────────────
  LucidePlus,
  LucidePauseCircle,
  LucidePlayCircle,
  LucideShuffle,
  // ── Layout ────────────────────────────────────────────────────────────────
  LucideLayoutDashboard,
  LucideClipboardList,
  // ── Divers ────────────────────────────────────────────────────────────────
  LucidePalette,
  LucidePhone,
  LucideClock,
  LucideSparkles,
  // ── Ajouts refonte (corrige des icônes vides) ─────────────────────────────
  LucideCalendar,
  LucideFileText,
  LucideChevronDown,
  LucideMenu,
  LucideArrowUpRight,
  LucideHeart,
  LucideMapPin,
  LucideMail,
  LucideWallet,
  LucideTrendingUp,
  LucideCircleHelp,
} from '@lucide/angular';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [
    CommonModule,
    // Chargement / état
    LucideLoader,
    LucideRefreshCw,
    // Auth
    LucideLogIn,
    LucideLogOut,
    // Validation / statut
    LucideCheck,
    LucideCheckCircle,
    LucideXCircle,
    LucideX,
    LucideAlertCircle,
    LucideInfo,
    // Navigation
    LucideArrowRight,
    LucideArrowLeft,
    LucideChevronLeft,
    LucideChevronRight,
    // Médias / fichiers
    LucideDownload,
    LucideImagePlus,
    LucideSave,
    // Sécurité
    LucideShieldCheck,
    LucideShield,
    LucideKey,
    LucideLock,
    // Recherche / UI
    LucideSearch,
    LucideEye,
    LucideBell,
    LucideGrid,
    LucideSettings,
    LucideHelpCircle,
    // Utilisateurs / personnes
    LucideUser,
    LucideUsers,
    LucideUserPlus,
    LucideGraduationCap,
    // Établissements / SaaS
    LucideSchool,
    LucideBuilding2,
    LucideDatabase,
    // Finances
    LucideBanknote,
    // Actions
    LucidePlus,
    LucidePauseCircle,
    LucidePlayCircle,
    LucideShuffle,
    // Layout
    LucideLayoutDashboard,
    LucideClipboardList,
    // Divers
    LucidePalette,
    LucidePhone,
    LucideClock,
    LucideSparkles,
    // Ajouts refonte
    LucideCalendar,
    LucideFileText,
    LucideChevronDown,
    LucideMenu,
    LucideArrowUpRight,
    LucideHeart,
    LucideMapPin,
    LucideMail,
    LucideWallet,
    LucideTrendingUp,
    LucideCircleHelp,
  ],
  template: `
    <span [class]="className()">
      <!-- Chargement / état -->
      <svg *ngIf="name() === 'loader'"      lucideLoader      [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'refresh-cw'"  lucideRefreshCw   [attr.width]="size()" [attr.height]="size()" />

      <!-- Auth -->
      <svg *ngIf="name() === 'log-in'"      lucideLogIn       [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'log-out'"     lucideLogOut      [attr.width]="size()" [attr.height]="size()" />

      <!-- Validation / statut -->
      <svg *ngIf="name() === 'check'"         lucideCheck         [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'check-circle'"  lucideCheckCircle   [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'x-circle'"      lucideXCircle       [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'x'"             lucideX             [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'alert-circle'"  lucideAlertCircle   [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'info'"          lucideInfo          [attr.width]="size()" [attr.height]="size()" />

      <!-- Navigation -->
      <svg *ngIf="name() === 'arrow-right'"    lucideArrowRight    [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'arrow-left'"     lucideArrowLeft     [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'chevron-left'"   lucideChevronLeft   [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'chevron-right'"  lucideChevronRight  [attr.width]="size()" [attr.height]="size()" />

      <!-- Médias / fichiers -->
      <svg *ngIf="name() === 'download'"    lucideDownload    [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'image-plus'"  lucideImagePlus   [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'save'"        lucideSave        [attr.width]="size()" [attr.height]="size()" />

      <!-- Sécurité -->
      <svg *ngIf="name() === 'shield-check'"  lucideShieldCheck  [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'shield'"        lucideShield       [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'key'"           lucideKey          [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'lock'"          lucideLock         [attr.width]="size()" [attr.height]="size()" />

      <!-- Recherche / UI -->
      <svg *ngIf="name() === 'search'"        lucideSearch        [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'eye'"           lucideEye           [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'bell'"          lucideBell          [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'grid'"          lucideGrid          [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'settings'"      lucideSettings      [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'help-circle'"   lucideHelpCircle    [attr.width]="size()" [attr.height]="size()" />

      <!-- Utilisateurs / personnes -->
      <svg *ngIf="name() === 'user'"            lucideUser            [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'users'"           lucideUsers           [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'user-plus'"       lucideUserPlus        [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'graduation-cap'"  lucideGraduationCap   [attr.width]="size()" [attr.height]="size()" />

      <!-- Établissements / SaaS -->
      <svg *ngIf="name() === 'school'"      lucideSchool      [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'building-2'"  lucideBuilding2   [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'database'"    lucideDatabase    [attr.width]="size()" [attr.height]="size()" />

      <!-- Finances -->
      <svg *ngIf="name() === 'banknote'"  lucideBanknote  [attr.width]="size()" [attr.height]="size()" />

      <!-- Actions -->
      <svg *ngIf="name() === 'plus'"          lucidePlus          [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'pause-circle'"  lucidePauseCircle   [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'play-circle'"   lucidePlayCircle    [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'shuffle'"       lucideShuffle       [attr.width]="size()" [attr.height]="size()" />

      <!-- Layout -->
      <svg *ngIf="name() === 'layout-dashboard'"  lucideLayoutDashboard  [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'clipboard-list'"    lucideClipboardList    [attr.width]="size()" [attr.height]="size()" />

      <!-- Divers -->
      <svg *ngIf="name() === 'palette'"    lucidePalette    [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'phone'"      lucidePhone      [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'clock'"      lucideClock      [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'sparkles'"   lucideSparkles   [attr.width]="size()" [attr.height]="size()" />

      <!-- Ajouts refonte -->
      <svg *ngIf="name() === 'calendar'"        lucideCalendar       [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'file-text'"       lucideFileText       [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'chevron-down'"    lucideChevronDown    [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'menu'"            lucideMenu           [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'arrow-up-right'"  lucideArrowUpRight   [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'heart'"           lucideHeart          [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'map-pin'"         lucideMapPin         [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'mail'"            lucideMail           [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'wallet'"          lucideWallet         [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'trending-up'"     lucideTrendingUp     [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'circle-help'"     lucideCircleHelp     [attr.width]="size()" [attr.height]="size()" />
    </span>
  `,
})
export class IconComponent {
  name = input.required<string>();
  size = input<number | string>(20);
  className = input<string>('', { alias: 'class' });
}
