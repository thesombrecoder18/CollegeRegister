import { Component, OnInit, signal, inject } from '@angular/core';

@Component({
  selector: 'app-superadmin-audit',
  standalone: true,
  imports: [],
  template: `
    <div class="animate-fade-in">
      <h2 class="text-xl font-semibold mb-4">Journal d'audit</h2>
      <div class="card">
        <p class="text-sm text-slate-500">La fonctionnalité d'audit sera connectée à l'API. Ici un aperçu fictif.</p>
        <div class="mt-4 space-y-2">
          <div class="flex items-center justify-between">
            <div class="text-sm">2026-05-01 10:12</div>
            <div class="text-sm">admin&#64;demo — Création d'école "Lycée Demo"</div>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-sm">2026-05-02 09:03</div>
            <div class="text-sm">superadmin&#64;demo — Suspension ecole "EcoleTest"</div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SuperadminAuditComponent implements OnInit {
  logs = signal<any[]>([]);

  ngOnInit(): void {
    // TODO: récupérer depuis l'API when available
    this.logs.set([
      { at: '2026-05-01 10:12', by: 'admin@demo', action: 'Création d\'école "Lycée Demo"' },
      { at: '2026-05-02 09:03', by: 'superadmin@demo', action: 'Suspension ecole "EcoleTest"' },
    ]);
  }
}
