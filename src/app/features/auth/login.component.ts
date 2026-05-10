import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
    RouterLink,
    TranslateModule,
    ButtonComponent,
    FormInputComponent,
    AuthContainerComponent
  ],
  template: `
    <app-auth-container
      [formTitle]="'AUTH.LOGIN_TITLE' | translate"
      [formSubtitle]="'AUTH.LOGIN_SUBTITLE' | translate"
      brandTitle="SmartBudget"
      [brandDescription]="'AUTH.BRAND_DESCRIPTION' | translate"
      [testimonialText]="'AUTH.TESTIMONIAL_TEXT' | translate"
      [testimonialAuthor]="'AUTH.TESTIMONIAL_AUTHOR' | translate"
      [testimonialRole]="'AUTH.TESTIMONIAL_ROLE' | translate"
      testimonialImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBGPcR_Ay2U7ylOXLjypHCHVsdR-Nj-nQ2pcSr9YYR7SHFBwl_of_rzMti7Ge85SNR3appdeR8_FoFrGdG5cWqkeVtEMlsKZEBAtFdF9jTzkPSB3xYygt-MAb-G2NlxobYK7WUxqMtKTnGKbdbEuApQJwLO2vx9Sy42UIW0RWPstrsqog4Yc13Zy4XsYvroiMgcQ3CUlIlEFZG9kyrHcJ86Bj9gf16POxg9dT2oVtV8Eed4SlXwQRLgHXAM6CiDpWOppR7asKA7dlfq"
    >
      <form (ngSubmit)="onSubmit()" class="auth-form">
        <app-form-input
          [label]="'AUTH.EMAIL_ACCESS' | translate"
          type="email"
          icon="mail"
          [placeholder]="'AUTH.EMAIL_PLACEHOLDER' | translate"
          [(value)]="email"
          (valueChange)="clearError()"
        ></app-form-input>

        <app-form-input
          [label]="'AUTH.PASSWORD' | translate"
          type="password"
          icon="key"
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
          type="submit"
        >
          <span class="material-symbols-outlined">login</span>
          {{ loading ? ('COMMON.LOADING' | translate) : ('AUTH.LOGIN' | translate) }}
        </app-button>
      </form>

      <div class="auth-footer">
        <p class="auth-link">
          {{ 'AUTH.NO_ACCOUNT' | translate }}
          <a routerLink="/auth/register" class="link-primary">{{ 'AUTH.CREATE_NOW' | translate }}</a>
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

    app-button .material-symbols-outlined {
      font-size: 18px;
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
      next: (response) => {
        console.log('[LoginComponent] Login successful, navigating to dashboard:', response);
        this.loading = false;
        this.router.navigate(['/dashboard']).then((success) => {
          console.log('[LoginComponent] Navigation result:', success);
        });
      },
      error: (err) => {
        console.error('[LoginComponent] Login error:', err);
        this.loading = false;
        this.error = 'Email ou palavra-passe inválidos';
      }
    });
  }

  clearError(): void {
    this.error = '';
  }
}

