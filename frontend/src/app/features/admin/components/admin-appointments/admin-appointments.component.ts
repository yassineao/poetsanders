import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  Output,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AdminService } from '../../../../core/admin/admin.service';
import { I18nService } from '../../../../core/i18/i18n.service';
import type { AdminAppointment } from '../../../../core/interfaces/admin';
import type { WashType } from '../../../../core/booking/booking.service';

type AppointmentStatusFilter = 'all' | 'pending' | 'accepted';

const pageSize = 10;
const treatmentSlugByWashType: Record<WashType, string> = {
  Total_Treatment: 'total-treatment',
  Interior_Treatment: 'interior-treatment',
  Exterior_Treatment: 'exterior-treatment',
  Ozone_Treatment: 'ozone-treatment',
  Headlight_Treatment: 'headlight-treatment',
};

@Component({
  selector: 'app-admin-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-appointments.component.html',
})
export class AdminAppointmentsComponent {
  readonly appointments = input.required<AdminAppointment[]>();
  readonly acceptingIds = input<string[]>([]);
  readonly acceptError = input(false);
  @Output() readonly appointmentAccepted = new EventEmitter<AdminAppointment>();
  readonly appointmentUpdated = output<AdminAppointment>();

  private readonly admin = inject(AdminService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly copy = computed(() => this.i18n.copy().admin);
  protected readonly query = signal('');
  protected readonly status = signal<AppointmentStatusFilter>('all');
  protected readonly page = signal(1);
  protected readonly editingAppointment = signal<AdminAppointment | null>(null);
  protected readonly savingEdit = signal(false);
  protected readonly editError = signal(false);
  protected readonly washTypes = Object.keys(treatmentSlugByWashType) as WashType[];

  protected readonly filteredAppointments = computed(() => {
    const query = this.query().trim().toLowerCase();
    const status = this.status();

    return this.appointments()
      .filter((appointment) => {
        const matchesStatus =
          status === 'all' ||
          (status === 'accepted' && appointment.accepted) ||
          (status === 'pending' && !appointment.accepted);
        const matchesQuery =
          !query ||
          [
            appointment.customerName,
            appointment.customerEmail,
            appointment.customerPhoneNumber ?? '',
            this.treatmentName(appointment.washType),
          ].some((value) => value.toLowerCase().includes(query));
        return matchesStatus && matchesQuery;
      })
      .sort(
        (left, right) => this.dateValue(left.localDateTime) - this.dateValue(right.localDateTime),
      );
  });
  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredAppointments().length / pageSize)),
  );
  protected readonly paginatedAppointments = computed(() => {
    const page = Math.min(this.page(), this.pageCount());
    const start = (page - 1) * pageSize;
    return this.filteredAppointments().slice(start, start + pageSize);
  });

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  protected updateStatus(event: Event): void {
    this.status.set((event.target as HTMLSelectElement).value as AppointmentStatusFilter);
    this.page.set(1);
  }

  protected changePage(offset: number): void {
    this.page.update((page) => Math.min(this.pageCount(), Math.max(1, page + offset)));
  }

  protected isAccepting(id: string): boolean {
    return this.acceptingIds().includes(id);
  }

  protected startEditing(appointment: AdminAppointment): void {
    this.editError.set(false);
    this.editingAppointment.set({
      ...appointment,
      localDateTime: appointment.localDateTime.slice(0, 16),
    });
  }

  protected cancelEditing(): void {
    if (!this.savingEdit()) {
      this.editingAppointment.set(null);
      this.editError.set(false);
    }
  }

  protected saveAppointment(): void {
    const appointment = this.editingAppointment();
    if (!appointment || this.savingEdit() || !appointment.localDateTime) {
      return;
    }

    this.savingEdit.set(true);
    this.editError.set(false);
    this.admin
      .updateAppointment(appointment.id, {
        washType: appointment.washType,
        localDateTime: appointment.localDateTime,
        accepted: appointment.accepted,
      })
      .pipe(
        finalize(() => this.savingEdit.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (updated) => {
          this.appointmentUpdated.emit(updated);
          this.cancelEditing();
        },
        error: () => this.editError.set(true),
      });
  }

  protected treatmentName(washType: WashType): string {
    const slug = treatmentSlugByWashType[washType];
    return (
      this.i18n.copy().services.treatments.items.find((item) => item.slug === slug)?.title ??
      washType
    );
  }

  protected formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    this.i18n.language();
    return new Intl.DateTimeFormat(this.i18n.getCurrentLanguage(), {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }

  private dateValue(value: string): number {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
  }
}
