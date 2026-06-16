import { Routes } from "@angular/router";
import { AdvantagesPageComponent } from "./pages/advantages/pages/advantages-page.component";
import { CataloguePageComponent } from "./pages/catalogue/pages/catalogue-page.component";
import { FaqPageComponent } from "./pages/faq/pages/faq-page.component";
import { HomeComponent } from "./pages/home/pages/home-page.component";
import { LegalPageComponent } from "./pages/legal/pages/legal-page.component";
import { SellPageComponent } from "./pages/sell/pages/sell-page.component";
import { LocaleShellComponent } from "./shared/locale-shell/locale-shell.component";
import { ContactPageComponent } from "./pages/contact/pages/contact-page.component";
import { AuthPageComponent } from "./pages/auth/pages/auth-page.component";
import { ProfileForm } from "./pages/profile/components/profile.form";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "de" },
  {
    path: ":locale",
    component: LocaleShellComponent,
    children: [
      { path: "", component: HomeComponent },
      { path: "Catalogue", component: CataloguePageComponent },
      { path: "catalogue", redirectTo: "Catalogue" },
      { path: "Sell", component: SellPageComponent },
      { path: "sell", redirectTo: "Sell" },
      { path: "faq", component: FaqPageComponent },
      { path: "form", component: ContactPageComponent },
      { path: "contact", redirectTo: "form" },
      { path: "auth", component: AuthPageComponent },
      { path: "login", redirectTo: "auth" },
      { path: "profile", component: ProfileForm },
      { path: "advantages", component: AdvantagesPageComponent },
      { path: "about", component: LegalPageComponent, data: { page: "about" } },
      { path: "privacy", component: LegalPageComponent, data: { page: "privacy" } },
      { path: "datenschutz", redirectTo: "privacy" },
      { path: "impressum", component: LegalPageComponent, data: { page: "impressum" } },
      { path: "terms", component: LegalPageComponent, data: { page: "terms" } },
      { path: "cookie", component: LegalPageComponent, data: { page: "cookie" } },
    ],
  },
  { path: "**", redirectTo: "de" },
];
