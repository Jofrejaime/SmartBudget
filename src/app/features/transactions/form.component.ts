import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of, switchMap } from 'rxjs';
import { ButtonComponent } from '../../shared/components/button.component';
import { FormInputComponent } from '../../shared/components/form-input.component';
import { TransactionService, Transaction } from '../../core/services/transaction.service';
import { CategoryService, Category } from '../../core/services/category.service';
import { ValidationService } from '../../core/services/validation.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, ButtonComponent, FormInputComponent],
  template: `
    <div class="form-wrapper">
      <div class="form-header">
        <h1>{{ isEditMode ? 'Editar Transação' : 'Nova Transação' }}</h1>
        <p class="subtitle">{{ isEditMode ? 'Atualize os detalhes' : 'Registre uma nova entrada ou saída' }}</p>
      </div>

      <!-- Error Message -->
      <div class="error-box" *ngIf="generalError">
        <span class="material-symbols-outlined">error</span>
        <p>{{ generalError }}</p>
      </div>

      <!-- Success Message -->
      <div class="success-box" *ngIf="successMessage">
        <span class="material-symbols-outlined">check_circle</span>
        <p>{{ successMessage }}</p>
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
              (click)="onTypeChange('income')"
            >
              <span class="material-symbols-outlined">trending_up</span>
              Receita
            </button>
            <button 
              type="button"
              class="type-btn"
              [class.active]="formData.type === 'expense'"
              (click)="onTypeChange('expense')"
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
              [error]="errors['amount']"
            ></app-form-input>

            <!-- Category -->
            <div class="form-group">
              <label>Categoria</label>
              <select [(ngModel)]="formData.category_id" name="category">
                <option [ngValue]="null">Selecionar...</option>
                <optgroup label="Minhas categorias" *ngIf="filteredCategories.length">
                  <option *ngFor="let cat of filteredCategories" [ngValue]="cat.id">{{ cat.name }}</option>
                </optgroup>
                <optgroup label="Outras categorias disponiveis" *ngIf="availableFilteredCategories.length">
                  <option *ngFor="let cat of availableFilteredCategories" [ngValue]="cat.id">{{ cat.name }}</option>
                </optgroup>
              </select>
              <span class="error-text" *ngIf="errors['category_id']">{{ errors['category_id'] }}</span>
            </div>

            <!-- Date -->
            <app-form-input
              label="Data"
              type="date"
              icon="calendar_today"
              [(value)]="formData.date"
              [error]="errors['date']"
            ></app-form-input>
          </div>

          <!-- Description -->
          <app-form-input
            label="Descrição"
            type="text"
            icon="description"
            placeholder="Descreva a transação"
            [(value)]="formData.description"
            [error]="errors['description']"
          ></app-form-input>

          <!-- Notes -->
          <div class="form-group">
            <label>Notas (Opcional)</label>
            <textarea 
              [(ngModel)]="formData.notes" 
              name="notes"
              placeholder="Detalhes adicionais"
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="button" class="btn-secondary" (click)="onCancel()">
            <span class="material-symbols-outlined">close</span>
            Cancelar
          </button>
          <app-button 
            variant="primary" 
            size="lg"
            type="submit"
            [disabled]="isLoading"
          >
            <span class="material-symbols-outlined">{{ isEditMode ? 'edit' : 'add_circle' }}</span>
            {{ isEditMode ? 'Atualizar' : 'Criar Transação' }}
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

    /* Error/Success Messages */
    .error-box, .success-box {
      display: flex;
      align-items: center;
      gap: var(--sb-spacing-md);
      padding: var(--sb-spacing-lg);
      margin-bottom: var(--sb-spacing-lg);
      border-radius: var(--sb-radius-md);
    }

    .error-box {
      background: rgba(239, 68, 68, 0.1);
      color: var(--sb-danger);
      border: 1px solid var(--sb-danger);
    }

    .success-box {
      background: rgba(16, 185, 129, 0.1);
      color: var(--sb-income);
      border: 1px solid var(--sb-income);
    }

    .error-box .material-symbols-outlined,
    .success-box .material-symbols-outlined {
      font-size: 20px;
      flex-shrink: 0;
    }

    .error-box p, .success-box p {
      margin: 0;
      font-size: 14px;
    }

    /* Form Sections */
    .transaction-form {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--sb-spacing-2xl);
    }

    .form-section {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-lg);
      padding: var(--sb-spacing-xl);
    }

    .form-section h3 {
      margin: 0 0 var(--sb-spacing-lg);
      font-size: 16px;
      font-weight: 600;
    }

    /* Type Selector */
    .type-selector {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--sb-spacing-md);
    }

    .type-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--sb-spacing-md);
      padding: var(--sb-spacing-lg);
      background: var(--sb-bg);
      color: var(--sb-text2);
      border: 2px solid var(--sb-border);
      border-radius: var(--sb-radius-md);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }

    .type-btn:hover {
      border-color: var(--sb-primary);
      background: var(--sb-primary-light);
      color: var(--sb-primary);
    }

    .type-btn.active {
      background: var(--sb-primary);
      color: white;
      border-color: var(--sb-primary);
    }

    .type-btn .material-symbols-outlined {
      font-size: 20px;
    }

    /* Form Grid */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--sb-spacing-lg);
      margin-bottom: var(--sb-spacing-lg);
    }

    /* Form Group */
    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-sm);
    }

    .form-group label {
      font-size: 14px;
      font-weight: 600;
    }

    .form-group select,
    .form-group textarea {
      padding: var(--sb-spacing-md);
      border: 1.5px solid var(--sb-border);
      border-radius: var(--sb-radius-md);
      background: var(--sb-bg);
      color: var(--sb-text1);
      font-size: 14px;
      font-family: inherit;
      transition: all 0.15s;
    }

    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--sb-primary);
      box-shadow: 0 0 0 3px var(--sb-primary-light);
    }

    /* Error Text */
    .error-text {
      font-size: 12px;
      color: var(--sb-danger);
      margin-top: var(--sb-spacing-xs);
    }

    /* Form Actions */
    .form-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--sb-spacing-lg);
      margin-top: var(--sb-spacing-2xl);
    }

    .btn-secondary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--sb-spacing-md);
      padding: var(--sb-spacing-md) var(--sb-spacing-lg);
      background: var(--sb-surface);
      color: var(--sb-text1);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-md);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }

    .btn-secondary:hover {
      background: var(--sb-border);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TransactionFormComponent implements OnInit {
  isEditMode = false;
  isLoading = false;
  generalError = '';
  successMessage = '';

  formData: any = {
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category_id: null,
    description: '',
    notes: ''
  };

  errors: { [key: string]: string } = {};
  filteredCategories: Category[] = [];
  availableFilteredCategories: Category[] = [];
  categories: Category[] = [];
  availableCategories: Category[] = [];

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private validationService: ValidationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkEditMode();
    this.loadCategories();
  }

  checkEditMode(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadTransaction(id);
    }
  }

  loadTransaction(id: number): void {
    this.transactionService.get(id).subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.formData = response.data;
          this.updateFilteredCategories();
        }
      },
      error: (err) => {
        this.generalError = 'Erro ao carregar transação';
        console.error(err);
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: () => {
        this.categories = this.categoryService.getCached();
        this.updateFilteredCategories();
      },
      error: () => {
        this.categories = this.categoryService.getCached();
        this.updateFilteredCategories();
      }
    });

    this.categoryService.listAvailable().subscribe({
      next: () => {
        this.availableCategories = this.categoryService.getAvailableCached();
        this.updateFilteredCategories();
      },
      error: () => {
        this.availableCategories = this.categoryService.getAvailableCached();
        this.updateFilteredCategories();
      }
    });
  }

  updateFilteredCategories(): void {
    const selectedType = this.formData.type as 'income' | 'expense';
    const matchesType = (category: Category) => category.type === selectedType || category.type === 'both';

    this.filteredCategories = this.categories.filter(matchesType);
    this.availableFilteredCategories = this.availableCategories.filter(matchesType);
  }

  onTypeChange(type: 'income' | 'expense'): void {
    this.formData.type = type;
    this.updateFilteredCategories();
  }

  validateForm(): boolean {
    this.errors = {};

    const amount = this.validationService.validateAmount(this.formData.amount);
    if (amount) this.errors['amount'] = amount;

    if (!this.formData.category_id) {
      this.errors['category_id'] = 'Categoria obrigatória';
    }

    const description = this.validationService.validateRequired(
      this.formData.description,
      'Descrição'
    );
    if (description) this.errors['description'] = description;

    const date = this.validationService.validateDate(this.formData.date as string);
    if (date) this.errors['date'] = date;

    return Object.keys(this.errors).length === 0;
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    this.isLoading = true;
    this.generalError = '';
    this.successMessage = '';

    const selectedCategoryId = Number(this.formData.category_id);
    const selectedIsAvailable = this.availableCategories.some((category) => category.id === selectedCategoryId);

    const ensureCategoryAccess$ = selectedIsAvailable
      ? this.categoryService.addToUser(selectedCategoryId).pipe(
          switchMap(() => {
            this.categories = this.categoryService.getCached();
            this.availableCategories = this.categoryService.getAvailableCached();
            this.updateFilteredCategories();
            return of(null);
          })
        )
      : of(null);

    ensureCategoryAccess$.pipe(
      switchMap(() => this.isEditMode
        ? this.transactionService.update(this.formData.id, this.formData)
        : this.transactionService.create(this.formData as any)
      )
    ).subscribe({
      next: (response: any) => {
        this.successMessage = this.isEditMode
          ? 'Transação atualizada com sucesso!'
          : 'Transação criada com sucesso!';
        
        setTimeout(() => {
          this.router.navigate(['/transactions']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.generalError = err.error?.message || 'Erro ao salvar transação';
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/transactions']);
  }
}
