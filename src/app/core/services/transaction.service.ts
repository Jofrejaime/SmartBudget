import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

/* =========================
 * INTERFACES
 * ========================= */

export interface Transaction {

  id?: number;

  user_id?: number;

  category_id: number;

  type: 'income' | 'expense';

  amount: number;

  description: string;

  date: string;

  notes?: string;

  created_at?: string;

  updated_at?: string;
}

export interface Pagination {

  total_count: number;

  limit: number;

  offset: number;

  current_page: number;

  total_pages: number;
}

export interface TransactionListData {

  transactions: Transaction[];

  pagination: Pagination;
}

export interface ApiResponse<T = any> {

  success: boolean;

  message: string;

  data: T;
}

export interface TransactionListResponse
  extends ApiResponse<TransactionListData> {}


/* =========================
 * SERVICE
 * ========================= */

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

private apiUrl = 'http://localhost:8000/transactions';

  constructor(
    private http: HttpClient
  ) {}

  /* =========================
   * LISTAR TRANSAÇÕES
   * ========================= */

  list(params?: {
    limit?: number;
    offset?: number;
    type?: 'income' | 'expense';
    category_id?: number;
    start?: string;
    end?: string;
  }): Observable<TransactionListResponse> {

    let httpParams = new HttpParams();

    if (params?.limit !== undefined) {
      httpParams =
        httpParams.set(
          'limit',
          params.limit.toString()
        );
    }

    if (params?.offset !== undefined) {
      httpParams =
        httpParams.set(
          'offset',
          params.offset.toString()
        );
    }

    if (params?.type) {
      httpParams =
        httpParams.set(
          'type',
          params.type
        );
    }

    if (params?.category_id) {
      httpParams =
        httpParams.set(
          'category_id',
          params.category_id.toString()
        );
    }

    if (params?.start) {
      httpParams =
        httpParams.set(
          'start',
          params.start
        );
    }

    if (params?.end) {
      httpParams =
        httpParams.set(
          'end',
          params.end
        );
    }

    return this.http.get<TransactionListResponse>(
      this.apiUrl,
      {
        params: httpParams
      }
    );
  }

  /* =========================
   * BUSCAR UMA TRANSAÇÃO
   * ========================= */

  get(
    id: number
  ): Observable<ApiResponse<Transaction>> {

    return this.http.get<
      ApiResponse<Transaction>
    >(
      `${this.apiUrl}/${id}`
    );
  }

  /* =========================
   * CRIAR TRANSAÇÃO
   * ========================= */

  create(
    data: Omit<
      Transaction,
      'id' |
      'user_id' |
      'created_at' |
      'updated_at'
    >
  ): Observable<ApiResponse<Transaction>> {

    return this.http.post<
      ApiResponse<Transaction>
    >(
      this.apiUrl,
      data
    );
  }

  /* =========================
   * ACTUALIZAR TRANSAÇÃO
   * ========================= */

  update(
    id: number,
    data: Partial<Transaction>
  ): Observable<ApiResponse<Transaction>> {

    return this.http.put<
      ApiResponse<Transaction>
    >(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  /* =========================
   * DELETAR TRANSAÇÃO
   * ========================= */

  delete(
    id: number
  ): Observable<ApiResponse> {

    return this.http.delete<ApiResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  /* =========================
   * EXPORTAR CSV
   * ========================= */

  export(
    startDate?: string,
    endDate?: string
  ): Observable<Blob> {

    let params = new HttpParams();

    if (startDate) {
      params =
        params.set(
          'start',
          startDate
        );
    }

    if (endDate) {
      params =
        params.set(
          'end',
          endDate
        );
    }

    return this.http.get(
      `${this.apiUrl}/export`,
      {
        params,
        responseType: 'blob'
      }
    );
  }
}
