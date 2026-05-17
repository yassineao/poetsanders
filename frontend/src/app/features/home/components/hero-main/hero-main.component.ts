import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { HomeHeroCopy } from '../../../../core/interfaces/home';

type HeroContent = HomeHeroCopy & {
  description: string;
};

const defaultHero: HeroContent = {
  eyebrow: '',
  heading: '',
  subheading: '',
  image: '#',
  ctaPrimary: '',
  ctaSecondary: '',
  primaryLink: '#',
  secondaryLink: '#',
  features: [],
  trustItems: [],
  description: '',
};

@Component({
  selector: 'app-hero-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-main.component.html'
})
export class HeroMainComponent {
  @Input() hero: HeroContent = defaultHero;
}
