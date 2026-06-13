import type { Copy } from "../../../../interfaces/types";

export const deHomeCopy: Copy["home"] = {
    metadata: {
      // ✅ IMPROVED: More specific, keyword-rich title
      title: "Autos kaufen und verkaufen | AutoAnders",

      // ✅ IMPROVED: Removed "aus Deutschland", added remote positioning, more compelling
      description:
        "Finden Sie geprüfte Gebrauchtwagen, erhalten Sie faire Angebote für Ihr Auto und kaufen Sie Ihr nächstes Fahrzeug mit klaren Informationen.",

      locale: "de_DE",

      // ✅ IMPROVED: Updated keywords (removed generic ones, added specific services)
      keywords: [
        "auto kaufen",
        "gebrauchtwagen",
        "auto verkaufen",
        "autohaus",
        "fahrzeugmarkt",
        "autofinanzierung",
        "inzahlungnahme",
        "fahrzeugcheck",
      ],
    },
    hero: {
      // ✅ IMPROVED: Removed "aus Deutschland" - focus on value
      eyebrow: "Autos kaufen und verkaufen mit Vertrauen",

      titleFirst: "Finden Sie Ihr naechstes Auto",
      titleSecond: "oder verkaufen Sie Ihres zum fairen Preis",

      // ✅ IMPROVED: Removed location, added remote benefit
      description:
        "AutoAnders hilft Ihnen, verfuegbare Autos zu vergleichen, jedes wichtige Detail zu verstehen und den Kauf oder Verkauf ohne Druck abzuschliessen.",

      primaryCta: "Autos ansehen",
      secondaryCta: "Auto verkaufen",
      videoAlt: "Video-Vorschau verfuegbarer Fahrzeuge bei AutoAnders",
      imageAlt: "Modernes Auto bei AutoAnders",
    },
    advantages: {
      eyebrow: "Ihre Vorteile",
      title: "Darum entscheiden sich Fahrer fuer AutoAnders",
      description:
        "Wir machen den Autokauf und Autoverkauf klarer, schneller und einfacher - mit geprueften Fahrzeugen, fairen Angeboten und persoenlicher Unterstuetzung.",
      items: [
        {
          value: "Mehr",
          title: "Auswahl",
          subtitle:
            "Vergleichen Sie ausgewaehlte Fahrzeuge mit den Informationen, die Sie vor dem Kauf brauchen.",
        },
        {
          value: "Faire",
          title: "Preise",
          subtitle:
            "Erhalten Sie transparente Preise und realistische Angebote beim Kaufen, Verkaufen oder Tauschen.",
        },
        {
          value: "Weniger",
          title: "Stress",
          subtitle:
            "Fahrzeugcheck, Unterlagen und Beratung begleiten wir gemeinsam mit Ihnen bis zum Abschluss.",
        },
      ],
    },
    services: {
      eyebrow: "Unsere Services",
      title: "Alles, was Sie zum Kaufen oder Verkaufen eines Autos brauchen",
      description:
        "Sehen Sie verfügbare Fahrzeuge, erhalten Sie Unterstützung bei der Finanzierung und bekommen Sie ein faires Angebot für Ihr aktuelles Auto.",
      cta: "Loslegen",
      items: [
        {
          title: "Verfuegbare Autos",
          description:
            "Entdecken Sie geprüfte Fahrzeuge mit klaren Fotos, wichtigen Details, Kilometerstand, Ausstattung und Preis.",
        },
        {
          title: "Finanzierung",
          description:
            "Finden Sie eine passende Zahlungsmoeglichkeit mit verständlicher Beratung und ohne Druck.",
        },
        {
          title: "Verkaufen oder eintauschen",
          description:
            "Senden Sie uns Ihre Fahrzeugdaten und erhalten Sie ein faires Angebot für Verkauf oder Inzahlungnahme.",
        },
      ],
    },
    about: {
      eyebrow: "Über AutoAnders",
      title: "Der einfachere Weg, Autos zu kaufen und zu verkaufen",

      // ✅ IMPROVED: Added remote positioning, removed generic filler
      paragraphs: [
        "AutoAnders ist für Fahrer gemacht, die beim Autokauf klare Informationen, faire Preise und eine angenehme Beratung wollen.",
        "Ob Sie Ihr nächstes Auto suchen oder Ihr aktuelles Fahrzeug verkaufen möchten: Wir helfen Ihnen, Optionen zu verstehen, fair zu vergleichen und sicher zu entscheiden.",
      ],

      cta: "Kontakt aufnehmen",
      more: "Mehr"
    },
    scrollTexts: ["Verfuegbare Autos", "Faire Angebote"],
    catalogue: {
      title: "Unsere Fahrzeuge",
      subtitle: "Verfügbare Autos",
      labels: {
        vehiclesFound: "Fahrzeuge gefunden",
        searchPlaceholder: "Keyword suchen",
        allBrands: "Alle Marken",
        allTransmissions: "Alle Getriebe",
        firstRegistrationDate: "Erstzulassung",
        maxMileage: "Max. Kilometerstand",
        maxPrice: "Maximaler Preis",
        allColours: "Alle Farben",
        allFuels: "Alle Kraftstoffe",
        engineCapacity: "Hubraum",
        allDoorCounts: "Anzahl Tueren",
        allConditions: "Neu / Gebraucht",
        allGearCounts: "Anzahl Gaenge",
        allVatOptions: "MwSt.",
        allVehicles: "Fahrzeugart",
        searchButton: "Suchen",
        resetButton: "Zuruecksetzen",
        viewDetails: "Details ansehen",
        moreButton: "Mehr",
      },
      cars: [
        {
          id: 1,
          brand: "BMW",
          model: "320i",
          price: 24950,
          year: 2019,
          firstRegistrationDate: "03/2019",
          mileage: 82000,
          transmission: "Automatik",
          fuel: "Benzin",
          engineCapacity: 1998,
          numberOfDoors: 4,
          numberOfSeats: 4,
          condition: "Gebraucht",
          numberOfGears: 8,
          vat: "MwSt. ausweisbar",
          vehicle: "Limousine",
          colour: "Schwarz",
          image: "/cars/BMW.jpg",
          tags: {
            de: ["Navigation", "Leder", "Garantie"],
            en: ["Navigation", "Leather", "Warranty"],
            nl: ["Navigatie", "Leder", "Garantie"],
          },
        },
        {
          id: 2,
          brand: "Audi",
          model: "A4 Avant",
          price: 21750,
          year: 2018,
          firstRegistrationDate: "07/2018",
          mileage: 96000,
          transmission: "Schaltung",
          fuel: "Diesel",
          engineCapacity: 1968,
          numberOfDoors: 5,
          numberOfSeats: 5,
          condition: "Gebraucht",
          numberOfGears: 6,
          vat: "MwSt. ausweisbar",
          vehicle: "Kombi",
          colour: "Grau",
          image: "/cars/audi.jpg",
          tags: {
            de: ["LED", "Kamera", "Tempomat"],
            en: ["LED", "Camera", "Cruise Control"],
            nl: ["LED", "Camera", "Cruise control"],
          },
        },
        {
          id: 3,
          brand: "Mercedes",
          model: "C-Klasse",
          price: 29900,
          year: 2020,
          firstRegistrationDate: "11/2020",
          mileage: 61000,
          transmission: "Automatik",
          fuel: "Hybrid",
          engineCapacity: 1991,
          numberOfDoors: 4,
          numberOfSeats: 5,
          condition: "Gebraucht",
          numberOfGears: 9,
          vat: "MwSt. ausweisbar",
          vehicle: "Limousine",
          colour: "Weiss",
          image: "/cars/mercedes.jpg",
          tags: {
            de: ["AMG Line", "PDC", "Sitzheizung"],
            en: ["AMG Line", "PDC", "Heated Seats"],
            nl: ["AMG Line", "PDC", "Stoelverwarming"],
          },
        },
      ],
    },
    seo: {
      // ✅ IMPROVED: Updated for schema (consistent with metadata)
      areaServed: ["Germany", "Austria", "Switzerland"],
      knowsAbout: [
        "Gebrauchtwagen",
        "Autoverkauf",
        "Inzahlungnahme",
        "Autofinanzierung",
        "Fahrzeugcheck",
        "Fahrzeugbewertung",
        "Autohaus",
      ],
      offerCatalogName: "Unsere Auto-Services",
      services: [
        "Verfuegbare Autos",
        "Finanzierung",
        "Inzahlungnahme",
        "Fahrzeugcheck",
      ],
    },

  };
