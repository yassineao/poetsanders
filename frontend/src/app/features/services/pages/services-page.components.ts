import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { I18nService } from '../../../core/i18/i18n.service';
import { FeaturesServicesComponent } from '../components/Features/Features-services.component';
import { HeroServicesComponent } from '../components/Hero-services/Hero-services.component';
import { TreatmentsServicesComponent } from '../components/Treatments/Treatments-services.component';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, HeroServicesComponent, FeaturesServicesComponent, TreatmentsServicesComponent],
  templateUrl: './services-page.component.html',
})
export class ServicesPageComponent {
  private readonly i18n = inject(I18nService);
  protected readonly copy = this.i18n.copy;
  protected readonly hero = computed(() => this.copy().services.hero);
  protected readonly features = computed(() => this.copy().services.features);
  protected readonly treatments = computed(() => this.copy().services.treatments);
}
