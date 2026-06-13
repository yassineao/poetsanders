import type { Copy } from "../../../../interfaces/types";
import { enLocaleCopy } from "./locale";
import { enNavbarCopy } from "./navbar";
import { enFooterCopy } from "./footer";
import { enHomeCopy } from "./home";
import { enFaqCopy } from "./faq";
import { enServicesCopy } from "./services";
import { enFormCopy } from "./form";
import { enPagesCopy } from "./pages";
import { enSellCopy } from "./sell";

export const enCopy: Copy = {
  localeName: enLocaleCopy,
  nav: enNavbarCopy,
  footer: enFooterCopy,
  home: enHomeCopy,
  faq: enFaqCopy,
  servicePage: enServicesCopy,
  form: enFormCopy,
  sell: enSellCopy,
  pages: enPagesCopy,
};
