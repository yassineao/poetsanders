import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';
import { CarsService } from '../../core/cars/cars.service';
import { CarSpecificationFieldsComponent } from '../../core/cars/car-specification-fields.component';
import { GuestCarRequest } from '../../core/interfaces/Car';
import { I18nService } from '../../core/i18/i18n.service';
import { translateUi } from '../../core/i18/ui-translations';

@Component({
  imports: [FormsModule, CarSpecificationFieldsComponent],
  template: `
    <main class="mx-auto max-w-5xl px-4 pb-20 pt-24 text-white sm:px-5 sm:pt-32">
      <h1 class="text-2xl font-bold sm:text-3xl">{{ t('Sell your car') }}</h1>
      <p class="mt-2 text-sm leading-6 text-slate-300 sm:mt-3 sm:text-base">{{ t('Submit your car without an account. We will contact you after review.') }}</p>
      @if (sent()) {
        <div role="status" class="mt-8 rounded-xl border border-emerald-300/30 bg-emerald-950 p-6">{{ t('Your car has been submitted for review.') }}</div>
      } @else {
        <form #form="ngForm" (ngSubmit)="submit(form)" class="mt-5 space-y-6 sm:mt-8">
          <fieldset [disabled]="sending()" class="space-y-6 disabled:opacity-60">
            <legend class="mb-4 text-xl font-semibold">{{ t('Contact details') }}</legend>
            <div class="grid gap-4 sm:grid-cols-3">
              <label>{{ t('Name') }}<input name="name" [(ngModel)]="request.name" required maxlength="255" class="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 p-3" /></label>
              <label>{{ t('Email') }}<input name="email" type="email" email [(ngModel)]="request.email" required maxlength="240" class="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 p-3" /></label>
              <label>{{ t('Phone number') }}<input name="phone" type="tel" [(ngModel)]="request.phoneNumber" required minlength="8" maxlength="30" class="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 p-3" /></label>
            </div>
            <h2 class="text-xl font-semibold">{{ t('Car details') }}</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <label>{{ t('Brand') }}<input name="brand" [(ngModel)]="request.car.brand" required class="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 p-3" /></label>
              <label>{{ t('Model') }}<input name="model" [(ngModel)]="request.car.model" required class="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 p-3" /></label>
              <label>{{ t('License plate') }}<input name="plate" [(ngModel)]="request.car.licensePlate" class="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 p-3" /></label>
              <label>{{ t('Year') }}<input name="year" type="number" min="1886" step="1" [(ngModel)]="request.car.yearOfManufacture" class="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 p-3" /></label>
              <label>{{ t('Mileage') }}<input name="mileage" type="number" min="0" step="1" [(ngModel)]="request.car.mileage" class="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 p-3" /></label>
              <label>{{ t('Price') }}<input name="price" type="number" min="0" step="0.01" [(ngModel)]="request.car.price" class="mt-2 w-full rounded-lg border border-white/10 bg-slate-900 p-3" /></label>
            </div>
            <details class="rounded-xl border border-white/10 p-5">
              <summary class="cursor-pointer font-semibold">{{ t('Specifications') }}</summary>
              <div class="mt-5"><app-car-specification-fields [values]="request.car" /></div>
            </details>
            <p class="text-sm text-slate-400">{{ t('Photo uploads require an account.') }}</p>
            @if (error()) { <p role="alert" class="text-rose-300">{{ error() }}</p> }
            <button type="submit" [disabled]="form.invalid || sending()" class="rounded-lg bg-cyan-300 px-6 py-3 font-bold text-slate-950 disabled:opacity-50">{{ t(sending() ? 'Sending…' : 'Submit car') }}</button>
          </fieldset>
        </form>
      }
    </main>
  `,
})
export class GuestCarPageComponent {
  private readonly cars = inject(CarsService);
  private readonly i18n = inject(I18nService);
  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal<string | null>(null);
  protected request: GuestCarRequest = { name: '', email: '', phoneNumber: '', car: { brand: '', model: '' } };
  protected t(value: string): string { return translateUi(value, this.i18n.getCurrentLanguage()); }
  protected submit(form: NgForm): void {
    if (form.invalid || this.sending()) return;
    const request = { ...this.request, name: this.request.name.trim(), email: this.request.email.trim(), phoneNumber: this.request.phoneNumber.trim(),
      car: { ...this.request.car, brand: this.request.car.brand.trim(), model: this.request.car.model.trim() } };
    if (!request.name || !request.car.brand || !request.car.model) return;
    this.sending.set(true);
    this.error.set(null);
    this.cars.addGuestCar(request).pipe(finalize(() => this.sending.set(false))).subscribe({
      next: () => this.sent.set(true),
      error: (error: HttpErrorResponse) => {
        const message = error.error?.detail ?? error.error?.message ?? error.error?.error;
        this.error.set(typeof message === 'string' ? message : this.t('Something went wrong. Please try again.'));
      },
    });
  }
}
