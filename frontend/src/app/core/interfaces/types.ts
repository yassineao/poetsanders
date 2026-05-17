import type { CollectionsCopy } from './collections';
import type { HomeCopy } from './home';
import type { FooterCopy, NavbarCopy } from './layout';

export type { CollectionsCopy } from './collections';
export type { HomeCardsSectionCopy, HomeCopy, HomeHeroCopy, HomeMetaCopy } from './home';
export type { FooterCopy, NavbarCopy } from './layout';
export type { Locale } from './locale';

export interface Copy {
  home: HomeCopy;
  collections: CollectionsCopy;
  navbar: NavbarCopy;
  footer: FooterCopy;
}
