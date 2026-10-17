// Test-only preload for the production SSR smoke test. Never loaded by the app.
const nativeFetch = globalThis.fetch;
const cars = [
  {
    id: 'seo-test-vehicle', brand: 'BMW', model: '320i', variant: 'Touring',
    title: 'BMW 320i Touring', subtitle: 'Navigation und Sitzheizung',
    yearOfManufacture: 2021, firstRegistrationDate: '2021-04-12', mileage: 42000,
    price: 24950, fuel: 'PETROL', gearbox: 'AUTOMATIC', bodyType: 'STATION_WAGON',
    status: 'Available', colour: 'Black', features: ['Navigation', 'Heated seats'],
    numberOfPreviousOwners: 0, accidentFree: false, numberOfDoors: 5,
    pictures: [{ storage_path: '/cars/BMW.jpg' }],
  },
];
cars.push({ ...cars[0], id: 'seo-photo-fallback', brand: 'Audi', model: 'A4', pictures: [] });

globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  if (url.pathname === '/cars/accepted') {
    return process.env['SEO_TEST_INVENTORY'] === 'offline'
      ? new Response('Temporarily unavailable', { status: 503 })
      : Response.json(cars);
  }
  if (url.pathname.startsWith('/auth/')) return new Response('Unauthorized', { status: 401 });
  if (url.pathname === '/cars/seo-photo-fallback/pictures') {
    await new Promise(resolve => setTimeout(resolve, 25));
    return Response.json([{ storage_path: '/cars/audi.jpg' }]);
  }
  return nativeFetch(input, init);
};
