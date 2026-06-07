import type { Copy } from '../../../interfaces/types';
import { nlBookingCopy } from './booking';
import { nlFooterCopy } from './footer';
import { nlHomeCopy } from './home';
import { nlNavbarCopy } from './navbar';
import { nlServicesCopy } from './services';

export const nlCopy: Copy = {
  booking: nlBookingCopy,
  home: nlHomeCopy,
  navbar: nlNavbarCopy,
  footer: nlFooterCopy,
  services: nlServicesCopy,
};
