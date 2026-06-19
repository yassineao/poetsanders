import type { Copy } from "../../../../interfaces/types";

const bodyTypeOptions = [
  { value: "MPV", label: "MPV" },
  { value: "SUV", label: "SUV" },
  { value: "SEDAN", label: "Limousine" },
  { value: "HATCHBACK", label: "Schraegheck" },
  { value: "STATION_WAGON", label: "Kombi" },
  { value: "COUPE", label: "Coupe" },
  { value: "CABRIOLET", label: "Cabriolet" },
  { value: "VAN", label: "Van" },
];

const gearboxOptions = [
  { value: "MANUAL", label: "Manuell" },
  { value: "AUTOMATIC", label: "Automatik" },
  { value: "SEMI_AUTOMATIC", label: "Halbautomatik" },
];

const fuelOptions = [
  { value: "PETROL", label: "Benzin" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELECTRIC", label: "Elektrisch" },
  { value: "HYBRID", label: "Hybrid" },
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
  { value: "PEARL", label: "Perleffekt" },
  { value: "MATTE", label: "Matt" },
];

const upholsteryOptions = [
  { value: "FABRIC", label: "Stoff" },
  { value: "LEATHER", label: "Leder" },
  { value: "PART_LEATHER", label: "Teilleder" },
  { value: "ALCANTARA", label: "Alcantara" },
];

const statusOptions = [
  { value: "Available", label: "Verfuegbar" },
  { value: "Pending_Confirmation", label: "Bestaetigung ausstehend" },
  { value: "Booked", label: "Reserviert" },
  { value: "Cancelled", label: "Storniert" },
];

export const deSellCopy: Copy["sell"] = {
  eyebrow: "Auto verkaufen",
  title: "Fahrzeugdaten senden",
  description:
    "Teilen Sie uns die wichtigsten Details zu Ihrem Auto mit. Wir melden uns mit einer fairen Einschätzung.",
  fields: [
    // { name: "firstName", label: "Vorname", type: "text", required: true },
    // { name: "lastName", label: "Nachname", type: "text", required: true },
    // { name: "email", label: "E-Mail", type: "email", required: true },
    // { name: "phone", label: "Telefon", type: "tel" },
    { name: "brand", label: "Marke", type: "text", required: true },
    { name: "model", label: "Modell", type: "text", required: true },
    { name: "title", label: "Titel", type: "text" },
    { name: "subtitle", label: "Untertitel", type: "text" },
    { name: "yearOfManufacture", label: "Baujahr", type: "number" },
    { name: "mileage", label: "Kilometerstand", type: "number", required: true },
    { name: "power", label: "Leistung", type: "text" },
    { name: "referenceNumber", label: "Referenznummer", type: "text" },
    { name: "price", label: "Preisvorstellung", type: "number" },
    { name: "firstRegistrationDate", label: "Erstzulassung", type: "date" },
    { name: "numberOfDoors", label: "Anzahl Tueren", type: "number" },
    { name: "wheelbase", label: "Radstand", type: "number" },
    { name: "numberOfCylinders", label: "Anzahl Zylinder", type: "number" },
    { name: "motorVehicleTax", label: "Kfz-Steuer", type: "text" },
    { name: "modelDateFrom", label: "Modell von", type: "date" },
    { name: "modelDateTo", label: "Modell bis", type: "date" },
    { name: "maxTowingWeight", label: "Max. Anhaengelast", type: "number" },
    { name: "maxTowingWeightUnbraked", label: "Max. Anhaengelast ungebremst", type: "number" },
    { name: "urbanFuelConsumption", label: "Verbrauch Stadt", type: "number" },
    { name: "combinedFuelConsumption", label: "Verbrauch kombiniert", type: "number" },
    { name: "motorwayFuelConsumption", label: "Verbrauch Autobahn", type: "number" },
    { name: "co2Emissions", label: "CO2-Emissionen", type: "number" },
    { name: "taxDeductible", label: "MwSt. ausweisbar", type: "checkbox" },
    { name: "chassisNumber", label: "Fahrgestellnummer", type: "text" },
    { name: "numberOfKeys", label: "Anzahl Schluessel", type: "number" },
    { name: "licensePlate", label: "Kennzeichen", type: "text" },
    { name: "engineDisplacement", label: "Hubraum", type: "number" },
    { name: "colour", label: "Farbe", type: "text" },
    { name: "emptyWeight", label: "Leergewicht", type: "number" },
    { name: "taxAdditionPercentage", label: "Steuerzuschlag Prozent", type: "number" },
    { name: "apkMotDate", label: "APK/TUV Datum", type: "text" },
    { name: "serviceDocumentation", label: "Serviceheft vorhanden", type: "checkbox" },
    { name: "location", label: "Standort", type: "text" },
    { name: "financialLeasePricePerMonth", label: "Finanzleasing pro Monat", type: "number" },
    { name: "leasePrice60Months", label: "Leasingpreis 60 Monate", type: "number" },
    { name: "leasePrice48Months", label: "Leasingpreis 48 Monate", type: "number" },
    { name: "leasePrice36Months", label: "Leasingpreis 36 Monate", type: "number" },
    { name: "bodyType", label: "Karosserieform", type: "select", options: bodyTypeOptions },
    { name: "gearbox", label: "Getriebe", type: "select", options: gearboxOptions },
    { name: "fuel", label: "Kraftstoff", type: "select", options: fuelOptions },
    { name: "emissionClass", label: "Emissionsklasse", type: "select", options: emissionClassOptions },
    { name: "energyLabel", label: "Energielabel", type: "select", options: energyLabelOptions },
    { name: "paintType", label: "Lackart", type: "select", options: paintTypeOptions },
    { name: "upholstery", label: "Polsterung", type: "select", options: upholsteryOptions },
    { name: "status", label: "Status", type: "select", options: statusOptions },
     {
      name: "pictures",
      label: "Bilder",
      type: "file",
      accept: "image/*",
      multiple: true,
      placeholder: "Fahrzeugbilder auswaehlen",
    },
  ],
  // textarea: { name: "message", label: "Nachricht", rows: 5 },
  submitLabel: "Anfrage senden",
  sendingLabel: "Wird gesendet...",
  popup: {
    successTitle: "Anfrage gesendet",
    successMessage: "Vielen Dank. Wir melden uns so schnell wie möglich.",
    errorTitle: "Anfrage nicht gesendet",
    errorMessage: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    closeLabel: "OK",
  },
};
