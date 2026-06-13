import type { Copy } from "../../../../interfaces/types";

export const nlNavbarCopy: Copy["nav"] = {
    ariaLabel: "Hoofdnavigatie",
    homeAriaLabel: "Ga naar AutoAnders homepage",
    items: [
      {
        label: "Auto kopen",
        href: "/Catalogue",
        // children: [
        //   {
        //     label: "Beschikbare auto's",
        //     href: "/Catalogue",
        //   },
        //   {
        //     label: "Financiering",
        //     href: "/Catalogue",
        //   },
        //   {
        //     label: "Inruilservice",
        //     href: "/Catalogue",
        //   },
        //   { label: "Voertuigcheck", href: "/Catalogue" },
        // ],
      },
      
      { label: "Auto verkopen", href: "/Sell" },
      { label: "FAQ", href: "/faq" },
      { label: "Over Ons", href: "/about" },
    ],
    contactLabel: "Contact",
    mobileMenuLabel: "Menu",
    switchLabel: "EN",
  };
