import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ProfileAppointment {
  id: string[];
  localDateTime: string;
  label: string;
  treatmentNames: string[];
}

@Component({
  selector: 'app-profile-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-bookings.component.html',
})
export class ProfileBookingsComponent {
  @Input({ required: true }) appointments: ProfileAppointment[] = [];
  @Input() loading = false;
  @Input() hasError = false;
  @Input() cancellingIds: string[] = [];
  @Output() cancelAppointment = new EventEmitter<string[]>();

  protected cancel(ids: string[]): void {
    this.cancelAppointment.emit(ids);
  }

  protected isCancelling(ids: string[]): boolean {
    return ids.some((id) => this.cancellingIds.includes(id));
  }
}
