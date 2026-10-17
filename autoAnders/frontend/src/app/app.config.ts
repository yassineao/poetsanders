import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { TokenRefreshInterceptor } from './core/auth/token-refresh.interceptor';
import { SeoService } from './core/lib/seo';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() => inject(SeoService).start()),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenRefreshInterceptor,
      multi: true,
    },
  ]
};
