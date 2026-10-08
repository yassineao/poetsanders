import { AuthUser } from "./AuthUser";


export type DriveType = 'FRONT_WHEEL_DRIVE' | 'REAR_WHEEL_DRIVE' | 'ALL_WHEEL_DRIVE' | 'FOUR_WHEEL_DRIVE';

export interface CarSpecifications {
  variant?: string | null;
  trimLevel?: string | null;
  vin?: string | null;
  originalPrice?: number | null;
  discountAmount?: number | null;
  taxScheme?: string | null;
  lastServiceDate?: string | null;
  warrantyUntil?: string | null;
  accidentFree?: boolean | null;
  imported?: boolean | null;
  numberOfPreviousOwners?: number | null;
  conditionDescription?: string | null;
  horsepower?: number | null;
  kilowatts?: number | null;
  torqueNm?: number | null;
  topSpeed?: number | null;
  acceleration?: number | null;
  tankCapacity?: number | null;
  engineCode?: string | null;
  wltpFuelConsumption?: number | null;
  electricRange?: number | null;
  batteryCapacityKwh?: number | null;
  chargingTimeHours?: number | null;
  fastChargingPowerKw?: number | null;
  numberOfSeats?: number | null;
  lengthMm?: number | null;
  widthMm?: number | null;
  heightMm?: number | null;
  grossVehicleWeight?: number | null;
  maxPayload?: number | null;
  trunkCapacityLitres?: number | null;
  numberOfGears?: number | null;
  driveType?: DriveType | null;
  manufacturerColour?: string | null;
  wheelSize?: string | null;
  tyreSize?: string | null;
  upholsteryColour?: string | null;
  interiorColour?: string | null;
  featured?: boolean | null;
  reserved?: boolean | null;
  sold?: boolean | null;
  features?: string[];
}

export interface Car extends CarSpecifications {
    features?: string[];
    id: string;

    brand: string;
    model: string;

    title: string;
    subtitle: string;

    yearOfManufacture: number;
    mileage: number;
    power: string;
    referenceNumber: string;
    price: number;

    firstRegistrationDate: string;
    numberOfDoors: number;
    wheelbase: number;
    numberOfCylinders: number;
    motorVehicleTax: string;
    modelDateFrom: string;
    modelDateTo: string;
    maxTowingWeight: number;
    maxTowingWeightUnbraked: number;
    urbanFuelConsumption: number;
    combinedFuelConsumption: number;
    motorwayFuelConsumption: number;
    co2Emissions: number;
    taxDeductible: boolean;
    chassisNumber: string;
    numberOfKeys: number;

    licensePlate: string;
    engineDisplacement: number;
    colour: string;
    emptyWeight: number;
    taxAdditionPercentage: number;
    apkMotDate: string;
    serviceDocumentation: boolean;
    location: string;

    financialLeasePricePerMonth: number;
    leasePrice60Months: number;
    leasePrice48Months: number;
    leasePrice36Months: number;

    bodyType: BodyType;
    gearbox: Gearbox;
    fuel: Fuel;
    emissionClass: EmissionClass;
    energyLabel: EnergyLabel;
    paintType: PaintType;
    upholstery: Upholstery;
    status: CarStatus;

    user: AuthUser;
    pictures: CarPicture[];
}

export type BodyType = 'MPV' | 'SUV' | 'SEDAN' | 'HATCHBACK' | 'STATION_WAGON' | 'COUPE' | 'CABRIOLET' | 'VAN';
export type EmissionClass = 'EURO_1' | 'EURO_2' | 'EURO_3' | 'EURO_4' | 'EURO_5' | 'EURO_6';
export type EnergyLabel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
export type Fuel = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' | 'LPG' | 'CNG';
export type Gearbox = 'MANUAL' | 'AUTOMATIC' | 'SEMI_AUTOMATIC';
export type PaintType = 'BASIC' | 'METALLIC' | 'PEARL' | 'MATTE';
export type CarStatus = 'Available' | 'Pending_Confirmation' | 'Booked' | 'Cancelled';
export type Upholstery = 'FABRIC' | 'LEATHER' | 'PART_LEATHER' | 'ALCANTARA';

export interface CarPicture {
    id: string;
    storage_path: string;
    title: string;
    description: string;
    width: number;
    height: number;
}

export interface AutoCatalogueLabels {
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
}

export interface CarPictureRequest {
    file: File;
    title?: string;
    description?: string;
    width: number;
    height: number;
}
export type CarRequest = Omit<Car, 'id' | 'user' | 'pictures'>;

export interface GuestCarRequest {
  name: string;
  email: string;
  phoneNumber: string;
  car: Pick<CarRequest, 'brand' | 'model'> & Partial<CarRequest>;
}
