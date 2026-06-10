import type { FormControl, FormGroup } from '@angular/forms';

export interface CalendarDay {
  date: Date;
  day: number;
  disabled: boolean;
}

export interface BookingConfirmation {
  appointment: string;
  treatments: string[];
  customerName: string;
  customerEmail: string;
  guest: boolean;
  registrationOnly: boolean;
}

export type BookingMode = 'register' | 'guest';

export type BookingFormGroup = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  retypePassword: FormControl<string>;
  phone: FormControl<string>;
  services: FormControl<string[]>;
  message: FormControl<string>;
}>;
