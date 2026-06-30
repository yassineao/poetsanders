import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";
import { catchError, finalize, forkJoin, of } from "rxjs";
import { CarsService } from "../../../core/cars/cars.service";
import type { Car, CarPicture, CarPictureRequest, CarRequest } from "../../../core/interfaces/Car";

type CarEditValues = CarRequest;
type CarEditKey = keyof CarEditValues;

interface CarInputField {
  key: CarEditKey;
  label: string;
  type: "text" | "number" | "date";
  required?: boolean;
  step?: string;
}

interface CarSelectField {
  key: CarEditKey;
  label: string;
  options: readonly string[];
}

@Component({
  selector: "app-profile-cars",
  imports: [CommonModule, FormsModule],
  templateUrl: "./profile-cars.component.html",
})
export class ProfileCarsComponent {
  private readonly carsService = inject(CarsService);

  protected readonly cars = signal<Car[]>([]);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly savingCarId = signal<string | null>(null);
  protected readonly uploadingPicturesCarId = signal<string | null>(null);
  protected readonly deletingPictureIds = signal<string[]>([]);
  protected readonly editingCarId = signal<string | null>(null);
  protected readonly editValues = signal<Record<string, CarEditValues>>({});
  protected readonly hasCars = computed(() => this.cars().length > 0);

  protected readonly textFields: CarInputField[] = [
    { key: "brand", label: "Brand", type: "text", required: true },
    { key: "model", label: "Model", type: "text", required: true },
    { key: "title", label: "Title", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "text" },
    { key: "power", label: "Power", type: "text" },
    { key: "referenceNumber", label: "Reference number", type: "text" },
    { key: "motorVehicleTax", label: "Motor vehicle tax", type: "text" },
    { key: "chassisNumber", label: "Chassis number", type: "text" },
    { key: "licensePlate", label: "License plate", type: "text" },
    { key: "colour", label: "Colour", type: "text" },
    { key: "apkMotDate", label: "APK/MOT date", type: "text" },
    { key: "location", label: "Location", type: "text" },
  ];

  protected readonly dateFields: CarInputField[] = [
    { key: "firstRegistrationDate", label: "First registration", type: "date" },
    { key: "modelDateFrom", label: "Model date from", type: "date" },
    { key: "modelDateTo", label: "Model date to", type: "date" },
  ];

  protected readonly numberFields: CarInputField[] = [
    { key: "yearOfManufacture", label: "Year", type: "number" },
    { key: "mileage", label: "Mileage", type: "number", required: true },
    { key: "price", label: "Price", type: "number", step: "0.01" },
    { key: "numberOfDoors", label: "Doors", type: "number" },
    { key: "wheelbase", label: "Wheelbase", type: "number" },
    { key: "numberOfCylinders", label: "Cylinders", type: "number" },
    { key: "maxTowingWeight", label: "Max towing weight", type: "number" },
    { key: "maxTowingWeightUnbraked", label: "Max towing weight unbraked", type: "number" },
    { key: "urbanFuelConsumption", label: "Urban fuel consumption", type: "number", step: "0.01" },
    { key: "combinedFuelConsumption", label: "Combined fuel consumption", type: "number", step: "0.01" },
    { key: "motorwayFuelConsumption", label: "Motorway fuel consumption", type: "number", step: "0.01" },
    { key: "co2Emissions", label: "CO2 emissions", type: "number" },
    { key: "numberOfKeys", label: "Number of keys", type: "number" },
    { key: "engineDisplacement", label: "Engine displacement", type: "number" },
    { key: "emptyWeight", label: "Empty weight", type: "number" },
    { key: "taxAdditionPercentage", label: "Tax addition percentage", type: "number", step: "0.01" },
    { key: "financialLeasePricePerMonth", label: "Financial lease per month", type: "number", step: "0.01" },
    { key: "leasePrice60Months", label: "Lease price 60 months", type: "number", step: "0.01" },
    { key: "leasePrice48Months", label: "Lease price 48 months", type: "number", step: "0.01" },
    { key: "leasePrice36Months", label: "Lease price 36 months", type: "number", step: "0.01" },
  ];

