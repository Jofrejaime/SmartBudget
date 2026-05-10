import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  Category,
  CategoryService
} from '../../core/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  categories: Category[] = [];

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
      })
    );

    this.categoryService.getAll().subscribe({
      next: () => {
        this.syncCategoriesFromCache();
      },
      error: () => {
        this.syncCategoriesFromCache();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get activeCategories(): Category[] {
    return this.categories.filter(
      (category) => category.is_active !== 0
    );
  }

  get expenseCategories(): Category[] {
    return this.activeCategories.filter(
      (category) => category.type === 'expense'
    );
  }

  get incomeCategories(): Category[] {
    return this.activeCategories.filter(
      (category) => category.type === 'income'
    );
  }

  get bothCategories(): Category[] {
    return this.activeCategories.filter(
      (category) => category.type === 'both'
    );
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

  this.categoryForm = {
    name: '',
    icon: 'category',
    type: 'expense',
    description: ''
  };
}

 submitCategory(): void {

  const name = this.categoryForm.name.trim();
  const icon = this.categoryForm.icon.trim() || 'category';
  const description = this.categoryForm.description.trim();

  if (!name) {
    this.formError = 'O nome da categoria é obrigatório';
    return;
  }

  this.saving = true;
  this.formError = '';

  this.categoryService.createCategory({
    name,
    icon,
    type: this.categoryForm.type,
    description: description || undefined
  })
  .subscribe({

    next: () => {

      this.saving = false;

      this.categoryForm = {
        name: '',
        icon: 'category',
        type: 'expense',
        description: ''
      };

      this.showCreateModal = false;
      this.formError = '';
    },

    error: (error: any) => {

      this.saving = false;

      this.formError =
        error?.error?.message ||
        error?.message ||
        'Erro ao criar categoria';
    }
  });
}

  removeCategory(category: Category): void {
    const confirmed = confirm(
      `Arquivar categoria "${category.name}"?`
    );

    if (!confirmed) {
      return;
    }

    this.categoryService.removeFromUser(category.id).subscribe({
      error: (error: any) => {
        const message =
          error?.error?.message ||
          error?.message ||
          'Erro ao arquivar categoria';

        alert(message);
      }
    });
  }

  trackByCategory(index: number, category: Category): number {
    return category.id;
  }

  private syncCategoriesFromCache(): void {
    this.categories = this.categoryService.getCategories();
  }
}
