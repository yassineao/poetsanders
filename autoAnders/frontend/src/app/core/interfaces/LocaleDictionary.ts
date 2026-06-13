import type { FormPageContent, Infos } from "./Infos";
import type {
  ServiceFeatures,
  ServiceHero2,
  ServiceHeroCollection,
  ServiceOverview,
} from "./Service";

interface NavItem  {
  label: string;
  href: string;
  children?: NavItem[];
};

interface ServiceItem  {
  title: string;
  description: string;
};

interface AdvantageItem  {
  value: string;
  title: string;
  subtitle: string;
};

interface FooterLink  {
  label: string;
  href: string;
};

interface PageMetadata  {
  title: string;
  description: string;
  locale: "de_DE" | "en_US" | "nl_NL";
  keywords: string[];
};

interface PageSeo  {
  areaServed: string[];
  knowsAbout: string[];
  offerCatalogName: string;
  services: string[];
};

interface ContentSection  {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
  subsections?: {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
    note?: string;
    links?: {
      label: string;
      href: string;
    }[];
  }[];
  table?: {
    columns: string[];
    rows: string[][];
  };
  rights?: {
    article: string;
    title: string;
    description: string;
  }[];
  contactCards?: {
    label: string;
    value: string;
  }[];
  categories?: {
    name: string;
    description: string;
    badge?: string;
  }[];
  cookieTables?: {
    title: string;
    columns: string[];
    rows: string[][];
  }[];
  links?: {
    label: string;
    href: string;
  }[];
};

interface ContentPage  {
  metadata: PageMetadata;
  eyebrow: string;
  title: string;
  intro: string;
  heroMeta?: string[];
  contents?: string[];
  sections: ContentSection[];
  note?: string;
  ctaLabel?: string;
};

interface HomeContent  {
  metadata: PageMetadata;
  hero: {
    eyebrow: string;
    titleFirst: string;
    titleSecond: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    videoAlt: string;
    imageAlt: string;
  };
  advantages: {
    eyebrow: string;
    title: string;
    description: string;
    items: AdvantageItem[];
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    items: ServiceItem[];
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    cta: string;
    more :string
  };
  catalogue: CatalogueContent;
  scrollTexts: [string, string];
  seo: PageSeo;
};

interface FormContent  {
  metadata: PageMetadata;
  content: Infos;
  seo: PageSeo;
};

type SellContent = FormPageContent;

interface FaqContent  {
  metadata: PageMetadata;
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  items: {
    question: string;
    answer: string;
  }[];
};

interface ServicePageContent  {
  metadata: PageMetadata;
  overview: ServiceOverview;
  hero: ServiceHeroCollection;
  features: ServiceFeatures;
  seo: PageSeo;
  hero2: ServiceHero2;
};

interface LocaleDictionary  {
  localeName: string;
  nav: {
    ariaLabel: string;
    homeAriaLabel: string;
    items: NavItem[];
    contactLabel: string;
    mobileMenuLabel: string;
    switchLabel: string;
  };
  footer: {
    tagline: string;
    navigationTitle: string;
    servicesTitle: string;
    contactTitle: string;
    navigationLinks: FooterLink[];
    serviceLinks: FooterLink[];
    contactLinks: FooterLink[];
    rights: string;
    legalLinks: FooterLink[];
  };
  home: HomeContent;
  faq: FaqContent;
  servicePage: ServicePageContent;
  form: FormContent;
  sell: SellContent;
  pages: {
    about: ContentPage;
    privacy: ContentPage;
    impressum: ContentPage;
    terms: ContentPage;
    cookie: ContentPage;
  };
};

export type {
  AdvantageItem,
  ContentPage,
  ContentSection,
  FooterLink,
  FaqContent,
  FormContent,
  HomeContent,
  LocaleDictionary,
  NavItem,
  PageMetadata,
  PageSeo,
  ServiceItem,
  ServicePageContent,
  SellContent,
};
interface CatalogueCar  {
  id: number;
  brand: string;
  model: string;
  price: number;
  year: number;
  firstRegistrationDate: string;
  mileage: number;
  transmission: string;
  fuel: string;
  engineCapacity: number;
  numberOfDoors: number;
  numberOfSeats: number;
  condition: string;
  numberOfGears: number;
  vat: string;
  vehicle: string;
  colour: string;
  image: string;
  tags: {
    de: string[];
    en: string[];
    nl: string[];
  };
};

interface CatalogueLabels  {
  vehiclesFound: string;
  searchPlaceholder: string;
  allBrands: string;
  allTransmissions: string;
  firstRegistrationDate: string;
  maxMileage: string;
  maxPrice: string;
  allColours: string;
  allFuels: string;
  engineCapacity: string;
  allDoorCounts: string;
  allConditions: string;
  allGearCounts: string;
  allVatOptions: string;
  allVehicles: string;
  searchButton: string;
  resetButton: string;
  viewDetails: string;
  moreButton: string;
};

interface CatalogueContent  {
  title: string;
  subtitle: string;
  labels: CatalogueLabels;
  cars: CatalogueCar[];
};
