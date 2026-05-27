import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideLoader,
  LucideLogIn,
  LucideCheck,
  LucideSchool,
  LucideDownload,
  LucideAlertCircle,
  LucidePhone,
  LucideArrowRight,
  LucideArrowLeft,
  LucideImagePlus,
  LucideCheckCircle,
  LucideRefreshCw,
  LucideShieldCheck,
  LucideKey,
  LucideLock,
  LucideSearch,
  LucideInfo,
  LucidePalette,
  LucideUser,
  LucideGraduationCap,
  LucideUserPlus,
} from '@lucide/angular';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [
    CommonModule,
    LucideLoader,
    LucideLogIn,
    LucideCheck,
    LucideSchool,
    LucideDownload,
    LucideAlertCircle,
    LucidePhone,
    LucideArrowRight,
    LucideArrowLeft,
    LucideImagePlus,
    LucideCheckCircle,
    LucideRefreshCw,
    LucideShieldCheck,
    LucideKey,
    LucideLock,
    LucideSearch,
    LucideInfo,
    LucidePalette,
    LucideUser,
    LucideGraduationCap,
    LucideUserPlus,
  ],
  template: `
    <span [class]="className()">
      <svg *ngIf="name() === 'loader'" lucideLoader [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'log-in'" lucideLogIn [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'check'" lucideCheck [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'school'" lucideSchool [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'download'" lucideDownload [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'alert-circle'" lucideAlertCircle [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'phone'" lucidePhone [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'arrow-right'" lucideArrowRight [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'arrow-left'" lucideArrowLeft [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'image-plus'" lucideImagePlus [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'check-circle'" lucideCheckCircle [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'refresh-cw'" lucideRefreshCw [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'shield-check'" lucideShieldCheck [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'key'" lucideKey [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'lock'" lucideLock [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'search'" lucideSearch [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'info'" lucideInfo [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'palette'" lucidePalette [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'user'" lucideUser [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'graduation-cap'" lucideGraduationCap [attr.width]="size()" [attr.height]="size()" />
      <svg *ngIf="name() === 'user-plus'" lucideUserPlus [attr.width]="size()" [attr.height]="size()" />
    </span>
  `,
})
export class IconComponent {
  name = input.required<string>();
  size = input<number | string>(20);
  className = input<string>('', { alias: 'class' });
}
