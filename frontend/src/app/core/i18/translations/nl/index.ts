import type { Copy } from '../../../interfaces/types';
import { nlAdminCopy } from './admin';
import { nlBookingCopy } from './booking';
import { nlFooterCopy } from './footer';
import { nlFaqCopy } from './faq';
import { nlHomeCopy } from './home';
import { nlLoginCopy } from './login';
import { nlNavbarCopy } from './navbar';
import { nlProfileCopy } from './profile';
import { nlServicesCopy } from './services';

export const nlCopy: Copy = {
  admin: nlAdminCopy,
  booking: nlBookingCopy,
  faq: nlFaqCopy,
  home: nlHomeCopy,
  login: nlLoginCopy,
  navbar: nlNavbarCopy,
  profile: nlProfileCopy,
  footer: nlFooterCopy,
  services: nlServicesCopy,
};
