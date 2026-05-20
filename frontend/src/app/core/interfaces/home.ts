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
  info: Array<{ label: string; value: string; href?: string }>;
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

export interface HomeTestimonialsSectionCopy {
  eyebrow: string;
  heading: string;
  description: string;
  ratingLabel: string;
  sourceLabel: string;
  testimonials: Array<{
    quote: string;
    name: string;
    detail: string;
    service: string;
  }>;
}

export interface HomeCopy {
  meta: HomeMetaCopy;
  hero: HomeHeroCopy;
  cards: HomeCardsSectionCopy;
  testimonials: HomeTestimonialsSectionCopy;
  maps: HomeCopyMap;
}

export interface HomeCopyMap {
  ADDRESS_LABEL: string;
  ADDRESS_DETAILS: string;
  EMAIL_LABEL: string;
  EMAIL: string;
  PHONE_LABEL: string;
  PHONE: string;
  MOBILE_LABEL: string;
  MOBILE: string;
  WEBSITE_LABEL: string;
  WEBSITE: string;
  WEBSITE_URL: string;
  MAPS_LABEL: string;
  MAPS_URL: string;
  FEEDBACK_LABEL: string;
  NAME_LABEL: string;
  EMAIL_LABEL_FORM: string;
  MESSAGE_LABEL: string;
  SUBMIT_LABEL: string;
  DISCLAIMER_LABEL: string;
  FeedbackText: string;
}
