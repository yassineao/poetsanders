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
  selector: 'contact-page',
  imports: [FormPageComponent],
  templateUrl: './contact-page.component.html',
})
export class ContactPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly contactService = inject(ContactService);

  private readonly localeParam = toSignal(
    (this.route.parent?.paramMap ?? this.route.paramMap).pipe(
      map((params) => params.get('locale') ?? 'de'),
    ),
    { initialValue: 'de' },
  );

  protected readonly locale = computed<Locale>(() => {
    const value = this.localeParam();
    return isValidLocale(value) ? value : 'de';
  });

  protected readonly content = computed<FormPageContent>(() => {
    const content = getDictionary(this.locale()).form.content;

    return {
      title: content.title,
      description: content.description,
      fields: [
        {
          name: 'companyName',
          label: content.fields.companyName,
          type: 'text',
          placeholder: content.placeholders.companyName,
          required: true,
        },
        {
          name: 'phoneNumber',
          label: content.fields.phoneNumber,
          type: 'tel',
          placeholder: content.placeholders.phoneNumber,
        },
      ],
      textarea: {
        name: 'message',
        label: content.fields.message,
        placeholder: content.placeholders.message,
        required: true,
      },
      consent: content.consent,
      submitLabel: content.submitLabel,
      sendingLabel: 'Sending...',
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
          console.error('Contact message failed:', error);
          this.failureMessage.set(this.errorMessage(error));
          this.failed.set(true);
        },
      });
  }

  private toContactMessage(values: Record<string, unknown>): ContactMessageRequest {
    return {
      companyName: this.toString(values['companyName']),
      phoneNumber: this.toString(values['phoneNumber']),
      message: this.toString(values['message']),
    };
  }

  private errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const response = error.error as
        { detail?: string; message?: string; error?: string } | string | null;

      if (typeof response === 'string' && response.trim()) {
        return response;
      }

      if (response && typeof response === 'object') {
        return (
          response.detail ??
          response.message ??
          response.error ??
          'Something went wrong. Please try again.'
        );
      }
    }

    return 'Something went wrong. Please try again.';
  }

  private toString(value: unknown): string {
    return String(value ?? '').trim();
  }

  protected loadMessages(): void {
    this.loadingMessages.set(true);
    this.contactService
      .getMessages()
      .pipe(
        catchError((error) => {
          console.error('Loading contact messages failed:', error);
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
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }
}
