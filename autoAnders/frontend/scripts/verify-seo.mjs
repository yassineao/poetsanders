import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixture = new URL('./seo-fixtures.mjs', import.meta.url).href;
const entry = fileURLToPath(new URL('../dist/frontend/server/server.mjs', import.meta.url));
const locales = ['de', 'en', 'nl'];
const pages = ['', 'Catalogue', 'Sell', 'faq', 'advantages', 'about', 'privacy', 'impressum', 'terms', 'cookie'];
const vehiclePages = ['Catalogue/seo-test-vehicle', 'Catalogue/seo-photo-fallback'];
let checks = 0;

async function startServer(inventory) {
  const socket = createServer();
  await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  const child = spawn(process.execPath, ['--import', fixture, entry], {
    cwd: root, windowsHide: true,
    env: { ...process.env, PORT: String(port), SEO_TEST_INVENTORY: inventory },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stderr.on('data', chunk => { output = (output + chunk.toString()).slice(-6000); });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { child.kill(); reject(new Error(`SSR startup timed out: ${output}`)); }, 20000);
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`SSR exited (${code}): ${output}`)); });
    child.stdout.on('data', chunk => {
      if (chunk.toString().includes('Node Express server listening')) { clearTimeout(timer); resolve(); }
    });
  });
  return {
    origin: `http://127.0.0.1:${port}`,
    stop: async () => {
      if (child.exitCode !== null) return;
      const exit = new Promise(resolve => child.once('exit', resolve));
      child.kill();
      await exit;
    },
  };
}

async function get(server, path) {
  const response = await fetch(server.origin + path, { redirect: 'manual', signal: AbortSignal.timeout(20000) });
  const body = await response.text();
  return { response, body };
}

const server = await startServer('available');
try {
  const robots = await get(server, '/robots.txt');
  assert.equal(robots.response.status, 200);
  assert.match(robots.response.headers.get('content-type'), /text\/plain/);
  const sitemapUrl = robots.body.match(/Sitemap: (\S+)/)?.[1];
  assert.ok(sitemapUrl, 'robots.txt must advertise the sitemap');
  const canonicalOrigin = new URL(sitemapUrl).origin;
  const sitemap = await get(server, '/sitemap.xml');
  assert.equal(sitemap.response.status, 200);
  const xml = new JSDOM(sitemap.body, { contentType: 'text/xml' }).window.document;
  const locations = [...xml.querySelectorAll('loc')].map(node => node.textContent);
  assert.equal(locations.length, 36);
  assert.equal(new Set(locations).size, locations.length);
  assert.ok(locations.every(url => !/\/(auth|form|profile)(?:\/|$)/.test(url)));
  assert.equal(xml.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'link').length, locations.length * 4);
  checks += 2;
  const linkedPaths = new Set();

  for (const locale of locales) {
    const titles = new Set();
    for (const page of [...pages, ...vehiclePages]) {
      const path = `/${locale}${page ? '/' + page : ''}`;
      const { response, body } = await get(server, path);
      assert.equal(response.status, 200, path);
      const document = new JSDOM(body).window.document;
      assert.equal(document.documentElement.lang, locale, path);
      assert.equal(document.querySelectorAll('h1').length, 1, `${path}: one visible page heading`);
      assert.ok(document.querySelector('h1').textContent.trim(), path);
      assert.ok(!titles.has(document.title), `${path}: unique title`);
      titles.add(document.title);
      assert.ok(document.querySelector('meta[name="description"]')?.content.length > 20, path);
      assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1, path);
      assert.equal(document.querySelector('link[rel="canonical"]').href, canonicalOrigin + path, path);
      assert.equal(document.querySelectorAll('link[hreflang]').length, 4, path);
      assert.match(document.querySelector('meta[name="robots"]').content, /^index, follow/, path);
      const graph = JSON.parse(document.querySelector('#seo-structured-data').textContent)['@graph'];
      for (const anchor of document.querySelectorAll('a[href]')) {
        const href = anchor.getAttribute('href');
        if (href.startsWith('/')) linkedPaths.add(new URL(href, server.origin).pathname);
      }
      assert.ok(graph.some(item => item['@type'] === 'WebSite'), path);
      if (page === 'Catalogue' || page === '') {
        assert.ok(document.querySelector(`a[href="/${locale}/Catalogue/seo-test-vehicle"]`), `${path}: vehicles present without JavaScript`);
      }
      if (vehiclePages.includes(page)) {
        const car = graph.find(item => item['@type'] === 'Car');
        assert.equal(car.offers.price, 24950);
        assert.equal(car.mileageFromOdometer.value, 42000);
        assert.ok(document.querySelector('main').textContent.includes('Navigation'));
        if (page === 'Catalogue/seo-photo-fallback') assert.ok(document.querySelector('main img[src="/cars/audi.jpg"]'), 'SSR must await separate photograph requests');
      }
      checks++;
    }
    const account = await get(server, `/${locale}/auth`);
    assert.equal(account.response.status, 200);
    const document = new JSDOM(account.body).window.document;
    assert.equal(document.querySelector('meta[name="robots"]').content, 'noindex, follow');
    assert.equal(document.querySelectorAll('link[hreflang]').length, 0);
    checks++;
  }
  const allowedPaths = new Set(locales.flatMap(locale => [...pages, ...vehiclePages, 'auth', 'profile', 'form'].map(page => `/${locale}${page ? '/' + page : ''}`)));
  for (const path of linkedPaths) assert.ok(allowedPaths.has(path), `Internal link must target a canonical route: ${path}`);
  for (const path of ['/de/profile', '/de/form']) {
    const { response } = await get(server, path);
    assert.ok([301, 302].includes(response.status), path);
    assert.ok(response.headers.get('location')?.includes('/de/auth'), path);
    checks++;
  }
  for (const path of ['/de/missing', '/fr', '/de/Catalogue/unknown-vehicle']) {
    const { response, body } = await get(server, path);
    assert.equal(response.status, 404, path);
    const document = new JSDOM(body).window.document;
    assert.equal(document.querySelector('meta[name="robots"]').content, 'noindex, follow');
    assert.equal(document.querySelector('link[rel="canonical"]'), null);
    checks++;
  }
  for (const [from, to] of [['/', '/de'], ['/de/catalogue?sort=price', '/de/Catalogue?sort=price'], ['/nl/Sell/', '/nl/Sell'], ['/en/login', '/en/auth']]) {
    const { response } = await get(server, from);
    assert.equal(response.status, 301, from);
    assert.equal(response.headers.get('location'), to, from);
    checks++;
  }
} finally { await server.stop(); }

const offline = await startServer('offline');
try {
  for (const path of ['/sitemap.xml', '/de/Catalogue', '/de/Catalogue/seo-test-vehicle']) {
    const { response, body } = await get(offline, path);
    assert.equal(response.status, 503, `${path}: an API outage must not become an empty 200 or a 404`);
    assert.equal(response.headers.get('retry-after'), '300');
    if (path !== '/sitemap.xml') assert.ok(new JSDOM(body).window.document.querySelector('main').textContent.includes('vorübergehend nicht verfügbar'));
    checks++;
  }
} finally { await offline.stop(); }
console.log(`SEO smoke checks passed: ${checks} HTTP responses, all three languages, server-rendered inventory, metadata, sitemap, redirects, 404s and upstream failures. Uses controlled inventory fixtures, not live availability.`);
