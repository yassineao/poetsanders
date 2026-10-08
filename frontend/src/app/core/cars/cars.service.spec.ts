import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CarsService } from './cars.service';

describe('admin car features API', () => {
  it('adds features with credentials and returns the complete feature list', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const http = TestBed.inject(HttpTestingController);
    let features: string[] = [];
    TestBed.inject(CarsService).addCarFeatures('car-1', ['Navigation']).subscribe(value => features = value);
    const request = http.expectOne(req => req.url.endsWith('/cars/car-1/features'));
    expect(request.request.method).toBe('POST');
    expect(request.request.withCredentials).toBe(true);
    expect(request.request.body).toEqual({ features: ['Navigation'] });
    request.flush(['Heated seats', 'Navigation']);
    expect(features).toEqual(['Heated seats', 'Navigation']);
    http.verify();
  });
});
