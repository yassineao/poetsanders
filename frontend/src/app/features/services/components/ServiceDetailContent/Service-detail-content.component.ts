import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ServiceTreatmentDetailsCopy, ServicesTreatmentsCopy } from '../../../../core/interfaces/services';

@Component({
  selector: 'app-service-detail-content',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './Service-detail-content.component.html',
})
export class ServiceDetailContentComponent {
  @Input({ required: true }) details!: ServiceTreatmentDetailsCopy;
  @Input({ required: true }) copy!: ServicesTreatmentsCopy;
}
