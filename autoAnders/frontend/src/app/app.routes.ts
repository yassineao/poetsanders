import { ActivatedRouteSnapshot, Routes } from "@angular/router";
import { Injector, inject, runInInjectionContext } from '@angular/core';
import { LocaleShellComponent } from "./shared/locale-shell/locale-shell.component";
import { authGuard } from "./guards/auth.guard";
import { isValidLocale } from './core/lib/i18n';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "de" },
  {
    path: ":locale",
    canMatch: [(_route, segments) => isValidLocale(segments[0]?.path ?? '')],
    component: LocaleShellComponent,
    children: [
      { path: "", loadComponent: () => import('./pages/home/pages/home-page.component').then(m => m.HomeComponent) },
      { path: "Catalogue", loadComponent: () => import('./pages/catalogue/pages/catalogue-page.component').then(m => m.CataloguePageComponent) },
      {
        path: "Catalogue/:id",
        loadComponent: () => import('./pages/catalogue/pages/vehicle-page.component').then(m => m.VehiclePageComponent),
        resolve: { vehicle: (route: ActivatedRouteSnapshot) => {
          const injector = inject(Injector);
          return import('./core/cars/vehicle.resolver').then(m => runInInjectionContext(injector, () => m.resolveVehicle(route)));
        } },
      },
      { path: "catalogue/:id", redirectTo: "Catalogue/:id" },
      { path: "catalogue", redirectTo: "Catalogue" },
      {
        path: "Sell", loadComponent: () => import('./pages/sell/pages/sell-page.component').then(m => m.SellPageComponent),
      },
      { path: "sell", redirectTo: "Sell" },
      { path: "faq", loadComponent: () => import('./pages/faq/pages/faq-page.component').then(m => m.FaqPageComponent) },
      { path: "form", loadComponent: () => import('./pages/contact/pages/contact-page.component').then(m => m.ContactPageComponent), canActivate: [authGuard] },
      { path: "contact", redirectTo: "form" },
      { path: "auth", loadComponent: () => import('./pages/auth/pages/auth-page.component').then(m => m.AuthPageComponent) },
      { path: "login", redirectTo: "auth" },
      { path: "profile", loadComponent: () => import('./pages/profile/components/profile.form').then(m => m.ProfileForm), canActivate: [authGuard] },
      { path: "advantages", loadComponent: () => import('./pages/advantages/pages/advantages-page.component').then(m => m.AdvantagesPageComponent) },
      { path: "about", loadComponent: () => import('./pages/legal/pages/legal-page.component').then(m => m.LegalPageComponent), data: { page: "about" } },
      { path: "privacy", loadComponent: () => import('./pages/legal/pages/legal-page.component').then(m => m.LegalPageComponent), data: { page: "privacy" } },
      { path: "datenschutz", redirectTo: "privacy" },
      { path: "impressum", loadComponent: () => import('./pages/legal/pages/legal-page.component').then(m => m.LegalPageComponent), data: { page: "impressum" } },
      { path: "terms", loadComponent: () => import('./pages/legal/pages/legal-page.component').then(m => m.LegalPageComponent), data: { page: "terms" } },
      { path: "cookie", loadComponent: () => import('./pages/legal/pages/legal-page.component').then(m => m.LegalPageComponent), data: { page: "cookie" } },
      { path: "**", component: NotFoundComponent, data: { notFound: true } },
    ],
  },
  { path: "**", component: NotFoundComponent, data: { notFound: true } },
];
