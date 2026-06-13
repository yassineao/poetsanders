import type { Copy } from "../../../../interfaces/types";

export const deServicesCopy: Copy["servicePage"] = {
    metadata: {
      // ✅ IMPROVED: More specific, keyword-rich
      title: "Autoservices | Kaufen, verkaufen, finanzieren | AutoAnders",

      // ✅ IMPROVED: Better flow, removed "fuer" typo
      description:
        "Entdecken Sie die AutoAnders Services: gepruefte Gebrauchtwagen, Auto verkaufen, Inzahlungnahme, Finanzierung und transparente Fahrzeugchecks.",

      locale: "de_DE",

      keywords: [
        "autoservices",
        "gebrauchtwagen kaufen",
        "auto verkaufen",
        "auto inzahlung geben",
        "autofinanzierung",
        "fahrzeugcheck",
        "autohaus",
      ],
    },
    overview: {
      hero: {
        eyebrow: "Unsere Auto-Services",
        title:
          "Alles rund um Ihr naechstes Auto an einem Ort",
        description:
          "Entdecken Sie, wie AutoAnders Ihnen hilft, das passende Fahrzeug zu finden, klar zu finanzieren oder Ihr aktuelles Auto fair zu verkaufen.",
        primaryCta: "Autos ansehen",
      },
      cards: {
        eyebrow: "Optionen entdecken",
        description:
          "Waehlen Sie, was Sie als Naechstes brauchen, und sehen Sie, wie wir Sie beim Kaufen, Verkaufen oder Inzahlunggeben unterstuetzen.",
        imageAlts: {
          "available-cars":
            "Illustration fuer verfuegbare Autos",
          financing: "Illustration fuer Autofinanzierung",
          tradein:
            "Illustration fuer Inzahlungnahme",
          "vehicle-check": "Illustration fuer Fahrzeugcheck",
        },
      },
    },
    hero: {
      "available-cars": {
        imageUrl: "/hero.jpg",
        badge: "Verfuegbare Autos",
        title: "Finden Sie einen geprueften Gebrauchtwagen, der zu Ihnen passt",
        description:
          "Sehen Sie verfuegbare Autos mit klaren Fotos, Kilometerstand, Ausstattung und transparenten Preisen.",
        primaryCta: "Autos ansehen",
        secondaryCta: "Mehr erfahren",
        imageAlt: "Verfuegbare Autos bei AutoAnders",
      },
      financing: {
        badge: "Finanzierung",
        imageUrl: "/hero.jpg",
        title: "Finanzierung mit klaren Bedingungen",
        description:
          "Wir helfen Ihnen, eine passende Zahlungsoption zu finden, die zu Ihrem Budget passt.",
        primaryCta: "Beratung anfragen",
        secondaryCta: "Mehr erfahren",
        imageAlt: "Autofinanzierung bei AutoAnders",
      },
      tradein: {
        imageUrl: "/hero.jpg",
        badge: "Inzahlungnahme",
        title: "Geben Sie Ihr aktuelles Auto einfach in Zahlung",
        description:
          "Senden Sie uns Ihre Fahrzeugdaten und erhalten Sie ein faires Angebot fuer Verkauf oder Inzahlungnahme.",
        primaryCta: "Angebot anfragen",
        secondaryCta: "Auto verkaufen",
        imageAlt: "Auto in Zahlung geben bei AutoAnders",
      },
      "vehicle-check": {
        imageUrl: "/hero.jpg",
        badge: "Fahrzeugcheck",
        title: "Klare Informationen, bevor Sie entscheiden",
        description:
          "Wir pruefen wichtige Fahrzeugdaten, damit Sie mit Vertrauen kaufen koennen.",
        primaryCta: "Fahrzeuge ansehen",
        secondaryCta: "Kontakt aufnehmen",
        imageAlt: "Fahrzeugcheck bei AutoAnders",
      },
    },
    features: {
      badge: "Warum AutoAnders",
      title: "Eine bessere Autoentscheidung beginnt mit klaren Informationen.",
      description:
        "Von der ersten Suche bis zur Uebergabe halten wir den Prozess transparent, praktisch und auf das passende Fahrzeug fuer Sie ausgerichtet.",

      items: [
        {
          title: "Klare Fahrzeugdetails",
          description:
            "Sehen Sie die wichtigsten Informationen, bevor Sie eine Besichtigung planen oder entscheiden.",
          imageAlt: "Klare Fahrzeugdetails",
          statLabel: "100%",
        },
        {
          title: "Faire Angebote",
          description:
            "Erhalten Sie realistische Preise beim Kaufen, Verkaufen oder Inzahlunggeben Ihres aktuellen Fahrzeugs.",
          imageAlt: "Faire Fahrzeugbewertung",
        },
        {
          title: "Einfacher Ablauf",
          description:
            "Wir helfen bei Fragen, Unterlagen, Terminen und dem naechsten Schritt zur richtigen Zeit.",
          imageAlt: "Einfacher Autokauf-Prozess",
        },
      ],
      sections: [
        {
          title: "Waehlen Sie Ihr naechstes Auto mit Vertrauen",
          points: [
            "Vergleichen Sie Autos nach Preis, Kilometerstand, Zustand und Ausstattung",
            "Stellen Sie Fragen, bevor Sie eine Besichtigung planen",
            "Verstehen Sie, was fuer Budget und Alltag wichtig ist",
            "Pruefen Sie vorhandene Informationen vor der Entscheidung",
            "Planen Sie den naechsten Schritt mit persoenlicher Unterstuetzung",
            "Vermeiden Sie Druck und unklare Versprechen",
            "Halten Sie den Prozess von Suche bis Uebergabe einfach",
            "Erhalten Sie transparente Antworten zum Fahrzeug",
            "Gehen Sie erst weiter, wenn das Auto wirklich passt",
          ],
        },
        {
          title: "Verkaufen oder in Zahlung geben ohne Verwirrung",
          points: [
            "Senden Sie die wichtigsten Daten zu Ihrem Auto",
            "Teilen Sie Kilometerstand, Zustand, Dokumente und Fotos",
            "Erhalten Sie eine realistische erste Einschaetzung",
            "Klaeren Sie das finale Angebot nach der Pruefung",
            "Nutzen Sie den Wert fuer Ihr naechstes Fahrzeug",
            "Verstehen Sie jeden Schritt, bevor Sie zusagen",
            "Reduzieren Sie Rueckfragen durch einen klaren Ablauf",
            "Bereiten Sie Unterlagen vor der Uebergabe vor",
            "Verkaufen Sie mit weniger Zeitaufwand und weniger Stress",
          ],
        },
        {
          title: "Verstehen Sie das Fahrzeug vor dem Kauf",
          points: [
            "Pruefen Sie Kilometerstand, Ausstattung und Zustand",
            "Fragen Sie nach Servicehistorie, wenn vorhanden",
            "Klaeren Sie, was beim Fahrzeug enthalten ist",
            "Besprechen Sie Finanzierung oder Zahlungsoptionen",
            "Vereinbaren Sie Besichtigung oder Probefahrt",
            "Wissen Sie, welche Dokumente benoetigt werden",
            "Erhalten Sie Unterstuetzung vor der Unterschrift",
            "Treffen Sie Entscheidungen auf Basis von Fakten",
            "Fahren Sie mit Vertrauen los",
          ],
        },
      ],
    },
    hero2: {
      badge: "Warum AutoAnders?",
      title: "Ein Auto zu kaufen oder zu verkaufen sollte vom ersten Schritt an klar sein.",
      description:
        "Jeder Fahrer, jedes Budget und jedes Fahrzeug ist anders. Deshalb nehmen wir uns Zeit, Optionen verstaendlich zu erklaeren und den passenden Weg zu finden.",
      subtitle: "Lassen Sie uns gemeinsam die richtige Auto-Loesung finden.",
      subdescription:
        "Ob Sie kaufen, verkaufen, in Zahlung geben oder Finanzierung besprechen moechten: AutoAnders haelt den Ablauf praktisch und transparent.",
      imageAlt: "Fahrzeugdetails im Hintergrund",
      imageUrl: "/hero.jpg",
    },
    seo: {
      areaServed: ["Germany", "Austria", "Switzerland"],
      knowsAbout: [
        "Gebrauchtwagen",
        "Autoverkauf",
        "Inzahlungnahme",
        "Autofinanzierung",
        "Fahrzeugcheck",
      ],
      offerCatalogName: "AutoAnders Autoservices",
      services: [
        "Verfuegbare Autos",
        "Auto verkaufen",
        "Inzahlungnahme",
        "Finanzierung",
      ],
    },
  };
