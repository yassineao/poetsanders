import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, Input, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { EMPTY, catchError, finalize, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../../core/auth/auth.service';
import {
  BookingService,
  type UserBooking,
  type WashType,
} from '../../../../core/booking/booking.service';
import { I18nService } from '../../../../core/i18/i18n.service';
import {
  AppointmentCardComponent,
  type AppointmentViewModel,
} from '../appointment-card/appointment-card.component';

const treatmentSlugByWashType: Record<WashType, string> = {
  Total_Treatment: 'total-treatment',
  Interior_Treatment: 'interior-treatment',
  Exterior_Treatment: 'exterior-treatment',
  Ozone_Treatment: 'ozone-treatment',
  Headlight_Treatment: 'headlight-treatment',
};

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, RouterModule, AppointmentCardComponent],
  templateUrl: './appointments-list.component.html',
})
export class AppointmentsListComponent {
  @Input() pageMode = false;

  private readonly auth = inject(AuthService);
  private readonly booking = inject(BookingService);
  private readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly isAuthenticated = computed(() => this.auth.currentUser() !== null);
  protected readonly copy = computed(() => this.i18n.copy().home.appointments);
  protected readonly loading = signal(false);
  protected readonly hasError = signal(false);
  protected readonly cancellingIds = signal<string[]>([]);
  private readonly bookings = signal<UserBooking[]>([]);

  protected readonly appointments = computed<AppointmentViewModel[]>(() => {
    this.i18n.language();
    const now = Date.now();
    const grouped = this.bookings().reduce<
      Record<string, { ids: string[]; washTypes: WashType[]; accepted: boolean[] }>
    >((appointments, booking) => {
      const appointmentTime = new Date(booking.localDateTime).getTime();
      if (Number.isNaN(appointmentTime)) {
        return appointments;
      }

      if (!this.pageMode && appointmentTime < now) {
        return appointments;
      }

      const appointment = appointments[booking.localDateTime] ?? {
        ids: [],
        washTypes: [],
        accepted: [],
      };
      appointment.ids.push(booking.id);
      appointment.washTypes.push(booking.washType);
      appointment.accepted.push(booking.accepted);
      appointments[booking.localDateTime] = appointment;
      return appointments;
    }, {});

    const sortedAppointments = Object.entries(grouped)
      .map<AppointmentViewModel>(([localDateTime, appointment]) => ({
        ids: appointment.ids,
        localDateTime,
        treatmentNames: appointment.washTypes.map((washType) => this.treatmentName(washType)),
        acceptanceStatus: appointment.accepted.every(Boolean)
          ? 'accepted'
          : appointment.accepted.some(Boolean)
            ? 'partial'
            : 'pending',
        label: new Intl.DateTimeFormat(this.i18n.getCurrentLanguage(), {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(localDateTime)),
      }))
      .sort((left, right) => {
        const leftTime = new Date(left.localDateTime).getTime();
        const rightTime = new Date(right.localDateTime).getTime();
        return this.pageMode ? rightTime - leftTime : leftTime - rightTime;
      });

    return this.pageMode ? sortedAppointments : sortedAppointments.slice(0, 2);
  });

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const session = this.auth.currentUser() ? of(this.auth.currentUser()) : this.auth.me();
    session
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap(() => this.booking.bookedSlotsByUser()),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 && this.pageMode) {
            void this.router.navigateByUrl('/login');
          } else if (error.status !== 401) {
            this.hasError.set(true);
          }
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((bookings) => this.bookings.set(bookings));
  }

  protected cancelAppointment(ids: string[]): void {
    if (!ids.length || ids.some((id) => this.cancellingIds().includes(id))) {
      return;
    }

    if (!window.confirm('Cancel this appointment? This cannot be undone.')) {
      return;
    }

    this.cancellingIds.update((current) => [...current, ...ids]);
    this.hasError.set(false);

    this.booking
      .cancelBookings(ids)
      .pipe(
        catchError(() => {
          this.hasError.set(true);
          return EMPTY;
        }),
        finalize(() =>
          this.cancellingIds.update((current) => current.filter((id) => !ids.includes(id))),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() =>
        this.bookings.update((bookings) => bookings.filter((booking) => !ids.includes(booking.id))),
      );
  }

  protected isCancelling(ids: string[]): boolean {
    return ids.some((id) => this.cancellingIds().includes(id));
  }

  private treatmentName(washType: WashType): string {
    const slug = treatmentSlugByWashType[washType];
    return (
      this.i18n.copy().services.treatments.items.find((item) => item.slug === slug)?.title ??
      washType
    );
  }
}
