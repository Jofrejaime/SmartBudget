import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DashboardService } from '../../core/services/dashboard.service';
import {
  TransactionService,
  Transaction
} from '../../core/services/transaction.service';

interface DashboardSummary {
  total_balance: number;

  total_income: number;
  total_expense: number;

  monthly_income: number;
  monthly_expense: number;
  monthly_balance: number;

  month: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    DatePipe,
    RouterLink
  ],
  template: `
    <div class="dashboard-shell">

      <!-- Loading -->
      <div class="loading-badge" *ngIf="isLoading">
        <span class="material-symbols-outlined spin">settings</span>
        A carregar dashboard...
      </div>

      <!-- HERO -->
      <section class="hero-grid">

        <div class="hero-card hero-card-main">

          <div class="hero-topline">

            <div>
              <p class="eyebrow">Resumo financeiro</p>

              <h2 class="page-title">
                Dashboard Financeiro
              </h2>

              <p class="page-subtitle">
                Controle completo das suas finanças.
              </p>
            </div>

            <a
              routerLink="/transactions/create"
              class="hero-action"
            >
              <span class="material-symbols-outlined">add</span>
              Nova Transação
            </a>

          </div>

          <!-- TOTAL BALANCE -->
          <div class="balance-block">

            <p class="balance-label">
              Saldo Total
            </p>

            <div
              class="balance-value"
              [class.positive]="summary.total_balance >= 0"
              [class.negative]="summary.total_balance < 0"
            >
              {{ summary.total_balance | number:'1.2-2' }} Kz
            </div>

            <div class="balance-meta">

              <div class="meta-pill income-pill">
                <span class="material-symbols-outlined">
                  trending_up
                </span>

                Receita:
                {{ summary.total_income | number:'1.2-2' }} Kz
              </div>

              <div class="meta-pill expense-pill">
                <span class="material-symbols-outlined">
                  trending_down
                </span>

                Despesa:
                {{ summary.total_expense | number:'1.2-2' }} Kz
              </div>

            </div>

          </div>

        </div>

        <!-- MONTHLY -->
        <div class="hero-card hero-card-insight">

          <span class="material-symbols-outlined insight-icon">
            calendar_month
          </span>

          <p class="eyebrow light">
            Resumo Mensal
          </p>

          <h3>{{ summary.month }}</h3>

          <div class="monthly-metrics">

            <div class="metric">
              <span>Receitas</span>

              <strong class="income">
                {{ summary.monthly_income | number:'1.2-2' }} Kz
              </strong>
            </div>

            <div class="metric">
              <span>Despesas</span>

              <strong class="expense">
                {{ summary.monthly_expense | number:'1.2-2' }} Kz
              </strong>
            </div>

            <div class="metric">
              <span>Saldo</span>

              <strong
                [class.income]="summary.monthly_balance >= 0"
                [class.expense]="summary.monthly_balance < 0"
              >
                {{ summary.monthly_balance | number:'1.2-2' }} Kz
              </strong>
            </div>

          </div>

        </div>

      </section>

      <!-- STATS -->
      <section class="stats-grid">

        <article class="stat-card">

          <p class="stat-label">
            Receita Total
          </p>

          <div class="stat-value income">
            {{ summary.total_income | number:'1.2-2' }} Kz
          </div>

          <p class="stat-caption">
            Total de entradas financeiras
          </p>

        </article>

        <article class="stat-card">

          <p class="stat-label">
            Despesa Total
          </p>

          <div class="stat-value expense">
            {{ summary.total_expense | number:'1.2-2' }} Kz
          </div>

          <p class="stat-caption">
            Total de saídas financeiras
          </p>

        </article>

        <article class="stat-card">

          <p class="stat-label">
            Saldo Mensal
          </p>

          <div
            class="stat-value"
            [class.income]="summary.monthly_balance >= 0"
            [class.expense]="summary.monthly_balance < 0"
          >
            {{ summary.monthly_balance | number:'1.2-2' }} Kz
          </div>

          <p class="stat-caption">
            Resultado financeiro do mês atual
          </p>

        </article>

      </section>

      <!-- RECENT TRANSACTIONS -->
      <section class="transactions-panel">

        <div class="panel-header">

          <div>
            <p class="eyebrow">Movimentos recentes</p>

            <h3>Últimas Transações</h3>
          </div>

          <a
            routerLink="/transactions"
            class="panel-link"
          >
            Ver tudo
          </a>

        </div>

        <!-- EMPTY -->
        <div
          class="empty-state"
          *ngIf="recentTransactions.length === 0"
        >
          <span class="material-symbols-outlined">
            receipt_long
          </span>

          <p>Nenhuma transação encontrada.</p>
        </div>

        <!-- TABLE -->
        <div
          class="transactions-table"
          *ngIf="recentTransactions.length > 0"
        >

          <div class="transactions-head">
            <span>Data</span>
            <span>Descrição</span>
            <span>Tipo</span>
            <span class="align-right">Valor</span>
          </div>

          <div
            class="transaction-row"
            *ngFor="let txn of recentTransactions"
          >

            <div class="txn-date">
              {{ txn.date | date:'dd/MM/yyyy' }}
            </div>

            <div class="txn-desc">

              <span
                class="txn-icon"
                [class.expense]="txn.type === 'expense'"
                [class.income]="txn.type === 'income'"
              >
                <span class="material-symbols-outlined">

                  {{
                    txn.type === 'income'
                      ? 'trending_up'
                      : 'trending_down'
                  }}

                </span>
              </span>

              <div>

                <p class="txn-title">
                  {{ txn.description }}
                </p>

                <p class="txn-subtitle">
                  {{ txn.notes || 'Sem observações' }}
                </p>

              </div>

            </div>

            <div>
              <span
                class="txn-badge"
                [class.income]="txn.type === 'income'"
                [class.expense]="txn.type === 'expense'"
              >
                {{
                  txn.type === 'income'
                    ? 'Receita'
                    : 'Despesa'
                }}
              </span>
            </div>

            <div
              class="txn-amount"
              [class.income]="txn.type === 'income'"
              [class.expense]="txn.type === 'expense'"
            >
              {{
                txn.type === 'income'
                  ? '+'
                  : '-'
              }}

              {{ txn.amount | number:'1.2-2' }} Kz
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
    }

    .loading-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 12px;
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      color: var(--sb-text2);
      font-weight: 600;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .hero-card {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: 24px;
      padding: 28px;
    }

    .hero-topline {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 24px;
    }

    .eyebrow {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--sb-primary);
      margin-bottom: 8px;
    }

    .eyebrow.light {
      color: rgba(255,255,255,0.8);
    }

    .page-title {
      margin: 0;
      font-size: 30px;
      font-weight: 800;
    }

    .page-subtitle {
      margin-top: 10px;
      color: var(--sb-text2);
    }

    .hero-action {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--sb-primary);
      color: white;
      padding: 12px 18px;
      border-radius: 14px;
      text-decoration: none;
      font-weight: 600;
    }

    .balance-label {
      color: var(--sb-text2);
      margin-bottom: 10px;
    }

    .balance-value {
      font-size: 42px;
      font-weight: 800;
    }

    .balance-value.positive {
      color: var(--sb-income);
    }

    .balance-value.negative {
      color: var(--sb-danger);
    }

    .balance-meta {
      display: flex;
      gap: 12px;
      margin-top: 18px;
      flex-wrap: wrap;
    }

    .meta-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
    }

    .income-pill {
      background: rgba(16,185,129,0.12);
      color: var(--sb-income);
    }

    .expense-pill {
      background: rgba(239,68,68,0.12);
      color: var(--sb-danger);
    }

    .hero-card-insight {
      background: linear-gradient(
        135deg,
        var(--sb-primary),
        var(--sb-primary-dark)
      );

      color: white;
    }

    .insight-icon {
      font-size: 42px;
      margin-bottom: 20px;
    }

    .monthly-metrics {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 20px;
    }

    .metric {
      display: flex;
      justify-content: space-between;
    }

    .metric strong.income {
      color: #bbf7d0;
    }

    .metric strong.expense {
      color: #fecaca;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .stat-card {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: 20px;
      padding: 24px;
    }

    .stat-label {
      color: var(--sb-text2);
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .stat-value {
      font-size: 30px;
      font-weight: 800;
    }

    .stat-value.income {
      color: var(--sb-income);
    }

    .stat-value.expense {
      color: var(--sb-danger);
    }

    .transactions-panel {
      background: var(--sb-surface);
      border: 1px solid var(--sb-border);
      border-radius: 24px;
      padding: 24px;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .panel-link {
      color: var(--sb-primary);
      text-decoration: none;
      font-weight: 700;
    }

    .transactions-head,
    .transaction-row {
      display: grid;
      grid-template-columns:
        120px
        1fr
        140px
        160px;

      gap: 16px;
      align-items: center;
    }

    .transactions-head {
      padding-bottom: 14px;
      border-bottom: 1px solid var(--sb-border);
      font-size: 12px;
      font-weight: 700;
      color: var(--sb-text2);
      text-transform: uppercase;
    }

    .transaction-row {
      padding: 18px 0;
      border-bottom: 1px solid var(--sb-border);
    }

    .txn-desc {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .txn-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--sb-primary-light);
      color: var(--sb-primary);
    }

    .txn-icon.income {
      background: rgba(16,185,129,0.12);
      color: var(--sb-income);
    }

    .txn-icon.expense {
      background: rgba(239,68,68,0.12);
      color: var(--sb-danger);
    }

    .txn-title {
      margin: 0;
      font-weight: 700;
    }

    .txn-subtitle {
      margin-top: 4px;
      color: var(--sb-text2);
      font-size: 12px;
    }

    .txn-badge {
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
    }

    .txn-badge.income {
      background: rgba(16,185,129,0.12);
      color: var(--sb-income);
    }

    .txn-badge.expense {
      background: rgba(239,68,68,0.12);
      color: var(--sb-danger);
    }

    .txn-amount {
      text-align: right;
      font-weight: 800;
    }

    .txn-amount.income {
      color: var(--sb-income);
    }

    .txn-amount.expense {
      color: var(--sb-danger);
    }

    .align-right {
      text-align: right;
    }

    .empty-state {
      padding: 40px;
      text-align: center;
      color: var(--sb-text2);
    }

    .empty-state .material-symbols-outlined {
      font-size: 48px;
      margin-bottom: 12px;
      opacity: 0.5;
    }

    @media (max-width: 900px) {

      .hero-grid,
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .hero-topline {
        flex-direction: column;
      }

      .transactions-head {
        display: none;
      }

      .transaction-row {
        grid-template-columns: 1fr;
      }

      .txn-amount {
        text-align: left;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {

  summary: DashboardSummary = {
    total_balance: 0,

    total_income: 0,
    total_expense: 0,

    monthly_income: 0,
    monthly_expense: 0,
    monthly_balance: 0,

    month: ''
  };

  recentTransactions: Transaction[] = [];

  isLoading = true;

  constructor(
    private dashboardService: DashboardService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadRecentTransactions();
  }

  loadDashboard(): void {

    this.dashboardService.getSummary().subscribe({

      next: (response) => {

        if (response.success && response.data) {
          this.summary = response.data;
        }

        this.isLoading = false;
      },

      error: (err) => {

        console.error('Dashboard Error:', err);

        this.isLoading = false;
      }

    });

  }

  loadRecentTransactions(): void {

    this.transactionService.list({
      limit: 5,
      offset: 0
    }).subscribe({

      next: (response) => {

        if (response.success && response.data) {
          this.recentTransactions =
            response.data.transactions;
        }

      },

      error: (err) => {
        console.error('Transactions Error:', err);
      }

    });

  }
}
