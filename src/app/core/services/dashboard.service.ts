import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface DashboardSummary {
  total_income: number;
  total_expenses: number;
  balance: number;
  expenses_by_category?: { [key: string]: number };
  monthly_income?: number;
  monthly_expenses?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8000/dashboard/summary';
  private summarySubject = new BehaviorSubject<DashboardSummary | null>(null);
  public summary$ = this.summarySubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get dashboard summary
  getSummary(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.summarySubject.next(response.data);
        }
      })
    );
  }

  // Get cached summary
  getCached(): DashboardSummary | null {
    return this.summarySubject.value;
  }

  // Refresh dashboard data
  refresh(): Observable<any> {
    return this.getSummary();
  }
}
