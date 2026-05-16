import type { Copy } from './index';

export const nlCopy: Copy = {
  home: {
    pageTitle: 'Poetry Sanders - Meertalige Gedichten & Verhalen',
    description: 'Ontdek poezie en verhalen in het Engels, Duits en Nederlands. Snelle, responsieve content met SEO-metadata voor elke taal.',
    heroHeading: 'Creativiteit spreekt elke taal.',
    heroSubheading: 'Lees prachtige verhalen en gedichten in het Engels, Duits en Nederlands.',
    ctaPrimary: 'Lees de nieuwste',
    ctaSecondary: 'Bekijk collecties',
    features: [
      'Live taalwissel voor de volledige pagina',
      'SEO-vriendelijke titel en beschrijving metadata',
      'Responsief Tailwind hero ontwerp',
    ],
    cards: [
      {
        title: 'SEO gereed',
        body: 'Alle zoekmetadata worden automatisch bijgewerkt bij het wisselen van taal.',
      },
      {
        title: 'Volledige meertalige tekst',
        body: 'Paginatoken, knoppen en kaarten worden vertaald voor elk geselecteerd taalgebied.',
      },
      {
        title: 'Elegant Tailwind-hero',
        body: 'Een moderne hero-sectie met sterke visuele hierarchie en toegankelijke bediening.',
      },
    ],
  },
  collections: {
    heading: 'Collecties',
    description: 'Blader door onze samengestelde collecties poezie en verhalen in meerdere talen.',
    cards: [
      {
        title: 'Engelse collectie',
        body: 'Ontdek prachtige werken die oorspronkelijk in het Engels zijn geschreven of naar het Engels zijn vertaald.',
      },
      {
        title: 'Duitse collectie',
        body: 'Ontdek prachtige werken in het Duits.',
      },
      {
        title: 'Nederlandse collectie',
        body: 'Ontdek prachtige werken in het Nederlands.',
      },
      {
        title: 'Alle talen',
        body: 'Blader door content in alle ondersteunde talen.',
      },
    ],
  },
  navbar: {
    home: 'Home',
    collections: 'Collecties',
    ctaPrimary: 'Lees de nieuwste',
    langLabel: 'Taal',
    langNames: {
      en: 'English',
      de: 'Deutsch',
      nl: 'Nederlands',
    },
    menuToggle: 'Navigatie wisselen',
  },
};
