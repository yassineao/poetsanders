import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { map } from "rxjs";
import { getDictionary, isValidLocale } from "../../../core/lib/i18n";
import type { LocaleDictionary } from "../../../core/interfaces/LocaleDictionary";
import type { Locale } from "../../../core/interfaces/locale";

type PageKey = keyof LocaleDictionary["pages"];

@Component({
  imports: [RouterLink],
  templateUrl: "./legal-page.component.html",
})
export class LegalPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly pageKey = toSignal(this.route.data.pipe(map(data => (data['page'] ?? 'about') as PageKey)), { initialValue: 'about' as PageKey });
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
  protected readonly page = computed(() => {
    const key = this.pageKey();
    return getDictionary(this.locale()).pages[key];
  });
}
