import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, ButtonComponent],
  template: `
    <div class="settings-wrapper">
      <!-- Header -->
      <div class="settings-header">
        <h1>Configurações</h1>
        <p class="subtitle">Personalize a sua experiência SmartBudget</p>
      </div>

      <!-- Settings Sections -->
      <div class="settings-grid">
        <!-- Appearance Settings -->
        <section class="settings-section">
          <div class="section-header">
            <span class="material-symbols-outlined">palette</span>
            <div>
              <h2>Aparência</h2>
              <p>Customize o tema e estilo</p>
            </div>
          </div>

          <div class="settings-item">
            <div class="item-content">
              <h3>Tema</h3>
              <p>Escolha entre tema claro e escuro</p>
            </div>
            <div class="toggle-group">
              <button 
                class="toggle-btn"
                [class.active]="(themeService.theme$ | async) === 'light'"
                (click)="setTheme('light')"
                title="Tema claro"
              >
                <span class="material-symbols-outlined">light_mode</span>
              </button>
              <button 
                class="toggle-btn"
                [class.active]="(themeService.theme$ | async) === 'dark'"
                (click)="setTheme('dark')"
                title="Tema escuro"
              >
                <span class="material-symbols-outlined">dark_mode</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Language Settings -->
        <section class="settings-section">
          <div class="section-header">
            <span class="material-symbols-outlined">language</span>
            <div>
              <h2>Idioma</h2>
              <p>Mude o idioma da aplicação</p>
            </div>
          </div>

          <div class="settings-item">
            <div class="item-content">
              <h3>Idioma Preferido</h3>
              <p>Português ou English</p>
            </div>
            <div class="toggle-group">
              <button 
                class="toggle-btn"
                [class.active]="(languageService.language$ | async) === 'pt'"
                (click)="setLanguage('pt')"
                title="Português"
              >
                <span>PT</span>
              </button>
              <button 
                class="toggle-btn"
                [class.active]="(languageService.language$ | async) === 'en'"
                (click)="setLanguage('en')"
                title="English"
              >
                <span>EN</span>
              </button>
            </div>
          </div>
        </section>

        <!-- Account Settings -->
        <section class="settings-section">
          <div class="section-header">
            <span class="material-symbols-outlined">person</span>
            <div>
              <h2>Conta</h2>
              <p>Gerencie os dados da sua conta</p>
            </div>
          </div>

          <div class="settings-item">
            <div class="item-content">
              <h3>Informações Pessoais</h3>
              <p class="user-info" *ngIf="(currentUser$ | async) as user">
                <strong>{{ user.name }}</strong><br>
                {{ user.email }}
              </p>
            </div>
            <button class="btn-secondary">
              <span class="material-symbols-outlined">edit</span>
              Editar
            </button>
          </div>
        </section>
      </div>

      <!-- Footer Info -->
      <div class="settings-footer">
        <p>SmartBudget v1.0.0</p>
        <p>© 2026 SmartBudget. Todos os direitos reservados.</p>
      </div>
    </div>
  `,
  styles: [`
    .settings-wrapper {
      max-width: 900px;
      margin: 0 auto;
    }

    /* ============ HEADER ============ */
    .settings-header {
      margin-bottom: var(--sb-spacing-3xl);
    }

    .settings-header h1 {
      margin: 0 0 var(--sb-spacing-xs);
      font-size: 28px;
      font-weight: 700;
    }

    .subtitle {
      margin: 0;
      color: var(--sb-text2);
      font-size: 14px;
    }

    /* ============ GRID ============ */
    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--sb-spacing-2xl);
      margin-bottom: var(--sb-spacing-3xl);
    }

    /* ============ SECTION ============ */
    .settings-section {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-lg);
      padding: var(--sb-spacing-xl);
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-lg);
    }

    .section-header {
      display: flex;
      gap: var(--sb-spacing-lg);
      padding-bottom: var(--sb-spacing-lg);
      border-bottom: 1px solid var(--sb-border);
    }

    .section-header .material-symbols-outlined {
      font-size: 28px;
      color: var(--sb-primary);
      flex-shrink: 0;
    }

    .section-header h2 {
      margin: 0 0 var(--sb-spacing-xs);
      font-size: 16px;
      font-weight: 600;
    }

    .section-header p {
      margin: 0;
      font-size: 12px;
      color: var(--sb-text2);
    }

    /* ============ ITEMS ============ */
    .settings-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--sb-spacing-lg);
      padding: var(--sb-spacing-lg) 0;
      border-bottom: 1px solid var(--sb-border);
    }

    .settings-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .item-content {
      flex: 1;
    }

    .item-content h3 {
      margin: 0 0 var(--sb-spacing-xs);
      font-size: 14px;
      font-weight: 600;
    }

    .item-content p {
      margin: 0;
      font-size: 12px;
      color: var(--sb-text2);
    }

    .user-info {
      margin: var(--sb-spacing-sm) 0 0;
      font-size: 13px;
      color: var(--sb-text1);
    }

    /* ============ TOGGLES ============ */
    .toggle-group {
      display: flex;
      gap: var(--sb-spacing-sm);
      align-items: center;
    }

    .toggle-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-md);
      background: var(--sb-bg);
      color: var(--sb-text2);
      cursor: pointer;
      transition: all 0.15s;
      font-weight: 500;
    }

    .toggle-btn:hover {
      border-color: var(--sb-primary);
      background: var(--sb-primary-light);
      color: var(--sb-primary);
    }

    .toggle-btn.active {
      background: var(--sb-primary);
      color: white;
      border-color: var(--sb-primary);
    }

    .toggle-btn .material-symbols-outlined {
      font-size: 20px;
    }

    /* ============ BUTTONS ============ */
    .btn-secondary {
      display: flex;
      align-items: center;
      gap: var(--sb-spacing-md);
      padding: var(--sb-spacing-md) var(--sb-spacing-lg);
      background: var(--sb-primary-light);
      color: var(--sb-primary);
      border: none;
      border-radius: var(--sb-radius-md);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .btn-secondary:hover {
      background: var(--sb-primary);
      color: white;
    }

    .btn-secondary .material-symbols-outlined {
      font-size: 18px;
    }

    /* ============ FOOTER ============ */
    .settings-footer {
      text-align: center;
      padding: var(--sb-spacing-2xl);
      border-top: 1px solid var(--sb-border);
      color: var(--sb-text2);
      font-size: 12px;
    }

    .settings-footer p {
      margin: var(--sb-spacing-xs) 0;
    }

    /* ============ RESPONSIVE ============ */
    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        gap: var(--sb-spacing-md);
      }

      .settings-item {
        flex-direction: column;
        gap: var(--sb-spacing-md);
        align-items: flex-start;
      }
    }

    .setting-label p {
      font-size: 12px;
      color: var(--sb-text3);
    }

    .toggle-btn {
      padding: 8px 16px;
      border-radius: var(--sb-radius-md);
      background: var(--sb-primary);
      color: #fff;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.15s;
    }

    .toggle-btn:hover {
      background: var(--sb-primary-dark);
    }
  `]
})
export class SettingsComponent {
  public themeService: ThemeService;
  public languageService: LanguageService;
  currentUser$;

  constructor(
    themeService: ThemeService,
    languageService: LanguageService,
    private authService: AuthService
  ) {
    this.themeService = themeService;
    this.languageService = languageService;
    this.currentUser$ = authService.currentUser$;
  }

  setTheme(theme: string): void {
    this.themeService.setTheme(theme as 'light' | 'dark');
  }

  setLanguage(lang: string): void {
    this.languageService.setLanguage(lang as 'pt' | 'en');
  }
}
