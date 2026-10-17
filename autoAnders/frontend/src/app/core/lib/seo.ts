import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, RESPONSE_INIT, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import { getDictionary, isValidLocale, locales } from './i18n';
import { seoContent } from './seo-content';
import type { Locale } from '../interfaces/locale';
import type { VehicleResult } from '../cars/vehicle.resolver';

export const siteUrl = environment.dealershipUrl.replace(/\/+$/, '');

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly response = inject(RESPONSE_INIT, { optional: true });

  start(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => this.update());
  }

  private update(): void {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    const segments = this.router.parseUrl(this.router.url).root.children['primary']?.segments ?? [];
    const locale: Locale = isValidLocale(segments[0]?.path ?? '') ? segments[0].path as Locale : 'de';
    const suffix = segments.slice(1).map(segment => encodeURIComponent(segment.path)).join('/');
    const dictionary = getDictionary(locale);
    const copy = seoContent[locale];
    const path = `/${locale}${suffix ? '/' + suffix : ''}`;
    const canonical = siteUrl + path;
    let metadata = dictionary.home.metadata;
    let indexable = !['auth', 'profile', 'form'].includes(suffix);
    let status = 200;
    let pageType = suffix === 'Catalogue' ? 'CollectionPage' : suffix === 'about' ? 'AboutPage' : 'WebPage';
    let image = `${siteUrl}/LogoBG-noBG.png`;
    const vehicle = route.data['vehicle'] as VehicleResult | undefined;
    if (suffix === 'Catalogue') metadata = { ...metadata, title: copy.catalogueTitle, description: copy.catalogueDescription };
    else if (suffix === 'Sell') metadata = { ...metadata, title: copy.sellTitle, description: copy.sellDescription };
    else if (suffix === 'faq') metadata = dictionary.faq.metadata;
    else if (suffix === 'advantages') metadata = { ...metadata, title: `${dictionary.home.advantages.eyebrow} | AutoAnders`, description: dictionary.home.advantages.description };
    else if (suffix === 'auth') metadata = dictionary.auth.metadata;
    else if (suffix === 'form') metadata = dictionary.form.metadata;
    else if (suffix === 'profile') metadata = { ...metadata, title: `${dictionary.profile.title} | AutoAnders`, description: dictionary.profile.description };
    else if (Object.hasOwn(dictionary.pages, suffix)) metadata = dictionary.pages[suffix as keyof typeof dictionary.pages].metadata;

    if (vehicle?.car) {
      const car = vehicle.car;
      const name = [car.brand, car.model, car.variant, car.yearOfManufacture].filter(Boolean).join(' ');
      const mileage = Number.isFinite(car.mileage) && car.mileage >= 0 ? `${car.mileage.toLocaleString(locale)} km. ` : '';
      metadata = { ...metadata, title: `${name} | AutoAnders`, description: `${name}. ${mileage}${copy.details}: ${car.subtitle || copy.catalogueDescription}`.slice(0, 170) };
      image = vehicle.images[0] && !vehicle.images[0].endsWith('/no-image-icon.png') ? new URL(vehicle.images[0], siteUrl).href : image;
      pageType = 'ItemPage';
    } else if (vehicle || route.data['notFound']) {
      status = vehicle?.unavailable ? 503 : 404;
      indexable = false;
      metadata = { ...metadata, title: `${status === 503 ? copy.unavailable : copy.notFound} | AutoAnders`, description: copy.back };
    }

    this.document.documentElement.lang = locale;
    this.title.setTitle(metadata.title);
    this.meta.updateTag({ name: 'description', content: metadata.description });
    this.meta.updateTag({ name: 'robots', content: indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow' });
    this.meta.removeTag('name="keywords"');
    for (const [property, content] of Object.entries({
      'og:type': 'website', 'og:site_name': 'AutoAnders', 'og:title': metadata.title,
      'og:description': metadata.description, 'og:url': canonical, 'og:image': image,
      'og:image:alt': 'AutoAnders', 'og:locale': dictionary.home.metadata.locale,
    })) this.meta.updateTag({ property, content });
    for (const [name, content] of Object.entries({
      'twitter:card': 'summary_large_image', 'twitter:title': metadata.title,
      'twitter:description': metadata.description, 'twitter:image': image,
    })) this.meta.updateTag({ name, content });

    this.document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach(node => node.remove());
    if (status === 200) this.link('canonical', canonical);
    if (indexable) {
      for (const language of locales) this.link('alternate', `${siteUrl}/${language}${suffix ? '/' + suffix : ''}`, language);
      this.link('alternate', `${siteUrl}/de${suffix ? '/' + suffix : ''}`, 'x-default');
    }
    const graph: Record<string, unknown>[] = indexable ? [
      { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'AutoAnders', url: siteUrl, logo: `${siteUrl}/LogoBG-noBG.png` },
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'AutoAnders', url: siteUrl, inLanguage: [...locales], publisher: { '@id': `${siteUrl}/#organization` } },
      { '@type': pageType, '@id': `${canonical}#webpage`, url: canonical, name: metadata.title, description: metadata.description, inLanguage: locale, isPartOf: { '@id': `${siteUrl}/#website` } },
    ] : [];
    if (indexable && suffix) {
      const crumbs = [{ name: 'AutoAnders', item: `${siteUrl}/${locale}` }];
      if (vehicle?.car) crumbs.push({ name: copy.catalogueHeading, item: `${siteUrl}/${locale}/Catalogue` });
      crumbs.push({ name: metadata.title.replace(' | AutoAnders', ''), item: canonical });
      graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })) });
    }
    if (indexable && vehicle?.car) {
      const car = vehicle.car;
      const vehicleSchema: Record<string, unknown> = {
        '@type': 'Car', '@id': `${canonical}#vehicle`, url: canonical,
        name: [car.brand, car.model, car.variant].filter(Boolean).join(' '),
        brand: { '@type': 'Brand', name: car.brand }, model: car.model,
        description: metadata.description,
      };
      const images = vehicle.images.filter(url => !url.endsWith('/no-image-icon.png'));
      if (images.length) vehicleSchema['image'] = images.map(url => new URL(url, siteUrl).href);
      if (Number.isFinite(car.yearOfManufacture) && car.yearOfManufacture > 0) vehicleSchema['vehicleModelDate'] = String(car.yearOfManufacture);
      if (Number.isFinite(car.mileage) && car.mileage >= 0) vehicleSchema['mileageFromOdometer'] = { '@type': 'QuantitativeValue', value: car.mileage, unitCode: 'KMT' };
      if (Number.isFinite(car.price) && car.price > 0) {
        const offer: Record<string, unknown> = { '@type': 'Offer', url: canonical, price: car.price, priceCurrency: 'EUR', seller: { '@id': `${siteUrl}/#organization` } };
        if (car.sold) offer['availability'] = 'https://schema.org/SoldOut';
        else if (car.reserved || String(car.status) === 'Booked') offer['availability'] = 'https://schema.org/Reserved';
        else if (String(car.status) === 'Available') offer['availability'] = 'https://schema.org/InStock';
        vehicleSchema['offers'] = offer;
      }
      graph.push(vehicleSchema);
    }
    this.document.getElementById('seo-structured-data')?.remove();
    if (graph.length) {
      const script = this.document.createElement('script');
      script.id = 'seo-structured-data';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
      this.document.head.appendChild(script);
    }
    if (this.response && status !== 200) {
      this.response.status = status;
      if (status === 503) {
        const headers = new Headers(this.response.headers);
        headers.set('Retry-After', '300');
        this.response.headers = headers;
      }
    }
  }

  private link(rel: string, href: string, language?: string): void {
    const link = this.document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (language) link.hreflang = language;
    this.document.head.appendChild(link);
  }
}
