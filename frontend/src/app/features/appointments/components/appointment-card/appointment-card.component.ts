import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { I18nService } from '../../../../core/i18/i18n.service';

export type AppointmentAcceptanceStatus = 'accepted' | 'pending' | 'partial';

export interface AppointmentViewModel {
  ids: string[];
  localDateTime: string;
  label: string;
  treatmentNames: string[];
  acceptanceStatus: AppointmentAcceptanceStatus;
}

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-card.component.html',
})
export class AppointmentCardComponent {
  @Input({ required: true }) appointment!: AppointmentViewModel;
  @Input() isCancelling = false;
  @Output() readonly cancelled = new EventEmitter<void>();

  private readonly i18n = inject(I18nService);
  protected readonly copy = computed(() => this.i18n.copy().home.appointments);
}
