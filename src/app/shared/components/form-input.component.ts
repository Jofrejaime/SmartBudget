import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-group">
      <label *ngIf="label" class="form-label">{{ label }}</label>
      <div class="input-wrapper">
        <span *ngIf="icon" class="input-icon">
          <span class="material-symbols-outlined">{{ icon }}</span>
        </span>
        <input
          [type]="type"
          [placeholder]="placeholder"
          [(ngModel)]="value"
          [disabled]="disabled"
          [class.input-error]="error"
          (ngModelChange)="onValueChange($event)"
          class="form-input"
        />
        <button
          *ngIf="showPasswordToggle && type === 'password'"
          type="button"
          (click)="togglePassword()"
          class="password-toggle"
        >
          <span class="material-symbols-outlined">
            {{ passwordVisible ? 'visibility' : 'visibility_off' }}
          </span>
        </button>
      </div>
      <div *ngIf="error" class="form-error">{{ error }}</div>
      <div *ngIf="hint && !error" class="form-hint">{{ hint }}</div>
    </div>
  `,
  styles: [`
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    .form-label {
      font-family: var(--sb-font-body);
      font-size: 12px;
      font-weight: 500;
      color: var(--sb-text2);
      display: block;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 12px;
      display: flex;
      align-items: center;
      color: var(--sb-text2);
      pointer-events: none;
    }

    .input-icon .material-symbols-outlined {
      font-size: 20px;
    }

    .form-input {
      width: 100%;
      height: 48px;
      padding: 0 16px;
      padding-left: 44px;
      background: var(--sb-surface);
      border: 1.5px solid var(--sb-border2);
      border-radius: var(--sb-radius-md);
      color: var(--sb-text);
      font-family: var(--sb-font-body);
      font-size: 15px;
      outline: none;
      transition: border 0.15s, box-shadow 0.15s;
    }

    .form-input::placeholder {
      color: var(--sb-text3);
    }

    .form-input:focus {
      border-color: var(--sb-primary);
      box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12);
    }

    .form-input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .form-input.input-error {
      border-color: var(--sb-danger);
    }

    .form-input.input-error:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      background: none;
      border: none;
      color: var(--sb-text2);
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 8px;
      transition: color 0.15s;
    }

    .password-toggle:hover {
      color: var(--sb-primary);
    }

    .password-toggle .material-symbols-outlined {
      font-size: 20px;
    }

    .form-error {
      font-size: 12px;
      color: var(--sb-danger);
      font-weight: 500;
    }

    .form-hint {
      font-size: 11px;
      color: var(--sb-text3);
    }
  `]
})
export class FormInputComponent {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() error = '';
  @Input() hint = '';
  @Input() icon = '';
  @Input() disabled = false;
  @Input() showPasswordToggle = false;
  @Output() valueChange = new EventEmitter<string>();

  passwordVisible = false;

  onValueChange(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
    this.type = this.passwordVisible ? 'text' : 'password';
  }
}
