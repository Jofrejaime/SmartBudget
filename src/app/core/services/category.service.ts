import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  BehaviorSubject,
  Observable,
  of,
  throwError
} from 'rxjs';

import {
  tap,
  catchError,
  map
} from 'rxjs/operators';

export interface Category {
  id: number;
  name: string;
  icon?: string;
  type: 'income' | 'expense' | 'both';
  description?: string;
  is_active: number;
  created_at?: string;
  updated_at?: string;
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

  data?:
    | {
        categories?: Category[];
      }
    | Category;
}

@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  private apiUrl =
    'http://localhost:8000/categories';

  private categoriesSubject =
    new BehaviorSubject<Category[]>([]);

  public categories$ =
    this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  /**
   * Load inicial
   */
  private loadCategories(): void {

    this.http
      .get<CategoryApiResponse>(this.apiUrl)

      .subscribe({

        next: (response) => {

          const categories =
            this.extractCategories(response);

          this.categoriesSubject.next(
            categories
          );
        },

        error: (error) => {

          console.error(
            'Erro ao carregar categorias:',
            error
          );
        }
      });
  }

  /**
   * GET /categories
   */
  getAll(): Observable<Category[]> {

    return this.http
      .get<CategoryApiResponse>(this.apiUrl)

      .pipe(

        map((response) => {

          const categories =
            this.extractCategories(response);

          this.categoriesSubject.next(
            categories
          );

          return categories;
        }),

        catchError((error) => {

          console.error(
            'Erro ao buscar categorias:',
            error
          );

          return of(
            this.categoriesSubject.value
          );
        })
      );
  }

  /**
   * POST /categories
   */
  createCategory(
    payload: CategoryCreateDto
  ): Observable<Category> {

    const errors =
      this.validateCategory(payload);

    if (errors.length > 0) {
      throw new Error(errors[0]);
    }

    return this.http
      .post<CategoryApiResponse>(
        this.apiUrl,
        payload
      )

      .pipe(

        map((response) => {

          const createdCategory =
            this.extractSingleCategory(response);

          if (!createdCategory) {
            throw new Error(
              'Categoria inválida'
            );
          }

          const current =
            this.categoriesSubject.value;

          this.categoriesSubject.next([
            createdCategory,
            ...current
          ]);

          return createdCategory;
        }),

        catchError((error) => {

          console.error(
            'Erro ao criar categoria:',
            error
          );

          return throwError(
            () => error
          );
        })
      );
  }

  /**
   * DELETE /categories/{id}
   */
  removeFromUser(
    categoryId: number
  ): Observable<void> {

    return this.http
      .delete<void>(
        `${this.apiUrl}/${categoryId}`
      )

      .pipe(

        tap(() => {

          const current =
            this.categoriesSubject.value;

          this.categoriesSubject.next(

            current.filter(
              (category) =>
                category.id !== categoryId
            )
          );
        }),

        catchError((error) => {

          console.error(
            'Erro ao remover categoria:',
            error
          );

          return throwError(
            () => error
          );
        })
      );
  }

  /**
   * Cache local
   */
  getCategories(): Category[] {

    return this.categoriesSubject.value;
  }

  /**
   * Filtra por tipo
   */
  getByType(
    type: 'income' | 'expense'
  ): Category[] {

    return this.categoriesSubject.value.filter(

      (category) =>

        category.type === type ||
        category.type === 'both'
    );
  }

  /**
   * Validação frontend
   */
  private validateCategory(
    data: CategoryCreateDto
  ): string[] {

    const errors: string[] = [];

    if (!data.name?.trim()) {

      errors.push(
        'Nome da categoria é obrigatório'
      );
    }

    if (data.name.length > 50) {

      errors.push(
        'Nome deve ter máximo 50 caracteres'
      );
    }

    if (
      ![
        'income',
        'expense',
        'both'
      ].includes(data.type)
    ) {

      errors.push(
        'Tipo inválido'
      );
    }

    if (
      data.description &&
      data.description.length > 255
    ) {

      errors.push(
        'Descrição deve ter máximo 255 caracteres'
      );
    }

    return errors;
  }

  /**
   * Extrai lista
   */
  private extractCategories(
    response: CategoryApiResponse
  ): Category[] {

    const data = response?.data;

    if (
      data &&
      typeof data === 'object' &&
      'categories' in data &&
      Array.isArray(data.categories)
    ) {

      return data.categories;
    }

    return [];
  }

  /**
   * Extrai item único
   */
  private extractSingleCategory(
    response: CategoryApiResponse
  ): Category | null {

    const data = response?.data;

    if (
      data &&
      typeof data === 'object' &&
      !Array.isArray(data) &&
      'id' in data
    ) {

      return data as Category;
    }

    return null;
  }
}