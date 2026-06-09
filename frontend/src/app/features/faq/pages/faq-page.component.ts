import { Component, computed, inject } from '@angular/core';
import { I18nService } from '../../../core/i18/i18n.service';
import { FaqAccordionComponent } from '../components/faq-accordion/faq-accordion.component';
import { FaqCtaComponent } from '../components/faq-cta/faq-cta.component';
import { FaqHeroComponent } from '../components/faq-hero/faq-hero.component';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [FaqHeroComponent, FaqAccordionComponent, FaqCtaComponent],
  templateUrl: './faq-page.component.html',
})
export class FaqPageComponent {
  private readonly i18n = inject(I18nService);

  protected readonly faq = computed(() => this.i18n.copy().faq);
}
