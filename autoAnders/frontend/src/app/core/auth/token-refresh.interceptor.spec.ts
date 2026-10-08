import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { TokenRefreshInterceptor } from './token-refresh.interceptor';
import { AuthService } from './auth.service';

describe('TokenRefreshInterceptor', () => {
  const base = environment.apiBaseUrl.replace(/\/$/, '');
  let http: HttpClient;
  let backend: HttpTestingController;
  let cleared: number;
  beforeEach(() => {
    cleared = 0;
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(),
      { provide: HTTP_INTERCEPTORS, useClass: TokenRefreshInterceptor, multi: true },
      { provide: AuthService, useValue: { clearCurrentUser: () => cleared++ } },
    ] });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });
  afterEach(() => backend.verify());

  for (const endpoint of ['login', 'register', 'refresh', 'logout', 'profile-access']) {
    it(`preserves ${endpoint} errors without refreshing`, () => {
      let result: HttpErrorResponse | undefined;
      http.post(`${base}/auth/${endpoint}`, {}).subscribe({ error: error => result = error });
      backend.expectOne(`${base}/auth/${endpoint}`).flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
      expect(result?.status).toBe(401);
      expect(result?.error).toEqual({ error: 'Invalid credentials' });
      expect(cleared).toBe(0);
    });
  }

  it('shares refresh and retries each concurrent request once', () => {
    const results: unknown[] = [];
    for (const path of ['cars/by_user', 'auth/me']) {
      http.get(`${base}/${path}`).subscribe(value => results.push(value));
      backend.expectOne(`${base}/${path}`).flush(null, { status: 401, statusText: 'Unauthorized' });
    }
    const refresh = backend.expectOne(`${base}/auth/refresh`);
    expect(refresh.request.withCredentials).toBe(true);
    refresh.flush({});
    backend.expectOne(`${base}/cars/by_user`).flush([]);
    backend.expectOne(`${base}/auth/me`).flush({ uid: 'user-1' });
    expect(results.length).toBe(2);
  });

  it('fails all waiting requests with their original error and permits a later refresh', () => {
    const errors: HttpErrorResponse[] = [];
    for (const path of ['cars/by_user', 'auth/me']) {
      http.get(`${base}/${path}`).subscribe({ error: error => errors.push(error) });
      backend.expectOne(`${base}/${path}`).flush({ error: path }, { status: 401, statusText: 'Unauthorized' });
    }
    backend.expectOne(`${base}/auth/refresh`).flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(errors.map(error => error.error.error)).toEqual(['cars/by_user', 'auth/me']);
    expect(cleared).toBe(1);
    http.get(`${base}/auth/me`).subscribe();
    backend.expectOne(`${base}/auth/me`).flush(null, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne(`${base}/auth/refresh`).flush({});
    backend.expectOne(`${base}/auth/me`).flush({ uid: 'user-1' });
  });

  it('does not refresh for external requests or retry a second 401', () => {
    const errors: HttpErrorResponse[] = [];
    http.get('https://other.example/data').subscribe({ error: error => errors.push(error) });
    backend.expectOne('https://other.example/data').flush(null, { status: 401, statusText: 'Unauthorized' });
    http.get(`${base}/auth/me`).subscribe({ error: error => errors.push(error) });
    backend.expectOne(`${base}/auth/me`).flush(null, { status: 401, statusText: 'Unauthorized' });
    backend.expectOne(`${base}/auth/refresh`).flush({});
    backend.expectOne(`${base}/auth/me`).flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(errors.length).toBe(2);
  });
});
