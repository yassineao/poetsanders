import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, type Observable } from 'rxjs';
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

  bookTreatments(treatmentSlugs: string[], localDateTime: string): Observable<unknown[]> {
    const requests = treatmentSlugs.map((slug) =>
      this.http.post<unknown>(
        `${this.apiBaseUrl}/wash_calendar`,
        {
          washType: washTypeBySlug[slug],
          localDateTime,
        },
        { withCredentials: true },
      ),
    );

    return forkJoin(requests);
  }

  bookedSlotsByUser(): Observable<UserBooking[]> {
    return this.http.get<UserBooking[]>(`${this.apiBaseUrl}/wash_calendar/by_user`, {
      withCredentials: true,
    });
  }

  cancelBookings(ids: string[]): Observable<void[]> {
    return forkJoin(
      ids.map((id) =>
        this.http.delete<void>(`${this.apiBaseUrl}/wash_calendar/${id}`, { withCredentials: true }),
      ),
    );
  }
}
