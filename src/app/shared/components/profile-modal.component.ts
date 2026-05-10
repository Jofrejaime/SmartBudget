import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],

  template: `
    <div
      class="modal-backdrop"
      (click)="close.emit()"
    >

      <div
        class="modal"
        (click)="$event.stopPropagation()"
      >

        <div class="modal-header">

          <h2>
            {{ 'PROFILE.EDIT_PROFILE' | translate }}
          </h2>

          <button
            class="close-btn"
            (click)="close.emit()"
            [title]="'COMMON.CANCEL' | translate"
          >
            ✕
          </button>

        </div>

        <form (ngSubmit)="save()">

          <div class="form-group">

            <label>
              {{ 'PROFILE.NAME' | translate }}
            </label>

            <input
              type="text"
              [(ngModel)]="name"
              name="name"
            >

          </div>

          <div class="form-group">

            <label>
              {{ 'PROFILE.EMAIL' | translate }}
            </label>

            <input
              type="email"
              [(ngModel)]="email"
              name="email"
            >

          </div>

          <div class="actions">

            <button
              type="button"
              class="cancel-btn"
              (click)="close.emit()"
            >
              {{ 'COMMON.CANCEL' | translate }}
            </button>

            <button
              type="submit"
              class="save-btn"
              [disabled]="loading"
            >

              {{
                loading
                  ? ('PROFILE.SAVING' | translate)
                  : ('COMMON.SAVE' | translate)
              }}

            </button>

          </div>

        </form>

      </div>

    </div>
  `,

  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;

      background: rgba(0,0,0,0.45);

      display: flex;
      align-items: center;
      justify-content: center;

      z-index: 9999;
    }

    .modal {
      width: 100%;
      max-width: 450px;

      background: var(--sb-surface);

      border-radius: 16px;

      padding: 24px;
    }

    .modal-header {
      display: flex;

      justify-content: space-between;
      align-items: center;

      margin-bottom: 24px;
    }

    .close-btn {
      border: none;
      background: transparent;

      cursor: pointer;

      font-size: 18px;
    }

    .form-group {
      display: flex;
      flex-direction: column;

      gap: 8px;

      margin-bottom: 18px;
    }

    input {
      height: 42px;

      border:
        1px solid var(--sb-border);

      border-radius: 10px;

      padding: 0 14px;

      background: var(--sb-bg);

      color: var(--sb-text1);
    }

    .actions {
      display: flex;

      justify-content: flex-end;

      gap: 12px;

      margin-top: 24px;
    }

    .cancel-btn,
    .save-btn {
      height: 40px;

      padding: 0 18px;

      border: none;

      border-radius: 10px;

      cursor: pointer;

      font-weight: 600;
    }

    .cancel-btn {
      background: var(--sb-border);
    }

    .save-btn {
      background: var(--sb-primary);

      color: white;
    }
  `]
})

export class ProfileModalComponent {

  @Output()
  close = new EventEmitter<void>();

  name = '';
  email = '';

  loading = false;

  constructor(
    private authService: AuthService
  ) {

    const user =
      this.authService.getCurrentUser();

    if (user) {

      this.name = user.name;
      this.email = user.email;
    }
  }

  save(): void {

    this.loading = true;

    this.authService.updateProfile({

      name: this.name,
      email: this.email

    }).subscribe({

      next: () => {

        this.loading = false;

        this.close.emit();
      },

      error: (err) => {

        console.error(err);

        this.loading = false;
      }
    });
  }
}