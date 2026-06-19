import { CommonModule } from '@angular/common';
import { Component, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { I18nService } from '../../../../core/i18/i18n.service';
import type { Car, CarStatus } from '../../../../core/interfaces/Car';

export interface CarStatusChange {
  car: Car;
  status: CarStatus;
}

type CarStatusFilter = 'all' | CarStatus;

const pageSize = 10;

@Component({
  selector: 'app-admin-cars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-cars.html',
})
export class AdminCarsComponent {
  readonly cars = input.required<Car[]>();
  readonly updatingIds = input<string[]>([]);
  readonly updateError = input(false);
  readonly statusChanged = output<CarStatusChange>();

  private readonly i18n = inject(I18nService);
  protected readonly copy = computed(() => this.i18n.copy().admin);
  protected readonly query = signal('');
  protected readonly status = signal<CarStatusFilter>('all');
  protected readonly page = signal(1);
  protected readonly selectedCar = signal<Car | null>(null);
  protected readonly selectedPicturesCar = signal<Car | null>(null);
  protected readonly statuses: CarStatus[] = [
    'Available',
    'Pending_Confirmation',
    'Booked',
    'Cancelled',
  ];

  protected readonly filteredCars = computed(() => {
    const query = this.query().trim().toLowerCase();
    const status = this.status();

    return this.cars().filter((car) => {
      const matchesStatus = status === 'all' || car.status === status;
      const matchesQuery =
        !query ||
        [
          car.brand,
          car.model,
          car.title,
          car.licensePlate,
          car.referenceNumber,
          String(car.yearOfManufacture ?? ''),
        ].some((value) => String(value ?? '').toLowerCase().includes(query));

      return matchesStatus && matchesQuery;
    });
  });

  protected readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredCars().length / pageSize)),
  );

  protected readonly paginatedCars = computed(() => {
    const page = Math.min(this.page(), this.pageCount());
    const start = (page - 1) * pageSize;
    return this.filteredCars().slice(start, start + pageSize);
  });

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.page.set(1);
  }

  protected updateFilter(event: Event): void {
    this.status.set((event.target as HTMLSelectElement).value as CarStatusFilter);
    this.page.set(1);
  }

  protected updateCarStatus(car: Car, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as CarStatus;
    if (status !== car.status) {
      this.statusChanged.emit({ car, status });
    }
  }

  protected changePage(offset: number): void {
    this.page.update((page) => Math.min(this.pageCount(), Math.max(1, page + offset)));
  }

  protected isUpdating(id: string): boolean {
    return this.updatingIds().includes(id);
  }

  protected statusLabel(status: CarStatus): string {
    const copy = this.copy();
    const labels: Record<CarStatus, string> = {
      Available: copy.availableLabel,
      Pending_Confirmation: copy.pendingLabel,
      Booked: copy.bookedLabel,
      Cancelled: copy.cancelledLabel,
    };
    return labels[status];
  }

  protected formatPrice(value: number): string {
    this.i18n.language();
    return new Intl.NumberFormat(this.i18n.getCurrentLanguage(), {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value ?? 0);
  }

  protected characteristics(car: Car): Array<{ label: string; value: string }> {
    return Object.entries(car)
      .filter(([key]) => key !== 'pictures' && key !== 'user')
      .map(([key, value]) => ({
        label: this.humanize(key),
        value: this.formatCharacteristic(key, value),
      }));
  }

  protected closeDetails(): void {
    this.selectedCar.set(null);
  }

  protected closePictures(): void {
    this.selectedPicturesCar.set(null);
  }

  @HostListener('document:keydown.escape')
  protected closeDialogs(): void {
    this.closeDetails();
    this.closePictures();
  }

  private humanize(value: string): string {
    const words = value
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replaceAll('_', ' ')
      .toLowerCase();
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  private formatCharacteristic(key: string, value: unknown): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (key === 'price' || key.toLowerCase().includes('leaseprice')) {
      return this.formatPrice(Number(value));
    }

    if (typeof value === 'string' && value.includes('_')) {
      return this.humanize(value);
    }

    return String(value);
  }
}
