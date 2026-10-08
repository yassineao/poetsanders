import { HttpBackend, HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  private readonly authService = inject(AuthService);
  // Bypass interceptors so refresh cannot recursively refresh itself.
  private readonly refreshClient = new HttpClient(inject(HttpBackend));
  private refreshRequest?: Observable<unknown>;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const path = req.url.split(/[?#]/)[0];
    const isApiRequest = path.startsWith(`${this.apiBaseUrl}/`);
    const isSessionEndpoint = ['login', 'register', 'refresh', 'logout', 'profile-access']
      .some(endpoint => path === `${this.apiBaseUrl}/auth/${endpoint}`);

    return next.handle(req).pipe(catchError(error => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || !isApiRequest || isSessionEndpoint) {
        return throwError(() => error);
      }
      return this.refreshToken().pipe(
        // Preserve each request's original HTTP error if the session cannot be restored.
        catchError(() => throwError(() => error)),
        switchMap(() => next.handle(req)),
      );
    }));
  }

  private refreshToken(): Observable<unknown> {
    if (!this.refreshRequest) {
      this.refreshRequest = this.refreshClient.post(`${this.apiBaseUrl}/auth/refresh`, null, {
        withCredentials: true,
      }).pipe(
        catchError(error => {
          this.authService.clearCurrentUser();
          return throwError(() => error);
        }),
        finalize(() => { this.refreshRequest = undefined; }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.refreshRequest;
  }
}
