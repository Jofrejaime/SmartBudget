import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkbox-wrapper">
      <input
        type="checkbox"
        [id]="id"
        [(ngModel)]="checked"
        (ngModelChange)="onCheckedChange($event)"
        class="checkbox-input"
      />
      <label [for]="id" class="checkbox-label">
        <ng-content></ng-content>
      </label>
    </div>
  `,
  styles: [`
    .checkbox-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
    }

    .checkbox-input {
      width: 20px;
      height: 20px;
      border-radius: var(--sb-radius-sm);
      border: 1.5px solid var(--sb-border2);
      background: var(--sb-surface);
      cursor: pointer;
      accent-color: var(--sb-primary);
      margin-top: 2px;
      flex-shrink: 0;
      transition: border 0.15s;
    }

    .checkbox-input:hover {
      border-color: var(--sb-primary-mid);
    }

    .checkbox-input:focus {
      outline: 2px solid var(--sb-primary);
      outline-offset: 2px;
    }

    .checkbox-input:checked {
      background: var(--sb-primary);
      border-color: var(--sb-primary);
    }

    .checkbox-label {
      font-family: var(--sb-font-body);
      font-size: 13px;
      color: var(--sb-text2);
      line-height: 1.4;
      cursor: pointer;
    }

    a {
      color: var(--sb-primary);
      font-weight: 600;
      text-decoration: none;
      transition: color 0.15s;
    }

    a:hover {
      color: var(--sb-primary-dark);
      text-decoration: underline;
    }
  `]
})
export class CheckboxComponent {
  @Input() id = 'checkbox-' + Math.random().toString(36).substr(2, 9);
  @Input() checked = false;
  @Output() checkedChange = new EventEmitter<boolean>();

  onCheckedChange(value: boolean): void {
    this.checked = value;
    this.checkedChange.emit(value);
  }
}
