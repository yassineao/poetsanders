import { Component } from '@angular/core';
import { AppointmentsListComponent } from '../components/appointments-list/appointments-list.component';

@Component({
  selector: 'app-appointments-page',
  standalone: true,
  imports: [AppointmentsListComponent],
  templateUrl: './appointments-page.component.html',
})
export class AppointmentsPageComponent {}
