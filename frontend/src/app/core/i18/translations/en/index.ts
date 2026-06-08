import type { Copy } from '../../../interfaces/types';
import { enBookingCopy } from './booking';
import { enFooterCopy } from './footer';
import { enHomeCopy } from './home';
import { enLoginCopy } from './login';
import { enNavbarCopy } from './navbar';
import { enServicesCopy } from './services';

export const enCopy: Copy = {
  booking: enBookingCopy,
  home: enHomeCopy,
  login: enLoginCopy,
  navbar: enNavbarCopy,
  footer: enFooterCopy,
  services: enServicesCopy,
};
