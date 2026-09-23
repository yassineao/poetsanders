import { Component, Input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ServiceTreatmentCopy, ServicesTreatmentsCopy } from '../../../../core/interfaces/services';

@Component({
  selector: 'app-service-detail-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './Service-detail-hero.component.html',
})
export class ServiceDetailHeroComponent {
  @Input({ required: true }) treatment!: ServiceTreatmentCopy;
  @Input({ required: true }) copy!: ServicesTreatmentsCopy;

  protected readonly comparison = signal(50);
  private readonly comparisonImages: Record<string, string> = {
    'total-treatment': '/treatments/total-treatment-before-after.png',
    'interior-treatment': '/treatments/interior-treatment-before-after.png',
    'exterior-treatment': '/treatments/exterior-treatment-before-after.png',
    'headlight-treatment': '/treatments/headlight-treatment-before-after.png',
  };

  protected hasComparison(): boolean {
    return Boolean(this.comparisonImages[this.treatment.slug]);
  }

  protected comparisonImage(): string {
    return this.comparisonImages[this.treatment.slug] ?? this.treatment.image;
  }

  protected updateComparison(event: Event): void {
    this.comparison.set(Number((event.target as HTMLInputElement).value));
  }
}
