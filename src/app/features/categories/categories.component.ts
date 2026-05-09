import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category, CategoryService } from '../../core/services/category.service';

interface CategoryCard {
  name: string;
  icon: string;
  type: 'income' | 'expense';
  transactions: number;
  amount: number;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="categories-shell">
      <section class="hero-grid">
        <div class="hero-card hero-card-main">
          <div class="hero-topline">
            <div>
              <p class="eyebrow">Gestão de categorias</p>
              <h2 class="page-title">Gerenciamento de Categorias</h2>
              <p class="page-subtitle">Organize os fluxos financeiros com categorias claras, ícones fortes e leitura rápida.</p>
            </div>
            <button type="button" class="hero-action">
              <span class="material-symbols-outlined">add</span>
              Nova Categoria
            </button>
          </div>

          <div class="hero-statline">
            <div class="stat-mini">
              <span class="stat-mini-label">Categorias ativas</span>
              <strong>{{ activeCategories.length }}</strong>
            </div>
            <div class="stat-mini">
              <span class="stat-mini-label">Despesas</span>
              <strong>{{ expenseCategories.length }}</strong>
            </div>
            <div class="stat-mini">
              <span class="stat-mini-label">Receitas</span>
              <strong>{{ incomeCategories.length }}</strong>
            </div>
          </div>
        </div>

        <div class="hero-card hero-card-insight">
          <span class="material-symbols-outlined insight-icon">insights</span>
          <p class="eyebrow light">Insight financeiro</p>
          <h3>Categoria mais pesada</h3>
          <p>
            {{ topCategory?.name || 'Sem dados ainda' }} continua a concentrar a maior fatia do gasto mensal.
            Um ajuste aqui melhora rapidamente o saldo final.
          </p>
          <a routerLink="/dashboard" class="ghost-link">
            Ver dashboard
            <span class="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>
      </section>

      <section class="cards-grid">
        <article class="category-card" *ngFor="let category of categoryCards">
          <div class="card-topline">
            <div class="icon-wrap" [class.expense]="category.type === 'expense'" [class.income]="category.type === 'income'">
              <span class="material-symbols-outlined">{{ category.icon }}</span>
            </div>
            <span class="type-pill" [class.income]="category.type === 'income'">{{ category.type === 'income' ? 'Receita' : 'Despesa' }}</span>
          </div>

          <h3>{{ category.name }}</h3>
          <div class="card-footer">
            <span>{{ category.transactions }} Transações</span>
            <strong [class.income]="category.type === 'income'" [class.expense]="category.type === 'expense'">
              {{ category.type === 'income' ? '+' : '-' }}R$ {{ category.amount | number:'1.2-2' }}
            </strong>
          </div>
        </article>

        <article class="category-card add-card">
          <div class="add-icon-wrap">
            <span class="material-symbols-outlined">add</span>
          </div>
          <h3>Nova Categoria</h3>
          <p>Crie um novo marcador</p>
        </article>
      </section>

      <section class="bottom-grid">
        <article class="panel panel-large">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Distribuição mensal</p>
              <h3>Despesas por categoria</h3>
            </div>
            <span class="panel-total">{{ totalExpenseAmount | number:'1.2-2' }} Kz</span>
          </div>

          <div class="distribution-list">
            <div class="distribution-item" *ngFor="let item of monthlyDistribution">
              <div class="distribution-row">
                <span class="distribution-name">{{ item.name }}</span>
                <span class="distribution-percent">{{ item.percent }}%</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" [class.alt]="item.alt" [style.width.%]="item.percent"></div>
              </div>
            </div>
          </div>
        </article>

        <article class="panel panel-side">
          <div>
            <p class="eyebrow">Atalho</p>
            <h3>Melhor próximo passo</h3>
          </div>

