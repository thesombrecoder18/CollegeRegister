import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../core/services/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div
      class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 min-w-[300px] max-w-[420px] rounded-2xl px-4 py-3.5 shadow-xl border text-sm font-medium animate-slide-in"
          [ngClass]="toastClasses(toast)"
          role="alert"
        >
          <!-- Icône -->
          <div class="shrink-0 mt-0.5" [ngClass]="iconClasses(toast)">
            <app-icon [name]="iconName(toast)" [size]="18" />
          </div>

          <!-- Message -->
          <p class="flex-1 leading-snug">{{ toast.message }}</p>

          <!-- Bouton fermer -->
          <button
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-1"
            [ngClass]="iconClasses(toast)"
            aria-label="Fermer"
          >
            <app-icon name="x" [size]="16" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from { opacity: 0; transform: translateX(100%); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .animate-slide-in {
      animation: slide-in 0.25s ease-out;
    }
  `],
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  toastClasses(toast: Toast): Record<string, boolean> {
    return {
      'bg-emerald-50 border-emerald-200 text-emerald-900': toast.type === 'success',
      'bg-red-50 border-red-200 text-red-900':             toast.type === 'error',
      'bg-amber-50 border-amber-200 text-amber-900':       toast.type === 'warning',
      'bg-blue-50 border-blue-200 text-blue-900':          toast.type === 'info',
    };
  }

  iconClasses(toast: Toast): Record<string, boolean> {
    return {
      'text-emerald-600': toast.type === 'success',
      'text-red-600':     toast.type === 'error',
      'text-amber-600':   toast.type === 'warning',
      'text-blue-600':    toast.type === 'info',
    };
  }

  iconName(toast: Toast): string {
    const map: Record<string, string> = {
      success: 'check-circle',
      error:   'alert-circle',
      warning: 'alert-circle',
      info:    'info',
    };
    return map[toast.type] ?? 'info';
  }
}
