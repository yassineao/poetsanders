import type { Copy } from "../../../../interfaces/types";

export const enHomeCopy: Copy["home"] = {
      metadata: {
        title: "Buy and Sell Cars | Trusted Vehicle Marketplace | AutoAnders",
        description:
          "Browse inspected cars, request a fair trade-in offer, and buy your next vehicle with clear pricing and personal support.",
        locale: "en_US",
        keywords: [
          "buy car",
          "used cars",
          "sell my car",
          "car dealership",
          "vehicle marketplace",
          "car financing",
          "trade in car",
          "inspected cars",
        ],
      },
      hero: {
        eyebrow: "Buy and sell cars with confidence",
        titleFirst: "Find your next car",
        titleSecond: "or sell yours for a fair price",
        description:
          "AutoAnders helps you compare available cars, understand every detail, and complete the buying or selling process without pressure.",
        primaryCta: "Browse Cars",
        secondaryCta: "Sell Your Car",
        videoAlt: "Video preview of vehicles available at AutoAnders",
        imageAlt: "Modern car available through AutoAnders",
      },
      advantages: {
        eyebrow: "Your Benefits",
        title: "Why drivers choose AutoAnders",
        description:
          "We make buying and selling cars clearer, faster, and easier with inspected vehicles, fair offers, and support at every step.",
        items: [
          {
            value: "More",
            title: "Choice",
            subtitle:
              "Compare carefully selected cars with the details you need before you visit or buy.",
          },
          {
            value: "Fair",
            title: "Prices",
            subtitle:
              "Get transparent pricing and realistic offers when buying, selling, or trading in.",
          },
          {
            value: "Less",
            title: "Stress",
            subtitle:
              "Vehicle checks, paperwork, and guidance are handled with you from start to finish.",
          },
        ],
      },
      services: {
        eyebrow: "Our Services",
        title: "Everything you need to buy or sell a car",
        description:
          "Browse available vehicles, get support with financing, and receive a fair offer if you want to sell or trade in your current car.",
        cta: "Get Started",
        items: [
          {
            title: "Available Cars",
            description:
              "Explore inspected cars with clear photos, key details, mileage, equipment, and pricing.",
          },
          {
            title: "Car Financing",
            description:
              "Find a payment option that fits your budget with straightforward guidance and no pressure.",
          },
          {
            title: "Sell or Trade In",
            description:
              "Send us your vehicle details and receive a fair offer for selling or trading in your car.",
          },
        ],
      },
      about: {
        eyebrow: "About AutoAnders",
        title: "A simpler way to buy and sell cars",
        paragraphs: [
          "AutoAnders is built for drivers who want a clear, honest, and comfortable car buying experience. We focus on inspected vehicles, transparent information, and personal support.",
          "Whether you are looking for your next car or want to sell your current one, we help you understand the options, compare fairly, and move forward with confidence.",
        ],
        cta: "Talk to Us",
        more: "More"
      },
      scrollTexts: ["Available Cars", "Fair Offers"],
      catalogue: {
  title: "Our Vehicles",
  subtitle: "Available Cars",
  labels: {
    vehiclesFound: "vehicles found",
    searchPlaceholder: "Search keyword",
    allBrands: "All brands",
    allTransmissions: "All transmissions",
    firstRegistrationDate: "First registration",
    maxMileage: "Maximum mileage",
    maxPrice: "Maximum price",
    allColours: "All colours",
    allFuels: "All fuels",
    engineCapacity: "Engine capacity",
    allDoorCounts: "Number of doors",
    allConditions: "New / used",
    allGearCounts: "Number of gears",
    allVatOptions: "VAT",
    allVehicles: "Vehicle type",
    searchButton: "Search",
    resetButton: "Reset",
    viewDetails: "View details",
    moreButton: "More",
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
      transmission: "Automatic",
      fuel: "Petrol",
      engineCapacity: 1998,
      numberOfDoors: 4,
      numberOfSeats: 4,
      condition: "Used",
      numberOfGears: 8,
      vat: "VAT deductible",
      vehicle: "Saloon",
      colour: "Black",
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
      transmission: "Manual",
      fuel: "Diesel",
      engineCapacity: 1968,
      numberOfDoors: 5,
      numberOfSeats: 5,
      condition: "Used",
      numberOfGears: 6,
      vat: "VAT deductible",
      vehicle: "Estate",
      colour: "Grey",
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
      model: "C-Class",
      price: 29900,
      year: 2020,
      firstRegistrationDate: "11/2020",
      mileage: 61000,
      transmission: "Automatic",
      fuel: "Hybrid",
      engineCapacity: 1991,
      numberOfDoors: 4,
      numberOfSeats: 5,
      condition: "Used",
      numberOfGears: 9,
      vat: "VAT deductible",
      vehicle: "Saloon",
      colour: "White",
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
        areaServed: ["Germany", "Europe", "International"],
        knowsAbout: [
          "Used Cars",
          "Vehicle Sales",
          "Car Trade-In",
          "Car Financing",
          "Vehicle Inspection",
          "Car Valuation",
          "Car Dealership",
        ],
        offerCatalogName: "Our Car Services",
        services: [
          "Available Cars",
          "Car Financing",
          "Trade-In Service",
          "Vehicle Check",
        ],
      },
    };
