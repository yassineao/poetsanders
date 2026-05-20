
import type { HomeCopy } from './home';
import type { FooterCopy, NavbarCopy } from './layout';
import type {ServicesCopy} from './services';

export type { HomeCardsSectionCopy, HomeCopy, HomeHeroCopy, HomeMetaCopy, HomeTestimonialsSectionCopy } from './home';
export type { FooterCopy, NavbarCopy } from './layout';
export type { Locale } from './locale';


export interface Copy {
  home: HomeCopy;
  navbar: NavbarCopy;
  footer: FooterCopy;
  services: ServicesCopy;
}
