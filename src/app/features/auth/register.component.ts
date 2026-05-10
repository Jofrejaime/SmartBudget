import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button.component';
import { FormInputComponent } from '../../shared/components/form-input.component';
import { CheckboxComponent } from '../../shared/components/checkbox.component';
import { AuthContainerComponent } from '../../shared/components/auth-container.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
    ButtonComponent,
    FormInputComponent,
    CheckboxComponent,
    AuthContainerComponent
  ],
  template: `
    <app-auth-container
      [formTitle]="'AUTH.REGISTER_TITLE' | translate"
      [formSubtitle]="'AUTH.REGISTER_SUBTITLE' | translate"
      brandTitle="SmartBudget"
      [brandDescription]="'AUTH.BRAND_DESCRIPTION_REGISTER' | translate"
      [testimonialText]="'AUTH.TESTIMONIAL_TEXT_REGISTER' | translate"
      [testimonialAuthor]="'AUTH.TESTIMONIAL_AUTHOR' | translate"
      [testimonialRole]="'AUTH.TESTIMONIAL_ROLE' | translate"
      testimonialImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBGPcR_Ay2U7ylOXLjypHCHVsdR-Nj-nQ2pcSr9YYR7SHFBwl_of_rzMti7Ge85SNR3appdeR8_FoFrGdG5cWqkeVtEMlsKZEBAtFdF9jTzkPSB3xYygt-MAb-G2NlxobYK7WUxqMtKTnGKbdbEuApQJwLO2vx9Sy42UIW0RWPstrsqog4Yc13Zy4XsYvroiMgcQ3CUlIlEFZG9kyrHcJ86Bj9gf16POxg9dT2oVtV8Eed4SlXwQRLgHXAM6CiDpWOppR7asKA7dlfq"
    >
      <form (ngSubmit)="onSubmit()" class="auth-form">
        <app-form-input
          [label]="'AUTH.FULL_NAME' | translate"
          type="text"
          icon="person"
          [placeholder]="'AUTH.FULL_NAME_PLACEHOLDER' | translate"
          [(value)]="name"
          (valueChange)="clearError()"
        ></app-form-input>

        <app-form-input
          [label]="'AUTH.EMAIL' | translate"
          type="email"
          icon="mail"
          [placeholder]="'AUTH.EMAIL_PLACEHOLDER_REGISTER' | translate"
          [(value)]="email"
          (valueChange)="clearError()"
        ></app-form-input>

        <app-form-input
          [label]="'AUTH.PASSWORD' | translate"
          type="password"
          icon="lock"
          [showPasswordToggle]="true"
          [placeholder]="'AUTH.PASSWORD_MIN' | translate"
          [(value)]="password"
          (valueChange)="clearError()"
        ></app-form-input>

        <app-form-input
          [label]="'AUTH.PASSWORD_CONFIRM' | translate"
          type="password"
          icon="lock"
          [showPasswordToggle]="true"
          [(value)]="passwordConfirm"
          (valueChange)="clearError()"
        ></app-form-input>

        <app-checkbox id="terms">
          {{ 'AUTH.TERMS_PREFIX' | translate }}
          <a href="#" class="link-primary">{{ 'AUTH.TERMS' | translate }}</a> {{ 'AUTH.TERMS_MIDDLE' | translate }}
          <a href="#" class="link-primary">{{ 'AUTH.PRIVACY_POLICY' | translate }}</a>
        </app-checkbox>

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
          {{ loading ? ('COMMON.LOADING' | translate) : ('AUTH.CREATE_ACCOUNT' | translate) }}
        </app-button>
      </form>

      <div class="auth-footer">
        <p class="auth-link">
          {{ 'AUTH.HAVE_ACCOUNT' | translate }}
          <a routerLink="/auth/login" class="link-primary">{{ 'AUTH.LOGIN_NOW' | translate }}</a>
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
      margin: 0 2px;
    }

    .link-primary:hover {
      color: var(--sb-primary-dark);
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  passwordConfirm = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  onSubmit(): void {
    if (!this.name || !this.email || !this.password || !this.passwordConfirm) {
      this.error = 'Por favor, preencha todos os campos';
      return;
    }

    if (this.password !== this.passwordConfirm) {
      this.error = 'As palavras-passe não correspondem';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'A palavra-passe deve ter pelo menos 6 caracteres';
      return;
    }

    this.error = '';
    this.loading = true;

    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erro ao registar. Tente novamente.';
      }
    });
  }

  clearError(): void {
    this.error = '';
  }
}
