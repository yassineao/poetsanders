import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { finalize, map, of, switchMap } from "rxjs";
import { getDictionary, isValidLocale } from "../../../core/lib/i18n";
import type { Locale } from "../../../core/interfaces/locale";
import {
    FormPageComponent,
    type FormSubmission,
} from "../../../shared/form/form-page.component";
import {
    CarsService,

} from "../../../core/cars/cars.service";

import { 
    type Car,
    type CarPicture ,
    type CarPictureRequest,
    type CarRequest  } from "../../../core/interfaces/Car"



@Component({
    imports: [FormPageComponent],
    template: `
        <app-form-page
            [locale]="locale()"
            [content]="content()"
            [sending]="sending()"
            [sent]="sent()"
            [failed]="failed()"
            (submitted)="submit($event)"
            (successClosed)="sent.set(false)"
            (failureClosed)="failed.set(false)"
        />

        @if (uploadedPictures().length > 0) {
            <section class="bg-zinc-950 px-4 pb-16 text-white sm:px-6">
                <div class="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-zinc-900 p-5">
                    <h2 class="text-lg font-black">Uploaded pictures</h2>
                    <div class="mt-4 space-y-2">
                        @for (picture of uploadedPictures(); track picture.id) {
                            <div class="rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm">
                                <p class="font-bold text-zinc-200">{{ picture.title || picture.id }}</p>
                                <p class="mt-1 break-all text-xs text-zinc-500">{{ picture.storage_path }}</p>
                            </div>
                        }
                    </div>
                </div>
            </section>
        }
    `,
})
export class SellPageComponent {
    private readonly route = inject(ActivatedRoute);
    private readonly carsService = inject(CarsService);

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

    protected readonly failed = signal(false);
    protected readonly sending = signal(false);
    protected readonly sent = signal(false);
    protected readonly uploadedPictures = signal<CarPicture[]>([]);

    protected submit(submission: FormSubmission): void {
        this.sent.set(false);
        this.failed.set(false);
        this.uploadedPictures.set([]);
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
                                this.uploadedPictures.set(uploadedPictures);
                                return car;
                            }),
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
                    this.failed.set(true);
                },
            });
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

    private toEnum<T>(value: unknown): T {
        return this.toString(value) as unknown as T;
    }
}
