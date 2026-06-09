import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { AdminDashboard } from '../interfaces/admin';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  dashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${this.apiBaseUrl}/admin/dashboard`, {
      withCredentials: true,
    });
  }

  acceptAppointment(id: string): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/wash_calendar/accept/${id}`, null, {
      withCredentials: true,
    });
  }
}
