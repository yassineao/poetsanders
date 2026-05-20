import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { HomeHeroCopy } from '../../../../core/interfaces/home';

type HeroContent = HomeHeroCopy & {
  description: string;
  highlightTitle?: string;
  highlightBody?: string;
  serviceNames?: string[];
  contactItems?: Array<{ label: string; value: string; href?: string }>;
  reviewLabel?: string;
};

const defaultHero: HeroContent = {
  eyebrow: '',
  heading: '',
  subheading: '',
  image: '/hero_Image.jpg',
  ctaPrimary: '',
  ctaSecondary: '',
  primaryLink: '#',
  secondaryLink: '#',
  features: [],
  trustItems: [],
  description: '',
  highlightTitle: '',
  highlightBody: '',
  serviceNames: [],
  contactItems: [],
  reviewLabel: '',
};

@Component({
  selector: 'app-first-hero-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './firstHero-main.components.html'
})
export class FirstHeroMainComponent {
  @Input() hero: HeroContent = defaultHero;
}
