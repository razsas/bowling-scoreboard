import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../models/user.models';
import { environment } from '../../environments/environments';
import { EndPoints } from '../constants/game.constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  // --- State ---
  private readonly _currentUser = signal<User | null>(null);
  // --- Selectors ---
  public readonly currentUser = this._currentUser.asReadonly();

  constructor() {
    const storedUser = localStorage.getItem(environment.storageKey);
    if (storedUser) {
      try {
        this._currentUser.set(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(environment.storageKey);
      }
    }
  }

  // --- Public API ---

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<User>(`${environment.apiUrl}${EndPoints.Login}`, request)
      .pipe(
        map((user) => {
          this._currentUser.set(user);
          localStorage.setItem(environment.storageKey, JSON.stringify(user));
          return { isSuccess: true, user };
        }),
        catchError((err) =>
          of({
            isSuccess: false,
            message:
              typeof err.error === 'string'
                ? err.error
                : err.error?.message || 'Login failed',
          })
        )
      );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<User>(`${environment.apiUrl}${EndPoints.Register}`, request)
      .pipe(
        map((user) => {
          this._currentUser.set(user);
          localStorage.setItem(environment.storageKey, JSON.stringify(user));
          return { isSuccess: true, user };
        }),
        catchError((err) =>
          of({
            isSuccess: false,
            message:
              typeof err.error === 'string'
                ? err.error
                : err.error?.message || 'Registration failed',
          })
        )
      );
  }

  logout(): void {
    this.http
      .post(
        `${environment.apiUrl}${EndPoints.Logout}`,
        {},
        { withCredentials: true }
      )
      .subscribe({
        next: () => {
          this._currentUser.set(null);
          localStorage.removeItem(environment.storageKey);
        },
        error: () => {
          this._currentUser.set(null);
          localStorage.removeItem(environment.storageKey);
        },
      });
  }
}
