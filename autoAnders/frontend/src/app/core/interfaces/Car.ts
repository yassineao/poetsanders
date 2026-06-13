
export interface Car  {
  id: number;
  brand: string;
  model: string;
  price: number;
  year: number;
  firstRegistrationDate: string;
  mileage: number;
  transmission: string;
  fuel: string;
  engineCapacity: number;
  numberOfDoors: number;
  numberOfSeats: number;
  condition: string;
  numberOfGears: number;
  vat: string;
  vehicle: string;
  colour: string;
  image: string;
  tags: {
    de: string[];
    en: string[];
    nl: string[];
  };
};

export interface AutoCatalogueLabels  {
  vehiclesFound: string;
  searchPlaceholder: string;
  allBrands: string;
  allTransmissions: string;
  firstRegistrationDate: string;
  maxMileage: string;
  maxPrice: string;
  allColours: string;
  allFuels: string;
  engineCapacity: string;
  allDoorCounts: string;
  allConditions: string;
  allGearCounts: string;
  allVatOptions: string;
  allVehicles: string;
  searchButton: string;
  resetButton: string;
  viewDetails: string;
  moreButton: string;
};

export interface AutoCatalogueProps  {
  cars: Car[];
  locale: "de" | "en" | "nl";
  title: string;
  subtitle: string;
  labels: AutoCatalogueLabels;
  showMoreButton?: boolean;
};
