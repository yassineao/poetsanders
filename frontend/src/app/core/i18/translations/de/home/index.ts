import type { HomeCopy } from '../../../../interfaces/types';
import { deHomeCardsCopy } from './cards';
import { deHomeHeroCopy } from './hero';
import { deHomeMetaCopy } from './meta';

export const deHomeCopy: HomeCopy = {
  meta: deHomeMetaCopy,
  hero: deHomeHeroCopy,
  cards: deHomeCardsCopy,
};
