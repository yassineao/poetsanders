import type { Copy } from "../../../../interfaces/types";

const bodyTypeOptions = [
  "MPV",
  "SUV",
  "SEDAN",
  "HATCHBACK",
  "STATION_WAGON",
  "COUPE",
  "CABRIOLET",
  "VAN",
].map((value) => ({ value, label: value.replaceAll("_", " ") }));

const gearboxOptions = ["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"].map((value) => ({
  value,
  label: value.replaceAll("_", " "),
}));

const fuelOptions = ["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "LPG", "CNG"].map((value) => ({
  value,
  label: value,
}));

const emissionClassOptions = ["EURO_1", "EURO_2", "EURO_3", "EURO_4", "EURO_5", "EURO_6"].map((value) => ({
  value,
  label: value.replace("_", " "),
}));

const energyLabelOptions = ["A", "B", "C", "D", "E", "F", "G"].map((value) => ({ value, label: value }));

const paintTypeOptions = ["BASIC", "METALLIC", "PEARL", "MATTE"].map((value) => ({
  value,
  label: value,
}));

const upholsteryOptions = ["FABRIC", "LEATHER", "PART_LEATHER", "ALCANTARA"].map((value) => ({
  value,
  label: value.replaceAll("_", " "),
}));

const statusOptions = ["Available", "Pending_Confirmation", "Booked", "Cancelled"].map((value) => ({
  value,
  label: value.replaceAll("_", " "),
}));

export const enSellCopy: Copy["sell"] = {
  eyebrow: "Sell your car",
  title: "Send vehicle details",
  description:
    "Share the key details of your car. We will contact you with a fair estimate.",
  fields: [
    // { name: "firstName", label: "First name", type: "text", required: true },
    // { name: "lastName", label: "Last name", type: "text", required: true },
    // { name: "email", label: "Email", type: "email", required: true },
    // { name: "phone", label: "Phone", type: "tel" },
    { name: "brand", label: "Brand", type: "text", required: true },
    { name: "model", label: "Model", type: "text", required: true },
    { name: "title", label: "Listing title", type: "text" },
    { name: "subtitle", label: "Listing subtitle", type: "text" },
    { name: "yearOfManufacture", label: "Year of manufacture", type: "number" },
    { name: "mileage", label: "Mileage", type: "number", required: true },
    { name: "power", label: "Power", type: "text" },
    { name: "referenceNumber", label: "Reference number", type: "text" },
    { name: "price", label: "Expected price", type: "number" },
    { name: "firstRegistrationDate", label: "First registration date", type: "date" },
    { name: "numberOfDoors", label: "Number of doors", type: "number" },
    { name: "wheelbase", label: "Wheelbase", type: "number" },
    { name: "numberOfCylinders", label: "Number of cylinders", type: "number" },
    { name: "motorVehicleTax", label: "Motor vehicle tax", type: "text" },
    { name: "modelDateFrom", label: "Model date from", type: "date" },
    { name: "modelDateTo", label: "Model date to", type: "date" },
    { name: "maxTowingWeight", label: "Max towing weight", type: "number" },
    { name: "maxTowingWeightUnbraked", label: "Max towing weight unbraked", type: "number" },
    { name: "urbanFuelConsumption", label: "Urban fuel consumption", type: "number" },
    { name: "combinedFuelConsumption", label: "Combined fuel consumption", type: "number" },
    { name: "motorwayFuelConsumption", label: "Motorway fuel consumption", type: "number" },
    { name: "co2Emissions", label: "CO2 emissions", type: "number" },
    { name: "taxDeductible", label: "Tax deductible", type: "checkbox" },
    { name: "chassisNumber", label: "Chassis number", type: "text" },
    { name: "numberOfKeys", label: "Number of keys", type: "number" },
    { name: "licensePlate", label: "License plate", type: "text" },
    { name: "engineDisplacement", label: "Engine displacement", type: "number" },
    { name: "colour", label: "Colour", type: "text" },
    { name: "emptyWeight", label: "Empty weight", type: "number" },
    { name: "taxAdditionPercentage", label: "Tax addition percentage", type: "number" },
    { name: "apkMotDate", label: "APK/MOT date", type: "text" },
    { name: "serviceDocumentation", label: "Service documentation", type: "checkbox" },
    { name: "location", label: "Location", type: "text" },
    { name: "financialLeasePricePerMonth", label: "Financial lease price per month", type: "number" },
    { name: "leasePrice60Months", label: "Lease price 60 months", type: "number" },
    { name: "leasePrice48Months", label: "Lease price 48 months", type: "number" },
    { name: "leasePrice36Months", label: "Lease price 36 months", type: "number" },
    { name: "bodyType", label: "Body type", type: "select", options: bodyTypeOptions },
    { name: "gearbox", label: "Gearbox", type: "select", options: gearboxOptions },
    { name: "fuel", label: "Fuel", type: "select", options: fuelOptions },
    { name: "emissionClass", label: "Emission class", type: "select", options: emissionClassOptions },
    { name: "energyLabel", label: "Energy label", type: "select", options: energyLabelOptions },
    { name: "paintType", label: "Paint type", type: "select", options: paintTypeOptions },
    { name: "upholstery", label: "Upholstery", type: "select", options: upholsteryOptions },
    { name: "status", label: "Status", type: "select", options: statusOptions },
  ],
  textarea: { name: "message", label: "Message", rows: 5 },
  submitLabel: "Send request",
  sendingLabel: "Sending...",
  popup: {
    successTitle: "Request sent",
    successMessage: "Thank you. We will contact you as soon as possible.",
    errorTitle: "Request not sent",
    errorMessage: "Something went wrong. Please try again.",
    closeLabel: "OK",
  },
};
