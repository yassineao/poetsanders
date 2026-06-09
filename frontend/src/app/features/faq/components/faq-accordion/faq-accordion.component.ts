import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import type { FaqCopy } from '../../../../core/interfaces/faq';

@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-accordion.component.html',
})
export class FaqAccordionComponent {
  @Input({ required: true }) items: FaqCopy['items'] = [];

  protected readonly openItem = signal<number | null>(0);

  protected toggleItem(index: number): void {
    this.openItem.update((current) => (current === index ? null : index));
  }
}
