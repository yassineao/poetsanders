import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

/**
 * HttpInterceptor that automatically refreshes expired access tokens.
 *
 * When a 401 response is received:
 * 1. Call `/auth/refresh` to obtain a new access token
 * 2. Retry the original request with the new token
 * 3. If refresh fails, allow the 401 to propagate (user must login again)
 *
 * Multiple simultaneous 401s are handled by queuing requests until
 * a single refresh completes.
 */
@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly authService = inject(AuthService);

  // Tracks whether a refresh is in progress
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<void>(undefined);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error) => {
        // Only intercept 401 Unauthorized responses
        if (error instanceof HttpErrorResponse && error.status === 401) {
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
    // Skip refresh for refresh endpoint itself (prevent infinite loop)
    if (req.url.includes('/auth/refresh')) {
      return throwError(() => new Error('Token refresh failed'));
    }

    // If not already refreshing, start the refresh process
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.refreshToken().pipe(
        switchMap(() => {
          this.isRefreshing = false;
          this.refreshSubject.next(undefined); // Notify waiting requests
          return next.handle(req); // Retry original request
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.clearCurrentUser();
          return throwError(() => err);
        }),
      );
    }

    // If refresh is already in progress, wait for it to complete then retry
    return this.refreshSubject.pipe(
      filter(() => !this.isRefreshing),
      take(1),
      switchMap(() => next.handle(req)),
    );
  }

  private refreshToken(): Observable<void> {
    return new Observable((observer) => {
      // Use fetch instead of HttpClient to avoid interceptor loop
      fetch(`${this.apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Include cookies
      })
        .then((response) => {
          if (response.ok) {
            observer.next(undefined);
            observer.complete();
          } else {
            observer.error(new Error('Token refresh failed'));
          }
        })
        .catch((err) => {
          observer.error(err);
        });
    });
  }
}
