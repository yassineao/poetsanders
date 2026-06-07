import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ServicesTreatmentsCopy } from '../../../../core/interfaces/services';

@Component({
  selector: 'app-service-detail-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './Service-detail-not-found.component.html',
})
export class ServiceDetailNotFoundComponent {
  @Input({ required: true }) copy!: ServicesTreatmentsCopy;
}
