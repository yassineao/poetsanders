import type { Copy } from "../../../../interfaces/types";

export const nlFooterCopy: Copy["footer"] = {
    tagline: "Vind, koop of verkoop uw volgende auto met vertrouwen.",
    navigationTitle: "Navigatie",
    servicesTitle: "Auto's",
    contactTitle: "Contact",
    navigationLinks: [
      { label: "Home", href: "/" },
      { label: "Voordelen", href: "/advantages" },
      { label: "Auto kopen", href: "/Catalogue" },
      { label: "Over Ons", href: "/about" },
    ],
    serviceLinks: [
      { label: "Beschikbare auto's", href: "/Catalogue" },
      { label: "Financiering", href: "/Catalogue" },
      { label: "Inruilservice", href: "/Catalogue" },
      { label: "Voertuigcheck", href: "/Catalogue" },
    ],
    contactLinks: [
      { label: "Auto verkopen", href: "/form" },
      { label: "Bod aanvragen", href: "/form" },
      { label: "Auto's bekijken", href: "#services" },
    ],
    rights: "Alle rechten voorbehouden.",
    legalLinks: [
      { label: "Privacy", href: "/privacy" },
      { label: "Colofon", href: "/impressum" },
      { label: "Voorwaarden", href: "/terms" },
      { label: "Cookies", href: "/cookie" },
    ],
  };
