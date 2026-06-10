import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { I18nService } from '../../../../core/i18/i18n.service';
import type { CalendarDay } from '../booking-form.models';

@Component({
  selector: 'app-booking-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-schedule.component.html',
})
export class BookingScheduleComponent {
  @Input() monthLabel = '';
  @Input() calendarDays: Array<CalendarDay | null> = [];
  @Input() selectedDate: Date | null = null;
  @Input() selectedTime = '';
  @Input() selectedAppointmentLabel = '';
  @Input() attemptedSubmit = false;
  @Input() submitting = false;
  @Input() errorMessage = '';
  @Input() appointmentRequired = true;
  @Input() guestRegistrationMode = false;
  @Input() submitLabel = '';
  @Input() submittingLabel = '';
  @Output() readonly previousMonth = new EventEmitter<void>();
  @Output() readonly nextMonth = new EventEmitter<void>();
  @Output() readonly dateSelected = new EventEmitter<CalendarDay>();
  @Output() readonly timeSelected = new EventEmitter<string>();

  private readonly i18n = inject(I18nService);
  protected readonly copy = computed(() => this.i18n.copy().booking);

  protected isSelectedDate(date: Date): boolean {
    return !!this.selectedDate && this.selectedDate.getTime() === date.getTime();
  }
}
