import type { FooterCopy } from '../../../interfaces/types';

export const deFooterCopy: FooterCopy = {
  navigationTitle: 'Navigation',
  footerItems: [
    { label: 'Startseite', routerLink: '/' },
    { label: 'Services', routerLink: '/collections' },
  ],
  servicesTitle: 'Angebote',
  serviceLinks: [
    { label: 'Aussenwaesche', routerLink: '/collections' },
    { label: 'Innenreinigung', routerLink: '/collections' },
    { label: 'Detailing', routerLink: '/collections' },
  ],
  contactTitle: 'Kontakt',
  contactLinks: [
    { label: 'Waesche buchen', routerLink: '/' },
    { label: 'Servicepakete', routerLink: '/collections' },
  ],
  legalLinks: [
    { label: 'Datenschutz', routerLink: '/' },
    { label: 'Impressum', routerLink: '/' },
  ],
  rights: 'Alle Rechte vorbehalten.',
  poweredBy: 'Bereitgestellt von Gloyoo',
};
