import type { Copy } from "../../../../interfaces/types";

export const deFormCopy: Copy["form"] = {
    metadata: {
      // ✅ IMPROVED: More action-oriented title
      title: "Kontakt AutoAnders | Auto kaufen oder verkaufen",

      description:
        "Kontaktieren Sie AutoAnders fuer Fragen zu Fahrzeugen, Autoverkauf, Inzahlungnahme, Finanzierung oder einem fairen Angebot.",

      locale: "de_DE",

      keywords: [
        "autoanders kontakt",
        "auto kaufen anfrage",
        "auto verkaufen anfrage",
        "inzahlungnahme anfragen",
        "autofinanzierung beratung",
      ],
    },
    content: {
      title: "Kontakt aufnehmen",

      // ✅ IMPROVED: Fixed typo "Gespraech" → "Gespräch"
      description:
        "Sie haben eine Frage zu einem Fahrzeug, zum Verkauf Ihres Autos oder zur Finanzierung? Unser Team hilft Ihnen gerne weiter.",

      fields: {
        companyName: "Fahrzeug oder Thema",
        lastName: "Nachname",
        email: "E-Mail",
        phoneNumber: "Telefonnummer",
        message: "Nachricht",
      },
      placeholders: {
        companyName: "BMW 320i, Inzahlungnahme, Finanzierung...",
        lastName: "Mustermann",
        email: "hallo@unternehmen.de",
        phoneNumber: "+49 123 456789",

        // ✅ IMPROVED: Fixed typo "Erzaehlen" → "Erzählen"
        message: "Erzählen Sie uns, welches Auto Sie interessiert oder welches Fahrzeug Sie verkaufen möchten",
      },
      consent: {
        prefix: "Sie stimmen unseren",
        terms: "Bedingungen",
        and: "und der",

        // ✅ IMPROVED: Fixed typo "Datenschutzerklaerung" → "Datenschutzerklärung"
        privacyPolicy: "Datenschutzerklärung",
        suffix: "zu.",
      },
      submitLabel: "Nachricht senden",
      popup: {
        successTitle: "Nachricht gesendet",
        successMessage: "Vielen Dank. Ihre Nachricht wurde gesendet. Pruefen Sie Ihre E-Mail.",
        errorTitle: "Nachricht nicht gesendet",
        errorMessage: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
        closeLabel: "OK",
      },
      testimonial: {
        quote:
          "Eine gute Autoentscheidung beginnt mit klaren Informationen, fairen Preisen und jemandem, der Ihre Fragen ernst nimmt.",
        author: "AutoAnders Team",
        imageAlt: "Auto im Hintergrund des Kontaktformulars",
        imageUrl: "/hero.jpg",
      },
    },
    seo: {
      areaServed: ["Germany", "Austria", "Switzerland"],
      knowsAbout: [
        "Gebrauchtwagen",
        "Autoverkauf",
        "Inzahlungnahme",
        "Autofinanzierung",
      ],
      offerCatalogName: "Kontakt und Fahrzeugberatung",
      services: [
        "Fahrzeuganfrage",
        "Auto verkaufen",
        "Inzahlungnahme",
        "Finanzierung",
      ],
    },
  };
