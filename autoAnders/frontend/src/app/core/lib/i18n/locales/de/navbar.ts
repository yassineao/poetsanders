import type { Copy } from "../../../../interfaces/types";

export const deNavbarCopy: Copy["nav"] = {
    ariaLabel: "Hauptnavigation",
    homeAriaLabel: "Zur Startseite von AutoAnders",
    items: [
      {
          label: "Auto kaufen",
          href: "/Catalogue",
        // children: [
        //   {
        //     label: "Verfuegbare Autos",
        //     href: "/Catalogue",
        //   },
        //   {
        //     label: "Finanzierung",
        //     href: "/Catalogue",
        //   },
        //   {
        //     label: "Inzahlungnahme",
        //     href: "/Catalogue",
        //   },
        //   { label: "Fahrzeugcheck", href: "/Catalogue" },
        // ],
      },
     
      { label: "Auto verkaufen", href: "/Sell" },
       { label: "FAQ", href: "/faq" },
      { label: "Über uns", href: "/about" },
    ],
    contactLabel: "Kontakt",
    mobileMenuLabel: "Menü",
    switchLabel: "EN",
  };
