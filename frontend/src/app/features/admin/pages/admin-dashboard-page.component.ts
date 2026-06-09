import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EMPTY, catchError, finalize, of, switchMap } from 'rxjs';
import { AdminService } from '../../../core/admin/admin.service';
import { AuthService } from '../../../core/auth/auth.service';
import type { AdminAppointment, AdminDashboard } from '../../../core/interfaces/admin';
import { I18nService } from '../../../core/i18/i18n.service';
import { AdminAppointmentsComponent } from '../components/admin-appointments/admin-appointments.component';
import { AdminDashboardStatsComponent } from '../components/admin-dashboard-stats/admin-dashboard-stats.component';
import { AdminUsersComponent } from '../components/admin-users/admin-users.component';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    AdminAppointmentsComponent,
    AdminDashboardStatsComponent,
    AdminUsersComponent,
  ],
  templateUrl: './admin-dashboard-page.component.html',
})
export class AdminDashboardPageComponent {
  private readonly admin = inject(AdminService);
  private readonly auth = inject(AuthService);
  private readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly copy = computed(() => this.i18n.copy().admin);
  protected readonly loading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly dashboard = signal<AdminDashboard | null>(null);
  protected readonly acceptingIds = signal<string[]>([]);
  protected readonly acceptError = signal(false);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const session = this.auth.currentUser() ? of(this.auth.currentUser()!) : this.auth.me();
    session
      .pipe(
        switchMap((user) => {
          if (user.role !== 'ADMIN') {
            void this.router.navigateByUrl('/');
            return EMPTY;
          }
          return this.admin.dashboard();
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            void this.router.navigateByUrl('/login');
          } else if (error.status === 403) {
            void this.router.navigateByUrl('/');
          } else {
            this.hasError.set(true);
          }
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((dashboard) => this.dashboard.set(dashboard));
  }

  protected acceptAppointment(appointment: AdminAppointment): void {
    if (appointment.accepted || this.isAccepting(appointment.id)) {
      return;
    }

    this.acceptError.set(false);
    this.acceptingIds.update((ids) => [...ids, appointment.id]);
    this.admin
      .acceptAppointment(appointment.id)
      .pipe(
        catchError(() => {
          this.acceptError.set(true);
          return EMPTY;
        }),
        finalize(() =>
          this.acceptingIds.update((ids) => ids.filter((id) => id !== appointment.id)),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.dashboard.update((dashboard) => {
          if (!dashboard) {
            return dashboard;
          }

          return {
            ...dashboard,
            pendingAppointments: Math.max(0, dashboard.pendingAppointments - 1),
            acceptedAppointments: dashboard.acceptedAppointments + 1,
            appointments: dashboard.appointments.map((item) =>
              item.id === appointment.id ? { ...item, accepted: true } : item,
            ),
          };
        });
      });
  }

  private isAccepting(id: string): boolean {
    return this.acceptingIds().includes(id);
  }
}
