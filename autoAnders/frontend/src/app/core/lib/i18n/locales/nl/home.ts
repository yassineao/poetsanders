import type { Copy } from "../../../../interfaces/types";

export const nlHomeCopy: Copy["home"] = {
    metadata: {
      title: "Auto's kopen en verkopen | AutoAnders",
      description:
        "Bekijk gecontroleerde occasions, ontvang een eerlijk bod op uw auto en koop uw volgende voertuig met duidelijke informatie.",
      locale: "nl_NL",
      keywords: [
        "auto kopen",
        "occasion kopen",
        "auto verkopen",
        "autodealer",
        "automarkt",
        "autofinanciering",
        "auto inruilen",
        "voertuigcheck",
      ],
    },
    hero: {
      eyebrow: "Auto's kopen en verkopen met vertrouwen",
      titleFirst: "Vind uw volgende auto",
      titleSecond: "of verkoop de uwe voor een eerlijke prijs",
      description:
        "AutoAnders helpt u beschikbare auto's te vergelijken, belangrijke details te begrijpen en kopen of verkopen zonder druk af te ronden.",
      primaryCta: "Auto's bekijken",
      secondaryCta: "Auto verkopen",
      videoAlt: "Video-preview van beschikbare voertuigen bij AutoAnders",
      imageAlt: "Moderne auto via AutoAnders",
    },
    advantages: {
      eyebrow: "Uw Voordelen",
      title: "Waarom bestuurders kiezen voor AutoAnders",
      description:
        "We maken auto's kopen en verkopen duidelijker, sneller en eenvoudiger met gecontroleerde voertuigen, eerlijke biedingen en persoonlijke begeleiding.",
      items: [
        {
          value: "Meer",
          title: "Keuze",
          subtitle:
            "Vergelijk zorgvuldig geselecteerde auto's met de informatie die u nodig heeft voor uw beslissing.",
        },
        {
          value: "Eerlijke",
          title: "Prijzen",
          subtitle:
            "Krijg transparante prijzen en realistische biedingen bij kopen, verkopen of inruilen.",
        },
        {
          value: "Minder",
          title: "Stress",
          subtitle:
            "Voertuigcheck, papierwerk en begeleiding lopen met u mee van begin tot eind.",
        },
      ],
    },
    services: {
      eyebrow: "Onze Diensten",
      title: "Alles wat u nodig heeft om een auto te kopen of verkopen",
      description:
        "Bekijk beschikbare voertuigen, krijg hulp bij financiering en ontvang een eerlijk bod als u uw huidige auto wilt verkopen of inruilen.",
      cta: "Starten",
      items: [
        {
          title: "Beschikbare auto's",
          description:
            "Ontdek gecontroleerde auto's met duidelijke foto's, belangrijke details, kilometerstand, uitrusting en prijs.",
        },
        {
          title: "Financiering",
          description:
            "Vind een betalingsoptie die past bij uw budget met duidelijke begeleiding en zonder druk.",
        },
        {
          title: "Verkopen of inruilen",
          description:
            "Stuur ons uw voertuiggegevens en ontvang een eerlijk bod voor verkoop of inruil.",
        },
      ],
    },
    about: {
      eyebrow: "Over AutoAnders",
      title: "Een eenvoudigere manier om auto's te kopen en verkopen",
      paragraphs: [
        "AutoAnders is er voor bestuurders die duidelijke informatie, eerlijke prijzen en prettige begeleiding willen bij het kopen van een auto.",
        "Of u nu uw volgende auto zoekt of uw huidige voertuig wilt verkopen: wij helpen u opties te begrijpen, eerlijk te vergelijken en met vertrouwen te beslissen.",
      ],
      cta: "Neem contact op",
      more: "Meer"
    },
    scrollTexts: ["Beschikbare auto's", "Eerlijke biedingen"],
  catalogue: {
  title: "Onze voertuigen",
  subtitle: "Beschikbare auto's",
  labels: {
    vehiclesFound: "voertuigen gevonden",
    searchPlaceholder: "Zoek trefwoord",
    allBrands: "Alle merken",
    allTransmissions: "Alle transmissies",
    firstRegistrationDate: "Eerste registratie",
    maxMileage: "Maximale kilometerstand",
    maxPrice: "Maximale prijs",
    allColours: "Alle kleuren",
    allFuels: "Alle brandstoffen",
    engineCapacity: "Cilinderinhoud",
    allDoorCounts: "Aantal deuren",
    allConditions: "Nieuw / gebruikt",
    allGearCounts: "Aantal versnellingen",
    allVatOptions: "BTW",
    allVehicles: "Voertuigtype",
    searchButton: "Zoeken",
    resetButton: "Resetten",
    viewDetails: "Bekijk details",
    moreButton: "Meer",
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
      transmission: "Automaat",
      fuel: "Benzine",
      engineCapacity: 1998,
      numberOfDoors: 4,
      numberOfSeats: 4,
      condition: "Gebruikt",
      numberOfGears: 8,
      vat: "BTW aftrekbaar",
      vehicle: "Sedan",
      colour: "Zwart",
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
      transmission: "Handgeschakeld",
      fuel: "Diesel",
      engineCapacity: 1968,
      numberOfDoors: 5,
      numberOfSeats: 5,
      condition: "Gebruikt",
      numberOfGears: 6,
      vat: "BTW aftrekbaar",
      vehicle: "Stationwagen",
      colour: "Grijs",
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
      transmission: "Automaat",
      fuel: "Hybride",
      engineCapacity: 1991,
      numberOfDoors: 4,
      numberOfSeats: 5,
      condition: "Gebruikt",
      numberOfGears: 9,
      vat: "BTW aftrekbaar",
      vehicle: "Sedan",
      colour: "Wit",
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
      areaServed: ["Netherlands", "Belgium"],
      knowsAbout: [
        "Occasions",
        "Auto verkoop",
        "Auto inruilen",
        "Autofinanciering",
        "Voertuigcheck",
        "Autowaardering",
        "Autodealer",
      ],
      offerCatalogName: "Onze autoservices",
      services: [
        "Beschikbare auto's",
        "Financiering",
        "Inruilservice",
        "Voertuigcheck",
      ],
    },
  };
