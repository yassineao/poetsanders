import type { Copy } from "../../../../interfaces/types";

export const nlSellCopy: Copy["sell"] = {
  eyebrow: "Auto verkopen",
  title: "Voertuiggegevens versturen",
  description:
    "Deel de belangrijkste details van uw auto. Wij nemen contact op met een eerlijke inschatting.",
  fields: [
    { name: "firstName", label: "Voornaam", type: "text", required: true },
    { name: "lastName", label: "Achternaam", type: "text", required: true },
    { name: "email", label: "E-mail", type: "email", required: true },
    { name: "phone", label: "Telefoon", type: "tel" },
    { name: "brand", label: "Merk", type: "text", required: true },
    { name: "model", label: "Model", type: "text", required: true },
    { name: "mileage", label: "Kilometerstand", type: "number", required: true },
    { name: "price", label: "Verwachte prijs", type: "number" },
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
