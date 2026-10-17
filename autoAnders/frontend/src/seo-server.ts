import type { Express } from 'express';
import { environment } from './environments/environment';

export const sitemapLocales = ['de', 'en', 'nl'] as const;
export const sitemapPages = ['', 'Catalogue', 'Sell', 'faq', 'advantages', 'about', 'privacy', 'impressum', 'terms', 'cookie'];
const origin = environment.dealershipUrl.replace(/\/+$/, '');
const xml = (value: string): string => value.replace(/[<>&"']/g, character => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]!);

export function buildSitemap(vehicleIds: string[]): string {
  const pages = [...sitemapPages, ...Array.from(new Set(vehicleIds)).map(id => `Catalogue/${encodeURIComponent(id)}`)];
  const entries = pages.flatMap(page => {
    const url = (locale: string) => `${origin}/${locale}${page ? '/' + page : ''}`;
    const alternates = [...sitemapLocales.map(locale => `<xhtml:link rel="alternate" hreflang="${locale}" href="${xml(url(locale))}"/>`), `<xhtml:link rel="alternate" hreflang="x-default" href="${xml(url('de'))}"/>`].join('');
    return sitemapLocales.map(locale => `<url><loc>${xml(url(locale))}</loc>${alternates}</url>`);
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`;
}

export function installSeoRoutes(app: Express): void {
  app.get('/robots.txt', (_req, res) => {
    // Account URLs remain crawlable so their noindex directive can be read.
    res.type('text/plain').set('Cache-Control', 'public, max-age=300').send(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
  });
  app.get('/sitemap.xml', async (_req, res) => {
    try {
      const response = await fetch(`${environment.apiBaseUrl}/cars/accepted`, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error(`Inventory returned ${response.status}`);
      const cars: unknown = await response.json();
      if (!Array.isArray(cars)) throw new Error('Invalid inventory response');
      const ids = cars.map(car => car?.id).filter((id): id is string => typeof id === 'string' && id.length > 0);
      res.type('application/xml').set('Cache-Control', 'public, max-age=300').send(buildSitemap(ids));
    } catch {
      res.status(503).set('Retry-After', '300').type('text/plain').send('Sitemap temporarily unavailable.');
    }
  });
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    const path = req.path.replace(/\/+$/, '') || '/';
    const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    if (path === '/') return res.redirect(301, `/de${query}`);
    const match = path.match(/^\/(de|en|nl)(?:\/([^/]+))?(\/.*)?$/);
    if (!match) return next();
    const aliases: Record<string, string> = { catalogue: 'Catalogue', sell: 'Sell', login: 'auth', contact: 'form', datenschutz: 'privacy' };
    const section = match[2];
    const canonical = `/${match[1]}${section ? '/' + (aliases[section] ?? section) : ''}${match[3] ?? ''}`;
    if (canonical !== req.path) return res.redirect(301, canonical + query);
    return next();
  });
}
