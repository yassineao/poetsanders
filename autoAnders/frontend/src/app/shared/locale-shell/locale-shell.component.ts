import { Component, computed, inject } from "@angular/core";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { FooterComponent } from "../footer/footer.component";
import { NavBarComponent } from "../navBar/navBar.components";
import { getDictionary, isValidLocale } from "../../core/lib/i18n";
import type { Locale } from "../../core/interfaces/locale";

@Component({
  selector: "app-locale-shell",
  imports: [RouterOutlet, NavBarComponent, FooterComponent],
  templateUrl: "./locale-shell.component.html",
})
export class LocaleShellComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly localeParam = toSignal(
    this.route.paramMap.pipe(map((params) => params.get("locale") ?? "de")),
    { initialValue: "de" },
  );

  protected readonly locale = computed<Locale>(() => {
    const value = this.localeParam();
    if (!isValidLocale(value)) {
      void this.router.navigateByUrl("/de");
      return "de";
    }
    return value;
  });
  protected readonly dictionary = computed(() => getDictionary(this.locale()));
}
