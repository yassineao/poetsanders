import { Component, computed, input, output, signal } from "@angular/core";
import { FormsModule, NgForm, NgModel } from "@angular/forms";
import { RouterLink } from "@angular/router";
import type { FormField, FormPageContent } from "../../core/interfaces/Infos";
import type { Locale } from "../../core/interfaces/locale";

export interface FormSubmission {
  values: Record<string, unknown>;
  form: NgForm;
}

interface FormStep {
  label: string;
  fields: FormField[];
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
  readonly failureMessage = input<string | null>(null);
  readonly submitted = output<FormSubmission>();
  readonly successClosed = output<void>();
  readonly failureClosed = output<void>();
  readonly registering = input(false);
  readonly registeringChange = output<boolean>();
  protected readonly attemptedSubmit = signal(false);
  protected readonly openColorField = signal<string | null>(null);
  private readonly persistedValues = signal<Record<string, unknown>>({});
  private readonly fileUrls = signal<Record<string, string[]>>({});
  readonly currentPage = signal(0);
  readonly sent_Url = input("/");

  readonly fields = computed(() => this.content().fields ?? []);
  readonly steps = computed<FormStep[]>(() => {
    const fields = this.fields();
    const fieldsWithSteps = fields.map((field) => ({
      ...field,
      step: field.step ?? this.defaultStepFor(field.name) ?? undefined,
    }));
    const groupedFields = fieldsWithSteps.filter((field) => field.step);

    if (!groupedFields.length) {
      return fieldsWithSteps.reduce<FormStep[]>((steps, field, index) => {
        const stepIndex = Math.floor(index / 10);
        steps[stepIndex] ??= {
          label: String(stepIndex + 1),
          fields: [],
        };
        steps[stepIndex].fields.push(field);
        return steps;
      }, []);
    }

    return fieldsWithSteps.reduce<FormStep[]>((steps, field) => {
      const label = field.step ?? "Other";
      const existingStep = steps.find((step) => step.label === label);
      if (existingStep) {
        existingStep.fields.push(field);
      } else {
        steps.push({ label, fields: [field] });
      }
      return steps;
    }, []);
  });
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

  readonly totalPages = computed(() => Math.max(1, this.steps().length));

  readonly currentStep = computed(() =>
    this.steps()[Math.min(this.currentPage(), this.totalPages() - 1)],
  );

  readonly visible_fields = computed(() => this.currentStep()?.fields ?? []);

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

    if (!this.isLastPage() || form.invalid || this.hasMismatch(form) || this.sending()) {
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

  protected fileUrlItems(field: FormField): { name: string; url: string; index: number }[] {
    const files = this.selectedFiles(field);
    const urls = this.fileUrls()[field.name] ?? [];

    return files.map((file, index) => ({
      name: file.name,
      url: urls[index] ?? "",
      index,
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

  protected goToStep(index: number): void {
    this.persistCurrentFormValues();
    this.currentPage.set(Math.min(this.totalPages() - 1, Math.max(0, index)));
  }

  protected selectColor(field: FormField, value: string): void {
    this.persistFieldValue(field.name, value);
    this.openColorField.set(null);
  }

  protected optionLabel(field: FormField, value: unknown): string {
    return field.options?.find((option) => option.value === value)?.label ?? String(value || "");
  }

  protected removeFile(field: FormField, index: number): void {
    const files = this.selectedFiles(field).filter((_, fileIndex) => fileIndex !== index);

    this.persistFieldValue(field.name, field.multiple ? files : files[0] ?? null);
    this.setFileUrls(field.name, files);
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

  private defaultStepFor(fieldName: string): string | null {
    const labels = this.defaultStepLabels();

    if ([
      "brand",
      "model",
      "yearOfManufacture",
      "mileage",
      "price",
      "firstRegistrationDate",
      "referenceNumber",
      "licensePlate",
      "colour",
      "location",
    ].includes(fieldName)) {
      return labels.basics;
    }

    if ([
      "power",
      "numberOfDoors",
      "wheelbase",
      "numberOfCylinders",
      "motorVehicleTax",
      "modelDateFrom",
      "modelDateTo",
      "maxTowingWeight",
      "maxTowingWeightUnbraked",
      "urbanFuelConsumption",
      "combinedFuelConsumption",
      "motorwayFuelConsumption",
      "co2Emissions",
      "chassisNumber",
      "numberOfKeys",
      "engineDisplacement",
      "emptyWeight",
      "apkMotDate",
    ].includes(fieldName)) {
      return labels.technical;
    }

    if ([
      "taxDeductible",
      "serviceDocumentation",
      "taxAdditionPercentage",
      "financialLeasePricePerMonth",
      "leasePrice60Months",
      "leasePrice48Months",
      "leasePrice36Months",
      "bodyType",
      "gearbox",
      "fuel",
      "emissionClass",
      "energyLabel",
      "paintType",
      "upholstery",
      "status",
    ].includes(fieldName)) {
      return labels.options;
    }

    if (fieldName === "pictures") {
      return labels.pictures;
    }

    return null;
  }

  private defaultStepLabels(): { basics: string; technical: string; options: string; pictures: string } {
    switch (this.locale()) {
      case "de":
        return {
          basics: "Basisdaten",
          technical: "Technische Daten",
          options: "Finanzen & Optionen",
          pictures: "Bilder",
        };
      case "nl":
        return {
          basics: "Basisgegevens",
          technical: "Technische gegevens",
          options: "Financieel & opties",
          pictures: "Afbeeldingen",
        };
      default:
        return {
          basics: "Basics",
          technical: "Technical details",
          options: "Finance & options",
          pictures: "Pictures",
        };
    }
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
