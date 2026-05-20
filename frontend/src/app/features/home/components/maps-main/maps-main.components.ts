import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import type { HomeCopyMap } from '../../../../core/interfaces/home';

const defaultMapsCopy: HomeCopyMap = {
  ADDRESS_LABEL: '',
  ADDRESS_DETAILS: 'Vondellaan 164, 3351 HG Papendrecht, Netherlands',
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
  MAPS_URL: '',
  FEEDBACK_LABEL: '',
  NAME_LABEL: '',
  EMAIL_LABEL_FORM: '',
  MESSAGE_LABEL: '',
  SUBMIT_LABEL: '',
  DISCLAIMER_LABEL: '',
  FeedbackText: '',
};

@Component({
  selector: 'app-maps-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './maps-main.components.html',
})
export class MapsMainComponent {
  @Input() maps: HomeCopyMap = defaultMapsCopy;

  constructor(private sanitizer: DomSanitizer) {}

  get mapSrc(): SafeResourceUrl {
    const encodedQuery = encodeURIComponent(this.maps.ADDRESS_DETAILS);
    const url = `https://maps.google.com/maps?width=100%&height=600&hl=en&q=${encodedQuery}&ie=UTF8&t=&z=14&iwloc=B&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
