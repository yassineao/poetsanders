import type { Copy } from '../../../interfaces/types';
import { enBookingCopy } from './booking';
import { enFooterCopy } from './footer';
import { enFaqCopy } from './faq';
import { enHomeCopy } from './home';
import { enLoginCopy } from './login';
import { enNavbarCopy } from './navbar';
import { enProfileCopy } from './profile';
import { enServicesCopy } from './services';

export const enCopy: Copy = {
  booking: enBookingCopy,
  faq: enFaqCopy,
  home: enHomeCopy,
  login: enLoginCopy,
  navbar: enNavbarCopy,
  profile: enProfileCopy,
  footer: enFooterCopy,
  services: enServicesCopy,
};
