import { isPlatformBrowser } from "@angular/common";
import { Component, PLATFORM_ID, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { catchError, forkJoin, map, of, startWith, switchMap, type Observable } from "rxjs";
import { getDictionary, isValidLocale } from "../../../core/lib/i18n";
import type { Locale } from "../../../core/interfaces/locale";
import { CatalogueComponent } from "../components/catalogue.component";
import { CarsService } from "../../../core/cars/cars.service";
import type { Car } from "../../../core/interfaces/Car";
import type { CatalogueCar } from "../../../core/interfaces/LocaleDictionary";

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
  private readonly carsSource$: Observable<Car[] | null> = this.isBrowser
    ? this.carsService.GetCars()
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
                map((pictures) => ({ ...car, pictures })),
                catchError((error) => {
                  console.error(`Loading pictures for car ${car.id} failed:`, error);
                  return of({ ...car, pictures: [] });
                }),
              ),
            ),
          );
        }),
        catchError((error) => {
          console.error("Loading cars failed:", error);
          return of([] as Car[]);
        }),

      ));

  protected readonly locale = computed<Locale>(() => {
    const value = this.localeParam();
    return isValidLocale(value) ? value : "de";
  });
  protected readonly catalogue = computed(() => getDictionary(this.locale()).home.catalogue);
  protected readonly carsLoaded = computed(() => this.apiCars() !== null);
  protected readonly cars = computed<CatalogueCar[]>(() =>
    (this.apiCars() ?? []).map((car) => this.toCatalogueCar(car)),
  );

  private toCatalogueCar(car: Car): CatalogueCar {
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
      image: car.pictures?.[0]?.storage_path ?? "/cars/audi.jpg",
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
}
