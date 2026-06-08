import type { Copy } from '../../../interfaces/types';
import { nlBookingCopy } from './booking';
import { nlFooterCopy } from './footer';
import { nlHomeCopy } from './home';
import { nlLoginCopy } from './login';
import { nlNavbarCopy } from './navbar';
import { nlServicesCopy } from './services';

export const nlCopy: Copy = {
  booking: nlBookingCopy,
  home: nlHomeCopy,
  login: nlLoginCopy,
  navbar: nlNavbarCopy,
  footer: nlFooterCopy,
  services: nlServicesCopy,
};
