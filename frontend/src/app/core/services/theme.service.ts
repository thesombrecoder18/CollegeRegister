import { Injectable, signal, computed } from '@angular/core';
import { EcolePublic } from '../models';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private ecoleSignal = signal<EcolePublic | null>(null);
  readonly ecole = this.ecoleSignal.asReadonly();
  readonly isLoaded = computed(() => !!this.ecoleSignal());

  setEcole(ecole: EcolePublic): void {
    this.ecoleSignal.set(ecole);
    document.documentElement.style.setProperty('--color-primary', ecole.couleurPrimaire);
    document.documentElement.style.setProperty('--color-secondary', ecole.couleurSecondaire);
  }

  clear(): void {
    this.ecoleSignal.set(null);
    document.documentElement.style.setProperty('--color-primary', '#1e293b');
    document.documentElement.style.setProperty('--color-secondary', '#059669');
  }
}
