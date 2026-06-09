import { Component, Input } from '@angular/core';
import type { FaqCopy } from '../../../../core/interfaces/faq';

@Component({
  selector: 'app-faq-hero',
  standalone: true,
  templateUrl: './faq-hero.component.html',
})
export class FaqHeroComponent {
  @Input({ required: true }) faq!: FaqCopy;
}
