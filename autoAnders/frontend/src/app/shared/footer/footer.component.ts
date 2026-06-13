import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import type { LocaleDictionary } from "../../core/interfaces/LocaleDictionary";
import type { Locale } from "../../core/interfaces/locale";

@Component({
  selector: "app-footer",
  imports: [RouterLink],
  templateUrl: "./footer.component.html",
})
export class FooterComponent {
  readonly locale = input.required<Locale>();
  readonly content = input.required<LocaleDictionary["footer"]>();
  protected readonly year = new Date().getFullYear();

  protected localized(href: string): string {
    return `/${this.locale()}${href}`;
  }
}
