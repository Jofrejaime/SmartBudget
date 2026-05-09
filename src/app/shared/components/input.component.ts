import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-wrap">
      <label class="input-label" *ngIf="label">{{ label }}</label>
      <input 
        class="sb-input"
        [type]="type"
        [placeholder]="placeholder"
        [(ngModel)]="value"
        [disabled]="disabled"
      >
      <div class="input-error" *ngIf="error">{{ error }}</div>
    </div>
  `,
  styles: [`
    .input-wrap {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .input-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--sb-text2);
    }

    .sb-input {
      height: 42px;
      padding: 0 14px;
      border-radius: var(--sb-radius-md);
      border: 1.5px solid var(--sb-border2);
      background: var(--sb-surface);
      color: var(--sb-text);
      font-family: var(--sb-font-body);
      font-size: 14px;
      outline: none;
      transition: border 0.15s, box-shadow 0.15s;
    }

    .sb-input:focus {
      border-color: var(--sb-primary);
      box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12);
    }

    .sb-input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .input-error {
      font-size: 11px;
      color: var(--sb-danger);
    }
  `]
})
export class InputComponent {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() error = '';
  @Input() disabled = false;
}
