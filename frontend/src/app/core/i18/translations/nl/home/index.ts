import type { HomeCopy } from '../../../../interfaces/types';
import { nlHomeAppointmentsCopy } from './appointments';
import { nlHomeCardsCopy } from './cards';
import { nlHomeHeroCopy } from './hero';
import { nlHomeMetaCopy } from './meta';
import { mapsCopy as nlMapsCopy } from './maps';
import { nlHomeTestimonialsCopy } from './testimonials';

export const nlHomeCopy: HomeCopy = {
  meta: nlHomeMetaCopy,
  hero: nlHomeHeroCopy,
  appointments: nlHomeAppointmentsCopy,
  cards: nlHomeCardsCopy,
  testimonials: nlHomeTestimonialsCopy,
  maps: nlMapsCopy,
};
