import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";
import { getDictionary, isValidLocale } from "../../core/lib/i18n";
import type { Locale } from "../../core/interfaces/locale";
import { CatalogueComponent } from "./catalogue.component";

@Component({
  imports: [CatalogueComponent],
  templateUrl: "./catalogue-page.component.html",
})
export class CataloguePageComponent {
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
  protected readonly catalogue = computed(() => getDictionary(this.locale()).home.catalogue);
}
