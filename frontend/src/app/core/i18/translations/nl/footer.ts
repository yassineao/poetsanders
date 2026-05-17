import type { FooterCopy } from '../../../interfaces/types';

export const nlFooterCopy: FooterCopy = {
  navigationTitle: 'Navigatie',
  footerItems: [
    { label: 'Home', routerLink: '/' },
    { label: 'Diensten', routerLink: '/collections' },
  ],
  servicesTitle: 'Diensten',
  serviceLinks: [
    { label: 'Buitenwas', routerLink: '/collections' },
    { label: 'Interieurreiniging', routerLink: '/collections' },
    { label: 'Detailing', routerLink: '/collections' },
  ],
  contactTitle: 'Contact',
  contactLinks: [
    { label: 'Boek een wasbeurt', routerLink: '/' },
    { label: 'Servicepakketten', routerLink: '/collections' },
  ],
  legalLinks: [
    { label: 'Privacy', routerLink: '/' },
    { label: 'Voorwaarden', routerLink: '/' },
  ],
  rights: 'Alle rechten voorbehouden.',
  poweredBy: 'Mogelijk gemaakt door Gloyoo',
};
