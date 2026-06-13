import type { Copy } from "../../../../interfaces/types";

export const enSellCopy: Copy["sell"] = {
  eyebrow: "Sell your car",
  title: "Send vehicle details",
  description:
    "Share the key details of your car. We will contact you with a fair estimate.",
  fields: [
    { name: "firstName", label: "First name", type: "text", required: true },
    { name: "lastName", label: "Last name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "brand", label: "Brand", type: "text", required: true },
    { name: "model", label: "Model", type: "text", required: true },
    { name: "mileage", label: "Mileage", type: "number", required: true },
    { name: "price", label: "Expected price", type: "number" },
  ],
  textarea: { name: "message", label: "Message", rows: 5 },
  submitLabel: "Send request",
  sendingLabel: "Sending...",
  popup: {
    successTitle: "Request sent",
    successMessage: "Thank you. We will contact you as soon as possible.",
    errorTitle: "Request not sent",
    errorMessage: "Something went wrong. Please try again.",
    closeLabel: "OK",
  },
};
