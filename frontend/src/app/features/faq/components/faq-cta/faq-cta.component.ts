import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import type { FaqCopy } from '../../../../core/interfaces/faq';

@Component({
  selector: 'app-faq-cta',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './faq-cta.component.html',
})
export class FaqCtaComponent {
  @Input({ required: true }) faq!: FaqCopy;
}
