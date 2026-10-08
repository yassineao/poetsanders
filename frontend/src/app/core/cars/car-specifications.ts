import type { CarSpecifications } from '../interfaces/Car';

export interface SpecificationField {
  key: keyof CarSpecifications;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  maxLength?: number;
  min?: number;
  step?: string;
  options?: string[];
}

export const specificationFields: SpecificationField[] = [
  {
    "key": "variant",
    "label": "Variant",
    "type": "text"
  },
  {
    "key": "trimLevel",
    "label": "Trim level",
    "type": "text"
  },
  {
    "key": "vin",
    "label": "VIN",
    "type": "text",
    "maxLength": 17
  },
  {
    "key": "originalPrice",
    "label": "Original price",
    "type": "number",
    "min": 0,
    "step": "0.01"
  },
  {
    "key": "discountAmount",
    "label": "Discount amount",
    "type": "number",
    "min": 0,
    "step": "0.01"
  },
  {
    "key": "taxScheme",
    "label": "Tax scheme",
    "type": "text"
  },
  {
    "key": "lastServiceDate",
    "label": "Last service date",
    "type": "date"
  },
  {
    "key": "warrantyUntil",
    "label": "Warranty until",
    "type": "date"
  },
  {
    "key": "accidentFree",
    "label": "Accident free",
    "type": "boolean"
  },
  {
    "key": "imported",
    "label": "Imported",
    "type": "boolean"
  },
  {
    "key": "numberOfPreviousOwners",
    "label": "Previous owners",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "conditionDescription",
    "label": "Condition description",
    "type": "text",
    "maxLength": 2000
  },
  {
    "key": "horsepower",
    "label": "Horsepower",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "kilowatts",
    "label": "Power (kW)",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "torqueNm",
    "label": "Torque (Nm)",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "topSpeed",
    "label": "Top speed (km/h)",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "acceleration",
    "label": "0â€“100 km/h (s)",
    "type": "number",
    "min": 0,
    "step": "0.1"
  },
  {
    "key": "tankCapacity",
    "label": "Tank capacity (L)",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "engineCode",
    "label": "Engine code",
    "type": "text"
  },
  {
    "key": "wltpFuelConsumption",
    "label": "WLTP consumption (L/100 km)",
    "type": "number",
    "min": 0,
    "step": "0.01"
  },
  {
    "key": "electricRange",
    "label": "Electric range (km)",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "batteryCapacityKwh",
    "label": "Battery capacity (kWh)",
    "type": "number",
    "min": 0,
    "step": "0.01"
  },
  {
    "key": "chargingTimeHours",
    "label": "Charging time (hours)",
    "type": "number",
    "min": 0,
    "step": "0.01"
  },
  {
    "key": "fastChargingPowerKw",
    "label": "Fast charging (kW)",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "numberOfSeats",
    "label": "Seats",
    "type": "number",
    "min": 1,
    "step": "1"
  },
  {
    "key": "lengthMm",
    "label": "Length (mm)",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "widthMm",
    "label": "Width (mm)",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "heightMm",
    "label": "Height (mm)",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "grossVehicleWeight",
    "label": "Gross vehicle weight (kg)",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "maxPayload",
    "label": "Max payload (kg)",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "trunkCapacityLitres",
    "label": "Trunk capacity (L)",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "numberOfGears",
    "label": "Gears",
    "type": "number",
    "min": 0,
    "step": "1"
  },
  {
    "key": "driveType",
    "label": "Drive type",
    "type": "select",
    "options": [
      "FRONT_WHEEL_DRIVE",
      "REAR_WHEEL_DRIVE",
      "ALL_WHEEL_DRIVE",
      "FOUR_WHEEL_DRIVE"
    ]
  },
  {
    "key": "manufacturerColour",
    "label": "Manufacturer colour",
    "type": "text"
  },
  {
    "key": "wheelSize",
    "label": "Wheel size",
    "type": "text"
  },
  {
    "key": "tyreSize",
    "label": "Tyre size",
    "type": "text"
  },
  {
    "key": "upholsteryColour",
    "label": "Upholstery colour",
    "type": "text"
  },
  {
    "key": "interiorColour",
    "label": "Interior colour",
    "type": "text"
  }
];

export function normalizeFeatures(value: unknown): string[] {
  const items = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/\r?\n/) : [];
  return [...new Set(items.map(item => String(item).trim()).filter(Boolean))];
}

/** Optional specifications stay null when unknown; zero is a real value. */
export function toSpecifications(values: object): CarSpecifications {
  const source = values as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  for (const field of specificationFields) {
    const value = source[field.key];
    result[field.key] = value === undefined || value === null || value === '' ? null
      : field.type === 'number' ? Number(value)
      : field.type === 'boolean' ? value === true || value === 'true'
      : String(value).trim();
  }
  result['features'] = normalizeFeatures(source['features']);
  return result as CarSpecifications;
}
