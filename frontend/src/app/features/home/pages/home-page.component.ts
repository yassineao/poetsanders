import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { I18nService } from '../../../core/i18/i18n.service';
import { CardMainComponent } from '../components/card-main/card-main.components';
import { FirstHeroMainComponent } from '../components/firstHero-main/firstHero-main.components';
import { HeroMainComponent } from '../components/hero-main/hero-main.component';
import { MapsMainComponent } from '../components/maps-main/maps-main.components';
import { TestimonialsMainComponent } from '../components/testimonials-main/testimonials-main.components';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FirstHeroMainComponent, HeroMainComponent, CardMainComponent, TestimonialsMainComponent, MapsMainComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  private readonly i18n = inject(I18nService);
  protected readonly copy = this.i18n.copy;
  protected readonly hero = computed(() => ({
    ...this.copy().home.hero,
    description: this.copy().home.meta.description,
    primaryLink: `tel:${this.copy().home.maps.PHONE.replace(/[^+\d]/g, '')}`,
    highlightTitle: this.copy().home.cards.highlight.title,
    highlightBody: this.copy().home.cards.highlight.body,
    serviceNames: this.copy().home.cards.treatments.map((treatment) => treatment.title),
    contactItems: [
      {
        label: this.copy().home.maps.PHONE_LABEL,
        value: this.copy().home.maps.PHONE,
        href: `tel:${this.copy().home.maps.PHONE.replace(/[^+\d]/g, '')}`,
      },
      {
        label: this.copy().home.maps.MOBILE_LABEL,
        value: this.copy().home.maps.MOBILE,
        href: `tel:${this.copy().home.maps.MOBILE.replace(/[^+\d]/g, '')}`,
      },
      {
        label: this.copy().home.maps.ADDRESS_LABEL,
        value: this.copy().home.maps.ADDRESS_DETAILS,
        href: this.copy().home.maps.MAPS_URL,
      },
    ],
    reviewLabel: this.copy().home.testimonials.ratingLabel,
    trustItems: this.copy().home.hero.trustItems.map((item, index) =>
      index === 2 ? { ...item, value: String(this.copy().home.testimonials.testimonials.length) } : item,
    ),
  }));
}
