import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { HomeCardsSectionCopy } from '../../../../core/interfaces/types';

@Component({
  selector: 'app-card-main',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card-main.components.html',
})
export class CardMainComponent {
  @Input({ required: true }) cards!: HomeCardsSectionCopy;
  @Input() dealershipUrl = '';
  @Input() dealershipLabel = 'AutoAnders';
  @Input() detailLabel = '';
  @Input() beforeLabel = 'Before';
  @Input() afterLabel = 'After';

  private readonly comparisonImages: Record<string, string> = {
    'total-treatment': '/treatments/total-treatment-before-after.png',
    'interior-treatment': '/treatments/interior-treatment-before-after.png',
    'exterior-treatment': '/treatments/exterior-treatment-before-after.png',
    'headlight-treatment': '/treatments/headlight-treatment-before-after.png',
  };

  comparisonImage(slug: string): string | null {
    return this.comparisonImages[slug] ?? null;
  }
}
