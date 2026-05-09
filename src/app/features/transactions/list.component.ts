import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/components/button.component';
import { TransactionService, Transaction } from '../../core/services/transaction.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, TranslateModule, FormsModule, ButtonComponent],
  template: `
    <div class="transactions-wrapper">
      <!-- Header -->
      <div class="transactions-header">
        <div>
          <h1>Transações</h1>
          <p class="subtitle">Gerencie seus fluxos financeiros com precisão</p>
        </div>
        <app-button 
          variant="primary" 
          size="md"
          routerLink="/transactions/create"
        >
          <span class="material-symbols-outlined">add</span>
          Nova Transação
        </app-button>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="filter-group">
          <label>Tipo</label>
          <select [(ngModel)]="filterType" (ngModelChange)="onFilterChange()">
            <option value="">Todos</option>
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Categoria</label>
          <select [(ngModel)]="filterCategory" (ngModelChange)="onFilterChange()">
            <option value="">Todas</option>
            <option *ngFor="let cat of categories" [value]="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <label>Data Início</label>
          <input type="date" [(ngModel)]="filterStartDate" (ngModelChange)="onFilterChange()" />
        </div>
        <div class="filter-group">
          <label>Data Fim</label>
          <input type="date" [(ngModel)]="filterEndDate" (ngModelChange)="onFilterChange()" />
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-row" *ngIf="stats">
        <div class="stat-box">
          <p class="stat-label">Total</p>
          <p class="stat-value">{{ stats.total | number: '1.2-2' }} Kz</p>
        </div>
        <div class="stat-box income">
          <p class="stat-label">Receita</p>
          <p class="stat-value">{{ stats.income | number: '1.2-2' }} Kz</p>
        </div>
        <div class="stat-box expense">
          <p class="stat-label">Despesa</p>
          <p class="stat-value">{{ stats.expense | number: '1.2-2' }} Kz</p>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="table-container" *ngIf="!loading">
        <table class="transactions-table" *ngIf="transactions.length > 0">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th class="text-right">Valor</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let txn of transactions" [class.income]="txn.type === 'income'">
              <td class="text-muted">{{ txn.date | date: 'dd/MM/yyyy' }}</td>
              <td>
                <div class="transaction-cell">
                  <span class="material-symbols-outlined icon" [ngClass]="txn.type">
                    {{ txn.type === 'income' ? 'trending_up' : 'trending_down' }}
                  </span>
                  <div>
                    <p class="name">{{ txn.description }}</p>
                    <p class="notes">{{ txn.notes }}</p>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge">{{ getCategoryName(txn.category_id) }}</span>
              </td>
              <td class="text-right" [ngClass]="txn.type">
                {{ (txn.type === 'income' ? '+' : '-') }} {{ txn.amount | number: '1.2-2' }} Kz
              </td>
              <td class="text-right">
                <div class="action-buttons">
                  <button class="btn-icon" [routerLink]="['/transactions/edit', txn.id]" title="Editar">
                    <span class="material-symbols-outlined">edit</span>
                  </button>
                  <button class="btn-icon danger" (click)="deleteTransaction(txn.id!)" title="Deletar">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div class="empty-state" *ngIf="transactions.length === 0">
          <span class="material-symbols-outlined">receipt_long</span>
          <h3>Nenhuma transação</h3>
          <p>Comece criando sua primeira transação</p>
          <app-button variant="primary" routerLink="/transactions/create">
            Nova Transação
          </app-button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading">
        <span class="material-symbols-outlined spin">settings</span>
        <p>Carregando transações...</p>
      </div>

      <!-- Pagination -->
      <div class="pagination" *ngIf="transactions.length > 0">
        <button 
          [disabled]="currentPage <= 1"
          (click)="previousPage()"
          class="btn-pagination"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button 
          [disabled]="currentPage >= totalPages"
          (click)="nextPage()"
          class="btn-pagination"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .transactions-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-2xl);
    }

    /* ============ HEADER ============ */
    .transactions-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--sb-spacing-2xl);
    }

    .transactions-header h1 {
      margin: 0 0 var(--sb-spacing-xs);
      font-size: 28px;
      font-weight: 700;
    }

    .subtitle {
      margin: 0;
      color: var(--sb-text2);
      font-size: 14px;
    }

    /* ============ FILTERS ============ */
    .filters-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--sb-spacing-lg);
      background: var(--sb-surface);
      padding: var(--sb-spacing-lg);
      border-radius: var(--sb-radius-lg);
      border: 1px solid var(--sb-border);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-sm);
    }

    .filter-group label {
      font-size: 12px;
      font-weight: 600;
      color: var(--sb-text2);
      text-transform: uppercase;
    }

    .filter-group select,
    .filter-group input {
      padding: var(--sb-spacing-sm) var(--sb-spacing-md);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-md);
      font-size: 14px;
      background: var(--sb-bg);
      color: var(--sb-text1);
    }

    /* ============ STATS ============ */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--sb-spacing-lg);
    }

    .stat-box {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-lg);
      padding: var(--sb-spacing-lg);
      text-align: center;
    }

    .stat-box.income {
      border-color: var(--sb-income);
      background: rgba(16, 185, 129, 0.05);
    }

    .stat-box.expense {
      border-color: var(--sb-danger);
      background: rgba(239, 68, 68, 0.05);
    }

    .stat-label {
      margin: 0;
      font-size: 12px;
      color: var(--sb-text2);
      font-weight: 600;
    }

    .stat-value {
      margin: var(--sb-spacing-sm) 0 0;
      font-size: 20px;
      font-weight: 700;
    }

    .stat-box.income .stat-value {
      color: var(--sb-income);
    }

    .stat-box.expense .stat-value {
      color: var(--sb-danger);
    }

    /* ============ TABLE ============ */
    .table-container {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-lg);
      overflow: hidden;
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
    }

    .transactions-table thead {
      background: var(--sb-bg);
      border-bottom: 1px solid var(--sb-border);
    }

    .transactions-table th {
      padding: var(--sb-spacing-lg);
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: var(--sb-text2);
      text-transform: uppercase;
    }

    .transactions-table td {
      padding: var(--sb-spacing-lg);
      border-bottom: 1px solid var(--sb-border);
      font-size: 14px;
    }

    .transactions-table tbody tr:hover {
      background: var(--sb-bg);
    }

    .transactions-table tr.income {
      border-left: 3px solid var(--sb-income);
    }

    /* Transaction Cell */
    .transaction-cell {
      display: flex;
      gap: var(--sb-spacing-md);
      align-items: flex-start;
    }

    .transaction-cell .icon {
      font-size: 20px;
      padding: var(--sb-spacing-xs);
      border-radius: var(--sb-radius-sm);
      background: var(--sb-primary-light);
      color: var(--sb-primary);
    }

    .transaction-cell .icon.income {
      background: rgba(16, 185, 129, 0.1);
      color: var(--sb-income);
    }

    .transaction-cell .icon.expense {
      background: rgba(239, 68, 68, 0.1);
      color: var(--sb-danger);
    }

    .transaction-cell .name {
      margin: 0;
      font-weight: 600;
      color: var(--sb-text1);
    }

    .transaction-cell .notes {
      margin: var(--sb-spacing-xs) 0 0;
      font-size: 12px;
      color: var(--sb-text2);
    }

    /* Badge */
    .badge {
      display: inline-block;
      padding: var(--sb-spacing-xs) var(--sb-spacing-sm);
      background: var(--sb-primary-light);
      color: var(--sb-primary-dark);
      border-radius: var(--sb-radius-pill);
      font-size: 12px;
      font-weight: 600;
    }

    .text-right {
      text-align: right;
    }

    .text-muted {
      color: var(--sb-text2);
    }

    .income {
      color: var(--sb-income);
    }

    .expense {
      color: var(--sb-danger);
    }

    /* Action Buttons */
    .action-buttons {
      display: flex;
      gap: var(--sb-spacing-sm);
      justify-content: flex-end;
    }

    .btn-icon {
      background: none;
      border: none;
      color: var(--sb-text2);
      cursor: pointer;
      padding: var(--sb-spacing-xs);
      border-radius: var(--sb-radius-sm);
      transition: all 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-icon:hover {
      background: var(--sb-primary-light);
      color: var(--sb-primary);
    }

    .btn-icon.danger:hover {
      background: rgba(239, 68, 68, 0.1);
      color: var(--sb-danger);
    }

    .btn-icon .material-symbols-outlined {
      font-size: 18px;
    }

    /* ============ EMPTY STATE ============ */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--sb-spacing-3xl);
      color: var(--sb-text2);
      text-align: center;
    }

    .empty-state .material-symbols-outlined {
      font-size: 64px;
      margin-bottom: var(--sb-spacing-lg);
      opacity: 0.3;
    }

    .empty-state h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--sb-text1);
    }

    .empty-state p {
      margin: var(--sb-spacing-sm) 0 var(--sb-spacing-lg);
      color: var(--sb-text2);
    }

    /* ============ LOADING ============ */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--sb-spacing-3xl);
      color: var(--sb-text2);
    }

    .loading-state .material-symbols-outlined {
      font-size: 48px;
      margin-bottom: var(--sb-spacing-lg);
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* ============ PAGINATION ============ */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--sb-spacing-lg);
      padding: var(--sb-spacing-lg);
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-lg);
      margin-top: var(--sb-spacing-lg);
    }

    .btn-pagination {
      background: none;
      border: 1px solid var(--sb-border);
      padding: var(--sb-spacing-sm) var(--sb-spacing-md);
      border-radius: var(--sb-radius-md);
      cursor: pointer;
      color: var(--sb-text2);
      transition: all 0.15s;
      display: flex;
      align-items: center;
    }

    .btn-pagination:hover:not(:disabled) {
      background: var(--sb-primary-light);
      color: var(--sb-primary);
      border-color: var(--sb-primary);
    }

    .btn-pagination:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-size: 14px;
      color: var(--sb-text2);
      font-weight: 500;
    }

    /* ============ RESPONSIVE ============ */
    @media (max-width: 768px) {
      .transactions-header {
        flex-direction: column;
      }

      .filters-bar {
        grid-template-columns: 1fr;
      }

      .transactions-table {
        font-size: 12px;
      }

      .transactions-table th,
      .transactions-table td {
        padding: var(--sb-spacing-md);
      }

      .transaction-cell {
        flex-direction: column;
      }
    }
  `]
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  categories: any[] = [];
  loading = true;
  currentPage = 1;
  totalPages = 1;
  limit = 20;
  
  filterType = '';
  filterCategory = '';
  filterStartDate = '';
  filterEndDate = '';
  
  stats: any = null;

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadTransactions();
  }

  loadCategories(): void {
    this.categories = this.categoryService.getCached();
    if (this.categories.length === 0) {
      this.categoryService.getAll().subscribe();
    }
  }

  loadTransactions(): void {
    this.loading = true;
    const offset = (this.currentPage - 1) * this.limit;

    const filters: any = {
      limit: this.limit,
      offset: offset
    };

    if (this.filterType) filters.type = this.filterType;
    if (this.filterCategory) filters.category_id = this.filterCategory;
    if (this.filterStartDate) filters.start = this.filterStartDate;
    if (this.filterEndDate) filters.end = this.filterEndDate;

    this.transactionService.list(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.transactions = response.data.transactions;
          const { total_count } = response.data.pagination;
          this.totalPages = Math.ceil(total_count / this.limit);
          this.calculateStats();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    const income = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    this.stats = {
      income,
      expense,
      total: income - expense
    };
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadTransactions();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || 'Sem categoria';
  }

  deleteTransaction(id: number): void {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      this.transactionService.delete(id).subscribe({
        next: () => {
          this.loadTransactions();
        },
        error: (err) => console.error('Error deleting transaction:', err)
      });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTransactions();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTransactions();
    }
  }
}

  ngOnInit(): void {
    // TODO: Load transactions from API
  }
}
