import { deCopy } from './translations/de';
import { enCopy } from './translations/en';
import { nlCopy } from './translations/nl';
import type { Copy, Locale } from '../interfaces/types';

export type { Copy, Locale } from '../interfaces/types';

export const translationMap: Record<Locale, Copy> = {
  en: enCopy,
  de: deCopy,
  nl: nlCopy,
};
