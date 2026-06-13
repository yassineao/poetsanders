import type { Copy } from "../../../../interfaces/types";

export const enServicesCopy: Copy["servicePage"] = {
      metadata: {
        title: "Car Services | Buy, Finance, Trade In | AutoAnders",
        description:
          "Discover our car services: available vehicles, financing support, trade-in offers, and transparent vehicle checks.",
        locale: "en_US",
        keywords: [
          "buy used car",
          "car financing",
          "trade in car",
          "sell my car",
          "vehicle check",
          "used car dealer",
        ],
      },
      overview: {
        hero: {
          eyebrow: "Our Car Services",
          title:
            "Everything around your next car in one place",
          description:
            "Explore how AutoAnders helps you find the right vehicle, finance it clearly, or sell your current car for a fair price.",
          primaryCta: "Browse Cars",
        },
        cards: {
          eyebrow: "Explore Options",
          description:
            "Choose what you need next and see how we support you through the car buying or selling process.",
          imageAlts: {
            "available-cars":
              "Illustration for available cars",
            financing: "Illustration for car financing",
            tradein:
              "Illustration for trade-in service",
            "vehicle-check": "Illustration for vehicle check",
          },
        },
      },
      hero: {
        "available-cars": {
          imageUrl: "/hero.jpg",
          badge: "Available Cars",
          title: "Find a car that fits your life",
          description:
            "Browse selected vehicles with clear details, transparent pricing, and support from the first question to the handover.",
          primaryCta: "Browse Cars",
          secondaryCta: "Learn More",
          imageAlt: "Available car from AutoAnders",
        },
        financing: {
          badge: "Car Financing",
          imageUrl: "/hero.jpg",
          title: "Financing options explained clearly",
          description:
            "We help you understand possible payment options and the information needed to move forward confidently.",
          primaryCta: "Ask About Financing",
          secondaryCta: "View Cars",
          imageAlt: "Car financing support at AutoAnders",
        },
        tradein: {
          imageUrl: "/hero.jpg",
          badge: "Trade-In Service",
          title: "Trade in or sell your car without stress",
          description:
            "Share your vehicle details and receive a realistic offer based on condition, mileage, and current market demand.",
          primaryCta: "Request an Offer",
          secondaryCta: "How It Works",
          imageAlt: "Trade-in service from AutoAnders",
        },
        "vehicle-check": {
          imageUrl: "/hero.jpg",
          badge: "Vehicle Check",
          title: "Know the important details before you buy",
          description:
            "We present vehicle information clearly, including condition, mileage, equipment, and the details that matter most.",
          primaryCta: "Check Vehicles",
          secondaryCta: "Learn More",
          imageAlt: "Vehicle check at AutoAnders",
        },
      },
      features: {
        badge: "Why AutoAnders",
        title: "A better car decision starts with clear information.",
        description:
          "From the first search to the final handover, we keep the process transparent, practical, and focused on the right vehicle for you.",
        items: [
          {
            title: "Clear Vehicle Details",
            description:
              "See the key information you need before arranging a viewing or making a decision.",
            imageAlt: "Clear vehicle details",
            statLabel: "100%",
          },
          {
            title: "Fair Offers",
            description:
              "Get realistic pricing when buying, selling, or trading in your current vehicle.",
            imageAlt: "Fair car valuation process",
          },
          {
            title: "Simple Process",
            description:
              "We help with questions, paperwork, appointments, and the next step at the right time.",
            imageAlt: "Simple car buying process",
          },
        ],
        sections: [
          {
            title: "Choose your next car confidently",
            points: [
              "Compare cars by price, mileage, condition, and equipment",
              "Ask questions before arranging a viewing",
              "Understand what matters for your budget and daily use",
              "Review available information before making a decision",
              "Plan the next step with personal support",
              "Avoid pressure and unclear promises",
              "Keep the process simple from search to handover",
              "Get transparent answers about the vehicle",
              "Move forward only when the car feels right",
            ],
          },
          {
            title: "Sell or trade in without confusion",
            points: [
              "Send the most important details about your car",
              "Share mileage, condition, documents, and photos",
              "Receive a realistic first estimate",
              "Clarify the final offer after inspection",
              "Use the value toward your next vehicle",
              "Understand every step before you commit",
              "Reduce back-and-forth with a clear process",
              "Prepare documents before handover",
              "Sell with less time and less stress",
            ],
          },
          {
            title: "Understand the vehicle before buying",
            points: [
              "Review mileage, equipment, and condition details",
              "Ask about service history when available",
              "Check what is included with the vehicle",
              "Discuss financing or payment options",
              "Arrange a viewing or test drive",
              "Know which documents are needed",
              "Get support before signing anything",
              "Make decisions based on facts",
              "Drive away with confidence",
              
            ],
          },
        ],
      },
      hero2: {
        badge: "Why AutoAnders?",
        title: "Buying or selling a car should feel clear from the first step.",
        description:
          "Every driver, budget, and vehicle is different. That's why we take the time to explain options clearly and help you choose the path that fits.",
        subtitle: "Let's find the right car solution together.",
        subdescription:
          "Whether you want to buy, sell, trade in, or ask about financing, AutoAnders keeps the process practical and transparent.",
        imageAlt: "Car details in the background",
        imageUrl: "/hero.jpg",
      },
      seo: {
        areaServed: ["Germany", "Europe", "International"],
        knowsAbout: [
          "Used Cars",
          "Car Financing",
          "Trade-In Service",
          "Vehicle Inspection",
          "Car Valuation",
          "Car Sales",
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
