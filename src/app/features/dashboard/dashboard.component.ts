import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';

interface DashboardSummary {
  total_income: number;
  total_expenses: number;
  balance: number;
  expenses_by_category?: { [key: string]: number };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterLink],
  template: `
    <div class="dashboard-shell">
      <div class="loading-badge" *ngIf="isLoading">
        <span class="material-symbols-outlined">settings</span>
        A atualizar dados
      </div>

      <section class="hero-grid">
        <div class="hero-card hero-card-main">
          <div class="hero-topline">
            <div>
              <p class="eyebrow">Resumo financeiro</p>
              <h2 class="page-title">Dashboard Financeiro</h2>
              <p class="page-subtitle">Acompanhe saldo, entradas, saídas e distribuição por categoria num único lugar.</p>
            </div>
            <a routerLink="/transactions/create" class="hero-action">
              <span class="material-symbols-outlined">add</span>
              Nova Transação
            </a>
          </div>

          <div class="balance-block">
            <p class="balance-label">Saldo total</p>
            <div class="balance-row">
              <span class="currency">Kz</span>
              <span class="balance-value">{{ summary.balance | number: '1.2-2' }}</span>
            </div>
            <div class="balance-meta">
              <span class="meta-pill income-pill">
                <span class="material-symbols-outlined">trending_up</span>
                Receita {{ summary.total_income | number: '1.2-2' }} Kz
              </span>
              <span class="meta-pill expense-pill">
                <span class="material-symbols-outlined">trending_down</span>
                Despesa {{ summary.total_expenses | number: '1.2-2' }} Kz
              </span>
            </div>
          </div>
        </div>

        <div class="hero-card hero-card-insight">
          <span class="material-symbols-outlined insight-icon">insights</span>
          <p class="eyebrow light">Insight financeiro</p>
          <h3>Controlo mensal mais claro</h3>
          <p>
            A maior fatia das despesas está concentrada em {{ topCategory?.name || 'categorias recorrentes' }}.
            Rever essa área pode reduzir o peso mensal.
          </p>
          <a routerLink="/transactions" class="ghost-link">
            Ver transações
            <span class="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>
      </section>

      <section class="stats-grid">
        <article class="stat-card">
          <p class="stat-label">Entradas</p>
          <div class="stat-value income">{{ summary.total_income | number: '1.2-2' }} Kz</div>
          <p class="stat-caption">Receitas acumuladas no período atual</p>
        </article>

        <article class="stat-card">
          <p class="stat-label">Saídas</p>
          <div class="stat-value expense">{{ summary.total_expenses | number: '1.2-2' }} Kz</div>
          <p class="stat-caption">Despesas consolidadas no período atual</p>
        </article>

        <article class="stat-card stat-card-action">
          <p class="stat-label">Ação rápida</p>
          <a routerLink="/transactions/create" class="action-link">
            <span class="material-symbols-outlined">add_circle</span>
            Adicionar transação
          </a>
          <p class="stat-caption">Registe uma nova entrada ou saída em segundos</p>
        </article>
      </section>

      <section class="content-grid">
        <article class="panel panel-large">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Distribuição mensal</p>
              <h3>Despesas por categoria</h3>
            </div>
            <span class="panel-total">{{ summary.total_expenses | number: '1.2-2' }} Kz</span>
          </div>

          <div class="category-list" *ngIf="getCategoryArray().length > 0; else emptyCategories">
            <div class="category-item" *ngFor="let cat of getCategoryArray(); let isLast = last">
              <div class="category-row">
                <div>
                  <p class="category-name">{{ cat.name }}</p>
                  <p class="category-meta">{{ getCategoryTransactionCount(cat.name) }} transações</p>
                </div>
                <span class="category-amount">{{ cat.amount | number: '1.2-2' }} Kz</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" [style.width.%]="getCategoryPercentage(cat.amount)"></div>
              </div>
            </div>
          </div>

          <ng-template #emptyCategories>
            <div class="empty-panel">
              <span class="material-symbols-outlined">category</span>
              <p>Sem categorias registadas para este período.</p>
            </div>
          </ng-template>
        </article>

        <article class="panel panel-side">
          <div class="panel-header compact">
            <div>
              <p class="eyebrow">Resumo rápido</p>
              <h3>Métricas principais</h3>
            </div>
          </div>

          <div class="summary-stack">
            <div class="summary-row">
              <span>Maior categoria</span>
              <strong>{{ topCategory?.name || 'N/D' }}</strong>
            </div>
            <div class="summary-row">
              <span>Percentual</span>
              <strong>{{ topCategory ? getCategoryPercentage(topCategory.amount) : 0 | number: '1.0-0' }}%</strong>
            </div>
            <div class="summary-row">
              <span>Saldo líquido</span>
              <strong>{{ summary.balance | number: '1.2-2' }} Kz</strong>
            </div>
          </div>

          <div class="mini-card">
            <span class="material-symbols-outlined">notifications</span>
            <div>
              <p>Verifique a categoria com maior peso.</p>
              <a routerLink="/transactions" class="mini-link">Abrir histórico</a>
            </div>
          </div>
        </article>
      </section>

      <section class="panel transactions-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Movimento recente</p>
            <h3>Transações recentes</h3>
          </div>
          <a routerLink="/transactions" class="panel-link">Ver tudo</a>
        </div>

        <div class="transactions-table">
          <div class="transactions-head">
            <span>Data</span>
            <span>Descrição</span>
            <span>Categoria</span>
            <span class="align-right">Valor</span>
          </div>

          <div class="transaction-row" *ngFor="let txn of recentTransactions">
            <div class="txn-date">{{ txn.date }}</div>
            <div class="txn-desc">
              <span class="txn-icon" [class.expense]="txn.type === 'expense'" [class.income]="txn.type === 'income'">
                <span class="material-symbols-outlined">{{ txn.icon }}</span>
              </span>
              <div>
                <p class="txn-title">{{ txn.title }}</p>
                <p class="txn-subtitle">{{ txn.subtitle }}</p>
              </div>
            </div>
            <div class="txn-category">
              <span class="txn-badge">{{ txn.category }}</span>
            </div>
            <div class="txn-amount" [class.income]="txn.type === 'income'" [class.expense]="txn.type === 'expense'">
              {{ txn.sign }} {{ txn.amount | number: '1.2-2' }} Kz
            </div>
          </div>
        </div>
      </section>
    </div>

  `,
  styles: [`
    .dashboard-shell {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .loading-badge {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 999px;
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      color: var(--sb-text2);
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
    }

    .loading-badge .material-symbols-outlined {
      font-size: 18px;
      animation: spin 1.6s linear infinite;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.85fr);
      gap: 24px;
    }

    .hero-card {
      border-radius: 24px;
      padding: 28px;
      border: 1px solid var(--sb-border);
      background: var(--sb-surface);
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.06);
    }

    .hero-card-main {
      background:
        radial-gradient(circle at top right, rgba(5, 150, 105, 0.08), transparent 26%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.96));
    }

    .hero-topline {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 28px;
    }

    .eyebrow {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--sb-primary);
      margin: 0 0 8px;
    }

    .eyebrow.light {
      color: rgba(255, 255, 255, 0.86);
    }

    .page-title {
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -0.8px;
      margin: 0;
      color: var(--sb-text);
    }

    .page-subtitle {
      margin: 10px 0 0;
      max-width: 720px;
      color: var(--sb-text2);
      font-size: 15px;
      line-height: 1.6;
    }

    .hero-action,
    .action-link {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;
      min-height: 44px;
      padding: 0 16px;
      border-radius: 14px;
      background: var(--sb-primary);
      color: #fff;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .hero-action:hover,
    .action-link:hover {
      background: #059669;
      color: white;
      transform: translateY(-1px);
    }

    .hero-card-insight {
      background: linear-gradient(135deg, var(--sb-primary) 0%, var(--sb-primary-dark) 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 18px;
    }

    .insight-icon {
      font-size: 40px;
    }

    .hero-card-insight h3 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.4px;
    }

    .hero-card-insight p {
      margin: 0;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.9);
    }

    .ghost-link {
      display: flex;
      flex-direction: column;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      text-decoration: none;
      font-weight: 600;
      width: fit-content;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .stat-card {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: 20px;
      padding: 22px;
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
    }

    .stat-label {
      margin: 0 0 10px;
      color: var(--sb-text2);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .stat-value {
      font-family: var(--sb-font-display);
      font-size: 30px;
      font-weight: 700;
      letter-spacing: -0.8px;
      margin-bottom: 8px;
    }

    .stat-value.income {
      color: var(--sb-income);
    }

    .stat-value.expense {
      color: var(--sb-expense);
    }

    .stat-caption {
      margin: 0;
      color: var(--sb-text2);
      font-size: 13px;
      line-height: 1.5;
    }

    .stat-card-action {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .action-link {
      width: 100%;
      margin-bottom: 10px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(300px, 0.65fr);
      gap: 24px;
      align-items: start;
    }

    .panel {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
    }

    .panel-large {
      min-height: 100%;
    }

    .panel-side {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }

    .panel-header.compact {
      margin-bottom: 0;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.4px;
    }

    .panel-total,
    .panel-link,
    .mini-link {
      color: var(--sb-primary);
      font-weight: 600;
      text-decoration: none;
      font-size: 14px;
    }

    .category-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .category-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .category-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .category-name {
      margin: 0;
      font-weight: 600;
      color: var(--sb-text);
    }

    .category-meta {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--sb-text2);
    }

    .category-amount {
      font-family: var(--sb-font-display);
      font-weight: 700;
      color: var(--sb-text);
      white-space: nowrap;
    }

    .progress-track {
      height: 10px;
      background: var(--sb-surface2);
      border-radius: 999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--sb-primary), var(--sb-primary-mid));
    }

    .summary-stack {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 18px;
      background: var(--sb-surface2);
      border-radius: 18px;
    }

    .summary-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      font-size: 14px;
      color: var(--sb-text2);
    }

    .summary-row strong {
      color: var(--sb-text);
      font-family: var(--sb-font-display);
      font-size: 15px;
    }

    .mini-card {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 18px;
      border-radius: 18px;
      background: linear-gradient(135deg, var(--sb-primary-light), #fff);
      border: 1px solid rgba(5, 150, 105, 0.15);
    }

    .mini-card .material-symbols-outlined {
      color: var(--sb-primary);
      font-size: 24px;
      margin-top: 2px;
    }

    .mini-card p {
      margin: 0 0 6px;
      color: var(--sb-text);
      font-weight: 500;
      line-height: 1.5;
    }

    .transactions-panel {
      padding: 0;
      overflow: hidden;
    }

    .transactions-panel .panel-header {
      padding: 24px 24px 0;
    }

    .transactions-table {
      padding: 0 24px 24px;
    }

    .transactions-head,
    .transaction-row {
      display: grid;
      grid-template-columns: 120px minmax(220px, 1fr) 170px 160px;
      gap: 16px;
      align-items: center;
    }

    .transactions-head {
      padding: 14px 0;
      color: var(--sb-text2);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      border-bottom: 1px solid var(--sb-border);
    }

    .transaction-row {
      padding: 18px 0;
      border-bottom: 1px solid var(--sb-border);
    }

    .transaction-row:last-child {
      border-bottom: none;
    }

    .txn-date {
      font-size: 13px;
      color: var(--sb-text2);
      font-weight: 500;
    }

    .txn-desc {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }

    .txn-icon {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: var(--sb-primary-light);
      color: var(--sb-primary);
    }

    .txn-icon.expense {
      background: var(--sb-danger-light);
      color: var(--sb-danger);
    }

    .txn-title {
      margin: 0;
      font-weight: 600;
      color: var(--sb-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .txn-subtitle {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--sb-text2);
    }

    .txn-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--sb-surface2);
      color: var(--sb-text2);
      font-size: 12px;
      font-weight: 600;
    }

    .txn-amount {
      font-family: var(--sb-font-display);
      font-weight: 700;
      text-align: right;
      white-space: nowrap;
    }

    .txn-amount.income {
      color: var(--sb-income);
    }

    .txn-amount.expense {
      color: var(--sb-expense);
    }

    .align-right {
      text-align: right;
    }

    .empty-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 180px;
      border: 1px dashed var(--sb-border);
      border-radius: 20px;
      background: var(--sb-surface2);
      color: var(--sb-text2);
      gap: 12px;
      text-align: center;
    }

    .empty-panel .material-symbols-outlined {
      font-size: 36px;
      color: var(--sb-primary);
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .hero-grid,
      .content-grid,
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .hero-topline,
      .panel-header,
      .category-row,
      .transactions-head,
      .transaction-row {
        grid-template-columns: 1fr;
      }

      .hero-topline {
        flex-direction: column;
      }

      .transactions-head {
        display: none;
      }

      .transaction-row {
        gap: 10px;
      }

      .txn-amount {
        text-align: left;
      }

      .txn-desc {
        align-items: flex-start;
      }

      .hero-card,
      .panel,
      .stat-card {
        border-radius: 20px;
        padding: 20px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary = {
    total_income: 0,
    total_expenses: 0,
    balance: 0,
    expenses_by_category: {}
  };
  isLoading = true;
  recentTransactions = [
    {
      date: '24 Out 2024',
      title: 'Consultoria Tech Global',
      subtitle: 'Fatura #8829',
      category: 'Serviços',
      amount: 12000,
      sign: '+',
      type: 'income',
      icon: 'payments'
    },
    {
      date: '22 Out 2024',
      title: 'Amazon Web Services',
      subtitle: 'Infraestrutura Cloud',
      category: 'Tecnologia',
      amount: 4350.2,
      sign: '-',
      type: 'expense',
      icon: 'cloud_queue'
    },
    {
      date: '20 Out 2024',
      title: 'Dividendos Mensais',
      subtitle: 'Fundo de Investimento',
      category: 'Investimentos',
      amount: 2450,
      sign: '+',
      type: 'income',
      icon: 'trending_up'
    },
    {
      date: '18 Out 2024',
      title: 'Aluguel Escritório SP',
      subtitle: 'WeWork Paulista',
      category: 'Operacional',
      amount: 8900,
      sign: '-',
      type: 'expense',
      icon: 'apartment'
    }
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.dashboardService.getSummary().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.summary = response.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.summary = {
          total_income: 0,
          total_expenses: 0,
          balance: 0,
          expenses_by_category: {}
        };
        this.isLoading = false;
      }
    });
  }

  getCategoryArray(): Array<{ name: string; amount: number }> {
    if (!this.summary?.expenses_by_category) return [];
    return Object.entries(this.summary.expenses_by_category)
      .map(([name, amount]) => ({
        name,
        amount: amount as number
      }))
      .sort((left, right) => right.amount - left.amount);
  }

  getCategoryPercentage(amount: number): number {
    if (!this.summary?.total_expenses || this.summary.total_expenses === 0) return 0;
    return (amount / this.summary.total_expenses) * 100;
  }

  getCategoryTransactionCount(categoryName: string): number {
    return this.recentTransactions.filter((transaction) => transaction.category === categoryName).length || 1;
  }

  get topCategory(): { name: string; amount: number } | null {
    const categories = this.getCategoryArray();
    return categories.length ? categories[0] : null;
  }
}
