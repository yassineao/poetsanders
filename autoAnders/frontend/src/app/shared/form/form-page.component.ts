import { Component, input, output, signal } from "@angular/core";
import { FormsModule, NgForm, NgModel } from "@angular/forms";
import { RouterLink } from "@angular/router";
import type { FormField, FormPageContent } from "../../core/interfaces/Infos";
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
  protected readonly attemptedSubmit = signal(false);

  protected toggleAuthMode(): void {
    this.attemptedSubmit.set(false);
    this.registeringChange.emit(!this.registering());
  }

  protected submit(form: NgForm): void {
    this.attemptedSubmit.set(true);
    form.form.markAllAsTouched();

    if (form.invalid || this.hasMismatch(form) || this.sending()) {
      return;
    }

    this.submitted.emit({
      values: { ...form.value } as Record<string, unknown>,
      form,
    });
  }

  protected fieldError(
    field: FormField,
    control: NgModel,
    form: NgForm,
  ): string | null {
    if (!control.touched && !this.attemptedSubmit()) {
      return null;
    }

    if (control.errors?.["required"]) {
      return field.errors?.required ?? "This field is required.";
    }
    if (control.errors?.["email"]) {
      return field.errors?.email ?? "Enter a valid email address.";
    }
    if (control.errors?.["minlength"]) {
      return field.errors?.minlength ?? "This value is too short.";
    }
    if (control.errors?.["maxlength"]) {
      return field.errors?.maxlength ?? "This value is too long.";
    }
    if (control.errors?.["pattern"]) {
      return field.errors?.pattern ?? "Enter a valid value.";
    }
    if (
      field.matchField &&
      control.value &&
      control.value !== form.controls[field.matchField]?.value
    ) {
      return field.errors?.mismatch ?? "The values do not match.";
    }

    return null;
  }

  private hasMismatch(form: NgForm): boolean {
    return this.content().fields.some(
      (field) =>
        field.matchField &&
        form.controls[field.name]?.value !== form.controls[field.matchField]?.value,
    );
  }
}
