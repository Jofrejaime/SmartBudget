import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../shared/components/button.component';
import { FormInputComponent } from '../../shared/components/form-input.component';
import { TransactionService, Transaction } from '../../core/services/transaction.service';
import { CategoryService } from '../../core/services/category.service';
import { ValidationService } from '../../core/services/validation.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ButtonComponent, FormInputComponent],
  template: `
    <div class="form-wrapper">
      <div class="form-header">
        <h1>{{ isEditMode ? 'Editar Transação' : 'Nova Transação' }}</h1>
        <p class="subtitle">{{ isEditMode ? 'Atualize os detalhes da transação' : 'Registre uma nova entrada ou saída' }}</p>
      </div>

      <form (ngSubmit)="onSubmit()" class="transaction-form">
        <!-- Type Selection -->
        <div class="form-section">
          <h3>Tipo de Transação</h3>
          <div class="type-selector">
            <button 
              type="button"
              class="type-btn"
              [class.active]="formData.type === 'income'"
              (click)="formData.type = 'income'"
            >
              <span class="material-symbols-outlined">trending_up</span>
              Receita
            </button>
            <button 
              type="button"
              class="type-btn"
              [class.active]="formData.type === 'expense'"
              (click)="formData.type = 'expense'"
            >
              <span class="material-symbols-outlined">trending_down</span>
              Despesa
            </button>
          </div>
        </div>

        <!-- Main Fields -->
        <div class="form-section">
          <h3>Informações Básicas</h3>
          
          <div class="form-grid">
            <!-- Amount -->
            <app-form-input
              label="Valor"
              type="number"
              icon="payments"
              placeholder="0,00"
              [(value)]="formData.amount"
              [error]="errors.amount"
              (valueChange)="clearError('amount')"
            ></app-form-input>

            <!-- Category -->
            <div class="form-group">
              <label>Categoria</label>
              <select [(ngModel)]="formData.category_id" name="category">
                <option value="">Selecionar categoria...</option>
                <option *ngFor="let cat of getFilteredCategories()" [value]="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <span class="error-text" *ngIf="errors.category_id">{{ errors.category_id }}</span>
            </div>

            <!-- Date -->
            <app-form-input
              label="Data"
              type="date"
              icon="calendar_today"
              [(value)]="formData.date"
              [error]="errors.date"
              (valueChange)="clearError('date')"
            ></app-form-input>
          </div>

          <!-- Description -->
          <app-form-input
            label="Descrição"
            type="text"
            icon="description"
            placeholder="Ex: Venda de serviço, Pagamento de internet"
            [(value)]="formData.description"
            [error]="errors.description"
            (valueChange)="clearError('description')"
          ></app-form-input>

          <!-- Notes -->
          <div class="form-group">
            <label>Notas (opcional)</label>
            <textarea 
              [(ngModel)]="formData.notes" 
              name="notes"
              placeholder="Adicione detalhes adicionais..."
              class="textarea"
            ></textarea>
          </div>
        </div>

        <!-- Error Message -->
        <div class="error-box" *ngIf="generalError">
          <span class="material-symbols-outlined">error</span>
          {{ generalError }}
        </div>

        <!-- Success Message -->
        <div class="success-box" *ngIf="successMessage">
          <span class="material-symbols-outlined">check_circle</span>
          {{ successMessage }}
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button 
            type="button"
            class="btn-cancel"
            (click)="onCancel()"
          >
            Cancelar
          </button>
          <app-button
            variant="primary"
            size="md"
            [disabled]="loading"
            (click)="onSubmit()"
          >
            {{ loading ? ('COMMON.LOADING' | translate) : (isEditMode ? 'Atualizar' : 'Criar Transação') }}
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-wrapper {
      max-width: 600px;
      margin: 0 auto;
    }

    /* ============ HEADER ============ */
    .form-header {
      margin-bottom: var(--sb-spacing-3xl);
    }

    .form-header h1 {
      margin: 0 0 var(--sb-spacing-xs);
      font-size: 28px;
      font-weight: 700;
    }

    .subtitle {
      margin: 0;
      color: var(--sb-text2);
      font-size: 14px;
    }

    /* ============ FORM ============ */
    .transaction-form {
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-2xl);
    }

    .form-section {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-lg);
      padding: var(--sb-spacing-xl);
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-lg);
    }

    .form-section h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--sb-text2);
    }

    /* ============ TYPE SELECTOR ============ */
    .type-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--sb-spacing-lg);
    }

    .type-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--sb-spacing-md);
      padding: var(--sb-spacing-lg);
      border: 2px solid var(--sb-border);
      border-radius: var(--sb-radius-lg);
      background: var(--sb-bg);
      cursor: pointer;
      transition: all 0.15s;
      font-weight: 600;
    }

    .type-btn:hover {
      border-color: var(--sb-primary);
      background: var(--sb-primary-light);
    }

    .type-btn.active {
      border-color: var(--sb-primary);
      background: var(--sb-primary-light);
      color: var(--sb-primary);
    }

    .type-btn .material-symbols-outlined {
      font-size: 24px;
    }

    /* ============ FORM GRID ============ */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--sb-spacing-lg);
    }

    /* ============ FORM GROUPS ============ */
    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-sm);
    }

    .form-group label {
      font-size: 12px;
      font-weight: 600;
      color: var(--sb-text2);
      text-transform: uppercase;
    }

    .form-group select,
    .form-group textarea {
      padding: var(--sb-spacing-md);
      border: 1.5px solid var(--sb-border);
      border-radius: var(--sb-radius-md);
      font-size: 14px;
      font-family: var(--sb-font-body);
      background: var(--sb-surface);
      color: var(--sb-text1);
      transition: all 0.15s;
    }

    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--sb-primary);
      box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
    }

    .textarea {
      min-height: 100px;
      resize: vertical;
    }

    .error-text {
      font-size: 12px;
      color: var(--sb-danger);
    }

    /* ============ MESSAGES ============ */
    .error-box {
      display: flex;
      align-items: center;
      gap: var(--sb-spacing-md);
      padding: var(--sb-spacing-lg);
      background: var(--sb-danger);
      color: white;
      border-radius: var(--sb-radius-md);
      font-weight: 500;
    }

    .error-box .material-symbols-outlined {
      font-size: 20px;
    }

    .success-box {
      display: flex;
      align-items: center;
      gap: var(--sb-spacing-md);
      padding: var(--sb-spacing-lg);
      background: var(--sb-income);
      color: white;
      border-radius: var(--sb-radius-md);
      font-weight: 500;
    }

    .success-box .material-symbols-outlined {
      font-size: 20px;
    }

    /* ============ ACTIONS ============ */
    .form-actions {
      display: flex;
      gap: var(--sb-spacing-lg);
      justify-content: flex-end;
    }

    .btn-cancel {
      padding: var(--sb-spacing-md) var(--sb-spacing-lg);
      background: var(--sb-bg);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-md);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      color: var(--sb-text2);
    }

    .btn-cancel:hover {
      background: var(--sb-surface);
      border-color: var(--sb-primary);
      color: var(--sb-primary);
    }

    /* ============ RESPONSIVE ============ */
    @media (max-width: 768px) {
      .form-wrapper {
        padding: 0;
      }

      .type-selector {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class TransactionFormComponent implements OnInit {
  isEditMode = false;
  loading = false;
  transactionId: number | null = null;
  
  formData: Partial<Transaction> = {
    type: 'expense',
    category_id: undefined,
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  };

  categories: any[] = [];
  errors: { [key: string]: string } = {};
  generalError = '';
  successMessage = '';

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private validationService: ValidationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.checkEditMode();
  }

  loadCategories(): void {
    this.categories = this.categoryService.getCached();
    if (this.categories.length === 0) {
      this.categoryService.getAll().subscribe();
    }
  }

  checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.transactionId = parseInt(params['id']);
        this.loadTransaction();
      }
    });
  }

  loadTransaction(): void {
    if (!this.transactionId) return;
    
    this.transactionService.get(this.transactionId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.formData = response.data;
        }
      },
      error: (err) => {
        this.generalError = 'Erro ao carregar transação';
        console.error('Error loading transaction:', err);
      }
    });
  }

  getFilteredCategories(): any[] {
    return this.categories.filter(c => c.type === this.formData.type);
  }

  clearError(field: string): void {
    delete this.errors[field];
    this.generalError = '';
  }

  validateForm(): boolean {
    this.errors = {};

    if (!this.formData.amount || this.formData.amount <= 0) {
      this.errors.amount = 'Valor inválido';
    }

    if (!this.formData.category_id) {
      this.errors.category_id = 'Categoria obrigatória';
    }

    if (!this.formData.description) {
      this.errors.description = 'Descrição obrigatória';
    }

    if (!this.formData.date) {
      this.errors.date = 'Data obrigatória';
    }

    return Object.keys(this.errors).length === 0;
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      this.generalError = 'Por favor, preencha os campos obrigatórios';
      return;
    }

    this.loading = true;
    this.generalError = '';

    const submitData = {
      type: this.formData.type,
      category_id: this.formData.category_id,
      amount: parseFloat(this.formData.amount as any),
      description: this.formData.description,
      date: this.formData.date,
      notes: this.formData.notes
    };

    const request = this.isEditMode && this.transactionId
      ? this.transactionService.update(this.transactionId, submitData)
      : this.transactionService.create(submitData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = this.isEditMode ? 'Transação atualizada!' : 'Transação criada!';
        setTimeout(() => {
          this.router.navigate(['/transactions']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.generalError = err.error?.message || 'Erro ao salvar transação';
        console.error('Error saving transaction:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/transactions']);
  }
}
          name="description"
        ></app-input>

        <div class="form-actions">
          <app-button variant="outline" (click)="onCancel()">Cancelar</app-button>
          <app-button variant="primary">Guardar</app-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-container {
      padding: var(--sb-spacing-3xl);
      max-width: 600px;
      margin: 0 auto;
    }

    h1 {
      margin-bottom: var(--sb-spacing-2xl);
    }

    .transaction-form {
      background: var(--sb-surface);
      border-radius: var(--sb-radius-lg);
      padding: var(--sb-spacing-xl);
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-lg);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--sb-spacing-lg);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-sm);
    }

    label {
      font-size: 12px;
      font-weight: 500;
      color: var(--sb-text2);
    }

    select, input {
      height: 42px;
      padding: 0 14px;
      border-radius: var(--sb-radius-md);
      border: 1.5px solid var(--sb-border2);
      background: var(--sb-surface);
      color: var(--sb-text);
      font-family: var(--sb-font-body);
      font-size: 14px;
      outline: none;
    }

    .form-actions {
      display: flex;
      gap: var(--sb-spacing-lg);
      margin-top: var(--sb-spacing-xl);
    }
  `]
})
export class TransactionFormComponent implements OnInit {
  mode: 'create' | 'edit' = 'create';
  type = 'expense';
  category = '';
  amount = 0;
  date = new Date().toISOString().split('T')[0];
  description = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = 'edit';
      // TODO: Load transaction data from API
    }
  }

  onSubmit(): void {
    // TODO: Submit form to API
  }

  onCancel(): void {
    this.router.navigate(['/transactions']);
  }
}
