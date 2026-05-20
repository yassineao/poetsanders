import type { Copy } from '../../../interfaces/types';
import { nlFooterCopy } from './footer';
import { nlHomeCopy } from './home';
import { nlNavbarCopy } from './navbar';
import { nlServicesCopy } from './services';

export const nlCopy: Copy = {
  home: nlHomeCopy,
  navbar: nlNavbarCopy,
  footer: nlFooterCopy,
  services: nlServicesCopy,
};
