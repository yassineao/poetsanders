import { isPlatformBrowser } from "@angular/common";
import { Component, PLATFORM_ID, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { catchError, forkJoin, from, map, of, startWith, switchMap, type Observable } from "rxjs";
import { getDictionary, isValidLocale } from "../../../core/lib/i18n";
import type { Locale } from "../../../core/interfaces/locale";
import { CatalogueComponent } from "../components/catalogue.component";
import { CarsService } from "../../../core/cars/cars.service";
import type { Car, CarPicture } from "../../../core/interfaces/Car";
import type { CatalogueCar } from "../../../core/interfaces/LocaleDictionary";
import { SupabaseService } from "../../../core/supabase/supabase.service";

type CatalogueApiCar = Car & {
  catalogueImage: string;
  catalogueImages: string[];
};

@Component({
  imports: [CatalogueComponent],
  templateUrl: "./catalogue-page.component.html",
})
export class CataloguePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly localeParam = toSignal(
    (this.route.parent?.paramMap ?? this.route.paramMap).pipe(
      map((params) => params.get("locale") ?? "de"),
    ),
    { initialValue: "de" },
  );
  private readonly carsService = inject(CarsService);
  private readonly supabase = inject(SupabaseService);
  private readonly carsSource$: Observable<Car[] | null> = this.isBrowser
    ? this.carsService.GetAvailableCars()
    : of(null);

  private readonly apiCars = toSignal(
    this.carsSource$
      .pipe(
        startWith(null),
        switchMap((cars) => {
          if (cars === null) {
            return of(null);
          }

          if (cars.length === 0) {
            return of([] as Car[]);
          }

          return forkJoin(
            cars.map((car) =>
              this.carsService.getCarPictures(car.id).pipe(
                switchMap((pictures) =>
                  from(this.resolveCatalogueImages(pictures)).pipe(
                    map((catalogueImages) => ({
                      ...car,
                      pictures,
                      catalogueImage: catalogueImages[0] ?? this.fallbackImage(),
                      catalogueImages,
                    })),
                  ),
                ),
                catchError((error) => {
                  console.error(`Loading pictures for car ${car.id} failed:`, error);
                  return of({
                    ...car,
                    pictures: [],
                    catalogueImage: this.fallbackImage(),
                    catalogueImages: [this.fallbackImage()],
                  });
                }),
              ),
            ),
          );
        }),
        catchError((error) => {
          console.error("Loading cars failed:", error);
          return of([] as CatalogueApiCar[]);
        }),

      ));

  protected readonly locale = computed<Locale>(() => {
    const value = this.localeParam();
    return isValidLocale(value) ? value : "de";
  });
  protected readonly catalogue = computed(() => getDictionary(this.locale()).home.catalogue);
  protected readonly carsLoaded = computed(() => this.apiCars() !== null);
  protected readonly cars = computed<CatalogueCar[]>(() =>
    ((this.apiCars() as CatalogueApiCar[] | null) ?? []).map((car) => this.toCatalogueCar(car)),
  );

  private toCatalogueCar(car: CatalogueApiCar): CatalogueCar {
    const fallbackTags = [
      car.bodyType,
      car.fuel,
      car.gearbox,
      car.status,
    ].filter(Boolean).map(String);

    return {
      id: car.id,
      brand: car.brand,
      model: car.model,
      price: car.price ?? 0,
      year: car.yearOfManufacture ?? this.yearFromDate(car.firstRegistrationDate),
      firstRegistrationDate: car.firstRegistrationDate,
      mileage: car.mileage ?? 0,
      transmission: String(car.gearbox ?? ""),
      fuel: String(car.fuel ?? ""),
      engineCapacity: car.engineDisplacement ?? 0,
      numberOfDoors: car.numberOfDoors ?? 0,
      numberOfSeats: 0,
      condition: String(car.status ?? ""),
      numberOfGears: 0,
      vat: car.taxDeductible ? "VAT deductible" : "",
      vehicle: String(car.bodyType ?? ""),
      colour: car.colour ?? "",
      title: car.title ?? "",
      subtitle: car.subtitle ?? "",
      power: car.power ?? "",
      referenceNumber: car.referenceNumber ?? "",
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
      emptyWeight: car.emptyWeight ?? 0,
      taxAdditionPercentage: car.taxAdditionPercentage ?? 0,
      apkMotDate: car.apkMotDate ?? "",
      serviceDocumentation: car.serviceDocumentation ?? false,
      location: car.location ?? "",
      financialLeasePricePerMonth: car.financialLeasePricePerMonth ?? 0,
      leasePrice60Months: car.leasePrice60Months ?? 0,
      leasePrice48Months: car.leasePrice48Months ?? 0,
      leasePrice36Months: car.leasePrice36Months ?? 0,
      emissionClass: String(car.emissionClass ?? ""),
      energyLabel: String(car.energyLabel ?? ""),
      paintType: String(car.paintType ?? ""),
      upholstery: String(car.upholstery ?? ""),
      image: car.catalogueImage,
      images: car.catalogueImages?.length ? car.catalogueImages : [car.catalogueImage],
      tags: {
        de: fallbackTags,
        en: fallbackTags,
        nl: fallbackTags,
      },
    };
  }

  private yearFromDate(value: string): number {
    const year = new Date(value).getFullYear();
    return Number.isNaN(year) ? new Date().getFullYear() : year;
  }

  private async resolveCatalogueImages(pictures: CarPicture[]): Promise<string[]> {
    const storagePaths = pictures
      .map((picture) => picture.storage_path)
      .filter((storagePath): storagePath is string => Boolean(storagePath));

    if (!storagePaths.length) {
      return [this.fallbackImage()];
    }

    const images = await Promise.all(
      storagePaths.map(async (storagePath) => {
        if (this.isRenderableUrl(storagePath)) {
          return storagePath;
        }

        return await this.supabase.getPrivateImageUrl("car-pictures", storagePath);
      }),
    );

    const renderableImages = images.filter((image): image is string => Boolean(image));
    return renderableImages.length ? renderableImages : [this.fallbackImage()];
  }

  private isRenderableUrl(value: string): boolean {
    return /^https?:\/\//i.test(value) || value.startsWith("/");
  }

  private fallbackImage(): string {
    return "/no-image-icon.png";
  }
}
