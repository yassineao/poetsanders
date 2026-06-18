import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EMPTY, catchError, finalize } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import { I18nService } from '../../../../core/i18/i18n.service';
import type { AuthUser } from '../../../../core/interfaces/AuthUser';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{12,}$/;

@Component({
  selector: 'app-profile-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-editor.component.html',
})
export class ProfileEditorComponent implements OnChanges {
  @Input({ required: true }) user!: AuthUser;

  private readonly auth = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly i18n = inject(I18nService);

  protected readonly copy = computed(() => this.i18n.copy().profile);
  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly profileForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
    password: [
      '',
      [Validators.minLength(12), Validators.maxLength(30), Validators.pattern(passwordPattern)],
    ],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.resetForm();
    }
  }

  protected startEditing(): void {
    this.saved.set(false);
    this.errorMessage.set('');
    this.editing.set(true);
  }

  protected cancelEditing(): void {
    this.resetForm();
    this.errorMessage.set('');
    this.editing.set(false);
  }

  protected save(): void {
    if (this.profileForm.invalid || this.saving()) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const value = this.profileForm.getRawValue();
    const request = {
      name: value.name.trim(),
      phoneNumber: value.phoneNumber.trim(),
      ...(value.password ? { password: value.password } : {}),
    };

    this.saving.set(true);
    this.saved.set(false);
    this.errorMessage.set('');
    this.auth
      .updateProfile(request)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage.set(
            error.status === 409 && typeof error.error?.error === 'string'
              ? error.error.error
              : this.copy().errorLabel,
          );
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe((user) => {
        this.user = user;
        this.resetForm();
        this.editing.set(false);
        this.saved.set(true);
      });
  }

  private resetForm(): void {
    if (!this.user) {
      return;
    }

    this.profileForm.reset({
      name: this.user.user,
      phoneNumber: this.user.phoneNumber ?? '',
      password: '',
    });
  }
}