  protected readonly selectFields: CarSelectField[] = [
    {
      key: "bodyType",
      label: "Body type",
      options: [
    "MPV",
    "SUV",
    "SEDAN",
    "HATCHBACK",
    "STATION_WAGON",
    "COUPE",
    "CABRIOLET",
    "VAN",
      ],
    },
    { key: "gearbox", label: "Gearbox", options: ["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"] },
    { key: "fuel", label: "Fuel", options: ["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "LPG", "CNG"] },
    { key: "emissionClass", label: "Emission class", options: ["EURO_1", "EURO_2", "EURO_3", "EURO_4", "EURO_5", "EURO_6"] },
    { key: "energyLabel", label: "Energy label", options: ["A", "B", "C", "D", "E", "F", "G"] },
    { key: "paintType", label: "Paint type", options: ["BASIC", "METALLIC", "PEARL", "MATTE"] },
    { key: "upholstery", label: "Upholstery", options: ["FABRIC", "LEATHER", "PART_LEATHER", "ALCANTARA"] },
  ];

  protected readonly booleanFields: Array<{ key: CarEditKey; label: string }> = [
    { key: "taxDeductible", label: "Tax deductible" },
    { key: "serviceDocumentation", label: "Service documentation" },
  ];

  constructor() {
    this.loadCars();
  }

  protected loadCars(): void {
    this.loading.set(true);
    this.failed.set(false);

    this.carsService.getCarsByCurrentUser()
      .pipe(
        catchError((error) => {
          console.error("Loading profile cars failed:", error);
          this.failed.set(true);
          return of([] as Car[]);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((cars) => this.cars.set(cars));
  }

  protected startEdit(car: Car): void {
    this.editingCarId.set(car.id);
    this.editValues.update((values) => ({
      ...values,
      [car.id]: this.toEditValues(car),
    }));
  }

  protected cancelEdit(): void {
    this.editingCarId.set(null);
  }

  protected valuesFor(car: Car): CarEditValues {
    return this.editValues()[car.id] ?? this.toEditValues(car);
  }

  protected coverImage(car: Car): string {
    return car.pictures?.[0]?.storage_path || "/no-image-icon.png";
  }

  protected picturesFor(car: Car): string[] {
    const pictures = car.pictures
      ?.map((picture) => picture.storage_path)
      .filter((storagePath): storagePath is string => Boolean(storagePath)) ?? [];
    return pictures.length ? pictures : ["/no-image-icon.png"];
  }

  protected isDeletingPicture(pictureId: string): boolean {
    return this.deletingPictureIds().includes(pictureId);
  }

  protected deletePicture(car: Car, picture: CarPicture): void {
    if (this.isDeletingPicture(picture.id)) {
      return;
    }

    if (!window.confirm(`Delete ${picture.title || "this picture"}? This cannot be undone.`)) {
      return;
    }

    this.failed.set(false);
    this.deletingPictureIds.update((ids) => [...ids, picture.id]);
    this.carsService.deleteCarPicture(car.id, picture.id)
      .pipe(
        finalize(() =>
          this.deletingPictureIds.update((ids) => ids.filter((id) => id !== picture.id)),
        ),
      )
      .subscribe({
        next: () => {
          this.cars.update((cars) =>
            cars.map((item) =>
              item.id === car.id
                ? { ...item, pictures: (item.pictures ?? []).filter((candidate) => candidate.id !== picture.id) }
                : item,
            ),
          );
        },
        error: (error) => {
          console.error("Deleting car picture failed:", error);
          this.failed.set(true);
        },
      });
  }

  protected async addPictures(car: Car, event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = "";

    if (!files.length || this.uploadingPicturesCarId()) {
      return;
    }

    this.failed.set(false);
    this.uploadingPicturesCarId.set(car.id);
    const pictureRequests = await this.toPictureRequests(files);

    forkJoin(pictureRequests.map((picture) => this.carsService.addCarPicture(car.id, picture)))
      .pipe(finalize(() => this.uploadingPicturesCarId.set(null)))
      .subscribe({
        next: (uploadedPictures) => {
          this.cars.update((cars) =>
            cars.map((item) =>
              item.id === car.id
                ? { ...item, pictures: [...(item.pictures ?? []), ...uploadedPictures] }
                : item,
            ),
          );
        },
        error: (error) => {
          console.error("Uploading car pictures failed:", error);
          this.failed.set(true);
        },
      });
  }

  protected statusLabel(car: Car): string {
    return String(car.status || "No status").replaceAll("_", " ");
  }

  protected saveCar(car: Car, form: NgForm): void {
    form.form.markAllAsTouched();
    if (form.invalid || this.savingCarId()) {
      return;
    }

    const values = this.valuesFor(car);
    const request = this.toCarRequest(values);
    if (!window.confirm(`Save changes to ${car.brand} ${car.model}?`)) {
      return;
    }

    this.savingCarId.set(car.id);
    this.failed.set(false);

    this.carsService.updateCar(car.id, request)
      .pipe(finalize(() => this.savingCarId.set(null)))
      .subscribe({
        next: (updatedCar) => {
          this.cars.update((cars) =>
            cars.map((item) => item.id === updatedCar.id ? updatedCar : item),
          );
          this.editingCarId.set(null);
        },
        error: (error) => {
          console.error("Updating car failed:", error);
          this.failed.set(true);
        },
      });
  }

  protected deleteCar(car: Car): void {
    if (this.savingCarId()) {
      return;
    }

    if (!window.confirm(`Delete ${car.brand} ${car.model}? This cannot be undone.`)) {
      return;
    }

    this.savingCarId.set(car.id);
    this.failed.set(false);

    this.carsService.deleteCar(car.id)
      .pipe(finalize(() => this.savingCarId.set(null)))
      .subscribe({
        next: () => {
          this.cars.update((cars) => cars.filter((item) => item.id !== car.id));
          if (this.editingCarId() === car.id) {
            this.editingCarId.set(null);
          }
        },
        error: (error) => {
          console.error("Deleting car failed:", error);
          this.failed.set(true);
        },
      });
  }

  private toEditValues(car: Car): CarEditValues {
    return {
      brand: car.brand ?? "",
      model: car.model ?? "",
      title: car.title ?? "",
      subtitle: car.subtitle ?? "",
      yearOfManufacture: car.yearOfManufacture ?? 0,
      mileage: car.mileage ?? 0,
      power: car.power ?? "",
      referenceNumber: car.referenceNumber ?? "",
      price: car.price ?? 0,
      firstRegistrationDate: car.firstRegistrationDate ?? "",
      numberOfDoors: car.numberOfDoors ?? 0,
      wheelbase: car.wheelbase ?? 0,
      numberOfCylinders: car.numberOfCylinders ?? 0,
      motorVehicleTax: car.motorVehicleTax ?? "",
      modelDateFrom: car.modelDateFrom ?? "",
      modelDateTo: car.modelDateTo ?? "",
      maxTowingWeight: car.maxTowingWeight ?? 0,
      maxTowingWeightUnbraked: car.maxTowingWeightUnbraked ?? 0,
      urbanFuelConsumption: car.urbanFuelConsumption ?? 0,
      combinedFuelConsumption: car.combinedFuelConsumption ?? 0,
      motorwayFuelConsumption: car.motorwayFuelConsumption ?? 0,
      co2Emissions: car.co2Emissions ?? 0,
      taxDeductible: car.taxDeductible ?? false,
      chassisNumber: car.chassisNumber ?? "",
      numberOfKeys: car.numberOfKeys ?? 0,
      licensePlate: car.licensePlate ?? "",
      engineDisplacement: car.engineDisplacement ?? 0,
      colour: car.colour ?? "",
      emptyWeight: car.emptyWeight ?? 0,
      taxAdditionPercentage: car.taxAdditionPercentage ?? 0,
      apkMotDate: car.apkMotDate ?? "",
      serviceDocumentation: car.serviceDocumentation ?? false,
      location: car.location ?? "",
      financialLeasePricePerMonth: car.financialLeasePricePerMonth ?? 0,
      leasePrice60Months: car.leasePrice60Months ?? 0,
      leasePrice48Months: car.leasePrice48Months ?? 0,
      leasePrice36Months: car.leasePrice36Months ?? 0,
      bodyType: car.bodyType ?? null,
      gearbox: car.gearbox ?? null,
      fuel: car.fuel ?? null,
      emissionClass: car.emissionClass ?? null,
      energyLabel: car.energyLabel ?? null,
      paintType: car.paintType ?? null,
      upholstery: car.upholstery ?? null,
      status: car.status ?? null,
    };
  }

  private toCarRequest(values: CarEditValues): CarRequest {
    return {
      brand: values.brand,
      model: values.model,
      title: values.title,
      subtitle: values.subtitle,
      yearOfManufacture: this.toNumber(values.yearOfManufacture),
      mileage: this.toNumber(values.mileage),
      power: values.power,
      referenceNumber: values.referenceNumber,
      price: this.toNumber(values.price),
      firstRegistrationDate: values.firstRegistrationDate,
      numberOfDoors: this.toNumber(values.numberOfDoors),
      wheelbase: this.toNumber(values.wheelbase),
      numberOfCylinders: this.toNumber(values.numberOfCylinders),
      motorVehicleTax: values.motorVehicleTax,
      modelDateFrom: values.modelDateFrom,
      modelDateTo: values.modelDateTo,
      maxTowingWeight: this.toNumber(values.maxTowingWeight),
      maxTowingWeightUnbraked: this.toNumber(values.maxTowingWeightUnbraked),
      urbanFuelConsumption: this.toNumber(values.urbanFuelConsumption),
      combinedFuelConsumption: this.toNumber(values.combinedFuelConsumption),
      motorwayFuelConsumption: this.toNumber(values.motorwayFuelConsumption),
      co2Emissions: this.toNumber(values.co2Emissions),
      taxDeductible: Boolean(values.taxDeductible),
      chassisNumber: values.chassisNumber,
      numberOfKeys: this.toNumber(values.numberOfKeys),
      licensePlate: values.licensePlate,
      engineDisplacement: this.toNumber(values.engineDisplacement),
      colour: values.colour,
      emptyWeight: this.toNumber(values.emptyWeight),
      taxAdditionPercentage: this.toNumber(values.taxAdditionPercentage),
      apkMotDate: values.apkMotDate,
      serviceDocumentation: Boolean(values.serviceDocumentation),
      location: values.location,
      financialLeasePricePerMonth: this.toNumber(values.financialLeasePricePerMonth),
      leasePrice60Months: this.toNumber(values.leasePrice60Months),
      leasePrice48Months: this.toNumber(values.leasePrice48Months),
      leasePrice36Months: this.toNumber(values.leasePrice36Months),
      bodyType: values.bodyType,
      gearbox: values.gearbox,
      fuel: values.fuel,
      emissionClass: values.emissionClass,
      energyLabel: values.energyLabel,
      paintType: values.paintType,
      upholstery: values.upholstery,
      status: values.status,
    };
  }

  private toNumber(value: unknown): number {
    if (value === null || value === undefined || value === "") {
      return 0;
    }
    return Number(value);
  }

  private toPictureRequests(files: File[]): Promise<CarPictureRequest[]> {
    return Promise.all(
      files.map(async (file) => {
        const dimensions = await this.readImageDimensions(file);

        return {
          file,
          title: file.name,
          description: file.name,
          width: dimensions.width,
          height: dimensions.height,
        };
      }),
    );
  }

  private readImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const previewUrl = URL.createObjectURL(file);
      const image = new Image();

      const finish = (width = 0, height = 0) => {
        URL.revokeObjectURL(previewUrl);
        resolve({ width, height });
      };

      image.onload = () => finish(image.naturalWidth, image.naturalHeight);
      image.onerror = () => finish();
      image.src = previewUrl;
    });
  }
}
