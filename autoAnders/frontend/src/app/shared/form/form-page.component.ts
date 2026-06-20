import { Component, computed, input, output, signal } from "@angular/core";
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
  private readonly persistedValues = signal<Record<string, unknown>>({});
  private readonly fileUrls = signal<Record<string, string[]>>({});
  readonly currentPage = signal(0);
  readonly fieldsPerPage = 10;
  readonly sent_Url = input("/");

  readonly fields = computed(() => this.content().fields ?? []);
  readonly paginationLabels = computed(() => {
    const labels = this.content().pagination;
    if (labels) {
      return labels;
    }

    switch (this.locale()) {
      case "de":
        return {
          previousLabel: "Zurück",
          nextLabel: "Weiter",
          pageLabel: "Seite",
          ofLabel: "von",
        };
      case "nl":
        return {
          previousLabel: "Vorige",
          nextLabel: "Volgende",
          pageLabel: "Pagina",
          ofLabel: "van",
        };
      default:
        return {
          previousLabel: "Previous",
          nextLabel: "Next",
          pageLabel: "Page",
          ofLabel: "of",
        };
    }
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.fields().length / this.fieldsPerPage)),
  );

  visible_fields = computed(
    () => {
      const start = this.currentPage() * this.fieldsPerPage;
      const end = (this.currentPage() + 1) * this.fieldsPerPage;
      return this.fields().slice(start , end); 

    }
  );

  protected isFirstPage(): boolean {
    return this.currentPage() === 0;
  }

  protected isLastPage(): boolean {
    return this.currentPage() >= this.totalPages() - 1;
  }

  protected toggleNext(): void {
    this.persistCurrentFormValues();
    const next = this.currentPage() + 1;
    if(next < this.totalPages()){
      this.currentPage.set(next);

    } 
  }

  protected togglePrevious(): void {
    this.persistCurrentFormValues();
    const next = this.currentPage() - 1;
    if(next >= 0){
      this.currentPage.set(next);

    } 
  }


  protected toggleAuthMode(): void {
    this.attemptedSubmit.set(false);
    this.registeringChange.emit(!this.registering());
  }

  protected submit(form: NgForm): void {
    this.attemptedSubmit.set(true);
    form.form.markAllAsTouched();
    this.persistCurrentFormValues();

    if (form.invalid || this.hasMismatch(form) || this.sending()) {
      return;
    }

    this.submitted.emit({
      values: { ...this.persistedValues(), ...form.value } as Record<string, unknown>,
      form,
    });
  }

  protected fieldValue(field: FormField): unknown {
    return this.persistedValues()[field.name] ?? "";
  }

  protected fileSummary(field: FormField): string {
    const files = this.selectedFiles(field);
    if (files.length === 0) {
      return "";
    }

    return files.map((file) => file.name).join(", ");
  }

  protected fileUrlItems(field: FormField): { name: string; url: string }[] {
    const files = this.selectedFiles(field);
    const urls = this.fileUrls()[field.name] ?? [];

    return files.map((file, index) => ({
      name: file.name,
      url: urls[index] ?? "",
    }));
  }

  protected onFileChange(event: Event, field: FormField): void {
    const input = event.target as HTMLInputElement;
    const selectedFiles = Array.from(input.files ?? []);
    const files = field.multiple
      ? this.mergeFiles(this.selectedFiles(field), selectedFiles)
      : selectedFiles;

    this.persistFieldValue(field.name, field.multiple ? files : files[0] ?? null);
    this.setFileUrls(field.name, files);
    input.value = "";
  }

  protected persistFieldValue(name: string, value: unknown): void {
    this.persistedValues.update((values) => ({
      ...values,
      [name]: value,
    }));
  }

  private persistCurrentFormValues(): void {
    this.persistedValues.update((values) => ({ ...values }));
  }

  private selectedFiles(field: FormField): File[] {
    const value = this.persistedValues()[field.name];

    if (Array.isArray(value)) {
      return value.filter((file): file is File => file instanceof File);
    }

    return value instanceof File ? [value] : [];
  }

  private setFileUrls(fieldName: string, files: File[]): void {
    const oldUrls = this.fileUrls()[fieldName] ?? [];
    oldUrls.forEach((url) => URL.revokeObjectURL(url));

    this.fileUrls.update((values) => ({
      ...values,
      [fieldName]: files.map((file) => URL.createObjectURL(file)),
    }));
  }

  private mergeFiles(existingFiles: File[], selectedFiles: File[]): File[] {
    const filesByKey = new Map<string, File>();

    for (const file of [...existingFiles, ...selectedFiles]) {
      filesByKey.set(this.fileKey(file), file);
    }

    return Array.from(filesByKey.values());
  }

  private fileKey(file: File): string {
    return `${file.name}-${file.size}-${file.lastModified}`;
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
