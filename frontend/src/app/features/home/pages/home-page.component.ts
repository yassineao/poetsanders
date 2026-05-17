import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { I18nService } from '../../../core/i18/i18n.service';
import { CardMainComponent } from '../components/card-main/card-main.components';
import { FirstHeroMainComponent } from '../components/firstHero-main/firstHero-main.components';
import { HeroMainComponent } from '../components/hero-main/hero-main.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, FirstHeroMainComponent, HeroMainComponent, CardMainComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  private readonly i18n = inject(I18nService);
  protected readonly copy = this.i18n.copy;
}
