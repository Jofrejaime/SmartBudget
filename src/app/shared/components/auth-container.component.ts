import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="auth-main">
      <!-- Left Side: Visual Branding -->
      <section class="auth-left">
        <div class="brand-content">
          <div class="brand-header">
            <span class="material-symbols-outlined brand-icon">account_balance_wallet</span>
            <h2 class="brand-title">SmartBudget</h2>
          </div>
          <h1 class="brand-display">{{ brandTitle }}</h1>
          <p class="brand-description">{{ brandDescription }}</p>
        </div>

        <!-- Testimonial Card -->
        <div class="testimonial-card">
          <div class="testimonial-content">
            <p class="testimonial-text">{{ testimonialText }}</p>
            <div class="testimonial-author">
              <img [src]="testimonialImage" alt="User" class="testimonial-avatar" />
              <div>
                <p class="testimonial-name">{{ testimonialAuthor }}</p>
                <p class="testimonial-role">{{ testimonialRole }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Right Side: Form -->
      <section class="auth-right">
        <div class="auth-panel">
          <!-- Mobile Header -->
          <div class="mobile-header">
            <span class="material-symbols-outlined">account_balance_wallet</span>
            <span class="mobile-title">SmartBudget</span>
          </div>

          <div class="form-header">
            <h2 class="form-title">{{ formTitle }}</h2>
            <p class="form-subtitle">{{ formSubtitle }}</p>
          </div>

          <ng-content></ng-content>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      padding: 24px;
      background:
        radial-gradient(circle at top left, rgba(5, 150, 105, 0.08), transparent 36%),
        radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.08), transparent 30%),
        var(--sb-bg);
      box-sizing: border-box;
    }

    .auth-main {
      width: 100%;
      max-width: 1240px;
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.95fr);
      min-height: calc(100vh - 48px);
      margin: 0 auto;
      background: var(--sb-surface);
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
      border: 1px solid rgba(148, 163, 184, 0.18);
    }

    @media (max-width: 768px) {
      .auth-main {
        grid-template-columns: 1fr;
        min-height: auto;
        border-radius: 20px;
      }

      :host {
        padding: 16px;
      }
    }

    /* Left Side */
    .auth-left {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      padding: 56px;
      background:
        linear-gradient(135deg, rgba(5, 150, 105, 0.96) 0%, rgba(6, 95, 70, 0.95) 100%),
        radial-gradient(circle at top right, rgba(209, 250, 229, 0.16), transparent 34%);
      color: white;
      position: relative;
      overflow: hidden;
    }

    @media (min-width: 768px) {
      .auth-left {
        display: flex;
      }
    }

    .brand-content {
      z-index: 1;
    }

    .brand-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 48px;
    }

    .brand-icon {
      font-size: 32px;
    }

    .brand-title {
      font-family: var(--sb-font-display);
      font-size: 18px;
      font-weight: 600;
      color: white;
    }

    .brand-display {
      font-family: var(--sb-font-display);
      font-size: 36px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -1.5px;
      color: white;
      margin-bottom: 16px;
    }

    .brand-description {
      font-family: var(--sb-font-body);
      font-size: 15px;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.9);
      max-width: 400px;
    }

    /* Testimonial */
    .testimonial-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 16px;
      z-index: 1;
    }

    .testimonial-text {
      font-family: var(--sb-font-display);
      font-size: 15px;
      font-weight: 600;
      color: white;
      margin-bottom: 16px;
      line-height: 1.4;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .testimonial-avatar {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      object-fit: cover;
    }

    .testimonial-name {
      font-family: var(--sb-font-body);
      font-size: 13px;
      font-weight: 600;
      color: white;
      margin: 0;
    }

    .testimonial-role {
      font-family: var(--sb-font-body);
      font-size: 11px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
    }

    /* Right Side */
    .auth-right {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 32px;
      background: var(--sb-surface);
    }

    @media (min-width: 768px) {
      .auth-right {
        padding: 56px 48px;
      }
    }

    .auth-panel {
      width: 100%;
      max-width: 440px;
    }

    .mobile-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 32px;
    }

    @media (min-width: 768px) {
      .mobile-header {
        display: none;
      }
    }

    .mobile-header .material-symbols-outlined {
      font-size: 28px;
      color: var(--sb-primary);
    }

    .mobile-title {
      font-family: var(--sb-font-display);
      font-size: 18px;
      font-weight: 700;
      color: var(--sb-primary);
    }

    .form-header {
      margin-bottom: 32px;
    }

    .form-title {
      font-family: var(--sb-font-display);
      font-size: 24px;
      font-weight: 700;
      color: var(--sb-text);
      margin: 0 0 8px 0;
    }

    .form-subtitle {
      font-family: var(--sb-font-body);
      font-size: 15px;
      color: var(--sb-text2);
      margin: 0;
    }
  `]
})
export class AuthContainerComponent {
  @Input() formTitle = '';
  @Input() formSubtitle = '';
  @Input() brandTitle = '';
  @Input() brandDescription = '';
  @Input() testimonialText = '';
  @Input() testimonialAuthor = '';
  @Input() testimonialRole = '';
  @Input() testimonialImage = '';
}
