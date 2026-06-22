import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  HostListener,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { finalize, map, of, switchMap } from 'rxjs';
import { AdminService } from '../../../../core/admin/admin.service';
import { CarsService } from '../../../../core/cars/cars.service';
import { I18nService } from '../../../../core/i18/i18n.service';
import type {
  Car,
  CarPictureRequest,
  CarRequest,
  CarStatus,
} from '../../../../core/interfaces/Car';

export interface CarStatusChange {
  car: Car;
  status: CarStatus;
}

type CarStatusFilter = 'all' | CarStatus;
type CarRequestKey = keyof CarRequest;

interface CarField {
  key: CarRequestKey;
  type: 'text' | 'number' | 'date';
  step?: string;
}

interface CarSelectField {
  key: CarRequestKey;
  options: readonly string[];
}

const pageSize = 10;

@Component({
  selector: 'app-admin-cars',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-cars.html',
})
export class AdminCarsComponent {
  readonly cars = input.required<Car[]>();
  readonly updatingIds = input<string[]>([]);
  readonly updateError = input(false);
  readonly statusChanged = output<CarStatusChange>();
  readonly carUpdated = output<Car>();
  readonly carCreated = output<Car>();

  private readonly admin = inject(AdminService);
  private readonly carsService = inject(CarsService);
  private readonly i18n = inject(I18nService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly copy = computed(() => this.i18n.copy().admin);
  protected readonly query = signal('');
  protected readonly status = signal<CarStatusFilter>('all');
  protected readonly page = signal(1);
  protected readonly selectedCar = signal<Car | null>(null);
  protected readonly selectedPicturesCar = signal<Car | null>(null);
  protected readonly editingCar = signal<Car | null>(null);
  protected readonly savingEdit = signal(false);
  protected readonly editError = signal(false);
  protected readonly creatingCar = signal<CarRequest | null>(null);
  protected readonly newCarPictures = signal<File[]>([]);
  protected readonly newCarPicturePreviews = signal<string[]>([]);
  protected readonly creating = signal(false);
  protected readonly createError = signal<string | null>(null);
  protected readonly statuses: CarStatus[] = [
    'Available',
    'Pending_Confirmation',
    'Booked',
    'Cancelled',
  ];
  protected readonly createFields: CarField[] = [
    { key: 'brand', type: 'text' },
    { key: 'model', type: 'text' },
    { key: 'title', type: 'text' },
    { key: 'subtitle', type: 'text' },
    { key: 'yearOfManufacture', type: 'number' },
    { key: 'mileage', type: 'number' },
    { key: 'power', type: 'text' },
    { key: 'referenceNumber', type: 'text' },
    { key: 'price', type: 'number', step: '0.01' },
    { key: 'firstRegistrationDate', type: 'date' },
    { key: 'numberOfDoors', type: 'number' },
    { key: 'wheelbase', type: 'number' },
    { key: 'numberOfCylinders', type: 'number' },
    { key: 'motorVehicleTax', type: 'text' },
    { key: 'modelDateFrom', type: 'date' },
    { key: 'modelDateTo', type: 'date' },
    { key: 'maxTowingWeight', type: 'number' },
    { key: 'maxTowingWeightUnbraked', type: 'number' },
    { key: 'urbanFuelConsumption', type: 'number', step: '0.01' },
    { key: 'combinedFuelConsumption', type: 'number', step: '0.01' },
    { key: 'motorwayFuelConsumption', type: 'number', step: '0.01' },
    { key: 'co2Emissions', type: 'number' },
    { key: 'chassisNumber', type: 'text' },
    { key: 'numberOfKeys', type: 'number' },
    { key: 'licensePlate', type: 'text' },
    { key: 'engineDisplacement', type: 'number' },
    { key: 'colour', type: 'text' },
    { key: 'emptyWeight', type: 'number' },
    { key: 'taxAdditionPercentage', type: 'number', step: '0.01' },
    { key: 'apkMotDate', type: 'text' },
    { key: 'location', type: 'text' },
    { key: 'financialLeasePricePerMonth', type: 'number', step: '0.01' },
    { key: 'leasePrice60Months', type: 'number', step: '0.01' },
    { key: 'leasePrice48Months', type: 'number', step: '0.01' },
    { key: 'leasePrice36Months', type: 'number', step: '0.01' },
  ];
  protected readonly createSelectFields: CarSelectField[] = [
    { key: 'bodyType', options: ['MPV', 'SUV', 'SEDAN', 'HATCHBACK', 'STATION_WAGON', 'COUPE', 'CABRIOLET', 'VAN'] },
    { key: 'gearbox', options: ['MANUAL', 'AUTOMATIC', 'SEMI_AUTOMATIC'] },
    { key: 'fuel', options: ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'LPG', 'CNG'] },
    { key: 'emissionClass', options: ['EURO_1', 'EURO_2', 'EURO_3', 'EURO_4', 'EURO_5', 'EURO_6'] },
    { key: 'energyLabel', options: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
    { key: 'paintType', options: ['BASIC', 'METALLIC', 'PEARL', 'MATTE'] },
    { key: 'upholstery', options: ['FABRIC', 'LEATHER', 'PART_LEATHER', 'ALCANTARA'] },
    { key: 'status', options: this.statuses },
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

  protected startEditing(car: Car): void {
    this.editError.set(false);
    this.editingCar.set({ ...car });
  }

  protected startCreating(): void {
    this.createError.set(null);
    this.creatingCar.set({
      brand: '',
      model: '',
      title: '',
      licensePlate: '',
      yearOfManufacture: new Date().getFullYear(),
      mileage: 0,
      price: 0,
      colour: '',
      location: '',
      status: 'Pending_Confirmation',
      subtitle: '',
      power: '',
      referenceNumber: '',
      firstRegistrationDate: null as unknown as string,
      numberOfDoors: 0,
      wheelbase: 0,
      numberOfCylinders: 0,
      motorVehicleTax: '',
      modelDateFrom: null as unknown as string,
      modelDateTo: null as unknown as string,
      maxTowingWeight: 0,
      maxTowingWeightUnbraked: 0,
      urbanFuelConsumption: 0,
      combinedFuelConsumption: 0,
      motorwayFuelConsumption: 0,
      co2Emissions: 0,
      taxDeductible: false,
      chassisNumber: '',
      numberOfKeys: 0,
      engineDisplacement: 0,
      emptyWeight: 0,
      taxAdditionPercentage: 0,
      apkMotDate: '',
      serviceDocumentation: false,
      financialLeasePricePerMonth: 0,
      leasePrice60Months: 0,
      leasePrice48Months: 0,
      leasePrice36Months: 0,
      bodyType: 'SEDAN',
      gearbox: 'MANUAL',
      fuel: 'PETROL',
      emissionClass: 'EURO_6',
      energyLabel: 'A',
      paintType: 'BASIC',
      upholstery: 'FABRIC',
    });
    this.clearNewCarPictures();
  }

  protected cancelCreating(): void {
    if (!this.creating()) {
      this.creatingCar.set(null);
      this.clearNewCarPictures();
      this.createError.set(null);
    }
  }

  protected saveNewCar(): void {
    const car = this.creatingCar();
    if (!car || this.creating() || !car.brand.trim() || !car.model.trim()) {
      return;
    }

    this.creating.set(true);
    this.createError.set(null);
    const pictures = this.toPictureRequests(this.newCarPictures());
    this.carsService
      .addCar(car)
      .pipe(
        switchMap((created) =>
          pictures.length
            ? this.carsService.addCarPictures(created.id, pictures).pipe(
                map((uploadedPictures) => ({ ...created, pictures: uploadedPictures })),
              )
            : of(created),
        ),
        finalize(() => this.creating.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (created) => {
          this.carCreated.emit(created);
          this.cancelCreating();
        },
        error: (error: HttpErrorResponse) => this.createError.set(this.errorMessage(error)),
      });
  }

  protected updateNewCarPictures(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    this.clearNewCarPictures();
    this.newCarPictures.set(files);
    this.newCarPicturePreviews.set(files.map((file) => URL.createObjectURL(file)));
  }

  protected closeCreateError(): void {
    this.createError.set(null);
  }

  protected createFieldLabel(key: CarRequestKey): string {
    return this.humanize(String(key));
  }

  protected cancelEditing(): void {
    if (!this.savingEdit()) {
      this.editingCar.set(null);
      this.editError.set(false);
    }
  }

  protected saveCar(): void {
    const car = this.editingCar();
    if (!car || this.savingEdit() || !car.brand.trim() || !car.model.trim()) {
      return;
    }

    this.savingEdit.set(true);
    this.editError.set(false);
    const { id, user: _user, pictures: _pictures, ...request } = car;
    this.admin
      .updateCar(id, request)
      .pipe(
        finalize(() => this.savingEdit.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (updated) => {
          this.carUpdated.emit(updated);
          this.cancelEditing();
        },
        error: () => this.editError.set(true),
      });
  }

  @HostListener('document:keydown.escape')
  protected closeDialogs(): void {
    this.closeDetails();
    this.closePictures();
    this.cancelEditing();
    this.cancelCreating();
  }

  protected humanize(value: string): string {
    const words = value
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replaceAll('_', ' ')
      .toLowerCase();
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  private toPictureRequests(files: File[]): CarPictureRequest[] {
    return files.map((file) => ({
      file,
      title: file.name,
      description: file.name,
      width: 0,
      height: 0,
    }));
  }

  private clearNewCarPictures(): void {
    this.newCarPicturePreviews().forEach((url) => URL.revokeObjectURL(url));
    this.newCarPicturePreviews.set([]);
    this.newCarPictures.set([]);
  }

  private errorMessage(error: HttpErrorResponse): string {
    const body = error.error;
    if (typeof body === 'string' && body.trim()) {
      return body;
    }
    if (body && typeof body === 'object') {
      const message = body.detail ?? body.message ?? body.error;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }
    return this.copy().carCreateErrorLabel;
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
