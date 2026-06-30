import { Component, computed, signal, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { getDictionary, isValidLocale } from "../../../core/lib/i18n";
import type { Locale } from "../../../core/interfaces/locale";
import type { CarPicture } from "../../../core/interfaces/Car";
import { SellCarFormComponent } from "../components/sell-car-form.component";
import { SellUploadedPicturesComponent } from "../components/sell-uploaded-pictures.component";

@Component({
    imports: [SellCarFormComponent, SellUploadedPicturesComponent],
    templateUrl: "./sell-page.component.html",
})
export class SellPageComponent {
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

    protected readonly content = computed(
        () => getDictionary(this.locale()).sell,
    );

    protected readonly uploadedPictures = signal<CarPicture[]>([]);
}
