import { Component, computed, inject, signal } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import {
    FormPageComponent,
    type FormSubmission,
} from "../../../shared/form/form-page.component";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, finalize, map, of } from "rxjs";
import { getDictionary, isValidLocale } from "../../../core/lib/i18n";
import type { Locale } from "../../../core/interfaces/locale";
import type { FormPageContent } from "../../../core/interfaces/Infos";
import { ContactService, type ContactMessageRequest, type UserContactMessage } from "../../../core/contact/contact.service";

@Component({
    imports: [FormPageComponent],
    template: `
        <app-form-page
            [locale]="locale()"
            [content]="content()"
            [sending]="sending()"
            [sent]="sent()"
            [failed]="failed()"
            [failureMessage]="failureMessage()"
            (submitted)="submit($event)"
            (successClosed)="sent.set(false)"
            (failureClosed)="failed.set(false)"
        />

        <section class="bg-zinc-950 px-4 pb-16 text-white sm:px-6">
            <div class="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-zinc-900 p-5">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 class="text-xl font-black">Messages</h2>
                        <p class="mt-1 text-sm text-zinc-400">Your contact messages and replies from AutoAnders.</p>
                    </div>
                    <button
                        type="button"
                        (click)="loadMessages()"
                        class="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-zinc-200 transition hover:bg-white/5">
                        Refresh
                    </button>
                </div>

                @if (loadingMessages()) {
                    <p class="mt-5 text-sm text-zinc-400">Loading messages...</p>
                } @else if (messages().length === 0) {
                    <p class="mt-5 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">
                        No messages yet.
                    </p>
                } @else {
                    <div class="mt-5 space-y-4">
                        @for (message of messages(); track message.id) {
                            <article class="rounded-xl border border-white/10 bg-zinc-950 p-4">
                                <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <p class="font-bold text-white">{{ message.companyName }}</p>
                                        <p class="mt-1 text-xs text-zinc-500">{{ formatDate(message.createdAt) }}</p>
                                    </div>
                                    <span class="self-start rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-zinc-300">
                                        {{ message.status }}
                                    </span>
                                </div>
                                <p class="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{{ message.message }}</p>
                                @if (message.adminReply) {
                                    <div class="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                                        <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">AutoAnders reply</p>
                                        <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-emerald-50">{{ message.adminReply }}</p>
                                        @if (message.repliedAt) {
                                            <p class="mt-2 text-xs text-emerald-200/70">{{ formatDate(message.repliedAt) }}</p>
                                        }
                                    </div>
                                }
                            </article>
                        }
                    </div>
                }
            </div>
        </section>
    `,
})
export class ContactPageComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly contactService = inject(ContactService);

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
    protected readonly failed = signal(false);
    protected readonly failureMessage = signal<string | null>(null);
    protected readonly loadingMessages = signal(false);
    protected readonly messages = signal<UserContactMessage[]>([]);

    constructor() {
        this.loadMessages();
    }

    protected submit(submission: FormSubmission): void {
        this.sent.set(false);
        this.failed.set(false);
        this.failureMessage.set(null);
        this.sending.set(true);

        this.contactService
            .sendMessage(this.toContactMessage(submission.values))
            .pipe(finalize(() => this.sending.set(false)))
            .subscribe({
                next: () => {
                    this.sent.set(true);
                    submission.form.resetForm();
                    this.loadMessages();
                },
                error: (error: unknown) => {
                    console.error("Contact message failed:", error);
                    this.failureMessage.set(this.errorMessage(error));
                    this.failed.set(true);
                },
            });
    }

    private toContactMessage(values: Record<string, unknown>): ContactMessageRequest {
        return {
            companyName: this.toString(values["companyName"]),
            phoneNumber: this.toString(values["phoneNumber"]),
            message: this.toString(values["message"]),
        };
    }

    private errorMessage(error: unknown): string {
        if (error instanceof HttpErrorResponse) {
            const response = error.error as { detail?: string; message?: string; error?: string } | string | null;

            if (typeof response === "string" && response.trim()) {
                return response;
            }

            if (response && typeof response === "object") {
                return response.detail ?? response.message ?? response.error ?? "Something went wrong. Please try again.";
            }
        }

        return "Something went wrong. Please try again.";
    }

    private toString(value: unknown): string {
        return String(value ?? "").trim();
    }

    protected loadMessages(): void {
        this.loadingMessages.set(true);
        this.contactService
            .getMessages()
            .pipe(
                catchError((error) => {
                    console.error("Loading contact messages failed:", error);
                    return of([]);
                }),
                finalize(() => this.loadingMessages.set(false)),
            )
            .subscribe((messages) => this.messages.set(messages));
    }

    protected formatDate(value: string): string {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat(this.locale(), {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date);
    }
}
