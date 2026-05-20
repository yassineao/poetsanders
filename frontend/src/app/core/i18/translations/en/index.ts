import type { Copy } from '../../../interfaces/types';
import { enFooterCopy } from './footer';
import { enHomeCopy } from './home';
import { enNavbarCopy } from './navbar';
import { enServicesCopy } from './services';

export const enCopy: Copy = {
  home: enHomeCopy,
  navbar: enNavbarCopy,
  footer: enFooterCopy,
  services: enServicesCopy,
};
