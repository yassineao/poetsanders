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

export interface GuestCarRequest {
    name: string;
    email: string;
    phoneNumber: string;
    car: CarRequest;
}

export interface Car extends CarSpecifications {
    version?: number;
    createdAt?: string;
    updatedAt?: string;
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

    user?: AuthUser;
    pictures: CarPicture[];
}

enum BodyType {
    MPV = "MPV",
    SUV = "SUV",
    SEDAN = "SEDAN",
    HATCHBACK = "HATCHBACK",
    STATION_WAGON = "STATION_WAGON",
    COUPE = "COUPE",
    CABRIOLET = "CABRIOLET",
    VAN = "VAN"}

enum EmissionClass {
    EURO_1 = "EURO_1",
    EURO_2 = "EURO_2",
    EURO_3 = "EURO_3",
    EURO_4 = "EURO_4",
    EURO_5 = "EURO_5",
    EURO_6 = "EURO_6"}
enum EnergyLabel {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    F = "F",
    G = "G"}
enum Fuel {
    PETROL = "PETROL",
    DIESEL = "DIESEL",
    ELECTRIC = "ELECTRIC",
    HYBRID = "HYBRID",
    LPG = "LPG",
    CNG = "CNG"}
enum Gearbox {
    MANUAL = "MANUAL",
    AUTOMATIC = "AUTOMATIC",
    SEMI_AUTOMATIC = "SEMI_AUTOMATIC"}
enum PaintType {
    BASIC = "BASIC",
    METALLIC = "METALLIC",
    PEARL = "PEARL",
    MATTE = "MATTE"}
enum CarStatus {
    Available = "Available",
    Pending_Confirmation = "Pending_Confirmation",
    Booked = "Booked",
    Cancelled = "Cancelled",
}
enum Transmission {
    Automatic = "Automatic",
    Manual = "Manual",
    Semi_Automatic = "Semi_Automatic"}
enum Upholstery {
    FABRIC = "FABRIC",
    LEATHER = "LEATHER",
    PART_LEATHER = "PART_LEATHER",
    ALCANTARA = "ALCANTARA"}

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
export type CarRequest = Omit<Car, 'id' | 'version' | 'createdAt' | 'updatedAt' | 'user' | 'pictures' | 'bodyType' | 'gearbox' | 'fuel' | 'emissionClass' | 'energyLabel' | 'paintType' | 'upholstery' | 'status'> & {
    bodyType: BodyType | null;
    gearbox: Gearbox | null;
    fuel: Fuel | null;
    emissionClass: EmissionClass | null;
    energyLabel: EnergyLabel | null;
    paintType: PaintType | null;
    upholstery: Upholstery | null;
    status: CarStatus | null;
};
