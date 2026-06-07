import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { I18nService } from '../../../core/i18/i18n.service';
import { ServiceDetailContentComponent } from '../components/ServiceDetailContent/Service-detail-content.component';
import { ServiceDetailHeroComponent } from '../components/ServiceDetailHero/Service-detail-hero.component';
import { ServiceDetailNotFoundComponent } from '../components/ServiceDetailNotFound/Service-detail-not-found.component';
import { ServiceDetailOverviewComponent } from '../components/ServiceDetailOverview/Service-detail-overview.component';

@Component({
  selector: 'app-service-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    ServiceDetailHeroComponent,
    ServiceDetailOverviewComponent,
    ServiceDetailContentComponent,
    ServiceDetailNotFoundComponent,
  ],
  templateUrl: './service-detail-page.component.html',
})
export class ServiceDetailPageComponent {
  private readonly i18n = inject(I18nService);
  private readonly route = inject(ActivatedRoute);
  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug'))),
    { initialValue: this.route.snapshot.paramMap.get('slug') },
  );

  protected readonly treatments = computed(() => this.i18n.copy().services.treatments);
  protected readonly treatment = computed(() =>
    this.treatments().items.find((item) => item.slug === this.slug()),
  );
}
