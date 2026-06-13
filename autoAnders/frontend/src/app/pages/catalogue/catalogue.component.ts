import { CommonModule } from "@angular/common";
import { Component, computed, input, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import type { Car, AutoCatalogueLabels } from "../../core/interfaces/Car";
import type { Locale } from "../../core/interfaces/locale";

@Component({
  selector: "app-catalogue",
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./catalogue.component.html",
})
export class CatalogueComponent {
  readonly cars = input.required<Car[]>();
  readonly locale = input.required<Locale>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly labels = input.required<AutoCatalogueLabels>();
  readonly showMoreButton = input(false);

  protected readonly search = signal("");
  protected readonly brand = signal("All");
  protected readonly selectedCar = signal<Car | null>(null);
  protected readonly brands = computed(() => ["All", ...new Set(this.cars().map((car) => car.brand))]);
  protected readonly filteredCars = computed(() => {
    const query = this.search().trim().toLowerCase();
    return this.cars().filter((car) => {
      const text = [car.brand, car.model, car.fuel, car.transmission, ...car.tags[this.locale()]].join(" ").toLowerCase();
      return (!query || text.includes(query)) && (this.brand() === "All" || car.brand === this.brand());
    });
  });

  protected formatPrice(value: number): string {
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
  }
}
