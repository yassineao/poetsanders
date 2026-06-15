import { Routes } from "@angular/router";
import { AdvantagesPageComponent } from "./pages/advantages/advantages-page.component";
import { CataloguePageComponent } from "./pages/catalogue/catalogue-page.component";
import { FaqPageComponent } from "./pages/faq/faq-page.component";
import { HomeComponent } from "./pages/home/home.component";
import { LegalPageComponent } from "./pages/legal/legal-page.component";
import { SellPageComponent } from "./pages/sell/sell-page.component";
import { LocaleShellComponent } from "./shared/locale-shell/locale-shell.component";
import { ContactFormComponent } from "./pages/contact/components/form";
import { AuthComponent } from "./pages/auth/components/auth";

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
      { path: "form", component: ContactFormComponent },
      { path: "contact", redirectTo: "form" },
      { path: "auth", component: AuthComponent },
      { path: "login", redirectTo: "auth" },
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
