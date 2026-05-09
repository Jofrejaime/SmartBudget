import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button.component';
import { FormInputComponent } from '../../shared/components/form-input.component';
import { AuthContainerComponent } from '../../shared/components/auth-container.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    ButtonComponent,
    FormInputComponent,
    AuthContainerComponent
  ],
  template: `
    <app-auth-container
      formTitle="Entrar em SmartBudget"
      formSubtitle="Gerencie suas finanças com confiança"
      brandTitle="SmartBudget"
      brandDescription="Controle as suas finanças com precisão enterprise"
      testimonialText="Indispensável para o meu dia-a-dia"
      testimonialAuthor="Ricardo Silva"
      testimonialRole="CFO @ AngoTech"
      testimonialImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBGPcR_Ay2U7ylOXLjypHCHVsdR-Nj-nQ2pcSr9YYR7SHFBwl_of_rzMti7Ge85SNR3appdeR8_FoFrGdG5cWqkeVtEMlsKZEBAtFdF9jTzkPSB3xYygt-MAb-G2NlxobYK7WUxqMtKTnGKbdbEuApQJwLO2vx9Sy42UIW0RWPstrsqog4Yc13Zy4XsYvroiMgcQ3CUlIlEFZG9kyrHcJ86Bj9gf16POxg9dT2oVtV8Eed4SlXwQRLgHXAM6CiDpWOppR7asKA7dlfq"
    >
      <form (ngSubmit)="onSubmit()" class="auth-form">
        <app-form-input
          label="Email"
          type="email"
          icon="mail"
          placeholder="seu@email.com"
          [(value)]="email"
          (valueChange)="clearError()"
        ></app-form-input>

        <app-form-input
          label="Palavra-passe"
          type="password"
          icon="lock"
          [showPasswordToggle]="true"
          [(value)]="password"
          (valueChange)="clearError()"
        ></app-form-input>

        <div class="auth-error" *ngIf="error">
          <span class="material-symbols-outlined">error</span>
          {{ error }}
        </div>

        <app-button
          variant="primary"
          size="md"
          [disabled]="loading"
          (click)="onSubmit()"
        >
          {{ loading ? ('COMMON.LOADING' | translate) : 'Entrar' }}
        </app-button>
      </form>

      <div class="auth-footer">
        <p class="auth-link">
          Não tem conta?
          <a routerLink="/auth/register" class="link-primary">Crie agora</a>
        </p>
      </div>
    </app-auth-container>
  `,
  styles: [`
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
    }

    .auth-error {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: var(--sb-danger-light);
      color: var(--sb-danger);
      border-radius: var(--sb-radius-md);
      font-size: 13px;
      font-weight: 500;
    }

    .auth-error .material-symbols-outlined {
      font-size: 18px;
      flex-shrink: 0;
    }

    .auth-footer {
      padding-top: 24px;
      border-top: 1px solid var(--sb-border);
      text-align: center;
    }

    .auth-link {
      font-family: var(--sb-font-body);
      font-size: 13px;
      color: var(--sb-text2);
      margin: 0;
    }

    .link-primary {
      color: var(--sb-primary);
      font-weight: 600;
      text-decoration: none;
      transition: color 0.15s;
      margin-left: 4px;
    }

    .link-primary:hover {
      color: var(--sb-primary-dark);
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Por favor, preencha todos os campos';
      return;
    }

    this.error = '';
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Email ou palavra-passe inválidos';
      }
    });
  }

  clearError(): void {
    this.error = '';
  }
}

