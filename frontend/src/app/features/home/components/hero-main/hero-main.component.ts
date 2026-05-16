import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-main.component.html'
})
export class HeroMainComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() description = '';
  @Input() ctaPrimary = '';
  @Input() ctaSecondary = '';
  @Input() primaryLink = '#';
  @Input() secondaryLink = '#';
  @Input() features: string[] = [];
}
