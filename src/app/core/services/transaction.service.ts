import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

export interface TransactionListResponse {
  success: boolean;
  message: string;
  data: {
    transactions: Transaction[];
    pagination: {
      total_count: number;
      limit: number;
      offset: number;
      current_page: number;
      total_pages: number;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost/smartbudget-api/api/transactions';

  constructor(private http: HttpClient) {}

  // List all transactions with filtering
  list(params?: {
    limit?: number;
    offset?: number;
    type?: 'income' | 'expense';
    category_id?: number;
    start?: string;
    end?: string;
  }): Observable<TransactionListResponse> {
    let url = this.apiUrl;
    if (params) {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.set('limit', params.limit.toString());
      if (params.offset) queryParams.set('offset', params.offset.toString());
      if (params.type) queryParams.set('type', params.type);
      if (params.category_id) queryParams.set('category_id', params.category_id.toString());
      if (params.start) queryParams.set('start', params.start);
      if (params.end) queryParams.set('end', params.end);
      if (queryParams.toString()) url += '?' + queryParams.toString();
    }
    return this.http.get<TransactionListResponse>(url);
  }

  // Get single transaction
  get(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create transaction
  create(data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Update transaction
  update(id: number, data: Partial<Transaction>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Delete transaction
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Export transactions to CSV
  export(startDate?: string, endDate?: string): Observable<Blob> {
    let url = `${this.apiUrl}/export`;
    const params = new URLSearchParams();
    if (startDate) params.set('start', startDate);
    if (endDate) params.set('end', endDate);
    if (params.toString()) url += '?' + params.toString();
    
    return this.http.get(url, { responseType: 'blob' });
  }
}
