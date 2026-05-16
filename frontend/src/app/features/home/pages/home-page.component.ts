import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { HeroMainComponent } from '../components/hero-main/hero-main.component';
import { I18nService } from '../../../core/i18/i18n.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HeroMainComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  copy = computed(() => {
    this.i18n.copy$();
    return this.i18n.getCurrentCopy();
  });

  constructor(private i18n: I18nService) {}
}
