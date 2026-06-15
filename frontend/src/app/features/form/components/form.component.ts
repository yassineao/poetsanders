import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { BookingService } from '../../../core/booking/booking.service';
import { I18nService } from '../../../core/i18/i18n.service';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import type {
  BookingConfirmation,
  BookingFormGroup,
  BookingMode,
  CalendarDay,
} from './booking-form.models';
import { BookingScheduleComponent } from './booking-schedule/booking-schedule.component';

const accountPasswordValidators = [
  Validators.required,
  Validators.minLength(12),
  Validators.maxLength(30),
  Validators.pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{12,}$/,
  ),
];

const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const retypePassword = control.get('retypePassword')?.value;

  return password && retypePassword && password !== retypePassword
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    BookingConfirmationComponent,
    BookingDetailsComponent,
    BookingScheduleComponent,
  ],
  templateUrl: './form.component.html',
})
export class BookingFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly i18n = inject(I18nService);
  private readonly auth = inject(AuthService);
  private readonly booking = inject(BookingService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly today = this.startOfDay(new Date());

  protected readonly isAuthenticated = computed(() => this.auth.currentUser() !== null);
  protected readonly copy = computed(() => this.i18n.copy().booking);
  protected readonly treatments = computed(() => this.i18n.copy().services.treatments.items);
  protected readonly viewMonth = signal(
    new Date(this.today.getFullYear(), this.today.getMonth(), 1),
  );
  protected readonly selectedDate = signal<Date | null>(null);
  protected readonly selectedTime = signal('');
  protected readonly bookingMode = signal<BookingMode>('register');
  protected readonly guestRegistrationMode = signal(false);
  protected readonly submitted = signal(false);
  protected readonly confirmation = signal<BookingConfirmation | null>(null);
  protected readonly submitting = signal(false);
  protected readonly errorKind = signal<'conflict' | 'unavailable' | null>(null);
  protected readonly errorMessage = computed(() => {
    const kind = this.errorKind();
    return kind === 'conflict'
      ? this.bookingMode() === 'guest'
        ? this.copy().guestConflictMessage
        : this.copy().registrationConflictMessage
      : kind === 'unavailable'
        ? this.copy().unavailableMessage
        : '';
  });
  protected readonly attemptedSubmit = signal(false);
  protected readonly appointmentRequired = computed(
    () =>
      this.isAuthenticated() ||
      this.bookingMode() === 'guest' ||
      (!this.guestRegistrationMode() &&
      (this.selectedServiceSlugs().length > 0 &&
        this.selectedDate() !== null &&
        this.selectedTime() !== '')),
  );
  protected readonly submitLabel = computed(() =>
    this.appointmentRequired() ? this.copy().submitLabel : this.copy().registerSubmitLabel,
  );
  protected readonly submittingLabel = computed(() =>
    this.appointmentRequired()
      ? this.copy().submittingLabel
      : this.copy().registerSubmittingLabel,
  );

  protected readonly bookingForm: BookingFormGroup = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        accountPasswordValidators,
      ],
      retypePassword: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      services: this.formBuilder.nonNullable.control<string[]>([], Validators.required),
      message: [''],
    },
    { validators: passwordsMatchValidator },
  );

  protected readonly selectedServiceSlugs = toSignal(
    this.bookingForm.controls.services.valueChanges,
    { initialValue: this.bookingForm.controls.services.value },
  );

  protected readonly monthLabel = computed(() => {
    this.i18n.language();
    return new Intl.DateTimeFormat(this.i18n.getCurrentLanguage(), {
      month: 'long',
      year: 'numeric',
    }).format(this.viewMonth());
  });

  protected readonly calendarDays = computed<Array<CalendarDay | null>>(() => {
    const month = this.viewMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const days: Array<CalendarDay | null> = Array.from({ length: firstWeekday }, () => null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, monthIndex, day);
      days.push({
        date,
        day,
        disabled: date < this.today,
      });
    }

    return days;
  });

  protected readonly selectedAppointmentLabel = computed(() => {
    const date = this.selectedDate();
    const time = this.selectedTime();
    if (!date || !time) {
      return '';
    }

    this.i18n.language();
    const formattedDate = new Intl.DateTimeFormat(this.i18n.getCurrentLanguage(), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);

    return `${formattedDate}, ${time}`;
  });

  protected previousMonth(): void {
    const current = this.viewMonth();
    const previous = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    const earliest = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    if (previous >= earliest) {
      this.viewMonth.set(previous);
    }
  }

  protected nextMonth(): void {
    const current = this.viewMonth();
    this.viewMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  protected selectDate(day: CalendarDay): void {
    if (day.disabled) {
      return;
    }
    this.selectedDate.set(day.date);
    this.selectedTime.set('');
    this.submitted.set(false);
  }

  protected selectTime(time: string): void {
    if (!this.selectedDate()) {
      return;
    }
    this.selectedTime.set(time);
    this.submitted.set(false);
  }

  protected isSelectedDate(date: Date): boolean {
    const selected = this.selectedDate();
    return !!selected && selected.getTime() === date.getTime();
  }

  protected toggleTreatment(slug: string): void {
    const control = this.bookingForm.controls.services;
    const current = control.value;
    const next = current.includes(slug)
      ? current.filter((selectedSlug) => selectedSlug !== slug)
      : [...current, slug];

    control.setValue(next);
    control.markAsTouched();
    this.submitted.set(false);
  }

  protected setBookingMode(mode: BookingMode): void {
    this.guestRegistrationMode.set(false);
    this.bookingMode.set(mode);
    const password = this.bookingForm.controls.password;
    const retypePassword = this.bookingForm.controls.retypePassword;

    if (mode === 'guest') {
      password.clearValidators();
      retypePassword.clearValidators();
      password.setValue('');
      retypePassword.setValue('');
    } else {
      password.setValidators(accountPasswordValidators);
      retypePassword.setValidators(Validators.required);
    }

    password.updateValueAndValidity();
    retypePassword.updateValueAndValidity();
    this.bookingForm.updateValueAndValidity();
    this.errorKind.set(null);
  }

  protected startGuestRegistration(): void {
    this.setBookingMode('register');
    this.guestRegistrationMode.set(true);
    this.bookingForm.controls.services.setValue([]);
    this.selectedDate.set(null);
    this.selectedTime.set('');
    this.attemptedSubmit.set(false);
    this.errorKind.set(null);
  }

  protected cancelGuestRegistration(): void {
    this.guestRegistrationMode.set(false);
    this.errorKind.set(null);
  }

  protected isTreatmentSelected(slug: string): boolean {
    return this.selectedServiceSlugs().includes(slug);
  }

  protected readonly selectedTreatmentNames = computed(() => {
    const selectedSlugs = this.selectedServiceSlugs();
    return this.treatments()
      .filter((treatment) => selectedSlugs.includes(treatment.slug))
      .map((treatment) => treatment.title);
  });

  protected submit(): void {
    const appointmentRequired = this.appointmentRequired();
    this.attemptedSubmit.set(appointmentRequired);
    this.submitted.set(false);
    this.errorKind.set(null);
    this.bookingForm.markAllAsTouched();

    if (
      this.submitting() ||
      (appointmentRequired &&
        (this.bookingForm.controls.services.invalid ||
          !this.selectedDate() ||
          !this.selectedTime())) ||
      (!this.isAuthenticated() && this.accountDetailsInvalid())
    ) {
      return;
    }

    if (this.isAuthenticated()) {
      this.submitting.set(true);

      this.booking
        .bookTreatments(this.selectedServiceSlugs(), this.selectedLocalDateTime())
        .pipe(
          finalize(() => this.submitting.set(false)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: () => this.completeBooking(),
          error: () => this.errorKind.set('unavailable'),
        });
    } else if (this.bookingMode() === 'register') {
      const { email, password, name, phone } = this.bookingForm.getRawValue();
      this.submitting.set(true);

      const registration = this.auth.register({
        email: email.trim(),
        password,
        name: name.trim(),
        phoneNumber: phone.trim(),
      });

      if (!appointmentRequired) {
        registration
          .pipe(
            finalize(() => this.submitting.set(false)),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe({
            next: () => this.completeRegistration(),
            error: (error: HttpErrorResponse) => {
              this.errorKind.set(error.status === 409 ? 'conflict' : 'unavailable');
            },
          });
        return;
      }

      registration
        .pipe(
          switchMap(() =>
            this.booking.bookTreatments(
              this.bookingForm.controls.services.value,
              this.selectedLocalDateTime(),
            ),
          ),
          finalize(() => this.submitting.set(false)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: () => this.completeBooking(),
          error: (error: HttpErrorResponse) => {
            this.errorKind.set(error.status === 409 ? 'conflict' : 'unavailable');
          },
        });
    } else {
      const { email, name, phone } = this.bookingForm.getRawValue();
      this.submitting.set(true);

      this.booking
        .bookGuestTreatments({
          name: name.trim(),
          email: email.trim(),
          phoneNumber: phone.trim(),
          treatmentSlugs: this.bookingForm.controls.services.value,
          localDateTime: this.selectedLocalDateTime(),
        })
        .pipe(
          finalize(() => this.submitting.set(false)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe({
          next: () => this.completeBooking(true),
          error: (error: HttpErrorResponse) => {
            this.errorKind.set(error.status === 409 ? 'conflict' : 'unavailable');
          },
        });
    }
  }

  protected startAnotherBooking(): void {
    this.bookingForm.reset({
      name: '',
      email: '',
      password: '',
      retypePassword: '',
      phone: '',
      services: [],
      message: '',
    });
    this.selectedDate.set(null);
    this.selectedTime.set('');
    this.attemptedSubmit.set(false);
    this.errorKind.set(null);
    this.submitted.set(false);
    this.confirmation.set(null);
    this.setBookingMode('register');
  }

  private completeBooking(guest = false): void {
    const user = this.auth.currentUser();
    const formValue = this.bookingForm.getRawValue();

    this.confirmation.set({
      appointment: this.selectedAppointmentLabel(),
      treatments: [...this.selectedTreatmentNames()],
      customerName: user?.user || formValue.name.trim(),
      customerEmail: user?.email || formValue.email.trim(),
      guest,
      registrationOnly: false,
    });
    this.submitted.set(true);
  }

  private completeRegistration(): void {
    const user = this.auth.currentUser();
    const formValue = this.bookingForm.getRawValue();

    this.confirmation.set({
      appointment: '',
      treatments: [],
      customerName: user?.user || formValue.name.trim(),
      customerEmail: user?.email || formValue.email.trim(),
      guest: false,
      registrationOnly: true,
    });
    this.submitted.set(true);
  }

  private accountDetailsInvalid(): boolean {
    const controls = this.bookingForm.controls;
    return (
      controls.name.invalid ||
      controls.email.invalid ||
      controls.phone.invalid ||
      (this.bookingMode() === 'register' &&
        (controls.password.invalid ||
          controls.retypePassword.invalid ||
          this.bookingForm.hasError('passwordMismatch')))
    );
  }

  private selectedLocalDateTime(): string {
    const date = this.selectedDate();
    if (!date) {
      throw new Error('Appointment date is missing');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}T${this.selectedTime()}:00`;
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
