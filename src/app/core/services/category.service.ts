import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  icon?: string;
  type: 'income' | 'expense' | 'both';
  description?: string;
  is_active: number;
  is_system?: number | boolean;
  created_by?: number | null;
}

export interface CategoryCreateDto {
  name: string;
  icon?: string | null;
  type: 'income' | 'expense' | 'both';
  description?: string | null;
}

interface CategoryApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    categories?: Category[];
  } | Category;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8000/categories';
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private availableSubject = new BehaviorSubject<Category[]>([]);
  
  public categories$ = this.categoriesSubject.asObservable();
  public available$ = this.availableSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  // Load categories from API and cache them
  private loadCategories(): void {
    this.http.get<any>(this.apiUrl).subscribe(
      (response) => {
        const categories = this.extractCategories(response);
        if (categories.length) {
          this.categoriesSubject.next(categories);
        }
      },
      (error) => {
        console.error('Error loading categories:', error);
        // Set default categories if API fails
        this.setDefaultCategories();
      }
    );
  }

  /**
   * GET /categories — Lista todas as categorias do utilizador
   * (sistema + categorias selecionadas)
   */
  getAll(): Observable<Category[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap((response) => {
        const categories = this.extractCategories(response);
        if (categories.length) {
          this.categoriesSubject.next(categories);
        }
      }),
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return of(this.categoriesSubject.value);
      })
    );
  }

  /**
   * GET /categories/available — Lista categorias NÃO adicionadas (marketplace)
   */
  listAvailable(): Observable<Category[]> {
    return this.http.get<any>(`${this.apiUrl}/available`).pipe(
      tap((response) => {
        const categories = this.extractCategories(response);
        this.availableSubject.next(categories);
      }),
      catchError((error) => {
        console.error('Error fetching available categories:', error);
        return of([]);
      })
    );
  }

  /**
   * POST /categories — Criar nova categoria global
   * Validação frontend: name (req, max 50), type (req, in:income,expense,both)
   */
  createCategory(payload: CategoryCreateDto): Observable<Category> {
    // Validação frontend
    const errors = this.validateCategory(payload);
    if (errors.length > 0) {
      throw new Error(errors[0]);
    }

    return this.http.post<any>(this.apiUrl, payload).pipe(
      tap((response) => {
        const createdCategory = this.extractSingleCategory(response);
        if (createdCategory) {
          const current = this.categoriesSubject.value;
          this.categoriesSubject.next([createdCategory, ...current]);
          
          // Remove do available se estava lá
          const available = this.availableSubject.value;
          this.availableSubject.next(available.filter(c => c.id !== createdCategory.id));
        }
      }),
      catchError((error) => {
        console.error('Error creating category:', error);
        throw error;
      })
    );
  }

  /**
   * POST /categories/{id}/add — Adicionar categoria existente à lista do utilizador
   */
  addToUser(categoryId: number): Observable<Category> {
    return this.http.post<any>(`${this.apiUrl}/${categoryId}/add`, {}).pipe(
      tap(() => {
        // Move do available para categories
        const available = this.availableSubject.value;
        const toAdd = available.find(c => c.id === categoryId);
        
        if (toAdd) {
          this.availableSubject.next(available.filter(c => c.id !== categoryId));
          const current = this.categoriesSubject.value;
          this.categoriesSubject.next([...current, toAdd]);
        }
      }),
      catchError((error) => {
        console.error('Error adding category:', error);
        throw error;
      })
    );
  }

  /**
   * DELETE /categories/{id}/remove — Remover categoria da lista do utilizador
   */
  removeFromUser(categoryId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${categoryId}/remove`).pipe(
      tap(() => {
        const current = this.categoriesSubject.value;
        const toRemove = current.find(c => c.id === categoryId);
        
        if (toRemove) {
          // Não pode remover sistema (backend já valida, mas check aqui tb)
          if (toRemove.is_system) {
            throw new Error('Cannot remove system categories');
          }
          
          this.categoriesSubject.next(current.filter(c => c.id !== categoryId));
          
          // Se não for sistema, volta para available
          if (!toRemove.is_system) {
            const available = this.availableSubject.value;
            this.availableSubject.next([...available, toRemove]);
          }
        }
      }),
      catchError((error) => {
        console.error('Error removing category:', error);
        throw error;
      })
    );
  }

  /**
   * Filtra categorias do sistema
   */
  getSystemCategories(): Category[] {
    return this.categoriesSubject.value.filter(c => c.is_system);
  }

  /**
   * Filtra categorias adicionadas pelo utilizador
   */
  getUserAddedCategories(): Category[] {
    return this.categoriesSubject.value.filter(c => !c.is_system);
  }

  // Get cached categories
  getCached(): Category[] {
    return this.categoriesSubject.value;
  }

  // Get available cached categories
  getAvailableCached(): Category[] {
    return this.availableSubject.value;
  }

  // Get categories by type
  getByType(type: 'income' | 'expense'): Category[] {
    return this.categoriesSubject.value.filter(c => c.type === type || c.type === 'both');
  }

  /**
   * Validação frontend para categoria
   * Retorna array de erro ou vazio se válido
   */
  private validateCategory(data: CategoryCreateDto): string[] {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Nome da categoria é obrigatório');
    } else if (data.name.length > 50) {
      errors.push('Nome deve ter máximo 50 caracteres');
    }

    if (!data.type || !['income', 'expense', 'both'].includes(data.type)) {
      errors.push('Tipo deve ser: income, expense ou both');
    }

    if (data.description && data.description.length > 255) {
      errors.push('Descrição deve ter máximo 255 caracteres');
    }

    if (data.icon && data.icon.length > 50) {
      errors.push('Ícone deve ter máximo 50 caracteres');
    }

    return errors;
  }

  private extractCategories(response: any): Category[] {
    const data = response?.data;
    if (Array.isArray(data)) {
      return data as Category[];
    }

    if (Array.isArray(data?.categories)) {
      return data.categories as Category[];
    }

    return [];
  }

  private extractSingleCategory(response: any): Category | null {
    const data = response?.data;
    if (data && !Array.isArray(data) && typeof data === 'object' && 'id' in data) {
      return data as Category;
    }

    return null;
  }

  // Set default categories for fallback
  private setDefaultCategories(): void {
    const defaultCategories: Category[] = [
      { id: 1, name: 'Alimentação', type: 'expense', is_active: 1, is_system: 1 },
      { id: 2, name: 'Transporte', type: 'expense', is_active: 1, is_system: 1 },
      { id: 3, name: 'Internet', type: 'expense', is_active: 1, is_system: 1 },
      { id: 4, name: 'Salário', type: 'income', is_active: 1, is_system: 1 },
      { id: 5, name: 'Saúde', type: 'expense', is_active: 1, is_system: 1 },
      { id: 6, name: 'Lazer', type: 'expense', is_active: 1, is_system: 1 },
      { id: 7, name: 'Habitação', type: 'expense', is_active: 1, is_system: 1 },
      { id: 8, name: 'Educação', type: 'expense', is_active: 1, is_system: 1 },
      { id: 9, name: 'Outros', type: 'expense', is_active: 1, is_system: 1 }
    ];
    this.categoriesSubject.next(defaultCategories);
  }
}
