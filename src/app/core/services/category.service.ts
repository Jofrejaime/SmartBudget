import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Category {
  id: number;
  name: string;
  icon?: string;
  type: 'income' | 'expense';
  description?: string;
  is_active: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost/smartbudget-api/api/categories';
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  // Load categories from API and cache them
  private loadCategories(): void {
    this.http.get<any>(this.apiUrl).subscribe(
      (response) => {
        if (response.success && response.data) {
          this.categoriesSubject.next(response.data);
        }
      },
      (error) => {
        console.error('Error loading categories:', error);
        // Set default categories if API fails
        this.setDefaultCategories();
      }
    );
  }

  // Get all categories
  getAll(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.categoriesSubject.next(response.data);
        }
      })
    );
  }

  // Get cached categories
  getCached(): Category[] {
    return this.categoriesSubject.value;
  }

  // Get categories by type
  getByType(type: 'income' | 'expense'): Category[] {
    return this.categoriesSubject.value.filter(c => c.type === type);
  }

  // Set default categories for fallback
  private setDefaultCategories(): void {
    const defaultCategories: Category[] = [
      { id: 1, name: 'Alimentação', type: 'expense', is_active: 1 },
      { id: 2, name: 'Transporte', type: 'expense', is_active: 1 },
      { id: 3, name: 'Internet', type: 'expense', is_active: 1 },
      { id: 4, name: 'Salário', type: 'income', is_active: 1 },
      { id: 5, name: 'Saúde', type: 'expense', is_active: 1 },
      { id: 6, name: 'Lazer', type: 'expense', is_active: 1 },
      { id: 7, name: 'Habitação', type: 'expense', is_active: 1 },
      { id: 8, name: 'Educação', type: 'expense', is_active: 1 },
      { id: 9, name: 'Outros', type: 'expense', is_active: 1 }
    ];
    this.categoriesSubject.next(defaultCategories);
  }
}
