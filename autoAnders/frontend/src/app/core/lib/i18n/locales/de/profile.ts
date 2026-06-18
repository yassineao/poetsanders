import type { Copy } from "../../../../interfaces/types";

export const deProfileCopy: Copy["profile"] = {
  eyebrow: "Konto",
  title: "Ihr Profil",
  description: "Pruefen Sie Ihre Kontodaten und aktualisieren Sie die Informationen, mit denen wir Sie kontaktieren.",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "E-Mail", type: "email" },
    { name: "phoneNumber", label: "Telefonnummer", type: "tel" },
    { name: "password", label: "Neues Passwort", type: "password", minLength: 8 },
  ],
  submitLabel: "Aenderungen speichern",
  sendingLabel: "Wird gespeichert...",
  editLabel: "Profil bearbeiten",
  cancelEditLabel: "Bearbeitung beenden",
  logoutLabel: "Abmelden",
  readOnlyHint: "Die Bearbeitung ist deaktiviert. Klicken Sie auf Bearbeiten, um Aenderungen vorzunehmen.",
  popup: {
    successTitle: "Profil aktualisiert",
    successMessage: "Ihre Profildaten wurden gespeichert.",
    errorTitle: "Aktualisierung fehlgeschlagen",
    errorMessage: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    closeLabel: "OK",
  },
};
