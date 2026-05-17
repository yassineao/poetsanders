import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { HomeCardsSectionCopy } from '../../../../core/interfaces/types';

@Component({
  selector: 'app-card-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-main.components.html',
})
export class CardMainComponent {
  @Input({ required: true }) cards!: HomeCardsSectionCopy;
}
