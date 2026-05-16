import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { I18nService } from '../../core/i18/i18n.service';

@Component({
  selector: 'app-collections-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collections-page.component.html',
})
export class CollectionsPageComponent {
  copy = computed(() => {
    this.i18n.copy$();
    return this.i18n.getCurrentCopy();
  });

  constructor(private i18n: I18nService) {}
}
