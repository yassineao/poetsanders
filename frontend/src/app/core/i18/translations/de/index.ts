import type { Copy } from '../../../interfaces/types';
import { deBookingCopy } from './booking';
import { deFooterCopy } from './footer';
import { deHomeCopy } from './home';
import { deLoginCopy } from './login';
import { deNavbarCopy } from './navbar';
import { deServicesCopy } from './services';
import { deServicesHeroCopy } from './services/hero';

export const deCopy: Copy = {
  booking: deBookingCopy,
  home: deHomeCopy,
  login: deLoginCopy,
  navbar: deNavbarCopy,
  footer: deFooterCopy,
  services: deServicesCopy,
};
