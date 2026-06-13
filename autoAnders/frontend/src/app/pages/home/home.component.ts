import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map } from "rxjs";
import { getDictionary, isValidLocale } from "../../core/lib/i18n";
import type { Locale } from "../../core/interfaces/locale";
import { CatalogueComponent } from "../catalogue/catalogue.component";
import { FaqComponent } from "../faq/faq.component";

@Component({
  selector: "app-home",
  imports: [RouterLink, CatalogueComponent, FaqComponent],
  templateUrl: "./home.component.html",
})
export class HomeComponent {
  private readonly route = inject(ActivatedRoute);

  private readonly localeParam = toSignal(
    (this.route.parent?.paramMap ?? this.route.paramMap).pipe(
      map((params) => params.get("locale") ?? "de"),
    ),
    { initialValue: "de" },
  );

  protected readonly locale = computed<Locale>(() => {
    const value = this.localeParam();
    return isValidLocale(value) ? value : "de";
  });
   
  protected readonly dictionary = computed(() => getDictionary(this.locale()));
  protected readonly home = computed(() => this.dictionary().home);
}
