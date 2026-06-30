import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { map, type Observable } from "rxjs";
import { environment } from "../../../environments/environment";

export type WashType =
  | "Total_Treatment"
  | "Interior_Treatment"
  | "Exterior_Treatment"
  | "Ozone_Treatment"
  | "Headlight_Treatment";

export interface Appointment {
  id: string;
  washType: WashType;
  userId: string;
  localDateTime: string;
  accepted: boolean;
  cancellationToken?: string | null;
}

interface AppointmentResponse extends Omit<Appointment, "localDateTime"> {
  localDateTime: string | number[];
}

@Injectable({ providedIn: "root" })
export class AppointmentsService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getMyAppointments(): Observable<Appointment[]> {
    return this.http
      .get<AppointmentResponse[]>(`${this.apiBaseUrl}/wash_calendar/by_user`, {
        withCredentials: true,
      })
      .pipe(
        map((appointments) =>
          appointments.flatMap((appointment) => {
            const localDateTime = this.normalizeLocalDateTime(appointment.localDateTime);
            return localDateTime ? [{ ...appointment, localDateTime }] : [];
          }),
        ),
      );
  }

  cancelAppointments(ids: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/wash_calendar/batch`, {
      body: { ids },
      withCredentials: true,
    });
  }

  private normalizeLocalDateTime(value: string | number[]): string | null {
    if (typeof value === "string") {
      return Number.isNaN(new Date(value).getTime()) ? null : value;
    }

    if (Array.isArray(value) && value.length >= 5) {
      const [year, month, day, hour, minute, second = 0] = value;
      const date = new Date(year, month - 1, day, hour, minute, second);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    }

    return null;
  }
}
