import type { HomeHeroCopy } from '../../../../interfaces/types';

export const enHomeHeroCopy: HomeHeroCopy = {
  eyebrow: 'Car cleaning in Papendrecht',
  heading: 'Your car clean, polished, and ready to drive.',
  subheading: 'Poets Anders handles total treatments, interior cleaning, exterior polishing, and headlight restoration with careful hand work.',
  image: '/hero_Image.jpg',
  ctaPrimary: 'Call Poets Anders',
  ctaSecondary: 'View treatments',
  primaryLink: '#content',
  secondaryLink: '#features',
  features: [
    'Total treatment for interior and exterior',
    'Paint polishing, hand wax, rims and tires',
    'Located at Vondellaan 164 in Papendrecht',
  ],
  trustItems: [
    { value: '5', label: 'Treatment options' },
    { value: 'NL', label: 'Papendrecht service' },
    { value: '4.6 (70)', label: 'Google reviews' },
  ],
  infoPanel: {
    eyebrow: 'Why Poets Anders',
    items: [
      {
        title: 'Clean, careful process',
        description: 'Every treatment is built around paint-safe washing, tidy interiors, and clear service choices.',
      },
      {
        title: 'Treatment packages below',
        description: 'Compare total, interior, exterior, and headlight care in the service cards.',
      },
    ],
  },
};
