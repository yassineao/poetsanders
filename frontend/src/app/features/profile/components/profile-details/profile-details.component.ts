import { I18nService } from '../../../../core/i18/i18n.service';
import { translateUi } from '../../../../core/i18/ui-translations';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import type { AuthUser } from '../../../../core/interfaces/AuthUser';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent {
  protected t(value: string): string {
    return translateUi(value, this.i18n.getCurrentLanguage());
  }

  private readonly i18n = inject(I18nService);
  @Input({ required: true }) user!: AuthUser;
}
