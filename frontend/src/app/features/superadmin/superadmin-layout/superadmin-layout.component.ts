import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-superadmin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <div class="flex min-h-screen bg-slate-50 font-sans">
      <!-- Sidebar -->
      <aside class="w-[260px] flex-shrink-0 bg-[#0f172a] text-white flex flex-col">
        <!-- Brand -->
        <div class="p-6">
          <h1 class="text-xl font-bold tracking-tight text-white">EduAdmin Pro</h1>
          <p class="text-[10px] font-semibold tracking-[0.15em] text-slate-400 mt-1 uppercase">Superadmin Console</p>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 space-y-2 px-4 mt-2">
          <a routerLink="/superadmin/dashboard" routerLinkActive="bg-[#1e293b] border-l-2 border-emerald-500 text-white" #rlaDashboard="routerLinkActive"
             class="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-slate-400 hover:bg-[#1e293b] hover:text-white transition-colors border-l-2 border-transparent">
            <div class="p-1 rounded bg-[#0f172a] shadow-sm border border-slate-700/50" [class.text-emerald-400]="rlaDashboard.isActive">
              <app-icon name="building-2" [size]="18" />
            </div>
            Établissements
          </a>
          
          <a routerLink="/superadmin/provisionnement" routerLinkActive="bg-[#1e293b] border-l-2 border-emerald-500 text-white" #rlaProv="routerLinkActive"
             class="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-slate-400 hover:bg-[#1e293b] hover:text-white transition-colors border-l-2 border-transparent">
            <div class="p-1 rounded bg-[#0f172a] shadow-sm border border-slate-700/50" [class.text-emerald-400]="rlaProv.isActive">
              <app-icon name="database" [size]="18" />
            </div>
            Provisionnement
          </a>
          
          <div class="px-3 py-2 mt-4">
             <div class="h-px bg-slate-800 border-dashed border-t border-slate-700"></div>
          </div>

          <a routerLink="/superadmin/audit" routerLinkActive="bg-[#1e293b] border-l-2 border-emerald-500 text-white" #rlaAudit="routerLinkActive"
             class="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-slate-400 hover:bg-[#1e293b] hover:text-white transition-colors border-l-2 border-transparent">
            <div class="p-1 rounded bg-[#0f172a] shadow-sm border border-slate-700/50" [class.text-emerald-400]="rlaAudit.isActive">
              <app-icon name="shield" [size]="18" />
            </div>
            Audit & Sécurité
          </a>
        </nav>

        <!-- Bottom Actions -->
        <div class="p-4 space-y-1 mb-2 border-t border-slate-800">
          <button class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-[#1e293b] hover:text-white transition-colors">
            <div class="p-1 rounded bg-[#0f172a] shadow-sm border border-slate-700/50">
              <app-icon name="settings" [size]="18" />
            </div>
            Paramètres
          </button>
          <button class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-[#1e293b] hover:text-white transition-colors">
            <div class="p-1 rounded bg-[#0f172a] shadow-sm border border-slate-700/50">
              <app-icon name="help-circle" [size]="18" />
            </div>
            Aide
          </button>
          <button class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 mt-2 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors" (click)="auth.logout()">
            <div class="p-1 rounded bg-red-950/30 shadow-sm border border-red-900/30 text-red-500">
              <app-icon name="log-out" [size]="18" />
            </div>
            Déconnexion
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Navbar -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div class="flex items-center gap-3">
            <span class="text-xl font-bold text-slate-900">EduAdmin</span>
            <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-900 bg-emerald-100 rounded uppercase">Superadmin Plateforme</span>
          </div>
          
          <div class="flex items-center gap-6">
            <div class="relative">
              <app-icon name="search" [size]="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Rechercher..." class="pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-64 transition-all">
            </div>
            
            <div class="flex items-center gap-4 text-slate-500">
              <button class="hover:text-slate-700 transition-colors">
                <app-icon name="bell" [size]="20" />
              </button>
              <button class="hover:text-slate-700 transition-colors">
                <app-icon name="grid" [size]="20" />
              </button>
              <div class="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden cursor-pointer">
                 <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="User Avatar" class="w-full h-full object-cover">
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-auto p-8">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class SuperadminLayoutComponent {
  auth = inject(AuthService);
}
