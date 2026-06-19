import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../core/auth/auth.service";
import { inject } from "@angular/core";
import { catchError, map, of } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const redirect = (url: string) =>
    router.createUrlTree([url], {
      queryParams: { returnUrl: state.url },
    });

  const user$ = auth.currentUser()
    ? of(auth.currentUser()!)
    : auth.me();

  return user$.pipe(
    map((user) =>
      user.role === 'ADMIN'
        ? true
        : redirect('/'),
    ),
    catchError((error: HttpErrorResponse) =>
      of(redirect(error.status === 401 ? '/login' : '/')),
    ),
  );
};