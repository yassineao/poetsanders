import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { I18nService } from '../../../../core/i18/i18n.service';
import type { ServiceTreatmentCopy } from '../../../../core/interfaces/services';
import type { BookingFormGroup, BookingMode } from '../booking-form.models';

const totalTreatmentSlug = 'total-treatment';
const treatmentsIncludedInTotal = ['interior-treatment', 'exterior-treatment'];

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './booking-details.component.html',
})
export class BookingDetailsComponent {
  @Input({ required: true }) form!: BookingFormGroup;
  @Input() isAuthenticated = false;
  @Input() bookingMode: BookingMode = 'register';
  @Input() treatments: ServiceTreatmentCopy[] = [];
  @Input() selectedServiceSlugs: string[] = [];
  @Input() selectedTreatmentNames: string[] = [];
  @Input() appointmentRequired = true;
  @Input() guestRegistrationMode = false;
  @Output() readonly bookingModeChange = new EventEmitter<BookingMode>();
  @Output() readonly guestRegistrationSelected = new EventEmitter<void>();
  @Output() readonly guestRegistrationCancelled = new EventEmitter<void>();
  @Output() readonly treatmentToggled = new EventEmitter<string>();

  private readonly i18n = inject(I18nService);
  protected readonly copy = computed(() => this.i18n.copy().booking);

  protected isTreatmentSelected(slug: string): boolean {
    return this.selectedServiceSlugs.includes(slug);
  }

  protected isTreatmentDisabled(slug: string): boolean {
    return (
      this.isTreatmentSelected(totalTreatmentSlug) &&
      treatmentsIncludedInTotal.includes(slug)
    );
  }
}
