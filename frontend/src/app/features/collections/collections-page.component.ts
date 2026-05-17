import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18/i18n.service';

@Component({
  selector: 'app-collections-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collections-page.component.html',
})
export class CollectionsPageComponent {
  private readonly i18n = inject(I18nService);
  protected readonly copy = this.i18n.copy;
}
