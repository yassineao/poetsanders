import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import type { Appointment } from "../../../core/appointments/appointments.service";
import type { Locale } from "../../../core/interfaces/locale";

@Component({
  selector: "app-appointment-card",
  imports: [CommonModule],
  templateUrl: "./appointment-card.component.html",
})
export class AppointmentCardComponent {
  readonly appointment = input.required<Appointment>();
  readonly locale = input.required<Locale>();
  readonly cancelling = input(false);
  readonly cancelRequested = output<Appointment>();

  protected readonly statusLabel = computed(() =>
    this.appointment().accepted ? "Accepted" : "Pending confirmation",
  );

  protected readonly treatmentLabel = computed(() =>
    this.appointment().washType.replaceAll("_", " ").toLowerCase()
      .replace(/^\w/, (letter) => letter.toUpperCase()),
  );

  protected readonly dateLabel = computed(() => {
    const date = new Date(this.appointment().localDateTime);
    if (Number.isNaN(date.getTime())) {
      return this.appointment().localDateTime;
    }

    return new Intl.DateTimeFormat(this.locale(), {
      dateStyle: "full",
      timeStyle: "short",
    }).format(date);
  });
}
