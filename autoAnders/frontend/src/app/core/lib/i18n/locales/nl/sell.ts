import type { Copy } from "../../../../interfaces/types";

const bodyTypeOptions = [
  { value: "MPV", label: "MPV" },
  { value: "SUV", label: "SUV" },
  { value: "SEDAN", label: "Sedan" },
  { value: "HATCHBACK", label: "Hatchback" },
  { value: "STATION_WAGON", label: "Stationwagen" },
  { value: "COUPE", label: "Coupe" },
  { value: "CABRIOLET", label: "Cabriolet" },
  { value: "VAN", label: "Bestelwagen" },
];

const gearboxOptions = [
  { value: "MANUAL", label: "Handgeschakeld" },
  { value: "AUTOMATIC", label: "Automaat" },
  { value: "SEMI_AUTOMATIC", label: "Semi-automaat" },
];

const fuelOptions = [
  { value: "PETROL", label: "Benzine" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELECTRIC", label: "Elektrisch" },
  { value: "HYBRID", label: "Hybride" },
  { value: "LPG", label: "LPG" },
  { value: "CNG", label: "CNG" },
];

const emissionClassOptions = ["EURO_1", "EURO_2", "EURO_3", "EURO_4", "EURO_5", "EURO_6"].map((value) => ({
  value,
  label: value.replace("_", " "),
}));

const energyLabelOptions = ["A", "B", "C", "D", "E", "F", "G"].map((value) => ({ value, label: value }));

const paintTypeOptions = [
  { value: "BASIC", label: "Basis" },
  { value: "METALLIC", label: "Metallic" },
  { value: "PEARL", label: "Parelmoer" },
  { value: "MATTE", label: "Mat" },
];

const upholsteryOptions = [
  { value: "FABRIC", label: "Stof" },
  { value: "LEATHER", label: "Leer" },
  { value: "PART_LEATHER", label: "Half leder" },
  { value: "ALCANTARA", label: "Alcantara" },
];

const statusOptions = [
  { value: "Available", label: "Beschikbaar" },
  { value: "Pending_Confirmation", label: "Wacht op bevestiging" },
  { value: "Booked", label: "Gereserveerd" },
  { value: "Cancelled", label: "Geannuleerd" },
];

export const nlSellCopy: Copy["sell"] = {
  eyebrow: "Auto verkopen",
  title: "Voertuiggegevens versturen",
  description:
    "Deel de belangrijkste details van uw auto. Wij nemen contact op met een eerlijke inschatting.",
  fields: [
    // { name: "firstName", label: "Voornaam", type: "text", required: true },
    // { name: "lastName", label: "Achternaam", type: "text", required: true },
    // { name: "email", label: "E-mail", type: "email", required: true },
    // { name: "phone", label: "Telefoon", type: "tel" },
    { name: "brand", label: "Merk", type: "text", required: true },
    { name: "model", label: "Model", type: "text", required: true },
    { name: "title", label: "Titel", type: "text" },
    { name: "subtitle", label: "Subtitel", type: "text" },
    { name: "yearOfManufacture", label: "Bouwjaar", type: "number" },
    { name: "mileage", label: "Kilometerstand", type: "number", required: true },
    { name: "power", label: "Vermogen", type: "text" },
    { name: "referenceNumber", label: "Referentienummer", type: "text" },
    { name: "price", label: "Verwachte prijs", type: "number" },
    { name: "firstRegistrationDate", label: "Eerste registratie", type: "date" },
    { name: "numberOfDoors", label: "Aantal deuren", type: "number" },
    { name: "wheelbase", label: "Wielbasis", type: "number" },
    { name: "numberOfCylinders", label: "Aantal cilinders", type: "number" },
    { name: "motorVehicleTax", label: "Motorrijtuigenbelasting", type: "text" },
    { name: "modelDateFrom", label: "Model vanaf", type: "date" },
    { name: "modelDateTo", label: "Model tot", type: "date" },
    { name: "maxTowingWeight", label: "Max. trekgewicht", type: "number" },
    { name: "maxTowingWeightUnbraked", label: "Max. trekgewicht ongeremd", type: "number" },
    { name: "urbanFuelConsumption", label: "Brandstofverbruik stad", type: "number" },
    { name: "combinedFuelConsumption", label: "Brandstofverbruik gecombineerd", type: "number" },
    { name: "motorwayFuelConsumption", label: "Brandstofverbruik snelweg", type: "number" },
    { name: "co2Emissions", label: "CO2-uitstoot", type: "number" },
    { name: "taxDeductible", label: "BTW aftrekbaar", type: "checkbox" },
    { name: "chassisNumber", label: "Chassisnummer", type: "text" },
    { name: "numberOfKeys", label: "Aantal sleutels", type: "number" },
    { name: "licensePlate", label: "Kenteken", type: "text" },
    { name: "engineDisplacement", label: "Cilinderinhoud", type: "number" },
    { name: "colour", label: "Kleur", type: "text" },
    { name: "emptyWeight", label: "Leeggewicht", type: "number" },
    { name: "taxAdditionPercentage", label: "Bijtelling percentage", type: "number" },
    { name: "apkMotDate", label: "APK-datum", type: "text" },
    { name: "serviceDocumentation", label: "Onderhoudsdocumentatie", type: "checkbox" },
    { name: "location", label: "Locatie", type: "text" },
    { name: "financialLeasePricePerMonth", label: "Financial lease per maand", type: "number" },
    { name: "leasePrice60Months", label: "Leaseprijs 60 maanden", type: "number" },
    { name: "leasePrice48Months", label: "Leaseprijs 48 maanden", type: "number" },
    { name: "leasePrice36Months", label: "Leaseprijs 36 maanden", type: "number" },
    { name: "bodyType", label: "Carrosserievorm", type: "select", options: bodyTypeOptions },
    { name: "gearbox", label: "Versnellingsbak", type: "select", options: gearboxOptions },
    { name: "fuel", label: "Brandstof", type: "select", options: fuelOptions },
    { name: "emissionClass", label: "Emissieklasse", type: "select", options: emissionClassOptions },
    { name: "energyLabel", label: "Energielabel", type: "select", options: energyLabelOptions },
    { name: "paintType", label: "Laksoort", type: "select", options: paintTypeOptions },
    { name: "upholstery", label: "Bekleding", type: "select", options: upholsteryOptions },
    { name: "status", label: "Status", type: "select", options: statusOptions },
  ],
  textarea: { name: "message", label: "Bericht", rows: 5 },
  submitLabel: "Aanvraag versturen",
  sendingLabel: "Wordt verstuurd...",
  popup: {
    successTitle: "Aanvraag verstuurd",
    successMessage: "Bedankt. Wij nemen zo snel mogelijk contact met u op.",
    errorTitle: "Aanvraag niet verstuurd",
    errorMessage: "Er is iets misgegaan. Probeer het opnieuw.",
    closeLabel: "OK",
  },
};
