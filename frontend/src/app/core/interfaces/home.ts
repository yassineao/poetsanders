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
  eyebrow: string;
  heading: string;
  description: string;
  highlight: {
    eyebrow: string;
    title: string;
    body: string;
    image: string;
    stats: Array<{ value: string; label: string }>;
  };
  items: Array<{ title: string; body: string }>;
  treatments: Array<{
    title: string;
    description: string;
    image: string;
    featured: boolean;
    featuredLabel?: string;
    services: string[];
  }>;
}

export interface HomeCopy {
  meta: HomeMetaCopy;
  hero: HomeHeroCopy;
  cards: HomeCardsSectionCopy;
  maps: HomeCopyMap;
}

export interface HomeCopyMap {
  ADDRESS_LABEL: string;
  ADDRESS_DETAILS: string;
  EMAIL_LABEL: string;
  EMAIL: string;
  PHONE_LABEL: string;
  PHONE: string;
  FEEDBACK_LABEL: string;
  NAME_LABEL: string;
  EMAIL_LABEL_FORM: string;
  MESSAGE_LABEL: string;
  SUBMIT_LABEL: string;
  DISCLAIMER_LABEL: string;
  FeedbackText: string;
}
