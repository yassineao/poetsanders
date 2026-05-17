import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-first-hero-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './firstHero-main.components.html'
})
export class FirstHeroMainComponent {
  @Input() title = '';
  @Input() eyebrow = '';
  @Input() subtitle = '';
  @Input() description = '';
  @Input() ctaPrimary = '';
  @Input() ctaSecondary = '';
  @Input() primaryLink = '#';
  @Input() secondaryLink = '#';
  @Input() features: string[] = [];
  @Input() trustItems: Array<{ value: string; label: string }> = [];
  @Input() ImageUrl = '#';
}
