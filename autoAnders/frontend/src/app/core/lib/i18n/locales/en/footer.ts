import type { Copy } from "../../../../interfaces/types";

export const enFooterCopy: Copy["footer"] = {
      tagline: "Find, buy, or sell your next car with confidence.",
      navigationTitle: "Navigation",
      servicesTitle: "Cars",
      contactTitle: "Contact",
      navigationLinks: [
        { label: "Home", href: "/" },
        { label: "Benefits", href: "/advantages" },
        { label: "Buy a Car", href: "/Catalogue" },
        { label: "About Us", href: "/about" },
      ],
      serviceLinks: [
        { label: "Available Cars", href: "/Catalogue" },
        { label: "Car Financing", href: "/Catalogue" },
        { label: "Trade-In Service", href: "/Catalogue" },
        { label: "Vehicle Check", href: "/Catalogue" },
      ],
      contactLinks: [
        { label: "Sell Your Car", href: "/form" },
        { label: "Request an Offer", href: "/form" },
        { label: "Browse Cars", href: "#services" },
      ],
      rights: "All rights reserved.",
      legalLinks: [
        { label: "Privacy", href: "/privacy" },
        { label: "Legal Notice", href: "/impressum" },
        { label: "Terms", href: "/terms" },
        { label: "Cookies", href: "/cookie" },
      ],
    };
