import type { Locale } from './locale';

export interface NavbarCopy {
  home: string;
  collections: string;
  ctaPrimary: string;
  langLabel: string;
  langNames: Record<Locale, string>;
  menuToggle: string;
}

export interface FooterCopy {
  navigationTitle: string;
  footerItems: Array<{ label: string; routerLink: string }>;
  serviceLinks: Array<{ label: string; routerLink: string }>;
  contactLinks: Array<{ label: string; routerLink: string }>;
  servicesTitle: string;
  contactTitle: string;
  legalLinks: Array<{ label: string; routerLink: string }>;
  rights: string;
  poweredBy: string;
}
