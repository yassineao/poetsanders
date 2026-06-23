import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface RefreshResponse {
  accessToken: string;
}

@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly refreshSubject = new BehaviorSubject<string | null>(null);
  private isRefreshing = false;
  private accessToken: string | null = null;

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (this.resetsAuthentication(req.url)) {
      this.accessToken = null;
    }

    const request = this.withAccessToken(req, this.accessToken);
    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !this.isAuthenticationRequest(req.url)
        ) {
          return this.handleUnauthorized(req, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private handleUnauthorized(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.accessToken = null;
      this.refreshSubject.next(null);

      return this.refreshToken().pipe(
        switchMap((token) => {
          this.isRefreshing = false;
          this.accessToken = token;
          this.refreshSubject.next(token);
          return next.handle(this.withAccessToken(req, token));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.accessToken = null;
          this.refreshSubject.next(null);
          return throwError(() => error);
        }),
      );
    }

    return this.refreshSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
      switchMap((token) => next.handle(this.withAccessToken(req, token))),
    );
  }

  private refreshToken(): Observable<string> {
    return new Observable((observer) => {
      fetch(`${this.apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error('Token refresh failed');
          }

          const body = (await response.json()) as RefreshResponse;
          if (!body.accessToken) {
            throw new Error('Refresh response did not include an access token');
          }

          observer.next(body.accessToken);
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  private withAccessToken(
    request: HttpRequest<unknown>,
    token: string | null,
  ): HttpRequest<unknown> {
    return token
      ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : request;
  }

  private isAuthenticationRequest(url: string): boolean {
    return ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'].some((path) =>
      url.includes(path),
    );
  }

  private resetsAuthentication(url: string): boolean {
    return ['/auth/login', '/auth/register', '/auth/logout'].some((path) => url.includes(path));
  }
}
