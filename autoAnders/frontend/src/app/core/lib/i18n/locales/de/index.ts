import type { Copy } from "../../../../interfaces/types";
import { deLocaleCopy } from "./locale";
import { deNavbarCopy } from "./navbar";
import { deFooterCopy } from "./footer";
import { deHomeCopy } from "./home";
import { deFaqCopy } from "./faq";
import { deServicesCopy } from "./services";
import { deFormCopy } from "./form";
import { dePagesCopy } from "./pages";
import { deSellCopy } from "./sell";
import { deAuthCopy } from "./auth";

export const deCopy: Copy = {
  localeName: deLocaleCopy,
  nav: deNavbarCopy,
  footer: deFooterCopy,
  home: deHomeCopy,
  faq: deFaqCopy,
  servicePage: deServicesCopy,
  form: deFormCopy,
  sell: deSellCopy,
  auth: deAuthCopy,
  pages: dePagesCopy,
};
