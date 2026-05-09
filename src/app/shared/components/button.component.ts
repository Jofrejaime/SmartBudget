import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [ngClass]="['btn', 'btn-' + size, 'btn-' + variant]"
      [disabled]="disabled"
      [type]="type"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      font-family: var(--sb-font-body);
      font-weight: 500;
      border-radius: var(--sb-radius-md);
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      white-space: nowrap;
      transition: all 0.15s;
    }

    .btn-sm {
      font-size: 13px;
      height: 34px;
      padding: 0 14px;
      border-radius: var(--sb-radius-sm);
    }

    .btn-md {
      font-size: 14px;
      height: 40px;
      padding: 0 20px;
    }

    .btn-lg {
      font-size: 15px;
      height: 48px;
      padding: 0 28px;
    }

    .btn-primary {
      background: var(--sb-primary);
      color: #fff;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--sb-primary-dark);
    }

    .btn-outline {
      background: transparent;
      color: var(--sb-text2);
      border: 1px solid var(--sb-border2);
    }

    .btn-outline:hover:not(:disabled) {
      background: var(--sb-surface2);
    }

    .btn-ghost {
      background: transparent;
      color: var(--sb-primary);
      border: 1px solid var(--sb-primary-light);
    }

    .btn-ghost:hover:not(:disabled) {
      background: var(--sb-primary-light);
    }

    .btn-danger {
      background: var(--sb-danger-light);
      color: var(--sb-danger);
    }

    .btn-danger:hover:not(:disabled) {
      background: var(--sb-danger);
      color: #fff;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: Variant = 'primary';
  @Input() size: Size = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}
