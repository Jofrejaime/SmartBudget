import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  BehaviorSubject
} from 'rxjs';

import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;

  data: {
    token: string;
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl =
    'http://localhost:8000';

  private tokenKey =
    'sb_token';

  private userKey =
    'sb_user';

  private currentUserSubject =
    new BehaviorSubject<User | null>(
      this.getCurrentUser()
    );

  public currentUser$ =
    this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {

    this.checkAuthStatus();
  }

  /* =========================
     AUTH
  ========================= */

  register(
    name: string,
    email: string,
    password: string
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/auth/register`,
      {
        name,
        email,
        password
      }
    );
  }

  login(
    email: string,
    password: string
  ): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`,
      {
        email,
        password
      }
    ).pipe(

      tap((response) => {

        if (
          response.success &&
          response.data?.token
        ) {

          localStorage.setItem(
            this.tokenKey,
            response.data.token
          );

          localStorage.setItem(
            this.userKey,
            JSON.stringify(
              response.data.user
            )
          );

          this.currentUserSubject.next(
            response.data.user
          );
        }
      })
    );
  }

  logout(): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/auth/logout`,
      {}
    ).pipe(

      tap(() => {

        localStorage.removeItem(
          this.tokenKey
        );

        localStorage.removeItem(
          this.userKey
        );

        this.currentUserSubject.next(
          null
        );
      })
    );
  }

  /* =========================
     PROFILE
  ========================= */

  getProfile(): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/user/profile`
    );
  }

updateProfile(data: {
  name?: string;
  email?: string;
}): Observable<any> {

  return this.http.put(
    `${this.apiUrl}/user/profile`,
    data
  ).pipe(

    tap((response: any) => {

      if (response?.data) {

        localStorage.setItem(
          'sb_user',
          JSON.stringify(response.data)
        );

        this.currentUserSubject.next(
          response.data
        );
      }
    })
  );
}
  changePassword(data: {
    current_password: string;
    new_password: string;
  }): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/user/change-password`,
      data
    );
  }

  deleteAccount(password: string): Observable<any> {

    return this.http.request(
      'DELETE',
      `${this.apiUrl}/user`,
      {
        body: { password }
      }
    );
  }

  /* =========================
     TOKEN
  ========================= */

  getToken(): string | null {

    return localStorage.getItem(
      this.tokenKey
    );
  }

  isAuthenticated(): boolean {

    return !!this.getToken();
  }

  /* =========================
     USER
  ========================= */

  getCurrentUser(): User | null {

    try {

      const userJson =
        localStorage.getItem(
          this.userKey
        );

      return userJson
        ? JSON.parse(userJson)
        : null;

    } catch {

      return null;
    }
  }

  setCurrentUser(user: User): void {

    localStorage.setItem(
      this.userKey,
      JSON.stringify(user)
    );

    this.currentUserSubject.next(
      user
    );
  }

  /* =========================
     INIT
  ========================= */

  private checkAuthStatus(): void {

    const user =
      this.getCurrentUser();

    this.currentUserSubject.next(
      user
    );
  }
}