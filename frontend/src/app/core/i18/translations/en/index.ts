import type { Copy } from '../../../interfaces/types';
import { enBookingCopy } from './booking';
import { enFooterCopy } from './footer';
import { enHomeCopy } from './home';
import { enNavbarCopy } from './navbar';
import { enServicesCopy } from './services';

export const enCopy: Copy = {
  booking: enBookingCopy,
  home: enHomeCopy,
  navbar: enNavbarCopy,
  footer: enFooterCopy,
  services: enServicesCopy,
};
