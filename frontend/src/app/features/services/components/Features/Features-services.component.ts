import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ServicesFeatureCopy } from '../../../../core/interfaces/services';

const defaultFeatures: ServicesFeatureCopy = {
  eyebrow: '',
  heading: '',
  description: '',
  items: [],
};

@Component({
  selector: 'app-features-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './Features-services.component.html',
})
export class FeaturesServicesComponent {
  @Input({ required: true }) features: ServicesFeatureCopy = defaultFeatures;
}
