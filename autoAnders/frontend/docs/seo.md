# AutoAnders SEO: implementation and launch notes

Research performed 15 October 2026. Implementation verified locally; these changes have not been deployed or submitted to Google. Germany/German is the provisional research market because the application defaults to `/de`. Confirm the actual sales region before adding city or country claims.

## Search research and page targeting

Ubersuggest's authenticated German keyword data returned the following estimates. These are tool results, not measured visits to AutoAnders. Difficulty is on a 0–100 scale; lower values indicate less competition. Cached keyword/SERP reports have different update dates.

| Search query | Monthly searches | Difficulty | Decision |
| --- | ---: | ---: | --- |
| gebrauchtwagen kaufen | 49,500 | 61 | Main catalogue topic; competitive, not a quick ranking promise |
| auto verkaufen | 40,500 | 44 | Main selling-page topic |
| auto verkaufen an händler | 210 | 34 | More specific commercial intent for selling-page copy and buyer questions |
| gebrauchtwagen kaufen vom händler | 110 | 63 | Relevant wording, but no evidence that this is an easy opportunity |

The returned SERP for “gebrauchtwagen kaufen” was last updated 1 September 2026 and included Autoland, AutoUncle, mobile.de, wirkaufendeinauto.de and HUK-Autowelt. This supports prioritizing a useful inventory and individual vehicle pages. It does not establish AutoAnders' current ranking.

Page mapping:

- `/de`: brand, used cars and selling overview.
- `/de/Catalogue`: buying intent; filterable inventory, a descriptive H1 and introductory copy.
- `/de/Catalogue/:id`: actual published make/model/variant/year, price, mileage, equipment and enquiry link. Stable IDs avoid changing URLs when a title changes.
- `/de/Sell`: selling and part-exchange intent, vehicle assessment request and the information needed for an assessment.
- `/de/faq`: customer questions about buying and selling.
- `/en` and `/nl`: equivalent translated pages with reciprocal language links. English/Dutch keyword volumes have not been researched.

Do not create empty brand/city pages, target competitor brand names, promise instant payment/guarantees, or target damaged-car services unless the actual business supports them. Local terms such as “Gebrauchtwagen [city]” require a verified location and further local research. Keyword meta tags are not used.

## Implemented

- Server-rendered titles, descriptions, canonical URLs, language tags, Open Graph and Twitter metadata; metadata updates on client navigation too.
- Reciprocal `hreflang` links (`de`, `en`, `nl`, German `x-default`). Query strings/fragments do not create extra canonicals.
- Real server-rendered inventory on home/catalogue pages; no login credentials on public inventory reads. Angular waits for photograph resolution before completing SSR.
- Crawlable vehicle links, dedicated vehicle pages and schema.org Organization, WebSite, WebPage, BreadcrumbList and Car/Offer markup derived from published data. Missing values are omitted; no invented reviews or business address.
- Missing URLs and unpublished vehicle IDs return 404 with `noindex`; inventory failures return 503 with `Retry-After` rather than a false missing-vehicle response. Home retains its useful static content during an inventory outage and shows an availability message.
- Auth/account/contact-form screens use `noindex` and are excluded from the sitemap. Existing authentication requirements are retained.
- `/robots.txt` and `/sitemap.xml` are served by Express. The sitemap includes current published vehicles and language alternates. On upstream failure it returns 503; it does not silently publish a reduced inventory.
- Permanent redirects for the root, legacy aliases and trailing slashes. Corrected footer buying/selling links.
- Fixed the SSR host allowlist: the configured production hostname and loopback hosts are accepted. An empty allowlist previously caused the production engine to return only a client-side shell.
- Page-level lazy loading, prioritized hero image, deferred lower-page images and visible headings on mobile. The initial build bundle is below the existing 600 kB warning threshold. This is not a Core Web Vitals measurement; route-specific chunks still load when needed.

The current catalogue design keeps its extra buying-guide section commented out. That hidden text is not claimed as published SEO content.

## Validation

```sh
npm run build
npm test -- --watch=false
npm run verify:seo
```

`verify:seo` starts and stops isolated production Node servers on temporary ports. A test-only fetch preload supplies two known vehicles (including one with a separate photograph request), unauthenticated account responses, and an upstream failure scenario. It checks all public page types in all three languages, inventory in the raw HTML, unique titles, H1s, descriptions, canonicals, language links, JSON-LD, internal links, sitemap XML, private-route redirects, 404 and 503 responses. It never writes to the real API and is not evidence of live inventory availability.

On 15 October, the configured frontend URL `https://auto-anders.vercel.app/de` returned 404 while the public inventory API returned 200. On 16 October, the inventory API timed out from both Node and PowerShell. Production reachability therefore still needs to be checked. A completed Ubersuggest crawl, live PageSpeed score, real-user Core Web Vitals, Search Console coverage and current AutoAnders rankings are not available from this work. The connected Ubersuggest account was free; its crawl tool is documented as requiring a paid account.

## Before launch

1. Set `DEALERSHIP_URL` to the verified production origin before building (for example `https://www.example.com`, without paths). It drives all canonicals, language links, schema URLs, sitemap URLs and the server's host allowlist. Do not ship with the current default unless that is the real, working domain. Configure any alternate host to redirect to this origin at the hosting layer.
2. Deploy the Angular SSR/Express server, not only `dist/frontend/browser`. The server entry is `dist/frontend/server/server.mjs`; `npm run serve:ssr:frontend` starts it. Static-only hosting will not execute the sitemap/robots handlers, vehicle resolvers or HTTP status logic.
3. Verify the backend is reachable anonymously at `/cars/accepted` from the server. The current implementation bounds inventory and photograph requests to 10 seconds. If the hosting service regularly takes longer to wake up, resolve that availability issue rather than accepting empty inventory as success.
4. Verify storage settings and published photos. Existing private storage URLs expire after one hour. Stable URLs for publicly advertised vehicle photos are preferable for image indexing and social previews; implement those through the backend/storage publication workflow, without making private uploads public by default.
5. Supply the real business name, address, telephone, opening hours and service area. Replace existing placeholder company/contact information in legal pages and verify visible service claims. Only then add appropriate AutoDealer/local-business schema and consistent business directory information.
6. Verify ownership in Google Search Console, submit `/sitemap.xml`, inspect representative home/catalogue/vehicle URLs, and test the production markup with Google's Rich Results Test. Monitor indexed pages, impressions, relevant queries and enquiry conversions. Search Console ownership/analytics were not created by this change.
7. Measure production mobile performance after deployment and optimize images or backend response time based on those measurements. Continue publishing accurate inventory and useful answers to real buyer questions. Rankings also depend on local relevance, competition and legitimate references from other sites; no first-page position is guaranteed.

## Primary technical references

- [Google: JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google: crawlable links and individual content URLs](https://developers.google.com/search/docs/fundamentals/get-started-developers)
- [Google: language versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: sitemap creation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Angular: server rendering, status codes and redirects](https://angular.dev/guide/ssr)
- [Angular: SSR host validation](https://angular.dev/best-practices/security#preventing-server-side-request-forgery-ssrf)
