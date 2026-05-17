import type { Copy } from '../../../interfaces/types';
import { deCollectionsCopy } from './collections';
import { deFooterCopy } from './footer';
import { deHomeCopy } from './home';
import { deNavbarCopy } from './navbar';

export const deCopy: Copy = {
  home: deHomeCopy,
  collections: deCollectionsCopy,
  navbar: deNavbarCopy,
  footer: deFooterCopy,
};
