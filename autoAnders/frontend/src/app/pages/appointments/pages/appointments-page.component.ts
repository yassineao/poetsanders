import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, finalize, map, of } from "rxjs";
import {
  AppointmentsService,
  type Appointment,
} from "../../../core/appointments/appointments.service";
import { isValidLocale } from "../../../core/lib/i18n";
import type { Locale } from "../../../core/interfaces/locale";
import { AppointmentCardComponent } from "../components/appointment-card.component";

@Component({
  imports: [CommonModule, RouterLink, AppointmentCardComponent],
  templateUrl: "./appointments-page.component.html",
})
export class AppointmentsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly appointmentsService = inject(AppointmentsService);
  private readonly localeParam = toSignal(
    (this.route.parent?.paramMap ?? this.route.paramMap).pipe(
      map((params) => params.get("locale") ?? "de"),
    ),
    { initialValue: "de" },
  );

  protected readonly locale = computed<Locale>(() => {
    const value = this.localeParam();
    return isValidLocale(value) ? value : "de";
  });

  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly cancellingIds = signal<string[]>([]);
  protected readonly hasAppointments = computed(() => this.appointments().length > 0);

  constructor() {
    this.loadAppointments();
  }

  protected loadAppointments(): void {
    this.loading.set(true);
    this.failed.set(false);

    this.appointmentsService.getMyAppointments()
      .pipe(
        catchError((error) => {
          console.error("Loading appointments failed:", error);
          this.failed.set(true);
          return of([] as Appointment[]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((appointments) => {
        this.appointments.set(
          appointments.sort(
            (left, right) =>
              new Date(left.localDateTime).getTime() - new Date(right.localDateTime).getTime(),
          ),
        );
      });
  }

  protected cancelAppointment(appointment: Appointment): void {
    if (this.cancellingIds().includes(appointment.id)) {
      return;
    }

    if (!window.confirm("Cancel this appointment? This cannot be undone.")) {
      return;
    }

    this.failed.set(false);
    this.cancellingIds.update((ids) => [...ids, appointment.id]);

    this.appointmentsService.cancelAppointments([appointment.id])
      .pipe(
        catchError((error) => {
          console.error("Cancelling appointment failed:", error);
          this.failed.set(true);
          return of(null);
        }),
        finalize(() =>
          this.cancellingIds.update((ids) => ids.filter((id) => id !== appointment.id)),
        ),
      )
      .subscribe((result) => {
        if (result === null) {
          return;
        }

        this.appointments.update((appointments) =>
          appointments.filter((item) => item.id !== appointment.id),
        );
      });
  }

  protected isCancelling(appointment: Appointment): boolean {
    return this.cancellingIds().includes(appointment.id);
  }
}