          <div class="summary-stack">
            <div class="summary-row">
              <span>Mais usada</span>
              <strong>{{ topCategory?.name || 'N/D' }}</strong>
            </div>
            <div class="summary-row">
              <span>Tipo dominante</span>
              <strong>{{ expenseCategories.length >= incomeCategories.length ? 'Despesa' : 'Receita' }}</strong>
            </div>
            <div class="summary-row">
              <span>Melhor ação</span>
              <strong>Rever a categoria principal</strong>
            </div>
          </div>

          <div class="mini-card">
            <span class="material-symbols-outlined">category</span>
            <div>
              <p>O controlo por categoria ajuda a identificar onde o orçamento está a ser consumido.</p>
              <a routerLink="/transactions" class="mini-link">Abrir transações</a>
            </div>
          </div>
        </article>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .categories-shell {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.75fr);
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
      margin-bottom: 26px;
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
    .ghost-link,
    .mini-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      font-weight: 600;
      white-space: nowrap;
    }

    .hero-action {
      min-height: 44px;
      padding: 0 16px;
      border-radius: 14px;
      background: var(--sb-primary);
      color: #fff;
      font-size: 14px;
      transition: all 0.15s;
    }

    .hero-action:hover {
      transform: translateY(-1px);
      background: var(--sb-primary-dark);
    }

    .hero-statline {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .stat-mini {
      padding: 18px;
      border-radius: 18px;
      background: var(--sb-surface2);
      border: 1px solid var(--sb-border);
    }

    .stat-mini-label {
      display: block;
      margin-bottom: 10px;
      color: var(--sb-text2);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .stat-mini strong {
      font-family: var(--sb-font-display);
      font-size: 24px;
      letter-spacing: -0.5px;
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
      color: #fff;
      width: fit-content;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }

    .category-card {
      background: var(--sb-surface);
      border-radius: 22px;
      border: 1px solid var(--sb-border);
      padding: 22px;
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.04);
      min-height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
    }

    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
      border-color: rgba(5, 150, 105, 0.28);
    }

    .card-topline {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    .icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: var(--sb-primary-light);
      color: var(--sb-primary);
    }

    .icon-wrap.income {
      background: rgba(16, 185, 129, 0.1);
      color: var(--sb-income);
    }

    .icon-wrap.expense {
      background: rgba(239, 68, 68, 0.1);
      color: var(--sb-expense);
    }

    .type-pill {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      background: var(--sb-surface2);
      color: var(--sb-text2);
      font-size: 12px;
      font-weight: 600;
    }

    .type-pill.income {
      background: rgba(16, 185, 129, 0.08);
      color: var(--sb-income);
    }

    .category-card h3 {
      margin: 18px 0 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.4px;
      color: var(--sb-text);
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-top: 18px;
      font-size: 13px;
      color: var(--sb-text2);
    }

    .card-footer strong {
      font-family: var(--sb-font-display);
      font-size: 15px;
      font-weight: 700;
      white-space: nowrap;
    }

    .card-footer strong.income {
      color: var(--sb-income);
    }

    .card-footer strong.expense {
      color: var(--sb-expense);
    }

    .add-card {
      justify-content: center;
      text-align: center;
      border: 2px dashed rgba(148, 163, 184, 0.55);
      background: var(--sb-surface2);
      box-shadow: none;
      min-height: 160px;
    }

    .add-card:hover {
      border-color: var(--sb-primary);
      background: rgba(209, 250, 229, 0.4);
      transform: none;
    }

    .add-icon-wrap {
      width: 48px;
      height: 48px;
      margin: 0 auto 12px;
      border-radius: 999px;
      background: var(--sb-primary-light);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--sb-primary);
    }

    .add-card h3 {
      margin: 0;
      color: var(--sb-primary);
      font-size: 18px;
    }

    .add-card p {
      margin: 6px 0 0;
      color: var(--sb-text2);
      font-size: 13px;
    }

    .bottom-grid {
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

    .panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.4px;
    }

    .panel-total,
    .mini-link {
      color: var(--sb-primary);
      font-weight: 600;
      text-decoration: none;
      font-size: 14px;
    }

    .distribution-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .distribution-row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      font-size: 14px;
    }

    .distribution-name {
      color: var(--sb-text);
      font-weight: 600;
    }

    .distribution-percent {
      color: var(--sb-text2);
      font-weight: 600;
    }

    .progress-track {
      height: 10px;
      background: var(--sb-surface2);
      border-radius: 999px;
      overflow: hidden;
      margin-top: 8px;
    }

    .progress-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--sb-primary), var(--sb-primary-mid));
    }

    .progress-fill.alt {
      background: linear-gradient(90deg, var(--sb-primary-mid), var(--sb-primary-dark));
    }

    .panel-side {
      display: flex;
      flex-direction: column;
      gap: 18px;
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

    @media (max-width: 1200px) {
      .cards-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .hero-grid,
      .bottom-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .hero-topline {
        flex-direction: column;
      }

      .hero-card,
      .panel,
      .category-card {
        border-radius: 20px;
        padding: 20px;
      }

      .cards-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categoryCards: CategoryCard[] = [];
  monthlyDistribution = [
    { name: 'Alimentação', percent: 42, alt: false },
    { name: 'Moradia', percent: 35, alt: false },
    { name: 'Transporte', percent: 12, alt: true }
  ];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.buildCards();
  }

  get activeCategories(): Category[] {
    return this.categoryService.getCached().filter((category) => category.is_active === 1);
  }

  get expenseCategories(): Category[] {
    return this.activeCategories.filter((category) => category.type === 'expense');
  }

  get incomeCategories(): Category[] {
    return this.activeCategories.filter((category) => category.type === 'income');
  }

  get topCategory(): CategoryCard | null {
    return this.categoryCards.length ? this.categoryCards[0] : null;
  }

  get totalExpenseAmount(): number {
    return this.categoryCards
      .filter((category) => category.type === 'expense')
      .reduce((total, category) => total + category.amount, 0);
  }

  private buildCards(): void {
    const source = this.activeCategories.length ? this.activeCategories : this.getFallbackCategories();
    const counts: Record<string, number> = {
      Alimentação: 14,
      Transporte: 8,
      Lazer: 5,
      Salário: 1,
      Moradia: 3,
      Educação: 2,
      Saúde: 4,
      Internet: 2,
      Outros: 1
    };
    const amounts: Record<string, number> = {
      Alimentação: 1240,
      Transporte: 450,
      Lazer: 320.5,
      Salário: 8500,
      Moradia: 2800,
      Educação: 600,
      Saúde: 180,
      Internet: 120,
      Outros: 95
    };
    const icons: Record<string, string> = {
      Alimentação: 'restaurant',
      Transporte: 'directions_car',
      Lazer: 'movie',
      Salário: 'payments',
      Moradia: 'home',
      Educação: 'school',
      Saúde: 'medical_services',
      Internet: 'wifi',
      Outros: 'category'
    };

    this.categoryCards = source.map((category) => ({
      name: category.name,
      type: category.type,
      icon: category.icon || icons[category.name] || 'category',
      transactions: counts[category.name] || (category.type === 'income' ? 1 : 2),
      amount: amounts[category.name] || (category.type === 'income' ? 1000 : 250)
    }));

    this.categoryCards.sort((left, right) => right.amount - left.amount);
  }

  private getFallbackCategories(): Category[] {
    return [
      { id: 1, name: 'Alimentação', type: 'expense', is_active: 1 },
      { id: 2, name: 'Transporte', type: 'expense', is_active: 1 },
      { id: 3, name: 'Lazer', type: 'expense', is_active: 1 },
      { id: 4, name: 'Salário', type: 'income', is_active: 1 },
      { id: 5, name: 'Moradia', type: 'expense', is_active: 1 },
      { id: 6, name: 'Educação', type: 'expense', is_active: 1 },
      { id: 7, name: 'Saúde', type: 'expense', is_active: 1 }
    ];
  }
}
