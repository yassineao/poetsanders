import type { Copy } from "../../../../interfaces/types";

export const nlFormCopy: Copy["form"] = {
    metadata: {
      title: "Contact AutoAnders | Auto kopen of verkopen",
      description:
        "Neem contact op met AutoAnders voor vragen over auto's, verkoop, inruil, financiering of een eerlijke waardering.",
      locale: "nl_NL",
      keywords: [
        "contact autoanders",
        "auto kopen aanvraag",
        "auto verkopen aanvraag",
        "auto inruilen",
        "autofinanciering advies",
      ],
    },
    content: {
      title: "Contact Opnemen",
      description:
        "Heeft u een vraag over een voertuig, uw auto verkopen of financiering? Ons team helpt u graag verder.",
      fields: {
        companyName: "Voertuig of onderwerp",
        lastName: "Achternaam",
        email: "E-mail",
        phoneNumber: "Telefoonnummer",
        message: "Bericht",
      },
      placeholders: {
        companyName: "BMW 320i, inruil, financiering...",
        lastName: "Janssen",
        email: "hallo@bedrijf.nl",
        phoneNumber: "+31 6 12345678",
        message: "Vertel ons welke auto u interessant vindt of welk voertuig u wilt verkopen",
      },
      consent: {
        prefix: "U gaat akkoord met onze",
        terms: "Voorwaarden",
        and: "en het",
        privacyPolicy: "Privacybeleid",
        suffix: ".",
      },
      submitLabel: "Bericht Versturen",
      popup: {
        successTitle: "Bericht verzonden",
        successMessage: "Bedankt. Uw bericht is verzonden. Controleer uw e-mail.",
        errorTitle: "Bericht niet verzonden",
        errorMessage: "Er is iets misgegaan. Probeer het opnieuw.",
        closeLabel: "OK",
      },
      testimonial: {
        quote:
          "Een goede autobeslissing begint met duidelijke informatie, eerlijke prijzen en iemand die uw vragen serieus neemt.",
        author: "AutoAnders Team",
        imageAlt: "Auto op de achtergrond van het contactformulier",
        imageUrl: "/hero.jpg",
      },
    },
    seo: {
      areaServed: ["Netherlands", "Belgium"],
      knowsAbout: [
        "Occasions",
        "Auto verkopen",
        "Auto inruilen",
        "Autofinanciering",
      ],
      offerCatalogName: "Contact en voertuigadvies",
      services: [
        "Voertuigaanvraag",
        "Auto verkopen",
        "Auto inruilen",
        "Financiering",
      ],
    },
  };
