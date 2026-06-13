import type { Copy } from "../../../../interfaces/types";

export const deFooterCopy: Copy["footer"] = {
    tagline: "Autos finden, kaufen oder verkaufen - einfach und transparent.",
    navigationTitle: "Navigation",
    servicesTitle: "Autos",
    contactTitle: "Kontakt",
    navigationLinks: [
      { label: "Startseite", href: "/" }, // ✅ Fixed: was "#home"
      { label: "Vorteile", href: "/advantages" },
      { label: "Auto kaufen", href: "/Catalogue" },
      { label: "Über uns", href: "/about" },
    ],
    serviceLinks: [
      { label: "Verfuegbare Autos", href: "/Catalogue" },
      { label: "Finanzierung", href: "/Catalogue" },
      { label: "Inzahlungnahme", href: "/Catalogue" },
      { label: "Fahrzeugcheck", href: "/Catalogue" },
    ],
    contactLinks: [
      { label: "Auto verkaufen", href: "/form" },
      { label: "Angebot anfragen", href: "/form" },
      { label: "Autos ansehen", href: "#services" },
    ],
    rights: "Alle Rechte vorbehalten.",
    legalLinks: [
      { label: "Datenschutz", href: "/privacy" }, // ✅ Fixed: was "#about-us"
      { label: "Impressum", href: "/impressum" }, // ✅ Fixed: was "#about-us"
      { label: "Bedingungen", href: "/terms" },
      { label: "Cookies", href: "/cookie" },
    ],
  };
