import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { HomeCopyMap, HomeTestimonialsSectionCopy } from '../../../../core/interfaces/home';

const defaultTestimonials: HomeTestimonialsSectionCopy = {
  eyebrow: '',
  heading: '',
  description: '',
  ratingLabel: '',
  sourceLabel: '',
  testimonials: [],
};

const defaultMaps: HomeCopyMap = {
  ADDRESS_LABEL: '',
  ADDRESS_DETAILS: '',
  EMAIL_LABEL: '',
  EMAIL: '',
  PHONE_LABEL: '',
  PHONE: '',
  MOBILE_LABEL: '',
  MOBILE: '',
  WEBSITE_LABEL: '',
  WEBSITE: '',
  WEBSITE_URL: '',
  MAPS_LABEL: '',
  MAPS_URL: '#',
  FEEDBACK_LABEL: '',
  NAME_LABEL: '',
  EMAIL_LABEL_FORM: '',
  MESSAGE_LABEL: '',
  SUBMIT_LABEL: '',
  DISCLAIMER_LABEL: '',
  FeedbackText: '',
};

@Component({
  selector: 'app-testimonials-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials-main.components.html',
})
export class TestimonialsMainComponent {
  @Input() testimonials: HomeTestimonialsSectionCopy = defaultTestimonials;
  @Input() maps: HomeCopyMap = defaultMaps;
}
