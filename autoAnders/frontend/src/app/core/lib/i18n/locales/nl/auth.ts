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
    name: "Naam",
    phoneNumber: "Telefoonnummer",
  },
  placeholders: {
    email: "Voer uw e-mailadres in",
    password: "Voer uw wachtwoord in",
    name: "Voer uw volledige naam in",
    phoneNumber: "Voer uw telefoonnummer in",
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
