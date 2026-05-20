import type { Locale } from './locale';

export interface ServicesHeroCopy {
    title: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    announcement: string;
}

export interface ServicesFeatureCopy {
  eyebrow: string;
  heading: string;
  description: string;
  items: Array<{
    title: string;
    body: string;
    icon: 'sparkle' | 'shield' | 'clock' | 'drop';
  }>;
}

export interface ServicesCopy {
  meta: ServicesHeroCopy;
  hero: ServicesHeroCopy;
  features: ServicesFeatureCopy;
}

