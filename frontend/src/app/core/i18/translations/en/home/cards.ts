import type { HomeCardsSectionCopy } from '../../../../interfaces/types';

export const enHomeCardsCopy: HomeCardsSectionCopy = {
  eyebrow: 'Treatment packages',
  heading: 'Choose the care your car deserves.',
  description: 'From a precise interior refresh to a complete premium treatment, every package is structured clearly so you know exactly what your car receives. Choose focused cabin care, exterior polishing and protection, headlight restoration, or a full inside-and-out treatment tailored to the condition of your vehicle.',
  highlight: {
    eyebrow: 'Signature care',
    title: 'A cleaner car, handled with patience and precision.',
    body: 'Poets Anders combines careful hand work with premium finishing steps, so your car leaves looking fresh, protected, and ready for the road.',
    image: '/beautiful-car-washing-service.jpg',
    stats: [
      { value: '4', label: 'Treatment options' },
      { value: 'NL', label: 'Dutch service standard' },
      { value: '1', label: 'Clear finish goal' },
    ],
  },
  items: [
    {
      title: 'Exterior wash',
      body: 'Gentle washing, wheel care, and a clean dry finish for daily drivers and business cars.',
    },
    {
      title: 'Interior refresh',
      body: 'Vacuuming, dashboard cleaning, and cabin care so every drive feels calm and clean.',
    },
    {
      title: 'Premium detailing',
      body: 'Extra attention for paint, glass, trim, and finish when your car needs the full treatment.',
    },
  ],
  treatments: [
    {
      title: 'Total Treatment',
      description: 'A complete inside-and-out refresh for cars that need the full Poets Anders finish.',
      image: '/beautiful-car-washing-service.jpg',
      featured: true,
      featuredLabel: 'Most complete',
      services: ['Interior treatment', 'Exterior treatment'],
    },
    {
      title: 'Interior Treatment',
      description: 'Deep cabin care focused on comfort, freshness, and the surfaces you touch every day.',
      image: '/Image_wash.jpg',
      featured: false,
      services: ['Clean upholstery', 'Odor treatment', 'Treat plastic'],
    },
    {
      title: 'Exterior Treatment',
      description: 'Paint, wheels, tires, and finish treated step by step for a clean premium look.',
      image: '/hero_Image.jpg',
      featured: false,
      services: ['Coarse polishing', 'Fine polishing', 'Hand wax', 'Rims cleaning', 'Tire treatment'],
    },
    {
      title: 'Headlight treatment',
      description: 'Your headlights clear again, improving the look of the front end and night visibility.',
      image: '/bg_heroo.jpg',
      featured: false,
      services: ['Clear finish restoration'],
    },
  ],
};
