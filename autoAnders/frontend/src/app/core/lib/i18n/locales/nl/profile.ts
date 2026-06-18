import type { Copy } from "../../../../interfaces/types";

export const nlProfileCopy: Copy["profile"] = {
  eyebrow: "Account",
  title: "Uw profiel",
  description: "Controleer uw accountgegevens en werk de informatie bij waarmee wij contact met u opnemen.",
  fields: [
    { name: "name", label: "Naam", type: "text", required: true },
    { name: "email", label: "E-mail", type: "email" },
    { name: "phoneNumber", label: "Telefoonnummer", type: "tel" },
    { name: "password", label: "Nieuw wachtwoord", type: "password", minLength: 8 },
  ],
  submitLabel: "Wijzigingen opslaan",
  sendingLabel: "Wordt opgeslagen...",
  editLabel: "Profiel bewerken",
  cancelEditLabel: "Stop met bewerken",
  logoutLabel: "Uitloggen",
  readOnlyHint: "Bewerken staat uit. Klik op bewerken om wijzigingen te maken.",
  popup: {
    successTitle: "Profiel bijgewerkt",
    successMessage: "Uw profielgegevens zijn opgeslagen.",
    errorTitle: "Bijwerken mislukt",
    errorMessage: "Er is iets misgegaan. Probeer het opnieuw.",
    closeLabel: "OK",
  },
};
