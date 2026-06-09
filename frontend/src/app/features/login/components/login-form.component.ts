import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { I18nService } from '../../../core/i18/i18n.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly i18n = inject(I18nService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly copy = computed(() => this.i18n.copy().login);
  protected readonly passwordVisible = signal(false);
  protected readonly submitting = signal(false);
  protected readonly errorKind = signal<'credentials' | 'unavailable' | null>(null);
  protected readonly errorMessage = computed(() => {
    const kind = this.errorKind();
    return kind === 'credentials'
      ? this.copy().invalidCredentialsMessage
      : kind === 'unavailable'
        ? this.copy().unavailableMessage
        : '';
  });

  protected readonly loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  protected submit(): void {
    this.errorKind.set(null);
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid || this.submitting()) {
      return;
    }

    const { email, password } = this.loginForm.getRawValue();
    this.submitting.set(true);

    this.auth
      .login({ email: email.trim(), password })
      .pipe(
        finalize(() => this.submitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (user) => void this.router.navigateByUrl(user.role === 'ADMIN' ? '/admin' : '/'),
        error: (error: HttpErrorResponse) => {
          this.errorKind.set(error.status === 401 ? 'credentials' : 'unavailable');
        },
      });
  }
}
