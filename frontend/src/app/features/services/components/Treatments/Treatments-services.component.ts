import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ServicesTreatmentsCopy } from '../../../../core/interfaces/services';

const defaultTreatments: ServicesTreatmentsCopy = {
  eyebrow: '',
  heading: '',
  description: '',
  includedLabel: '',
  detailLinkLabel: '',
  benefitsLabel: '',
  processLabel: '',
  backLabel: '',
  bookLabel: '',
  bookLink: '#',
  notFoundTitle: '',
  items: [],
};

@Component({
  selector: 'app-treatments-services',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './Treatments-services.component.html',
})
export class TreatmentsServicesComponent {
  @Input({ required: true }) treatments: ServicesTreatmentsCopy = defaultTreatments;
}
