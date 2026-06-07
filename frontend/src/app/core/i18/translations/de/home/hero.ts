import type { HomeHeroCopy } from '../../../../interfaces/types';

export const deHomeHeroCopy: HomeHeroCopy = {
  eyebrow: 'Autoreinigung in Papendrecht',
  heading: 'Ihr Auto sauber, poliert und bereit für die Straße.',
  subheading: 'Poets Anders übernimmt Totalbehandlungen, Innenreinigung, Außenpolitur und Scheinwerferaufbereitung mit sorgfältiger Handarbeit.',
  image: '/hero_Image.jpg',
  ctaPrimary: 'Poets Anders anrufen',
  ctaSecondary: 'Behandlungen ansehen',
  primaryLink: '#content',
  secondaryLink: '#features',
  features: [
    'Totalbehandlung für Innenraum und Außenbereich',
    'Lack polieren, Handwachs, Felgen und Reifen',
    'An der Vondellaan 164 in Papendrecht',
  ],
  trustItems: [
    { value: '5', label: 'Behandlungsoptionen' },
    { value: 'NL', label: 'Service in Papendrecht' },
    { value: '4.6 (70)', label: 'Google-Bewertungen sichtbar' },
  ],
  infoPanel: {
    eyebrow: 'Warum Poets Anders',
    items: [
      {
        title: 'Sauberer, sorgfältiger Ablauf',
        description: 'Jede Behandlung basiert auf lackschonender Wäsche, gepflegten Innenräumen und klaren Serviceoptionen.',
      },
      {
        title: 'Behandlungspakete im Überblick',
        description: 'Vergleichen Sie Komplett-, Innenraum-, Außen- und Scheinwerferpflege in den Servicekarten.',
      },
    ],
  },
};
