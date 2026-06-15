import type { Copy } from "../../../../interfaces/types";
import { nlLocaleCopy } from "./locale";
import { nlNavbarCopy } from "./navbar";
import { nlFooterCopy } from "./footer";
import { nlHomeCopy } from "./home";
import { nlFaqCopy } from "./faq";
import { nlServicesCopy } from "./services";
import { nlFormCopy } from "./form";
import { nlPagesCopy } from "./pages";
import { nlSellCopy } from "./sell";
import { nlAuthCopy } from "./auth";

export const nlCopy: Copy = {
  localeName: nlLocaleCopy,
  nav: nlNavbarCopy,
  footer: nlFooterCopy,
  home: nlHomeCopy,
  faq: nlFaqCopy,
  servicePage: nlServicesCopy,
  form: nlFormCopy,
  sell: nlSellCopy,
  auth: nlAuthCopy,
  pages: nlPagesCopy,
};
