export interface HomeMetaCopy {
  pageTitle: string;
  description: string;
}

export interface HomeHeroCopy {
  eyebrow: string;
  heading: string;
  subheading: string;
  image: string;
  ctaPrimary: string;
  ctaSecondary: string;
  primaryLink: string;
  secondaryLink: string;
  features: string[];
  trustItems: Array<{ value: string; label: string }>;
}

export interface HomeCardsSectionCopy {
  items: Array<{ title: string; body: string }>;
}

export interface HomeCopy {
  meta: HomeMetaCopy;
  hero: HomeHeroCopy;
  cards: HomeCardsSectionCopy;
}
