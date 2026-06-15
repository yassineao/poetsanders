import { Component, input, output } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { RouterLink } from "@angular/router";
import type { FormPageContent } from "../../core/interfaces/Infos";
import type { Locale } from "../../core/interfaces/locale";

export interface FormSubmission {
  values: Record<string, unknown>;
  form: NgForm;
}

@Component({
  selector: "app-form-page",
  imports: [FormsModule, RouterLink],
  templateUrl: "./form-page.component.html",
})
export class FormPageComponent {
  readonly locale = input.required<Locale>();
  readonly content = input.required<FormPageContent>();
  readonly sending = input(false);
  readonly sent = input(false);
  readonly failed = input(false);
  readonly submitted = output<FormSubmission>();
  readonly successClosed = output<void>();
  readonly failureClosed = output<void>();
  readonly registering = input(false);
  readonly registeringChange = output<boolean>();

  protected toggleAuthMode(): void {
    this.registeringChange.emit(!this.registering());
  }

  protected submit(form: NgForm): void {
    if (form.invalid || this.sending()) {
      return;
    }

    this.submitted.emit({
      values: { ...form.value } as Record<string, unknown>,
      form,
    });
  }
}
