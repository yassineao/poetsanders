import type { Locale } from '../../../core/interfaces/locale';
import { translateUi } from '../../../core/lib/i18n/ui-translations';
import { Component, input } from "@angular/core";
import type { CarPicture } from "../../../core/interfaces/Car";

@Component({
    selector: "app-sell-uploaded-pictures",
    templateUrl: "./sell-uploaded-pictures.component.html",
})
export class SellUploadedPicturesComponent {
  protected t(value: string): string {
    return translateUi(value, this.locale());
  }

  readonly locale = input.required<Locale>();
    readonly pictures = input.required<CarPicture[]>();
}
