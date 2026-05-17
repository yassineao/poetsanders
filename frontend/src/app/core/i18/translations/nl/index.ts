import type { Copy } from '../../../interfaces/types';
import { nlCollectionsCopy } from './collections';
import { nlFooterCopy } from './footer';
import { nlHomeCopy } from './home';
import { nlNavbarCopy } from './navbar';

export const nlCopy: Copy = {
  home: nlHomeCopy,
  collections: nlCollectionsCopy,
  navbar: nlNavbarCopy,
  footer: nlFooterCopy,
};
