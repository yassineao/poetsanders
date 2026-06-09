import type { Copy } from '../../../interfaces/types';
import { deBookingCopy } from './booking';
import { deFooterCopy } from './footer';
import { deFaqCopy } from './faq';
import { deHomeCopy } from './home';
import { deLoginCopy } from './login';
import { deNavbarCopy } from './navbar';
import { deProfileCopy } from './profile';
import { deServicesCopy } from './services';
import { deServicesHeroCopy } from './services/hero';

export const deCopy: Copy = {
  booking: deBookingCopy,
  faq: deFaqCopy,
  home: deHomeCopy,
  login: deLoginCopy,
  navbar: deNavbarCopy,
  profile: deProfileCopy,
  footer: deFooterCopy,
  services: deServicesCopy,
};
