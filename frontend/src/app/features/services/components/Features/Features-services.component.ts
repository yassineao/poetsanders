import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { I18nService } from '../../../../core/i18/i18n.service';
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
  protected readonly i18n = inject(I18nService);
  @Input({ required: true }) features: ServicesFeatureCopy = defaultFeatures;
}
