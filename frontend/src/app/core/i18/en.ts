import type { Copy } from './index';

export const enCopy: Copy = {
  home: {
    pageTitle: 'Poetry Sanders - Multilingual Poems & Stories',
    description: 'Discover poetry and storytelling in English, German and Dutch. Fast, responsive content with SEO metadata for every language.',
    heroHeading: 'Creativity meets every language.',
    heroSubheading: 'Read beautiful stories and poems in English, Deutsch und Nederlands.',
    ctaPrimary: 'Read the latest',
    ctaSecondary: 'See the collections',
    features: [
      'Live language switching for the full page',
      'SEO-friendly title and description metadata',
      'Responsive Tailwind hero layout',
    ],
    cards: [
      {
        title: 'Built for SEO',
        body: 'All search metadata updates automatically when you switch languages.',
      },
      {
        title: 'Complete multilingual copy',
        body: 'Page text, buttons, and cards are translated for every selected locale.',
      },
      {
        title: 'Elegant Tailwind hero',
        body: 'A modern hero section with strong visual hierarchy and accessible controls.',
      },
    ],
  },
  collections: {
    heading: 'Collections',
    description: 'Browse our curated collections of poetry and stories in multiple languages.',
    cards: [
      {
        title: 'English Collection',
        body: 'Discover beautiful works originally written or translated to English.',
      },
      {
        title: 'German Collection',
        body: 'Discover beautiful works in German.',
      },
      {
        title: 'Dutch Collection',
        body: 'Discover beautiful works in Dutch.',
      },
      {
        title: 'All Languages',
        body: 'Browse content across all supported languages.',
      },
    ],
  },
  navbar: {
    home: 'Home',
    collections: 'Collections',
    ctaPrimary: 'Read the latest',
    langLabel: 'Language',
    langNames: {
      en: 'English',
      de: 'Deutsch',
      nl: 'Nederlands',
    },
    menuToggle: 'Toggle navigation',
  },
};
