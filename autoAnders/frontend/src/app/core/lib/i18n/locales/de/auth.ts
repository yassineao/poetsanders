import type { Copy } from "../../../../interfaces/types";

export const deAuthCopy: Copy["auth"] = {
    metadata: {
        title: "Anmelden | Auto kaufen & verkaufen | AutoAnders",
        description:
            "Sicheres Anmelden bei AutoAnders: Erstellen Sie Ihr Konto oder melden Sie sich an, um Zugang zu unserem Fahrzeugbestand, Angeboten und personalisierten Services zu erhalten.",
        locale: "de_DE",
        keywords: [
            "auto anmelden",
            "auto konto erstellen",
            "auto login",
            "auto benutzerkonto",
            "auto andres anmelden",
        ],
    },
    badge: "Anmelden",
    title: "Willkommen zurück bei AutoAnders",
    description:
        "Melden Sie sich an, um Ihren Zugang zu unserem Fahrzeugbestand, Angeboten und personalisierten Services zu erhalten. Erstellen Sie ein Konto, um den Kauf- und Verkaufsprozess bei AutoAnders zu vereinfachen.",
    submitLabel: "Anmelden",
    sendingLabel: "Anmeldung läuft...",
    fields: {
        email: "E-Mail-Adresse",
        password: "Passwort",
        confirmPassword: "Passwort bestätigen",
        name: "Name",
        phoneNumber: "Telefonnummer",
    },
    placeholders: {
        email: "Geben Sie Ihre E-Mail-Adresse ein",
        password: "Geben Sie Ihr Passwort ein",
        confirmPassword: "Geben Sie Ihr Passwort erneut ein",
        name: "Geben Sie Ihren vollständigen Namen ein",
        phoneNumber: "Geben Sie Ihre Telefonnummer ein",
    },
    validation: {
        required: "Dieses Feld ist erforderlich.",
        invalidEmail: "Geben Sie eine gültige E-Mail-Adresse ein.",
        passwordLength: "Das Passwort muss zwischen 12 und 30 Zeichen lang sein.",
        passwordPattern: "Verwenden Sie Groß- und Kleinbuchstaben, eine Zahl und ein Sonderzeichen.",
        passwordMismatch: "Die Passwörter stimmen nicht überein.",
        nameTooLong: "Der Name darf höchstens 255 Zeichen lang sein.",
        phoneLength: "Die Telefonnummer muss zwischen 8 und 30 Zeichen lang sein.",
    },
    consent: {
        prefix: "Mit der Anmeldung stimmen Sie unseren",
        terms: "Nutzungsbedingungen",
        and: "und",
        privacyPolicy: "Datenschutzrichtlinie",
        suffix: "zu.",
    },
    popup: {
        successTitle: "Erfolgreich angemeldet!",
        successMessage: "Sie haben sich erfolgreich bei AutoAnders angemeldet. Sie können jetzt auf Ihren Account zugreifen und unsere Services nutzen.",
        errorTitle: "Fehler bei der Anmeldung",
        errorMessage: "Die E-Mail-Adresse oder das Passwort ist falsch.",
        closeLabel: "Schließen",
    },
    loginAuth: {
        message: "Sie haben noch kein Konto?",
        buttonLabel: "Konto erstellen",
    },
    registerAuth: {
        message: "Sie haben bereits ein Konto?",
        buttonLabel: "Anmelden",
    },
};
