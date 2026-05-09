import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardService, DashboardSummary } from '../../core/services/dashboard.service';
import { TransactionService } from '../../core/services/transaction.service';
import { ButtonComponent } from '../../shared/components/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink, TranslateModule, ButtonComponent],
  template: `
    <div class="dashboard-wrapper">
      <!-- Total Balance Card -->
      <div class="balance-card">
        <div class="balance-header">
          <h2>Saldo Total</h2>
          <span class="material-symbols-outlined">account_balance</span>
        </div>
        <div class="balance-amount" *ngIf="summary">
          {{ summary.balance | number: '1.2-2' }} Kz
        </div>
        <p class="balance-helper" *ngIf="summary">
          <span class="income">
            <span class="material-symbols-outlined">trending_up</span>
            Receita: {{ summary.total_income | number: '1.2-2' }} Kz
          </span>
          <span class="expense">
            <span class="material-symbols-outlined">trending_down</span>
            Despesa: {{ summary.total_expenses | number: '1.2-2' }} Kz
          </span>
        </p>
      </div>

      <!-- This Month Stats -->
      <div class="stats-grid">
        <div class="stat-card" *ngIf="summary">
          <div class="stat-top">
            <h3>Este Mês</h3>
            <span class="material-symbols-outlined">calendar_month</span>
          </div>

          <div class="stat-row">
            <div class="stat-item income">
              <p class="stat-label">Receita</p>
              <p class="stat-value">
                {{ (summary.total_income || 0) | number: '1.2-2' }}
                <span class="currency">Kz</span>
              </p>
            </div>
            <div class="divider"></div>
            <div class="stat-item expense">
              <p class="stat-label">Despesa</p>
              <p class="stat-value">
                {{ (summary.total_expenses || 0) | number: '1.2-2' }}
                <span class="currency">Kz</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h3>Ações Rápidas</h3>
          <app-button 
            variant="primary" 
            size="md"
            routerLink="/transactions/create"
            class="action-btn"
          >
            <span class="material-symbols-outlined">add_circle</span>
            Adicionar Receita
          </app-button>
          <app-button 
            variant="danger" 
            size="md"
            routerLink="/transactions/create"
            class="action-btn"
          >
            <span class="material-symbols-outlined">remove_circle</span>
            Adicionar Despesa
          </app-button>
        </div>
      </div>

      <!-- Expenses by Category -->
      <div class="category-breakdown" *ngIf="summary?.expenses_by_category">
        <h3>Despesas por Categoria</h3>
        <div class="categories-list">
          <div class="category-item" *ngFor="let cat of getCategoryArray()">
            <div class="category-header">
              <span class="category-name">{{ cat.name }}</span>
              <span class="category-amount">{{ cat.amount | number: '1.2-2' }} Kz</span>
            </div>
            <div class="category-bar">
              <div class="category-progress" [style.width]="getCategoryPercentage(cat.amount) + '%'"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading" *ngIf="!summary">
        <span class="material-symbols-outlined spin">settings</span>
        <p>Carregando dashboard...</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--sb-spacing-2xl);
    }

    /* ============ BALANCE CARD ============ */
    .balance-card {
      background: linear-gradient(135deg, var(--sb-primary) 0%, var(--sb-primary-dark) 100%);
      border-radius: var(--sb-radius-lg);
      padding: var(--sb-spacing-3xl);
      color: white;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.15);
    }

    .balance-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--sb-spacing-lg);
    }

    .balance-header h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      opacity: 0.9;
    }

    .balance-header .material-symbols-outlined {
      font-size: 24px;
      opacity: 0.8;
    }

    .balance-amount {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: var(--sb-spacing-xl);
      font-family: var(--sb-font-display);
    }

    .balance-helper {
      display: flex;
      gap: var(--sb-spacing-2xl);
      margin: 0;
      font-size: 13px;
      opacity: 0.9;
    }

    .balance-helper span {
      display: flex;
      align-items: center;
      gap: var(--sb-spacing-xs);
    }

    .balance-helper .material-symbols-outlined {
      font-size: 16px;
    }

    /* ============ STATS GRID ============ */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--sb-spacing-lg);
    }

    .stat-card {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-lg);
      padding: var(--sb-spacing-xl);
    }

    .stat-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--sb-spacing-lg);
    }

    .stat-top h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .stat-top .material-symbols-outlined {
      color: var(--sb-text2);
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--sb-spacing-lg);
    }

    .stat-item {
      flex: 1;
    }

    .stat-item.income .stat-value {
      color: var(--sb-income);
    }

    .stat-item.expense .stat-value {
      color: var(--sb-danger);
    }

    .stat-label {
      margin: 0;
      font-size: 12px;
      color: var(--sb-text2);
      font-weight: 500;
      text-transform: uppercase;
    }

    .stat-value {
      margin: var(--sb-spacing-sm) 0 0;
      font-size: 24px;
      font-weight: 700;
      display: flex;
      align-items: baseline;
      gap: var(--sb-spacing-xs);
    }

    .currency {
      font-size: 14px;
      font-weight: 600;
      color: var(--sb-text2);
    }

    .divider {
      width: 1px;
      background: var(--sb-border);
      height: 50px;
    }

    /* ============ QUICK ACTIONS ============ */
    .quick-actions {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-lg);
      padding: var(--sb-spacing-xl);
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-lg);
    }

    .quick-actions h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--sb-spacing-md);
    }

    .action-btn .material-symbols-outlined {
      font-size: 20px;
    }

    /* ============ CATEGORY BREAKDOWN ============ */
    .category-breakdown {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: var(--sb-radius-lg);
      padding: var(--sb-spacing-xl);
    }

    .category-breakdown h3 {
      margin: 0 0 var(--sb-spacing-lg);
      font-size: 16px;
      font-weight: 600;
    }

    .categories-list {
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-lg);
    }

    .category-item {
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-sm);
    }

    .category-header {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 500;
    }

    .category-name {
      color: var(--sb-text1);
    }

    .category-amount {
      color: var(--sb-text2);
      font-weight: 600;
    }

    .category-bar {
      height: 8px;
      background: var(--sb-primary-light);
      border-radius: var(--sb-radius-pill);
      overflow: hidden;
    }

    .category-progress {
      height: 100%;
      background: var(--sb-primary);
      border-radius: var(--sb-radius-pill);
      transition: width 0.3s ease;
    }

    /* ============ LOADING ============ */
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--sb-spacing-3xl);
      color: var(--sb-text2);
      min-height: 200px;
    }

    .loading .material-symbols-outlined {
      font-size: 48px;
      margin-bottom: var(--sb-spacing-lg);
      animation: spin 2s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .spin {
      animation: spin 2s linear infinite;
    }

    /* ============ RESPONSIVE ============ */
    @media (max-width: 768px) {
      .balance-card {
        padding: var(--sb-spacing-xl);
      }

      .balance-amount {
        font-size: 36px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .balance-helper {
        flex-direction: column;
        gap: var(--sb-spacing-lg);
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.dashboardService.getSummary().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.summary = response.data;
        }
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.summary = {
          total_income: 0,
          total_expenses: 0,
          balance: 0,
          expenses_by_category: {}
        };
      }
    });
  }

  getCategoryArray(): Array<{ name: string; amount: number }> {
    if (!this.summary?.expenses_by_category) return [];
    return Object.entries(this.summary.expenses_by_category).map(([name, amount]) => ({
      name,
      amount: amount as number
    }));
  }

  getCategoryPercentage(amount: number): number {
    if (!this.summary?.total_expenses || this.summary.total_expenses === 0) return 0;
    return (amount / this.summary.total_expenses) * 100;
  }
}

    .stat-card {
      background: var(--sb-surface);
      border-radius: var(--sb-radius-lg);
      padding: var(--sb-spacing-xl);
      border: 1px solid var(--sb-border);
    }

    .stat-label {
      font-size: 13px;
      color: var(--sb-text2);
      margin-bottom: var(--sb-spacing-md);
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--sb-primary);
    }

    .stat-row {
      display: flex;
      gap: var(--sb-spacing-lg);
    }

    .stat-income, .stat-expense {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--sb-spacing-sm);
    }

    .stat-income strong { color: var(--sb-income); }
    .stat-expense strong { color: var(--sb-expense); }

    .recent-transactions {
      background: var(--sb-surface);
      border-radius: var(--sb-radius-lg);
      padding: var(--sb-spacing-xl);
      border: 1px solid var(--sb-border);
    }
  `]
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // TODO: Load dashboard data from API
  }
}
