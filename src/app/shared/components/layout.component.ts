import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, TranslateModule],
  template: `
    <div class="app-layout" [attr.data-theme]="theme$ | async">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <span class="logo-icon">💚</span>
            <span class="logo-text">SmartBudget</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a 
            routerLink="/dashboard" 
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>

          <a 
            routerLink="/transactions" 
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="material-symbols-outlined">swap_horiz</span>
            <span>Transações</span>
          </a>

          <a 
            routerLink="/settings" 
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="material-symbols-outlined">settings</span>
            <span>Configurações</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button class="nav-item logout-btn" (click)="onLogout()">
            <span class="material-symbols-outlined">logout</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Header -->
        <header class="header">
          <div class="header-left">
            <h1 class="page-title">{{ pageTitle }}</h1>
          </div>

          <div class="header-right">
            <!-- Theme Toggle -->
            <button 
              class="icon-btn"
              (click)="toggleTheme()"
              [title]="'Alternar tema'"
            >
              <span class="material-symbols-outlined">
                {{ (theme$ | async) === 'dark' ? 'light_mode' : 'dark_mode' }}
              </span>
            </button>

            <!-- Language Toggle -->
            <button 
              class="icon-btn"
              (click)="toggleLanguage()"
              [title]="'Alternar idioma'"
            >
              <span class="material-symbols-outlined">language</span>
            </button>

            <!-- User Menu -->
            <div class="user-menu">
              <button class="user-btn" (click)="toggleUserMenu()">
                <span class="avatar">{{ (currentUser$ | async)?.name | slice:0:2 | uppercase }}</span>
                <span class="material-symbols-outlined">expand_more</span>
              </button>

              <div class="user-dropdown" *ngIf="showUserMenu">
                <div class="user-info">
                  <p class="user-name">{{ (currentUser$ | async)?.name }}</p>
                  <p class="user-email">{{ (currentUser$ | async)?.email }}</p>
                </div>
                <hr />
                <a routerLink="/settings" class="dropdown-item">
                  <span class="material-symbols-outlined">person</span>
                  Perfil
                </a>
                <button class="dropdown-item logout" (click)="onLogout()">
                  <span class="material-symbols-outlined">logout</span>
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      height: 100vh;
      background-color: var(--sb-bg);
      color: var(--sb-text1);
    }

    /* ============ SIDEBAR ============ */
    .sidebar {
      width: 260px;
      background-color: var(--sb-surface);
      border-right: 1px solid var(--sb-border);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
    }

    .sidebar-header {
      padding: var(--sb-spacing-xl);
      border-bottom: 1px solid var(--sb-border);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--sb-spacing-md);
      font-family: var(--sb-font-display);
      font-size: 18px;
      font-weight: 700;
      color: var(--sb-primary);
      text-decoration: none;
    }

    .logo-icon {
      font-size: 24px;
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--sb-spacing-lg) 0;
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-xs);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--sb-spacing-md);
      padding: var(--sb-spacing-md) var(--sb-spacing-lg);
      color: var(--sb-text2);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      background: none;
      transition: all 0.15s;
      border-left: 3px solid transparent;
    }

    .nav-item:hover {
      background-color: var(--sb-primary-light);
      color: var(--sb-primary-dark);
    }

    .nav-item.active {
      background-color: var(--sb-primary-light);
      color: var(--sb-primary);
      border-left-color: var(--sb-primary);
    }

    .nav-item .material-symbols-outlined {
      font-size: 20px;
    }

    .sidebar-footer {
      padding: var(--sb-spacing-lg) 0;
      border-top: 1px solid var(--sb-border);
    }

    .logout-btn {
      color: var(--sb-danger);
    }

    .logout-btn:hover {
      background-color: #fee2e2;
      color: var(--sb-danger);
    }

    /* ============ MAIN CONTENT ============ */
    .main-content {
      margin-left: 260px;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    /* ============ HEADER ============ */
    .header {
      height: 70px;
      background-color: var(--sb-surface);
      border-bottom: 1px solid var(--sb-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 var(--sb-spacing-3xl);
      gap: var(--sb-spacing-2xl);
    }

    .header-left {
      flex: 1;
      min-width: 0;
    }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
      color: var(--sb-text1);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--sb-spacing-lg);
    }

    .icon-btn {
      background: none;
      border: none;
      color: var(--sb-text2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--sb-radius-md);
      transition: all 0.15s;
      font-size: 0;
    }

    .icon-btn:hover {
      background-color: var(--sb-primary-light);
      color: var(--sb-primary);
    }

    .icon-btn .material-symbols-outlined {
      font-size: 20px;
    }

    /* ============ USER MENU ============ */
    .user-menu {
      position: relative;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: var(--sb-spacing-sm);
      background: var(--sb-primary-light);
      border: none;
      border-radius: var(--sb-radius-md);
      padding: var(--sb-spacing-sm) var(--sb-spacing-md);
      cursor: pointer;
      color: var(--sb-primary);
      font-weight: 600;
      transition: all 0.15s;
    }

    .user-btn:hover {
      background-color: var(--sb-primary);
      color: white;
    }

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--sb-radius-md);
      background-color: var(--sb-primary);
      color: white;
      font-weight: 700;
      font-size: 12px;
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-lg);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      min-width: 200px;
      margin-top: var(--sb-spacing-sm);
      z-index: 1000;
    }

    .user-info {
      padding: var(--sb-spacing-lg);
      border-bottom: 1px solid var(--sb-border);
    }

    .user-name {
      margin: 0;
      font-weight: 600;
      font-size: 14px;
      color: var(--sb-text1);
    }

    .user-email {
      margin: var(--sb-spacing-xs) 0 0;
      font-size: 12px;
      color: var(--sb-text2);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--sb-spacing-md);
      width: 100%;
      padding: var(--sb-spacing-md) var(--sb-spacing-lg);
      background: none;
      border: none;
      color: var(--sb-text2);
      cursor: pointer;
      font-size: 14px;
      transition: all 0.15s;
      text-decoration: none;
    }

    .dropdown-item:hover {
      background-color: var(--sb-primary-light);
      color: var(--sb-primary);
    }

    .dropdown-item.logout {
      color: var(--sb-danger);
    }

    .dropdown-item.logout:hover {
      background-color: #fee2e2;
    }

    .dropdown-item .material-symbols-outlined {
      font-size: 18px;
    }

    /* ============ PAGE CONTENT ============ */
    .page-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--sb-spacing-2xl) var(--sb-spacing-3xl);
    }

    /* ============ MOBILE RESPONSIVE ============ */
    @media (max-width: 768px) {
      .sidebar {
        width: 0;
        z-index: 999;
        transform: translateX(-100%);
        transition: transform 0.3s;
      }

      .main-content {
        margin-left: 0;
      }

      .header {
        padding: 0 var(--sb-spacing-lg);
      }

      .page-content {
        padding: var(--sb-spacing-lg);
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  showUserMenu = false;
  pageTitle = 'Dashboard';
  theme$: Observable<string>;
  currentUser$: Observable<any>;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.theme$ = this.themeService.theme$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Update page title on navigation
    this.router.events.subscribe(() => {
      const segments = this.router.url.split('/');
      const lastSegment = segments[segments.length - 1] || 'dashboard';
      
      const titles: { [key: string]: string } = {
        'dashboard': 'Dashboard',
        'transactions': 'Transações',
        'create': 'Nova Transação',
        'edit': 'Editar Transação',
        'settings': 'Configurações'
      };
      
      this.pageTitle = titles[lastSegment] || 'SmartBudget';
    });
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
