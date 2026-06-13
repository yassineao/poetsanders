import type { Copy } from "../../../../interfaces/types";

export const deSellCopy: Copy["sell"] = {
  eyebrow: "Auto verkaufen",
  title: "Fahrzeugdaten senden",
  description:
    "Teilen Sie uns die wichtigsten Details zu Ihrem Auto mit. Wir melden uns mit einer fairen Einschätzung.",
  fields: [
    { name: "firstName", label: "Vorname", type: "text", required: true },
    { name: "lastName", label: "Nachname", type: "text", required: true },
    { name: "email", label: "E-Mail", type: "email", required: true },
    { name: "phone", label: "Telefon", type: "tel" },
    { name: "brand", label: "Marke", type: "text", required: true },
    { name: "model", label: "Modell", type: "text", required: true },
    { name: "mileage", label: "Kilometerstand", type: "number", required: true },
    { name: "price", label: "Preisvorstellung", type: "number" },
  ],
  textarea: { name: "message", label: "Nachricht", rows: 5 },
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
