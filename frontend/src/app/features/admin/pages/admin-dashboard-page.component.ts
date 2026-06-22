import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, catchError, finalize } from 'rxjs';
import { AdminService } from '../../../core/admin/admin.service';
import { CarsService } from '../../../core/cars/cars.service';
import type { Car } from '../../../core/interfaces/Car';
import type {
  AdminAppointment,
  AdminDashboard,
  AdminSection,
  AdminSidebar,
  AdminUser,
} from '../../../core/interfaces/admin';
import { I18nService } from '../../../core/i18/i18n.service';
import { AdminAppointmentsComponent } from '../components/admin-appointments/admin-appointments.component';
import { AdminButtonComponent } from '../components/admin-buttons/admin-buttons';
import {
  AdminCarsComponent,
  type CarStatusChange,
} from '../components/admin-cars/admin-cars';
import { AdminDashboardStatsComponent } from '../components/admin-dashboard-stats/admin-dashboard-stats.component';
import { AdminSidebarComponent } from '../components/admin-sidebar/admin-sidebar';
import { AdminUsersComponent } from '../components/admin-users/admin-users.component';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    AdminAppointmentsComponent,
    AdminButtonComponent,
    AdminCarsComponent,
    AdminDashboardStatsComponent,
    AdminSidebarComponent,
    AdminUsersComponent,
  ],
  templateUrl: './admin-dashboard-page.component.html',
})
export class AdminDashboardPageComponent {
  private readonly admin = inject(AdminService);
  private readonly carsService = inject(CarsService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly route = inject(ActivatedRoute);

  protected readonly copy = computed(() => this.i18n.copy().admin);
  protected readonly sidebar = computed<AdminSidebar>(() => {
    const copy = this.i18n.copy();

    return {
      items: [
        { name: copy.admin.heading, table: 'overview' },
        { name: copy.admin.usersHeading, table: 'users' },
        { name: copy.admin.appointmentsHeading, table: 'appointments' },
        { name: copy.admin.carsManagementHeading, table: 'cars' },
      ],
      logout: copy.profile.logoutLabel,
    };
  });
  protected readonly activeSection = signal<AdminSection>('overview');
  protected readonly loading = signal(true);
  protected readonly hasError = signal(false);
  protected readonly dashboard = signal<AdminDashboard | null>(null);
  protected readonly acceptingIds = signal<string[]>([]);
  protected readonly acceptError = signal(false);
  protected readonly cars = signal<Car[]>([]);
  protected readonly updatingCarIds = signal<string[]>([]);
  protected readonly carUpdateError = signal(false);

  constructor() {
  this.route.queryParamMap
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe((params) => {
      const section = params.get('section');
      if (this.isAdminSection(section)) {
        this.activeSection.set(section);
      }
    });

  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  this.admin.dashboard()
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Loading dashboard failed:', error);
        this.hasError.set(true);
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((dashboard) => {
      this.dashboard.set(dashboard);
    });

  this.carsService
    .getCars()
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Loading cars failed:', error);
        this.hasError.set(true);
        return EMPTY;
      }),
      takeUntilDestroyed(this.destroyRef),
    )
    .subscribe((cars) => this.cars.set(cars));
}

  private isAdminSection(value: string | null): value is AdminSection {
    return value === 'overview' || value === 'users' || value === 'appointments' || value === 'cars';
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

  protected updateAppointment(updatedAppointment: AdminAppointment): void {
    this.dashboard.update((dashboard) => {
      if (!dashboard) {
        return dashboard;
      }

      const appointments = dashboard.appointments.map((appointment) =>
        appointment.id === updatedAppointment.id ? updatedAppointment : appointment,
      );
      const acceptedAppointments = appointments.filter((appointment) => appointment.accepted).length;

      return {
        ...dashboard,
        appointments,
        acceptedAppointments,
        pendingAppointments: appointments.length - acceptedAppointments,
      };
    });
  }

  protected link(): void {
  console.log('Button clicked');
}

  protected updateCarStatus(change: CarStatusChange): void {
    if (this.updatingCarIds().includes(change.car.id)) {
      return;
    }

    this.carUpdateError.set(false);
    this.updatingCarIds.update((ids) => [...ids, change.car.id]);

    this.carsService
      .updateCarStatus(change.car.id, change.status)
      .pipe(
        catchError(() => {
          this.carUpdateError.set(true);
          return EMPTY;
        }),
        finalize(() =>
          this.updatingCarIds.update((ids) => ids.filter((id) => id !== change.car.id)),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((updatedCar) => {
        this.cars.update((cars) =>
          cars.map((car) => (car.id === updatedCar.id ? { ...car, ...updatedCar } : car)),
        );
      });
  }

  protected updateCar(updatedCar: Car): void {
    this.cars.update((cars) =>
      cars.map((car) => (car.id === updatedCar.id ? { ...car, ...updatedCar } : car)),
    );
  }

  protected addCar(createdCar: Car): void {
    this.cars.update((cars) => [createdCar, ...cars]);
  }

  protected updateUser(updatedUser: AdminUser): void {
    this.dashboard.update((dashboard) =>
      dashboard
        ? {
            ...dashboard,
            users: dashboard.users.map((user) =>
              user.id === updatedUser.id ? updatedUser : user,
            ),
          }
        : dashboard,
    );
  }

  protected addUser(createdUser: AdminUser): void {
    this.dashboard.update((dashboard) =>
      dashboard
        ? {
            ...dashboard,
            totalUsers: dashboard.totalUsers + 1,
            users: [createdUser, ...dashboard.users],
          }
        : dashboard,
    );
  }

  private isAccepting(id: string): boolean {
    return this.acceptingIds().includes(id);
  }
}
