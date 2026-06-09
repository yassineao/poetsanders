import type { HomeCopy } from '../../../../interfaces/types';
import { deHomeAppointmentsCopy } from './appointments';
import { deHomeCardsCopy } from './cards';
import { deHomeHeroCopy } from './hero';
import { deHomeMetaCopy } from './meta';
import { mapsCopy as deMapsCopy } from './maps';
import { deHomeTestimonialsCopy } from './testimonials';

export const deHomeCopy: HomeCopy = {
  meta: deHomeMetaCopy,
  hero: deHomeHeroCopy,
  appointments: deHomeAppointmentsCopy,
  cards: deHomeCardsCopy,
  testimonials: deHomeTestimonialsCopy,
  maps: deMapsCopy,
};
