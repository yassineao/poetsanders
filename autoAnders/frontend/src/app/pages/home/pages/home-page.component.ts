import { isPlatformBrowser } from "@angular/common";
import { Component, PLATFORM_ID, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { catchError, map, of, startWith, type Observable } from "rxjs";
import { CarsService } from "../../../core/cars/cars.service";
import type { Car } from "../../../core/interfaces/Car";
import type { CatalogueCar } from "../../../core/interfaces/LocaleDictionary";
import { getDictionary, isValidLocale } from "../../../core/lib/i18n";
import type { Locale } from "../../../core/interfaces/locale";
import { CatalogueComponent } from "../../catalogue/components/catalogue.component";
import { FaqComponent } from "../../faq/components/faq.component";

@Component({
  selector: "app-home",
  imports: [RouterLink, CatalogueComponent, FaqComponent],
  templateUrl: "./home-page.component.html",
})
export class HomeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly carsService = inject(CarsService);
  private readonly carsSource$: Observable<Car[] | null> = this.isBrowser
    ? this.carsService.getCars()
    : of(null);
  private readonly apiCars = toSignal(
    this.carsSource$.pipe(
      map((cars) => (cars ?? []).slice(0, 3)),
      startWith(null),
      catchError((error) => {
        console.error("Loading cars failed:", error);
        return of([] as Car[]);
      }),
    ),
    { initialValue: null },
  );

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
   
  protected readonly dictionary = computed(() => getDictionary(this.locale()));
  protected readonly home = computed(() => this.dictionary().home);
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
