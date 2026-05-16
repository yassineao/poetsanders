import { deCopy } from './de';
import { enCopy } from './en';
import { nlCopy } from './nl';

export type Locale = 'en' | 'de' | 'nl';

export interface Copy {
  home: {
    pageTitle: string;
    description: string;
    heroHeading: string;
    heroSubheading: string;
    ctaPrimary: string;
    ctaSecondary: string;
    features: string[];
    cards: Array<{ title: string; body: string }>;
  };
  collections: {
    heading: string;
    description: string;
    cards: Array<{ title: string; body: string }>;
  };
  navbar: {
    home: string;
    collections: string;
    ctaPrimary: string;
    langLabel: string;
    langNames: Record<Locale, string>;
    menuToggle: string;
  };
}

export const translationMap: Record<Locale, Copy> = {
  en: enCopy,
  de: deCopy,
  nl: nlCopy,
};
