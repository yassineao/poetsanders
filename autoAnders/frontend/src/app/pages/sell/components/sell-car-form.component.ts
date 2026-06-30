import { Component, input, output, signal, inject } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, finalize, map, of, switchMap, throwError } from "rxjs";
import type { Locale } from "../../../core/interfaces/locale";
import type { FormPageContent } from "../../../core/interfaces/Infos";
import type {
    CarPicture,
    CarPictureRequest,
    CarRequest,
} from "../../../core/interfaces/Car";
import { CarsService } from "../../../core/cars/cars.service";
import {
    FormPageComponent,
    type FormSubmission,
} from "../../../shared/form/form-page.component";

@Component({
    selector: "app-sell-car-form",
    imports: [FormPageComponent],
    templateUrl: "./sell-car-form.component.html",
})
export class SellCarFormComponent {
    readonly locale = input.required<Locale>();
    readonly content = input.required<FormPageContent>();
    readonly picturesUploaded = output<CarPicture[]>();

    private readonly carsService = inject(CarsService);

    protected readonly failed = signal(false);
    protected readonly failureMessage = signal<string | null>(null);
    protected readonly sending = signal(false);
    protected readonly sent = signal(false);

    protected submit(submission: FormSubmission): void {
        this.sent.set(false);
        this.failed.set(false);
        this.failureMessage.set(null);
        this.picturesUploaded.emit([]);
        this.sending.set(true);

        const pictures = this.toPictureRequests(submission.values["pictures"]);

        this.carsService.AddCar(this.toCarRequest(submission))
            .pipe(
                switchMap((car) => {
                    if (pictures.length === 0) {
                        return of(car);
                    }

                    return this.carsService
                        .addCarPictures(car.id, pictures)
                        .pipe(
                            map((uploadedPictures) => {
                                this.picturesUploaded.emit(uploadedPictures);
                                return car;
                            }),
                            catchError((uploadError) =>
                                this.carsService.deleteCar(car.id).pipe(
                                    catchError((deleteError) => {
                                        console.error("Cleaning up car after image upload failure failed:", deleteError);
                                        return of(undefined);
                                    }),
                                    switchMap(() => throwError(() => uploadError)),
                                ),
                            ),
                        );
                }),
                finalize(() => this.sending.set(false)),
            )
            .subscribe({
                next: () => {
                    this.sent.set(true);
                    submission.form.resetForm();
                },
                error: (error) => {
                    console.error("Adding car failed:", error);
                    this.failureMessage.set(this.errorMessage(error));
                    this.failed.set(true);
                },
            });
    }

    protected closeFailure(): void {
        this.failed.set(false);
        this.failureMessage.set(null);
    }

    private toPictureRequests(value: unknown): CarPictureRequest[] {
        const files = Array.isArray(value)
            ? value
            : value instanceof File
              ? [value]
              : [];

        return files
            .filter((file): file is File => file instanceof File)
            .map((file) => ({
                file,
                title: file.name,
                description: file.name,
                width: 0,
                height: 0,
            }));
    }

    private toCarRequest(submission: FormSubmission): CarRequest {
        const values = submission.values;

        return {
            brand: this.toString(values["brand"]),
            model: this.toString(values["model"]),
            title: this.toString(values["title"]),
            subtitle: this.toString(values["subtitle"]),
            yearOfManufacture: this.toNumber(values["yearOfManufacture"]),
            mileage: this.toNumber(values["mileage"]),
            power: this.toString(values["power"]),
            referenceNumber: this.toString(values["referenceNumber"]),
            price: this.toNumber(values["price"]),
            firstRegistrationDate: this.toString(values["firstRegistrationDate"]),
            numberOfDoors: this.toNumber(values["numberOfDoors"]),
            wheelbase: this.toNumber(values["wheelbase"]),
            numberOfCylinders: this.toNumber(values["numberOfCylinders"]),
            motorVehicleTax: this.toString(values["motorVehicleTax"]),
            modelDateFrom: this.toString(values["modelDateFrom"]),
            modelDateTo: this.toString(values["modelDateTo"]),
            maxTowingWeight: this.toNumber(values["maxTowingWeight"]),
            maxTowingWeightUnbraked: this.toNumber(values["maxTowingWeightUnbraked"]),
            urbanFuelConsumption: this.toNumber(values["urbanFuelConsumption"]),
            combinedFuelConsumption: this.toNumber(values["combinedFuelConsumption"]),
            motorwayFuelConsumption: this.toNumber(values["motorwayFuelConsumption"]),
            co2Emissions: this.toNumber(values["co2Emissions"]),
            taxDeductible: this.toBoolean(values["taxDeductible"]),
            chassisNumber: this.toString(values["chassisNumber"]),
            numberOfKeys: this.toNumber(values["numberOfKeys"]),
            licensePlate: this.toString(values["licensePlate"]),
            engineDisplacement: this.toNumber(values["engineDisplacement"]),
            colour: this.toString(values["colour"]),
            emptyWeight: this.toNumber(values["emptyWeight"]),
            taxAdditionPercentage: this.toNumber(values["taxAdditionPercentage"]),
            apkMotDate: this.toString(values["apkMotDate"]),
            serviceDocumentation: this.toBoolean(values["serviceDocumentation"]),
            location: this.toString(values["location"]),
            financialLeasePricePerMonth: this.toNumber(values["financialLeasePricePerMonth"]),
            leasePrice60Months: this.toNumber(values["leasePrice60Months"]),
            leasePrice48Months: this.toNumber(values["leasePrice48Months"]),
            leasePrice36Months: this.toNumber(values["leasePrice36Months"]),
            bodyType: this.toEnum<CarRequest["bodyType"]>(values["bodyType"]),
            gearbox: this.toEnum<CarRequest["gearbox"]>(values["gearbox"]),
            fuel: this.toEnum<CarRequest["fuel"]>(values["fuel"]),
            emissionClass: this.toEnum<CarRequest["emissionClass"]>(values["emissionClass"]),
            energyLabel: this.toEnum<CarRequest["energyLabel"]>(values["energyLabel"]),
            paintType: this.toEnum<CarRequest["paintType"]>(values["paintType"]),
            upholstery: this.toEnum<CarRequest["upholstery"]>(values["upholstery"]),
            status: this.toEnum<CarRequest["status"]>(values["status"]),
        };
    }

    private toString(value: unknown): string {
        return String(value ?? "").trim();
    }

    private toNumber(value: unknown): number {
        if (value === null || value === undefined || value === "") {
            return 0;
        }
        return Number(value);
    }

    private toBoolean(value: unknown): boolean {
        return value === true || value === "true" || value === "on";
    }

    private toEnum<T>(value: unknown): T | null {
        const text = this.toString(value);
        return text ? text as T : null;
    }

    private errorMessage(error: unknown): string {
        if (error instanceof HttpErrorResponse) {
            const backendError = error.error as {
                detail?: unknown;
                message?: unknown;
                error?: unknown;
                title?: unknown;
            } | string | null;

            if (typeof backendError === "string" && backendError.trim()) {
                return backendError;
            }

            if (backendError && typeof backendError === "object") {
                for (const key of ["detail", "message", "error", "title"] as const) {
                    const value = backendError[key];
                    if (typeof value === "string" && value.trim()) {
                        return value;
                    }
                }
            }

            if (error.status === 413) {
                return "One or more selected images are too large. Please upload smaller files.";
            }
        }

        return "Something went wrong. Please try again.";
    }
}
