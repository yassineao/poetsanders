import type { HomeCopy } from '../../../../interfaces/types';
import { enHomeCardsCopy } from './cards';
import { enHomeHeroCopy } from './hero';
import { enHomeMetaCopy } from './meta';
import { mapsCopy as enMapsCopy } from './maps';
import { enHomeTestimonialsCopy } from './testimonials';

export const enHomeCopy: HomeCopy = {
  meta: enHomeMetaCopy,
  hero: enHomeHeroCopy,
  cards: enHomeCardsCopy,
  testimonials: enHomeTestimonialsCopy,
  maps: enMapsCopy,
};
