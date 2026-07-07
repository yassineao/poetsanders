import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AdminAppointment,
  AdminAppointmentCreate,
  AdminAppointmentUpdate,
  AdminCarCreate,
  AdminCarUpdate,
  AdminContactMessage,
  AdminContactMessageStatus,
  AdminDashboard,
  AdminUser,
  AdminUserCreate,
  AdminUserUpdate,
} from '../interfaces/admin';
import type { Car } from '../interfaces/Car';

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

  updateUser(id: string, user: AdminUserUpdate): Observable<AdminUser> {
    return this.http.patch<AdminUser>(`${this.apiBaseUrl}/admin/users/${id}`, user, {
      withCredentials: true,
    });
  }

  createUser(user: AdminUserCreate): Observable<AdminUser> {
    return this.http.post<AdminUser>(`${this.apiBaseUrl}/admin/users`, user, {
      withCredentials: true,
    });
  }

  updateAppointment(
    id: string,
    appointment: AdminAppointmentUpdate,
  ): Observable<AdminAppointment> {
    return this.http.patch<AdminAppointment>(
      `${this.apiBaseUrl}/admin/appointments/${id}`,
      appointment,
      { withCredentials: true },
    );
  }

  createAppointment(appointment: AdminAppointmentCreate): Observable<AdminAppointment> {
    return this.http.post<AdminAppointment>(
      `${this.apiBaseUrl}/admin/appointments`,
      appointment,
      { withCredentials: true },
    );
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/admin/appointments/${id}`, {
      withCredentials: true,
    });
  }

  updateCar(id: string, car: AdminCarUpdate): Observable<Car> {
    return this.http.patch<Car>(`${this.apiBaseUrl}/admin/cars/${id}`, car, {
      withCredentials: true,
    });
  }

  createCar(car: AdminCarCreate): Observable<Car> {
    return this.http.post<Car>(`${this.apiBaseUrl}/admin/cars`, car, {
      withCredentials: true,
    });
  }

  deleteCar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/admin/cars/${id}`, {
      withCredentials: true,
    });
  }

  updateContactMessage(
    id: string,
    status: AdminContactMessageStatus,
    adminReply: string | null = null,
  ): Observable<AdminContactMessage> {
    return this.http.patch<AdminContactMessage>(
      `${this.apiBaseUrl}/admin/contact-messages/${id}`,
      { status, adminReply },
      { withCredentials: true },
    );
  }

  deleteContactMessage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/admin/contact-messages/${id}`, {
      withCredentials: true,
    });
  }
}
