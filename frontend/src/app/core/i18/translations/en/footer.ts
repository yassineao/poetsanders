import type { FooterCopy } from '../../../interfaces/types';

export const enFooterCopy: FooterCopy = {
  navigationTitle: 'Navigation',
  footerItems: [
    { label: 'Home', routerLink: '/' },
    { label: 'Services', routerLink: '/collections' },
  ],
  servicesTitle: 'Services',
  serviceLinks: [
    { label: 'Exterior wash', routerLink: '/collections' },
    { label: 'Interior cleaning', routerLink: '/collections' },
    { label: 'Detailing', routerLink: '/collections' },
  ],
  contactTitle: 'Contact',
  contactLinks: [
    { label: 'Book a wash', routerLink: '/' },
    { label: 'Service packages', routerLink: '/collections' },
  ],
  legalLinks: [
    { label: 'Privacy', routerLink: '/' },
    { label: 'Terms', routerLink: '/' },
  ],
  rights: 'All rights reserved.',
  poweredBy: 'Powered by Gloyoo',
};
