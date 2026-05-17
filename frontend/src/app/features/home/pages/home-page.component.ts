import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { I18nService } from '../../../core/i18/i18n.service';
import { CardMainComponent } from '../components/card-main/card-main.components';
import { FirstHeroMainComponent } from '../components/firstHero-main/firstHero-main.components';
import { HeroMainComponent } from '../components/hero-main/hero-main.component';
import { MapsMainComponent } from '../components/maps-main/maps-main.components';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FirstHeroMainComponent, HeroMainComponent, CardMainComponent, MapsMainComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  private readonly i18n = inject(I18nService);
  protected readonly copy = this.i18n.copy;
  protected readonly hero = computed(() => ({
    ...this.copy().home.hero,
    description: this.copy().home.meta.description,
  }));
}
