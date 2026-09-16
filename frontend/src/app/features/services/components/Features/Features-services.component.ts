import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  imports: [CommonModule, RouterModule],
  templateUrl: './Features-services.component.html',
})
export class FeaturesServicesComponent {
  @Input({ required: true }) features: ServicesFeatureCopy = defaultFeatures;
}
