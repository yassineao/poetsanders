import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ServiceTreatmentCopy, ServicesTreatmentsCopy } from '../../../../core/interfaces/services';

@Component({
  selector: 'app-service-detail-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './Service-detail-hero.component.html',
})
export class ServiceDetailHeroComponent {
  @Input({ required: true }) treatment!: ServiceTreatmentCopy;
  @Input({ required: true }) copy!: ServicesTreatmentsCopy;
}
