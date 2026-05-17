import type { HomeCopy } from '../../../../interfaces/types';
import { nlHomeCardsCopy } from './cards';
import { nlHomeHeroCopy } from './hero';
import { nlHomeMetaCopy } from './meta';

export const nlHomeCopy: HomeCopy = {
  meta: nlHomeMetaCopy,
  hero: nlHomeHeroCopy,
  cards: nlHomeCardsCopy,
};
