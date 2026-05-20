import type { Copy } from '../../../interfaces/types';
import { deFooterCopy } from './footer';
import { deHomeCopy } from './home';
import { deNavbarCopy } from './navbar';
import { deServicesCopy } from './services';
import { deServicesHeroCopy } from './services/hero';

export const deCopy: Copy = {
  home: deHomeCopy,
  navbar: deNavbarCopy,
  footer: deFooterCopy,
  services: deServicesCopy,
};
