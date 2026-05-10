import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category, CategoryService } from '../../core/services/category.service';

interface CategoryCard {
  name: string;
  icon: string;
  type: 'income' | 'expense' | 'both';
  transactions: number;
  amount: number;
}

interface DistributionItem {
  name: string;
  percent: number;
  accent?: 'primary' | 'secondary';
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  systemCategories: Category[] = [];
  userAddedCategories: Category[] = [];

  categoryCards: CategoryCard[] = [];
  monthlyDistribution: DistributionItem[] = [];

  showCreateModal = false;
  saving = false;
  formError = '';

  categoryForm = {
    name: '',
    icon: 'category',
    type: 'expense' as 'income' | 'expense' | 'both',
    description: ''
  };

  private readonly subscriptions = new Subscription();

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.categoryService.categories$.subscribe(() => {
        this.syncCategoriesFromCache();
        this.rebuildView();
      })
    );

    this.categoryService.getAll().subscribe({
      error: () => {
        this.syncCategoriesFromCache();
        this.rebuildView();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get activeCategories(): Category[] {
    return [...this.systemCategories, ...this.userAddedCategories].filter((c) => c.is_active !== 0);
  }

  get expenseCategories(): Category[] {
    return this.activeCategories.filter((c) => c.type === 'expense');
  }

  get incomeCategories(): Category[] {
    return this.activeCategories.filter((c) => c.type === 'income');
  }

  get topCategory(): CategoryCard | null {
    return this.categoryCards[0] ?? null;
  }

  get totalExpenseAmount(): number {
    return this.categoryCards
      .filter((c) => c.type === 'expense')
      .reduce((total, c) => total + c.amount, 0);
  }

  openCreateModal(): void {
    this.formError = '';
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    if (this.saving) {
      return;
    }

    this.showCreateModal = false;
    this.formError = '';
  }

  submitCategory(): void {
    const name = this.categoryForm.name.trim();
    const icon = this.categoryForm.icon.trim() || 'category';
    const description = this.categoryForm.description.trim();

    if (!name) {
      this.formError = 'O nome da categoria e obrigatorio';
      return;
    }

    this.saving = true;
    this.formError = '';

    this.categoryService.createCategory({
      name,
      icon,
      type: this.categoryForm.type,
      description: description || undefined
    }).subscribe({
      next: () => {
        this.saving = false;
        this.showCreateModal = false;
        this.categoryForm = {
          name: '',
          icon: 'category',
          type: 'expense',
          description: ''
        };
      },
      error: (error: any) => {
        this.saving = false;
        this.formError = error?.error?.message || error?.message || 'Erro ao criar categoria';
      }
    });
  }

  removeCategory(category: Category): void {
    if (!confirm(`Remover categoria "${category.name}" da sua lista?`)) {
      return;
    }

    this.categoryService.removeFromUser(category.id).subscribe({
      error: (error: any) => {
        const message = error?.error?.message || error?.message || 'Erro ao remover categoria';
        alert(message);
      }
    });
  }

  private syncCategoriesFromCache(): void {
    this.systemCategories = this.categoryService.getSystemCategories();
    this.userAddedCategories = this.categoryService.getUserAddedCategories();
  }

  private rebuildView(): void {
    this.categoryCards = this.activeCategories.map((category) => ({
      name: category.name,
      icon: category.icon || 'category',
      type: category.type,
      transactions: 0,
      amount: 0
    }));

    this.buildDistribution();
  }

  private buildDistribution(): void {
    const expenseCards = this.categoryCards
      .filter((category) => category.type === 'expense')
      .slice(0, 3);

    if (!expenseCards.length) {
      this.monthlyDistribution = [];
      return;
    }

    const total = expenseCards.reduce((sum, category) => sum + category.amount, 0) || 1;
    this.monthlyDistribution = expenseCards.map((category, index) => ({
      name: category.name,
      percent: Math.round((category.amount / total) * 100),
      accent: index === 2 ? 'secondary' : 'primary'
    }));
  }
}
