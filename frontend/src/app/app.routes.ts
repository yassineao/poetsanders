import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/pages/home-page.component';
import { ServicesPageComponent } from './features/services/pages/services-page.components';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'services', component: ServicesPageComponent },
  { path: '**', redirectTo: '' }
];
