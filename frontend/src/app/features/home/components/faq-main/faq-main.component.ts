import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import type { FaqCopy } from '../../../../core/interfaces/faq';

@Component({
  selector: 'app-faq-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faq-main.component.html',
})
export class FaqMainComponent {
  @Input({ required: true }) faq!: FaqCopy;

  protected readonly openItem = signal<number | null>(0);

  protected toggleItem(index: number): void {
    this.openItem.update((current) => (current === index ? null : index));
  }
}
