import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import type { Locale } from '../../../core/i18';
import { I18nService } from '../../../core/i18/i18n.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.components.html'
})
export class FooterComponent {
  private readonly i18n = inject(I18nService);

  protected readonly currentYear = new Date().getFullYear();
  protected readonly languages = this.i18n.languages;
  protected readonly selectedLanguage = this.i18n.language;
  protected readonly copy = this.i18n.copy;
  protected readonly footer = computed(() => this.copy().footer);
  protected readonly services = computed(() =>
    this.copy().services.treatments.items.map((treatment) => ({
      label: treatment.title,
      routerLink: `/services/${treatment.slug}`,
    })),
  );
  protected readonly contactItems = computed(() => [
    {
      label: this.copy().home.maps.PHONE,
      href: `tel:${this.copy().home.maps.PHONE.replace(/[^+\d]/g, '')}`,
      icon: 'phone',
    },
    {
      label: this.copy().home.maps.EMAIL,
      href: `mailto:${this.copy().home.maps.EMAIL}`,
      icon: 'email',
    },
    {
      label: this.copy().home.maps.ADDRESS_DETAILS,
      href: this.copy().home.maps.MAPS_URL,
      icon: 'location',
    },
  ]);

  protected setLanguage(language: Locale): void {
    this.i18n.setLanguage(language);
  }
}
