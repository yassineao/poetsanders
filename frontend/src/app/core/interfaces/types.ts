import type { BookingCopy } from './booking';
import type { FaqCopy } from './faq';
import type { HomeCopy } from './home';
import type { FooterCopy, NavbarCopy } from './layout';
import type { LoginCopy } from './login';
import type { ProfileCopy } from './profile';
import type { ServicesCopy } from './services';

export type {
  HomeCardsSectionCopy,
  HomeCopy,
  HomeHeroCopy,
  HomeMetaCopy,
  HomeTestimonialsSectionCopy,
} from './home';
export type { FooterCopy, NavbarCopy } from './layout';
export type { Locale } from './locale';
export type { BookingCopy } from './booking';
export type { LoginCopy } from './login';

export interface Copy {
  booking: BookingCopy;
  faq: FaqCopy;
  login: LoginCopy;
  profile: ProfileCopy;
  home: HomeCopy;
  navbar: NavbarCopy;
  footer: FooterCopy;
  services: ServicesCopy;
}
