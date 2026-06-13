type ServiceSlug =
  | "available-cars"
  | "financing"
  | "tradein"
  | "vehicle-check";

type ServiceHero = {
  badge: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  imageAlt: string;
  imageUrl: string;
};

type ServiceHero2 = {
  badge: string;
  title: string;
  description: string;
  subtitle: string;
  subdescription: string;
  imageAlt: string;
  imageUrl: string;
};

type ServiceHeroCollection = Record<ServiceSlug, ServiceHero>;

type ServiceOverviewHero = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
};

type ServiceOverviewCards = {
  eyebrow: string;
  description: string;
  imageAlts: Record<ServiceSlug, string>;
};

type ServiceOverview = {
  hero: ServiceOverviewHero;
  cards: ServiceOverviewCards;
};

type ServiceFeaturesItem = {
  title: string;
  description: string;
  imageAlt: string;
  statLabel?: string;
};

type ServiceFeatureSection = {
  title: string;
  points: string[];
};

type ServiceFaqItem = {
  question: string;
  answer: string;
};

type ServiceFaq = {
  badge: string;
  title: string;
  description: string;
  items: ServiceFaqItem[];
};

type ServiceFeatures = {
  badge: string;
  title: string;
  description: string;
  items: ServiceFeaturesItem[];
  sections: ServiceFeatureSection[];
};

export type {
  ServiceFaq,
  ServiceFaqItem,
  ServiceFeatureSection,
  ServiceFeatures,
  ServiceFeaturesItem,
  ServiceHero,
  ServiceOverview,
  ServiceOverviewCards,
  ServiceOverviewHero,
  ServiceHeroCollection,
  ServiceSlug,
  ServiceHero2,
};
