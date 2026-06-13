import { Component, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs";
import { getDictionary, isValidLocale } from "../../core/lib/i18n";
import type { Locale } from "../../core/interfaces/locale";

@Component({
  templateUrl: "./advantages-page.component.html",
})
export class AdvantagesPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly localeParam = toSignal(
    (this.route.parent?.paramMap ?? this.route.paramMap).pipe(
      map((params) => params.get("locale") ?? "de"),
    ),
    { initialValue: "de" },
  );

  private readonly locale = computed<Locale>(() => {
    const value = this.localeParam();
    return isValidLocale(value) ? value : "de";
  });
  private readonly dictionary = computed(() => getDictionary(this.locale()));
  protected readonly content = computed(() => this.dictionary().home.advantages);
  protected readonly services = computed(() => this.dictionary().home.services);
}
