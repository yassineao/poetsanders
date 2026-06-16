import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
    FormPageComponent,
    type FormSubmission,
} from "../../../shared/form/form-page.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { getDictionary, isValidLocale } from "../../../core/lib/i18n";
import type { Locale } from "../../../core/interfaces/locale";
import type { FormPageContent } from "../../../core/interfaces/Infos";

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
export class ContactPageComponent {
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

    protected readonly content = computed<FormPageContent>(() => {
        const content = getDictionary(this.locale()).form.content;

        return {
            title: content.title,
            description: content.description,
            fields: [
                { name: "companyName", label: content.fields.companyName, type: "text", placeholder: content.placeholders.companyName, required: true },
                { name: "lastName", label: content.fields.lastName, type: "text", placeholder: content.placeholders.lastName, required: true },
                { name: "email", label: content.fields.email, type: "email", placeholder: content.placeholders.email, required: true },
                { name: "phoneNumber", label: content.fields.phoneNumber, type: "tel", placeholder: content.placeholders.phoneNumber },
            ],
            textarea: {
                name: "message",
                label: content.fields.message,
                placeholder: content.placeholders.message,
                required: true,
            },
            consent: content.consent,
            submitLabel: content.submitLabel,
            sendingLabel: "Sending...",
            popup: content.popup,
            testimonial: content.testimonial,
        };
    });

    protected readonly sending = signal(false);
    protected readonly sent = signal(false);

    protected submit(submission: FormSubmission): void {
        this.sent.set(false);
        this.sending.set(true);

        setTimeout(() => {
            console.log("Contact form:", submission.values);
            this.sending.set(false);
            this.sent.set(true);
            submission.form.resetForm();
        }, 400);
    }
}
