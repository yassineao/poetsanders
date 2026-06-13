import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import type { FaqContent } from "../../core/interfaces/LocaleDictionary";

@Component({
  selector: "app-faq",
  imports: [RouterLink],
  templateUrl: "./faq.component.html",
})
export class FaqComponent {
  readonly content = input.required<FaqContent>();
  readonly items = input<FaqContent["items"]>();
  readonly ctaHref = input<string>();

  protected displayedItems(): FaqContent["items"] {
    return this.items() ?? this.content().items;
  }
}
