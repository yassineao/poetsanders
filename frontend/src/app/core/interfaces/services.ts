import type { Locale } from './locale';

export interface ServicesHeroCopy {
    title: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    announcement: string;
}

export interface ServicesFeatureCopy {
  eyebrow: string;
  heading: string;
  description: string;
  items: Array<{
    title: string;
    body: string;
    icon: 'sparkle' | 'shield' | 'clock' | 'drop';
  }>;
}

export interface ServicesTreatmentsCopy {
  eyebrow: string;
  heading: string;
  description: string;
  includedLabel: string;
  detailLinkLabel: string;
  benefitsLabel: string;
  processLabel: string;
  backLabel: string;
  bookLabel: string;
  bookLink: string;
  notFoundTitle: string;
  items: Array<{
    slug: string;
    title: string;
    description: string;
    longDescription: string;
    image: string;
    services: string[];
    benefits: string[];
    process: string[];
    details?: {
      sections: Array<{
        heading: string;
        paragraphs: string[];
      }>;
      odorsHeading: string;
      odorsDescription: string;
      odors: string[];
      priceLabel: string;
      price: string;
      ctaHeading: string;
      safetyNote: string;
    };
  }>;
}

export type ServiceTreatmentCopy = ServicesTreatmentsCopy['items'][number];
export type ServiceTreatmentDetailsCopy = NonNullable<ServiceTreatmentCopy['details']>;

export interface ServicesCopy {
  meta: ServicesHeroCopy;
  hero: ServicesHeroCopy;
  features: ServicesFeatureCopy;
  treatments: ServicesTreatmentsCopy;
}

