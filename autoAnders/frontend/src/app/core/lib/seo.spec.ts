import { DOCUMENT } from '@angular/common';
import { Component, RESPONSE_INIT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SeoService, siteUrl } from './seo';

@Component({ template: '' })
class Page {}

describe('search metadata across navigation', () => {
  let document: Document;
  let response: ResponseInit;
  beforeEach(() => {
    response = {};
    TestBed.configureTestingModule({ providers: [
      provideRouter([{ path: ':locale', children: [
        { path: '', component: Page }, { path: 'Catalogue', component: Page },
        { path: 'Sell', component: Page }, { path: 'auth', component: Page },
        { path: 'Catalogue/example', component: Page, data: { vehicle: { car: { brand: '</script><img src=x>', model: 'Test', mileage: 0, price: 12000, yearOfManufacture: 2020, status: 'Available' }, images: ['/cars/BMW.jpg'] } } },
        { path: 'Catalogue/offline', component: Page, data: { vehicle: { car: null, images: [], unavailable: true } } },
        { path: '**', component: Page, data: { notFound: true } },
      ] }]),
      { provide: RESPONSE_INIT, useValue: response },
    ] });
    document = TestBed.inject(DOCUMENT);
    TestBed.inject(SeoService).start();
  });

  it('keeps one canonical and reciprocal language links without query or fragment variants', async () => {
    const harness = await RouterTestingHarness.create('/de/Catalogue?sort=price#cars');
    expect(document.title).toContain('Gebrauchtwagen kaufen');
    expect(document.documentElement.lang).toBe('de');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${siteUrl}/de/Catalogue`);
    expect(document.querySelectorAll('link[hreflang]')).toHaveLength(4);
    await harness.navigateByUrl('/nl/Sell');
    expect(document.title).toContain('Auto verkopen');
    expect(document.documentElement.lang).toBe('nl');
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelector('link[hreflang="de"]')?.getAttribute('href')).toBe(`${siteUrl}/de/Sell`);
    expect(document.querySelectorAll('#seo-structured-data')).toHaveLength(1);
  });

  it('removes indexable markup from account pages and restores it on public pages', async () => {
    const harness = await RouterTestingHarness.create('/en/Catalogue');
    await harness.navigateByUrl('/en/auth?returnUrl=/en/profile');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, follow');
    expect(document.querySelectorAll('link[hreflang]')).toHaveLength(0);
    expect(document.getElementById('seo-structured-data')).toBeNull();
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(`${siteUrl}/en/auth`);
    await harness.navigateByUrl('/de');
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('index, follow');
    expect(document.querySelectorAll('link[hreflang]')).toHaveLength(4);
  });

  it('returns a real 404 without a canonical for unknown pages', async () => {
    await RouterTestingHarness.create('/en/missing');
    expect(response.status).toBe(404);
    expect(document.title).toBe('Page not found | AutoAnders');
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('distinguishes backend failure from a missing vehicle', async () => {
    await RouterTestingHarness.create('/de/Catalogue/offline');
    expect(response.status).toBe(503);
    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, follow');
  });

  it('safely serializes real vehicle facts, including zero mileage', async () => {
    await RouterTestingHarness.create('/en/Catalogue/example');
    const json = document.getElementById('seo-structured-data')!.textContent!;
    expect(json).not.toContain('</script>');
    const car = JSON.parse(json)['@graph'].find((item: { '@type': string }) => item['@type'] === 'Car');
    expect(car.name).toContain('</script>');
    expect(car.mileageFromOdometer.value).toBe(0);
    expect(car.offers.price).toBe(12000);
    expect(car.offers.availability).toBe('https://schema.org/InStock');
    expect(document.querySelectorAll('script#seo-structured-data')).toHaveLength(1);
  });
});
