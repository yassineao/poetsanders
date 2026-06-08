import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EMPTY, catchError, finalize, of, switchMap } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import {
  BookingService,
  type UserBooking,
  type WashType,
} from '../../../core/booking/booking.service';
import { I18nService } from '../../../core/i18/i18n.service';
import { ProfileBookingsComponent } from '../components/profile-bookings/profile-bookings.component';
import { ProfileDetailsComponent } from '../components/profile-details/profile-details.component';

const treatmentSlugByWashType: Record<WashType, string> = {
  Total_Treatment: 'total-treatment',
  Interior_Treatment: 'interior-treatment',
  Exterior_Treatment: 'exterior-treatment',
  Ozone_Treatment: 'ozone-treatment',
  Headlight_Treatment: 'headlight-treatment',
};

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ProfileDetailsComponent, ProfileBookingsComponent],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {
  readonly auth = inject(AuthService);
  private readonly booking = inject(BookingService);
  private readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly loggingOut = signal(false);
  protected readonly bookingsLoading = signal(false);
  protected readonly bookingsError = signal(false);
  protected readonly cancellingIds = signal<string[]>([]);
  private readonly bookings = signal<UserBooking[]>([]);

  protected readonly appointments = computed(() => {
    this.i18n.language();

    const bookingsByDate = this.bookings().reduce<
      Record<string, { id: string[]; washTypes: WashType[] }>
    >((appointments, booking) => {
      const appointment = appointments[booking.localDateTime] ?? {
        id: [],
        washTypes: [],
      };

      appointment.id.push(booking.id);
      appointment.washTypes.push(booking.washType);
      appointments[booking.localDateTime] = appointment;

      return appointments;
    }, {});

    return Object.entries(bookingsByDate)
      .map(([localDateTime, appointment]) => ({
        id: appointment.id,
        localDateTime,
        treatmentNames: appointment.washTypes.map((washType) => this.treatmentName(washType)),
        label: new Intl.DateTimeFormat(this.i18n.getCurrentLanguage(), {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(localDateTime)),
      }))
      .sort(
        (left, right) =>
          new Date(right.localDateTime).getTime() - new Date(left.localDateTime).getTime(),
      );
  });

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.bookingsLoading.set(true);
    const session = this.auth.currentUser() ? of(this.auth.currentUser()) : this.auth.me();

    session
      .pipe(
        switchMap(() => this.booking.bookedSlotsByUser()),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            void this.router.navigateByUrl('/login');
          } else {
            this.bookingsError.set(true);
          }
          return EMPTY;
        }),
        finalize(() => this.bookingsLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((bookings) => this.bookings.set(bookings));
  }

  protected cancelAppointment(ids: string[]): void {
    if (!ids.length || ids.some((id) => this.cancellingIds().includes(id))) {
      return;
    }

    this.cancellingIds.update((currentIds) => [...currentIds, ...ids]);
    this.bookingsError.set(false);

    this.booking
      .cancelBookings(ids)
      .pipe(
        catchError(() => {
          this.bookingsError.set(true);
          return EMPTY;
        }),
        finalize(() =>
          this.cancellingIds.update((currentIds) =>
            currentIds.filter((id) => !ids.includes(id)),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() =>
        this.bookings.update((bookings) =>
          bookings.filter((booking) => !ids.includes(booking.id)),
        ),
      );
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

  private treatmentName(washType: WashType): string {
    const slug = treatmentSlugByWashType[washType];
    return (
      this.i18n.copy().services.treatments.items.find((item) => item.slug === slug)?.title ??
      washType
    );
  }
}
