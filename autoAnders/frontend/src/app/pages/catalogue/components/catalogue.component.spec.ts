import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { getDictionary } from '../../../core/lib/i18n';
import { CatalogueComponent } from './catalogue.component';

describe('catalogue translations', () => {
  it('updates labels, vehicle enums and number formatting when the locale changes', () => {
    TestBed.configureTestingModule({
      imports: [CatalogueComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(CatalogueComponent);
    const catalogue = getDictionary('en').home.catalogue;
    fixture.componentRef.setInput('title', catalogue.title);
    fixture.componentRef.setInput('subtitle', catalogue.subtitle);
    fixture.componentRef.setInput('labels', catalogue.labels);
    fixture.componentRef.setInput('cars', [{
      ...catalogue.cars[0],
      mileage: 12345,
      fuel: 'PETROL',
      transmission: 'MANUAL',
    }]);
    fixture.componentRef.setInput('locale', 'nl');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Bouwjaar');
    expect(fixture.nativeElement.textContent).toContain('Benzine');
    expect(fixture.nativeElement.textContent).toContain('Handgeschakeld');
    expect(fixture.nativeElement.textContent).toContain('12.345');

    fixture.componentRef.setInput('locale', 'de');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Baujahr');
    expect(fixture.nativeElement.textContent).toContain('Benzin');
    expect(fixture.nativeElement.textContent).toContain('Schaltgetriebe');
    expect(fixture.componentInstance.cars()[0].transmission).toBe('MANUAL');

    fixture.componentRef.setInput('locale', 'en');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('12,345');
  });

  it('opens detailed filters and combines filter criteria', () => {
    TestBed.configureTestingModule({
      imports: [CatalogueComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(CatalogueComponent);
    const catalogue = getDictionary('en').home.catalogue;
    const cars = [
      { ...catalogue.cars[0], brand: 'BMW', fuel: 'PETROL', transmission: 'AUTOMATIC', mileage: 50000, price: 20000, numberOfDoors: 4 },
      { ...catalogue.cars[1], brand: 'Audi', fuel: 'DIESEL', transmission: 'MANUAL', mileage: 90000, price: 15000, numberOfDoors: 5 },
    ];
    fixture.componentRef.setInput('title', catalogue.title);
    fixture.componentRef.setInput('subtitle', catalogue.subtitle);
    fixture.componentRef.setInput('labels', catalogue.labels);
    fixture.componentRef.setInput('cars', cars);
    fixture.componentRef.setInput('locale', 'en');
    fixture.detectChanges();

    const filterButton = fixture.nativeElement.querySelector('[aria-controls="catalogue-filters"]') as HTMLButtonElement;
    filterButton.click();
    fixture.detectChanges();
    expect(filterButton.getAttribute('aria-expanded')).toBe('true');
    expect(fixture.nativeElement.querySelector('#catalogue-filters')).not.toBeNull();

    const component = fixture.componentInstance as any;
    component.fuel.set('PETROL');
    component.maxMileage.set(60000);
    fixture.detectChanges();
    expect(component.filteredCars().map((car: { brand: string }) => car.brand)).toEqual(['BMW']);
    expect(component.activeFilterCount()).toBe(2);

    component.resetFilters();
    expect(component.filteredCars().length).toBe(2);
    expect(component.activeFilterCount()).toBe(0);
  });
});
