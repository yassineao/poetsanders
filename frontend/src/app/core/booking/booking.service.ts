import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, type Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type WashType =
  | 'Total_Treatment'
  | 'Interior_Treatment'
  | 'Exterior_Treatment'
  | 'Ozone_Treatment'
  | 'Headlight_Treatment';

export interface UserBooking {
  id: string;
  washType: WashType;
  userId: string;
  localDateTime: string;
  accepted: boolean;
}

interface UserBookingResponse extends Omit<UserBooking, 'localDateTime'> {
  localDateTime: string | number[];
}

const washTypeBySlug: Record<string, WashType> = {
  'total-treatment': 'Total_Treatment',
  'interior-treatment': 'Interior_Treatment',
  'exterior-treatment': 'Exterior_Treatment',
  'ozone-treatment': 'Ozone_Treatment',
  'headlight-treatment': 'Headlight_Treatment',
};

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  bookTreatments(treatmentSlugs: string[], localDateTime: string): Observable<UserBooking[]> {
    return this.http.post<UserBooking[]>(
      `${this.apiBaseUrl}/wash_calendar/batch`,
      {
        washTypes: treatmentSlugs.map((slug) => washTypeBySlug[slug]),
        localDateTime,
      },
      { withCredentials: true },
    );
  }

  bookedSlotsByUser(): Observable<UserBooking[]> {
    return this.http
      .get<UserBookingResponse[]>(`${this.apiBaseUrl}/wash_calendar/by_user`, {
        withCredentials: true,
      })
      .pipe(
        map((bookings) =>
          bookings.flatMap((booking) => {
            const localDateTime = this.normalizeLocalDateTime(booking.localDateTime);
            return localDateTime ? [{ ...booking, localDateTime }] : [];
          }),
        ),
      );
  }

  cancelBookings(ids: string[]): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/wash_calendar/batch`, {
      body: { ids },
      withCredentials: true,
    });
  }

  private normalizeLocalDateTime(value: string | number[]): string | null {
    if (typeof value === 'string') {
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
