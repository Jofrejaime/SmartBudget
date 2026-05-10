import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'sb_token';

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { name, email, password });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${this.apiUrl}/auth/login`;
    console.log('[AuthService] Login attempt to:', url, { email });
    
    return this.http.post<LoginResponse>(url, { email, password }).pipe(
      tap(response => {
        console.log('[AuthService] Login successful:', response);
        if (response.data && response.data.token) {
          localStorage.setItem(this.tokenKey, response.data.token);
          localStorage.setItem('sb_user', JSON.stringify(response.data.user));
          this.currentUserSubject.next(response.data.user);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem('sb_user');
        this.currentUserSubject.next(null);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    try {
      const userJson = localStorage.getItem('sb_user');
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  private checkAuthStatus(): void {
    const user = this.getCurrentUser();
    this.currentUserSubject.next(user);
  }
}
