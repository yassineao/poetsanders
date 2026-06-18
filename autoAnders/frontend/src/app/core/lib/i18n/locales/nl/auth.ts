import type { Copy } from "../../../../interfaces/types";

export const nlAuthCopy: Copy["auth"] = {
  metadata: {
    title: "Inloggen | AutoAnders",
    description: "Log in voor toegang tot uw AutoAnders-account en diensten.",
    locale: "nl_NL",
    keywords: ["autoanders inloggen", "autoanders login", "auto account"],
  },
  badge: "Inloggen",
  title: "Welkom terug bij AutoAnders",
  description: "Log in voor toegang tot uw account en persoonlijke diensten.",
  fields: {
    email: "E-mailadres",
    password: "Wachtwoord",
    confirmPassword: "Bevestig wachtwoord",
    name: "Naam",
    phoneNumber: "Telefoonnummer",
  },
  placeholders: {
    email: "Voer uw e-mailadres in",
    password: "Voer uw wachtwoord in",
    confirmPassword: "Voer uw wachtwoord opnieuw in",
    name: "Voer uw volledige naam in",
    phoneNumber: "Voer uw telefoonnummer in",
  },
  validation: {
    required: "Dit veld is verplicht.",
    invalidEmail: "Voer een geldig e-mailadres in.",
    passwordLength: "Het wachtwoord moet 12 tot 30 tekens bevatten.",
    passwordPattern: "Gebruik hoofdletters, kleine letters, een cijfer en een speciaal teken.",
    passwordMismatch: "De wachtwoorden komen niet overeen.",
    nameTooLong: "De naam mag maximaal 255 tekens bevatten.",
    phoneLength: "Het telefoonnummer moet 8 tot 30 tekens bevatten.",
  },
  consent: {
    prefix: "Door in te loggen gaat u akkoord met onze",
    terms: "Voorwaarden",
    and: "en",
    privacyPolicy: "Privacyverklaring",
    suffix: ".",
  },
  submitLabel: "Inloggen",
  sendingLabel: "Bezig met inloggen...",
  popup: {
    successTitle: "Ingelogd",
    successMessage: "U bent succesvol ingelogd.",
    errorTitle: "Inloggen mislukt",
    errorMessage: "Het e-mailadres of wachtwoord is onjuist.",
    closeLabel: "Sluiten",
  },
  loginAuth: {
    message: "Heeft u nog geen account?",
    buttonLabel: "Account aanmaken",
  },
  registerAuth: {
    message: "Heeft u al een account?",
    buttonLabel: "Inloggen",
  },
};
