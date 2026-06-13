import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { getDictionary, isValidLocale } from "../../core/lib/i18n";
import type { Locale } from "../../core/interfaces/locale";
import {
    FormPageComponent,
    type FormSubmission,
} from "../../shared/form/form-page.component";

@Component({
    imports: [FormPageComponent],
    template: `
        <app-form-page
            [locale]="locale()"
            [content]="content()"
            [sending]="sending()"
            [sent]="sent()"
            (submitted)="submit($event)"
            (successClosed)="sent.set(false)"
        />
    `,
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

    protected readonly sending = signal(false);
    protected readonly sent = signal(false);

    protected submit(submission: FormSubmission): void {
        this.sent.set(false);
        this.sending.set(true);

        setTimeout(() => {
            console.log("Sell form:", submission.values);
            this.sending.set(false);
            this.sent.set(true);
            submission.form.resetForm();
        }, 400);
    }
}
