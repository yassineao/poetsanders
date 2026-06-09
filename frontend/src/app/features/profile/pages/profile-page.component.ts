import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EMPTY, catchError, finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { I18nService } from '../../../core/i18/i18n.service';
import { ProfileEditorComponent } from '../components/profile-editor/profile-editor.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ProfileEditorComponent],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {
  readonly auth = inject(AuthService);
  private readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly loggingOut = signal(false);
  protected readonly copy = computed(() => this.i18n.copy().profile);

  constructor() {
    if (!isPlatformBrowser(this.platformId) || this.auth.currentUser()) {
      return;
    }

    this.auth
      .me()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            void this.router.navigateByUrl('/login');
          }
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  protected logout(): void {
    this.loggingOut.set(true);
    this.auth
      .logout()
      .pipe(
        finalize(() => this.loggingOut.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => void this.router.navigateByUrl('/login'));
  }
}
