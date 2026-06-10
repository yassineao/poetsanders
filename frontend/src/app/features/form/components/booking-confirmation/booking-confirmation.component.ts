import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../../../core/i18/i18n.service';
import type { BookingConfirmation } from '../booking-form.models';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-confirmation.component.html',
})
export class BookingConfirmationComponent {
  @Input({ required: true }) confirmation!: BookingConfirmation;
  @Output() readonly startAnother = new EventEmitter<void>();

  private readonly i18n = inject(I18nService);
  protected readonly copy = computed(() => this.i18n.copy().booking);
}
