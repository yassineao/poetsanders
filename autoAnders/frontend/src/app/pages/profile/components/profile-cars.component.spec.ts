import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CarsService } from '../../../core/cars/cars.service';
import type { Car } from '../../../core/interfaces/Car';
import { ProfileCarsComponent } from './profile-cars.component';

describe('ProfileCarsComponent', () => {
  const car = {
    id: 'car-1',
    brand: 'BMW',
    model: '320i',
    yearOfManufacture: 2020,
    mileage: 42000,
    price: 24950,
    fuel: 'PETROL',
    status: 'Pending_Confirmation',
    licensePlate: 'AA-12-BB',
    colour: '#111827',
    pictures: [],
  } as unknown as Car;

  it('shows account cars with useful information and management controls', () => {
    TestBed.configureTestingModule({
      imports: [ProfileCarsComponent],
      providers: [{
        provide: CarsService,
        useValue: { getCarsByCurrentUser: () => of([car]) },
      }],
    });

    const fixture = TestBed.createComponent(ProfileCarsComponent);
    fixture.componentRef.setInput('locale', 'nl');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent.replace(/\s+/g, ' ');
    expect(text).toContain('Mijn auto’s');
    expect(text).toContain('BMW 320i');
    expect(text).toContain('42.000 km');
    expect(text).toContain('€ 24.950');
    expect(text).toContain('In afwachting van bevestiging');
    expect(text).toContain('Bewerken');
    expect(text).toContain('Verwijderen');
  });
});
