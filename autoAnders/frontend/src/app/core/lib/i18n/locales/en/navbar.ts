import type { Copy } from "../../../../interfaces/types";

export const enNavbarCopy: Copy["nav"] = {
      ariaLabel: "Main navigation",
      homeAriaLabel: "Go to AutoAnders homepage",
      items: [
        {
          label: "Buy a Car",
          href: "/Catalogue",
          // children: [
          //   {
          //     label: "Available Cars",
          //     href: "/Catalogue",
          //   },
          //   {
          //     label: "Car Financing",
          //     href: "/Catalogue",
          //   },
          //   {
          //     label: "Trade-In Service",
          //     href: "/Catalogue",
          //   },
          //   { label: "Vehicle Check", href: "/Catalogue" },
          // ],
        },
        
        { label: "Sell your car", href: "/Sell" },
        { label: "FAQ", href: "/faq" },
        { label: "About Us", href: "/about" },
      ],
      contactLabel: "Contact",
      mobileMenuLabel: "Menu",
      switchLabel: "DE",
    };
