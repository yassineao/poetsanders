import { translateUi } from '../../../core/lib/i18n/ui-translations';
import { CommonModule } from "@angular/common";
import { Component, computed, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import type { CatalogueCar, CatalogueLabels } from "../../../core/interfaces/LocaleDictionary";
import type { Locale } from "../../../core/interfaces/locale";

@Component({
  selector: "app-catalogue",
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./catalogue.component.html",
})
export class CatalogueComponent {
  protected t(value: string): string {
    return translateUi(value, this.locale());
  }

  readonly cars = input.required<CatalogueCar[]>();
  readonly locale = input.required<Locale>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly labels = input.required<CatalogueLabels>();
  readonly showMoreButton = input(false);
  readonly loaded = input(true);

  protected readonly search = signal("");
  protected readonly filtersOpen = signal(false);
  protected readonly selectedImage = signal<string | null>(null);
  protected readonly selectedImages = signal<string[]>([]);
  protected readonly brand = signal("All");
  protected readonly transmission = signal("All");
  protected readonly fuel = signal("All");
  protected readonly vehicle = signal("All");
  protected readonly doorCount = signal("All");
  protected readonly maxMileage = signal<number | null>(null);
  protected readonly maxPrice = signal<number | null>(null);
  protected readonly selectedCar = signal<CatalogueCar | null>(null);
  protected readonly colorOptions = [
    { label: "Black", hex: "#111827" },
    { label: "White", hex: "#f8fafc" },
    { label: "Gray", hex: "#6b7280" },
    { label: "Silver", hex: "#cbd5e1" },
    { label: "Red", hex: "#dc2626" },
    { label: "Blue", hex: "#2563eb" },
    { label: "Green", hex: "#16a34a" },
    { label: "Yellow", hex: "#facc15" },
    { label: "Orange", hex: "#f97316" },
    { label: "Brown", hex: "#92400e" },
    { label: "Beige", hex: "#d6c7a1" },
  ];
  protected readonly brands = computed(() => ["All", ...new Set(this.cars().map((car) => car.brand))]);
  protected readonly transmissions = computed(() => this.uniqueValues(car => car.transmission));
  protected readonly fuels = computed(() => this.uniqueValues(car => car.fuel));
  protected readonly vehicles = computed(() => this.uniqueValues(car => car.vehicle));
  protected readonly doorCounts = computed(() => [
    "All",
    ...new Set(this.cars().map(car => car.numberOfDoors).filter(value => value > 0).map(String)),
  ]);
  protected readonly activeFilterCount = computed(() => [
    this.brand(),
    this.transmission(),
    this.fuel(),
    this.vehicle(),
    this.doorCount(),
  ].filter(value => value !== "All").length + Number(this.maxMileage() !== null) + Number(this.maxPrice() !== null));
  protected readonly filteredCars = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.cars().filter((car) => {
      const tags = car.tags[this.locale()] ?? [];
      const text = [
        car.brand,
        car.model,
        car.fuel,
        car.transmission,
        car.colour,
        car.year,
        car.vehicle,
        car.condition,
        ...tags,
      ]
        .filter(value => value !== null && value !== undefined)
        .map(value => this.t(String(value)))
        .join(' ')
        .toLowerCase();
      return (!query || text.includes(query))
        && (this.brand() === "All" || car.brand === this.brand())
        && (this.transmission() === "All" || car.transmission === this.transmission())
        && (this.fuel() === "All" || car.fuel === this.fuel())
        && (this.vehicle() === "All" || car.vehicle === this.vehicle())
        && (this.doorCount() === "All" || car.numberOfDoors === Number(this.doorCount()))
        && (this.maxMileage() === null || car.mileage <= this.maxMileage()!)
        && (this.maxPrice() === null || car.price <= this.maxPrice()!);
    });
  });

  protected resetFilters(): void {
    this.search.set("");
    this.brand.set("All");
    this.transmission.set("All");
    this.fuel.set("All");
    this.vehicle.set("All");
    this.doorCount.set("All");
    this.maxMileage.set(null);
    this.maxPrice.set(null);
  }

  private uniqueValues(selector: (car: CatalogueCar) => string): string[] {
    return ["All", ...new Set(this.cars().map(selector).filter(Boolean))];
  }

  protected formatNumber(value: number): string {
    return new Intl.NumberFormat(this.locale()).format(value);
  }

  protected formatPrice(value: number): string {
    return new Intl.NumberFormat(this.locale(), { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  }

  protected formatOptionalPrice(value: number | null | undefined): string {
    return value && value > 0 ? this.formatPrice(value) : "-";
  }

  protected detailValue(value: boolean | number | string | null | undefined, suffix = ""): string {
    if (typeof value === "boolean") {
      return this.t(value ? "Yes" : "No");
    }

    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (typeof value === "number") {
      return value > 0 ? `${new Intl.NumberFormat(this.locale()).format(value)}${suffix}` : "-";
    }

    return `${this.t(value)}${suffix}`;
  }

  protected imagesFor(car: CatalogueCar): string[] {
    const images = car.images?.length ? car.images : [car.image];
    return images.filter(Boolean);
  }

  protected isColorHex(value: string | null | undefined): boolean {
    return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
  }

  protected colorLabel(value: string | null | undefined): string {
    if (!value) {
      return "-";
    }

    return this.colorOptions.find((option) => option.hex === value)?.label ?? value;
  }
}
