import type { Copy } from '../../../interfaces/types';
import { enCollectionsCopy } from './collections';
import { enFooterCopy } from './footer';
import { enHomeCopy } from './home';
import { enNavbarCopy } from './navbar';

export const enCopy: Copy = {
  home: enHomeCopy,
  collections: enCollectionsCopy,
  navbar: enNavbarCopy,
  footer: enFooterCopy,
};
