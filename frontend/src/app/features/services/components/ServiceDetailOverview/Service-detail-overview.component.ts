import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { ServiceTreatmentCopy, ServicesTreatmentsCopy } from '../../../../core/interfaces/services';

@Component({
  selector: 'app-service-detail-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Service-detail-overview.component.html',
})
export class ServiceDetailOverviewComponent {
  @Input({ required: true }) treatment!: ServiceTreatmentCopy;
  @Input({ required: true }) copy!: ServicesTreatmentsCopy;
}
