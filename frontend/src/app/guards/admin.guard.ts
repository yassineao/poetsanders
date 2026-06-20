import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from "../core/auth/auth.service";
import { inject } from "@angular/core";
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanMatchFn = (_route, segments) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const returnUrl = `/${segments.map((segment) => segment.path).join('/')}`;

  const redirect = (url: string) =>
    router.createUrlTree([url], {
      queryParams: { returnUrl },
    });

  return auth.me().pipe(
    map((user) =>
      String(user.role).toUpperCase() === 'ADMIN'
        ? true
        : redirect('/'),
    ),
    catchError(() => of(redirect('/login'))),
  );
};
