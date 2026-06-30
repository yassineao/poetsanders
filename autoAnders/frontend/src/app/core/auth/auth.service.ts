import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser } from '../interfaces/AuthUser';
import { LoginCredentials } from '../interfaces/loginCridentials';
import { RegisterCredentials } from '../interfaces/registerCredentials';
import { UpdateProfileRequest } from '../interfaces/updateProfile';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  readonly currentUser = signal<AuthUser | null>(null);

  clearCurrentUser(): void {
    this.currentUser.set(null);
  }

  login(credentials: LoginCredentials): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(`${this.apiBaseUrl}/auth/login`, credentials, { withCredentials: true })
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  me(): Observable<AuthUser> {
    return this.http
      .get<AuthUser>(`${this.apiBaseUrl}/auth/me`, { withCredentials: true })
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  register(credentials: RegisterCredentials): Observable<AuthUser> {
    return this.http
      .post<AuthUser>(`${this.apiBaseUrl}/auth/register`, credentials, { withCredentials: true })
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  updateProfile(profile: UpdateProfileRequest): Observable<AuthUser> {
    return this.http
      .patch<AuthUser>(`${this.apiBaseUrl}/auth/update`, profile, { withCredentials: true })
      .pipe(tap((user) => this.currentUser.set(user)));
  }

  logout(): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(`${this.apiBaseUrl}/auth/logout`, null, { withCredentials: true })
      .pipe(tap(() => this.currentUser.set(null)));
  }
}
