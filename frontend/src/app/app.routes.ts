import { Routes } from '@angular/router';
import { AdminDashboardPageComponent } from './features/admin/pages/admin-dashboard-page.component';
import { AppointmentsPageComponent } from './features/appointments/pages/appointments-page.component';
import { BookingPageComponent } from './features/form/page/booking-page';
import { FaqPageComponent } from './features/faq/pages/faq-page.component';
import { HomePageComponent } from './features/home/pages/home-page.component';
import { LoginPageComponent } from './features/login/pages/login-page.component';
import { ProfilePageComponent } from './features/profile/pages/profile-page.component';
import { ServicesPageComponent } from './features/services/pages/services-page.components';
import { ServiceDetailPageComponent } from './features/services/pages/service-detail-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'admin', component: AdminDashboardPageComponent },
  { path: 'appointments', component: AppointmentsPageComponent },
  { path: 'book', component: BookingPageComponent },
  { path: 'faq', component: FaqPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'services', component: ServicesPageComponent },
  { path: 'services/:slug', component: ServiceDetailPageComponent },
  { path: '**', redirectTo: '' },
];
