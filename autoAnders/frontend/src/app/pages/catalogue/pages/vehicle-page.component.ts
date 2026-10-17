import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import type { VehicleResult } from '../../../core/cars/vehicle.resolver';
import { specificationFields } from '../../../core/cars/car-specifications';
import { isValidLocale } from '../../../core/lib/i18n';
import { translateUi } from '../../../core/lib/i18n/ui-translations';
import { seoContent } from '../../../core/lib/seo-content';

@Component({
  imports: [RouterLink],
  templateUrl: './vehicle-page.component.html',
})
export class VehiclePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.parent!.paramMap);
  protected readonly result = toSignal(this.route.data.pipe(map(data => data['vehicle'] as VehicleResult)));
  protected readonly locale = computed(() => {
    const value = this.params()?.get('locale') ?? 'de';
    return isValidLocale(value) ? value : 'de';
  });
  protected readonly copy = computed(() => seoContent[this.locale()]);
  protected readonly fields = specificationFields;
  protected readonly facts = computed(() => {
    const car = this.result()?.car;
    if (!car) return [];
    return [
      { label: 'Year', value: car.yearOfManufacture },
      { label: 'Mileage', value: car.mileage == null ? null : `${this.number(car.mileage)} km` },
      { label: 'Fuel', value: car.fuel },
      { label: 'Gearbox', value: car.gearbox },
      { label: 'First registration', value: car.firstRegistrationDate },
      { label: 'Power', value: car.power },
      { label: 'Doors', value: car.numberOfDoors },
      { label: 'Colour', value: car.colour },
    ].filter(fact => fact.value !== null && fact.value !== undefined && fact.value !== '');
  });
  protected t(value: string): string { return translateUi(value, this.locale()); }
  protected number(value: number): string { return new Intl.NumberFormat(this.locale()).format(value); }
  protected value(value: unknown): string {
    if (typeof value === 'boolean') return this.t(value ? 'Yes' : 'No');
    if (typeof value === 'number') return this.number(value);
    return this.t(String(value));
  }
  protected price(value: number): string {
    return new Intl.NumberFormat(this.locale(), { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  }
}
