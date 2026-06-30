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
  readonly cars = input.required<CatalogueCar[]>();
  readonly locale = input.required<Locale>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly labels = input.required<CatalogueLabels>();
  readonly showMoreButton = input(false);
  readonly loaded = input(true);

  protected readonly search = signal("");
  protected readonly selectedImage = signal<string | null>(null);
  protected readonly selectedImages = signal<string[]>([]);
  protected readonly brand = signal("All");
  protected readonly selectedCar = signal<CatalogueCar | null>(null);
  protected readonly brands = computed(() => ["All", ...new Set(this.cars().map((car) => car.brand))]);
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
        .join(' ')
        .toLowerCase();
      return (!query || text.includes(query)) && (this.brand() === "All" || car.brand === this.brand());
    });
  });

  protected formatPrice(value: number): string {
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  }

  protected imagesFor(car: CatalogueCar): string[] {
    const images = car.images?.length ? car.images : [car.image];
    return images.filter(Boolean);
  }
}
