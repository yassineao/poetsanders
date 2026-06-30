import { Component, input } from "@angular/core";
import type { CarPicture } from "../../../core/interfaces/Car";

@Component({
    selector: "app-sell-uploaded-pictures",
    templateUrl: "./sell-uploaded-pictures.component.html",
})
export class SellUploadedPicturesComponent {
    readonly pictures = input.required<CarPicture[]>();
}
