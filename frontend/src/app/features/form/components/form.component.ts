import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { I18nService } from '../../../core/i18/i18n.service';

interface CalendarDay {
  date: Date;
  day: number;
  disabled: boolean;
}

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
})
export class BookingFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly i18n = inject(I18nService);
  private readonly today = this.startOfDay(new Date());

  protected readonly copy = computed(() => this.i18n.copy().booking);
  protected readonly treatments = computed(() => this.i18n.copy().services.treatments.items);
  protected readonly viewMonth = signal(new Date(this.today.getFullYear(), this.today.getMonth(), 1));
  protected readonly selectedDate = signal<Date | null>(null);
  protected readonly selectedTime = signal('');
  protected readonly submitted = signal(false);
  protected readonly attemptedSubmit = signal(false);

  protected readonly bookingForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    vehicle: ['', Validators.required],
    services: this.formBuilder.nonNullable.control<string[]>([], Validators.required),
    message: [''],
  });

  protected readonly selectedServiceSlugs = toSignal(
    this.bookingForm.controls.services.valueChanges,
    { initialValue: this.bookingForm.controls.services.value },
  );

  protected readonly monthLabel = computed(() => {
    this.i18n.language();
    return new Intl.DateTimeFormat(this.i18n.getCurrentLanguage(), {
      month: 'long',
      year: 'numeric',
    }).format(this.viewMonth());
  });

  protected readonly calendarDays = computed<Array<CalendarDay | null>>(() => {
    const month = this.viewMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const days: Array<CalendarDay | null> = Array.from({ length: firstWeekday }, () => null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, monthIndex, day);
      days.push({
        date,
        day,
        disabled: date < this.today,
      });
    }

    return days;
  });

  protected readonly selectedAppointmentLabel = computed(() => {
    const date = this.selectedDate();
    const time = this.selectedTime();
    if (!date || !time) {
      return '';
    }

    this.i18n.language();
    const formattedDate = new Intl.DateTimeFormat(this.i18n.getCurrentLanguage(), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);

    return `${formattedDate}, ${time}`;
  });

  protected previousMonth(): void {
    const current = this.viewMonth();
    const previous = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    const earliest = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    if (previous >= earliest) {
      this.viewMonth.set(previous);
    }
  }

  protected nextMonth(): void {
    const current = this.viewMonth();
    this.viewMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  protected selectDate(day: CalendarDay): void {
    if (day.disabled) {
      return;
    }
    this.selectedDate.set(day.date);
    this.selectedTime.set('');
    this.submitted.set(false);
  }

  protected selectTime(time: string): void {
    if (!this.selectedDate()) {
      return;
    }
    this.selectedTime.set(time);
    this.submitted.set(false);
  }

  protected isSelectedDate(date: Date): boolean {
    const selected = this.selectedDate();
    return !!selected && selected.getTime() === date.getTime();
  }

  protected toggleTreatment(slug: string): void {
    const control = this.bookingForm.controls.services;
    const current = control.value;
    const next = current.includes(slug)
      ? current.filter((selectedSlug) => selectedSlug !== slug)
      : [...current, slug];

    control.setValue(next);
    control.markAsTouched();
    this.submitted.set(false);
  }

  protected isTreatmentSelected(slug: string): boolean {
    return this.selectedServiceSlugs().includes(slug);
  }

  protected readonly selectedTreatmentNames = computed(() => {
    const selectedSlugs = this.selectedServiceSlugs();
    return this.treatments()
      .filter((treatment) => selectedSlugs.includes(treatment.slug))
      .map((treatment) => treatment.title);
  });

  protected submit(): void {
    this.attemptedSubmit.set(true);
    this.submitted.set(false);
    this.bookingForm.markAllAsTouched();

    if (this.bookingForm.invalid || !this.selectedDate() || !this.selectedTime()) {
      return;
    }

    this.submitted.set(true);
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
}
