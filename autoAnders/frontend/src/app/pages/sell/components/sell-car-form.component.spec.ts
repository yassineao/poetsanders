import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { NgForm } from '@angular/forms';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthUser } from '../../../core/interfaces/AuthUser';
import { getDictionary } from '../../../core/lib/i18n';
import { SellCarFormComponent } from './sell-car-form.component';

describe('car submission API integration', () => {
  const currentUser = signal<AuthUser | null>(null);
  beforeEach(() => {
    currentUser.set(null);
    TestBed.configureTestingModule({
      imports: [SellCarFormComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), {
        provide: AuthService, useValue: { currentUser, me: () => of(null) },
      }],
    });
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  function create() {
    const fixture = TestBed.createComponent(SellCarFormComponent);
    fixture.componentRef.setInput('locale', 'en');
    fixture.componentRef.setInput('content', getDictionary('en').sell);
    return fixture.componentInstance;
  }

  it('submits guest contact details and specifications without protected picture requests', () => {
    const component = create();
    const fields = component['formContent']().fields;
    expect(fields.find(field => field.name === 'email')?.required).toBe(true);
    expect(fields.some(field => field.type === 'file')).toBe(false);
    let reset = false;
    component['submit']({
      values: { name: ' Guest ', email: 'guest@example.com', phoneNumber: '0612345678',
        brand: 'BMW', model: '320i', horsepower: '184', accidentFree: 'false',
        features: ' Heated seats \nNavigation\nHeated seats',
        pictures: [new File(['image'], 'car.jpg')] },
      form: { resetForm: () => { reset = true; } } as unknown as NgForm,
    });
    const request = TestBed.inject(HttpTestingController).expectOne(req => req.url.endsWith('/cars/guest'));
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toMatchObject({ name: 'Guest', email: 'guest@example.com',
      car: { brand: 'BMW', horsepower: 184, accidentFree: false, batteryCapacityKwh: null,
        features: ['Heated seats', 'Navigation'] } });
    request.flush({ id: 'guest-car', status: 'Pending_Confirmation' });
    expect(reset).toBe(true);
    expect(component['sent']()).toBe(true);
  });

  it('uses the authenticated endpoint for signed-in users and shows backend failures', () => {
    currentUser.set({ uid: 'user-1', role: 'USER' } as AuthUser);
    const component = create();
    expect(component['formContent']().fields.some(field => field.name === 'email')).toBe(false);
    component['submit']({ values: { brand: 'BMW', model: '320i' }, form: {} as NgForm });
    const request = TestBed.inject(HttpTestingController).expectOne(req => req.url.endsWith('/cars'));
    request.flush({ detail: 'Car already exists' }, { status: 409, statusText: 'Conflict' });
    expect(component['failureMessage']()).toBe('Car already exists');
    expect(component['sending']()).toBe(false);
    expect(component['sent']()).toBe(false);
  });
});
