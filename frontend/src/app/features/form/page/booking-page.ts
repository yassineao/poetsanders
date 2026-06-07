import { Component } from '@angular/core';
import { BookingFormComponent } from '../components/form.component';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [BookingFormComponent],
  templateUrl: './booking-page.html',
})
export class BookingPageComponent {}
