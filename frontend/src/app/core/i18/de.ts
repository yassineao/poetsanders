import type { Copy } from './index';

export const deCopy: Copy = {
  home: {
    pageTitle: 'Poetry Sanders - Mehrsprachige Gedichte & Geschichten',
    description: 'Entdecken Sie Poesie und Erzaehlungen auf Englisch, Deutsch und Niederlaendisch. Schneller, responsiver Inhalt mit SEO-Metadaten fuer jede Sprache.',
    heroHeading: 'Kreativitaet trifft jede Sprache.',
    heroSubheading: 'Lesen Sie wunderschoene Geschichten und Gedichte auf Englisch, Deutsch und Niederlaendisch.',
    ctaPrimary: 'Neueste lesen',
    ctaSecondary: 'Sammlungen ansehen',
    features: [
      'Live-Sprachwechsel fuer die gesamte Seite',
      'SEO-freundliche Titel- und Beschreibungsmetadaten',
      'Responsive Tailwind-Hero-Gestaltung',
    ],
    cards: [
      {
        title: 'SEO-faehig',
        body: 'Alle Suchmetadaten aktualisieren sich automatisch beim Wechsel der Sprache.',
      },
      {
        title: 'Vollstaendige mehrsprachige Inhalte',
        body: 'Seiteninhalt, Schaltflaechen und Karten werden fuer jedes gewaehlte Locale uebersetzt.',
      },
      {
        title: 'Eleganter Tailwind-Hero',
        body: 'Ein modernes Hero-Segment mit klarer visueller Hierarchie und zugaenglichen Steuerelementen.',
      },
    ],
  },
  collections: {
    heading: 'Sammlungen',
    description: 'Durchstoebern Sie unsere kuratierten Sammlungen von Gedichten und Geschichten in mehreren Sprachen.',
    cards: [
      {
        title: 'Englische Sammlung',
        body: 'Entdecken Sie wunderschoene Werke, die auf Englisch geschrieben oder ins Englische uebersetzt wurden.',
      },
      {
        title: 'Deutsche Sammlung',
        body: 'Entdecken Sie wunderbare Werke in deutscher Sprache.',
      },
      {
        title: 'Niederlaendische Sammlung',
        body: 'Entdecken Sie wunderschoene Werke auf Niederlaendisch.',
      },
      {
        title: 'Alle Sprachen',
        body: 'Durchstoebern Sie Inhalte in allen unterstuetzten Sprachen.',
      },
    ],
  },
  navbar: {
    home: 'Startseite',
    collections: 'Sammlungen',
    ctaPrimary: 'Neueste lesen',
    langLabel: 'Sprache',
    langNames: {
      en: 'English',
      de: 'Deutsch',
      nl: 'Nederlands',
    },
    menuToggle: 'Navigation umschalten',
  },
};
