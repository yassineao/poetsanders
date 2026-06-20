import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../core/auth/auth.service";

export const authGuard: CanActivateFn = (
  route,
  state,
) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.currentUser !== null){
        return true;
    }

    const locale = route.paramMap.get('locale') ?? 'de';
    return router.createUrlTree(
        ['/', locale , 'auth'],
        {
            queryParams: {
                returnUrl: state.url,
            }
        }


    )
}