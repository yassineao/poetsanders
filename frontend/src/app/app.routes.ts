import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/pages/home-page.component';
import { CollectionsPageComponent } from './features/collections/collections-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'collections', component: CollectionsPageComponent },
  { path: '**', redirectTo: '' }
];
