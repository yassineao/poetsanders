import type { Copy } from "../../../../interfaces/types";

export const enProfileCopy: Copy["profile"] = {
  eyebrow: "Account",
  title: "Your profile",
  description: "Review your account details and update the information we use to contact you.",
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email" },
    { name: "phoneNumber", label: "Phone number", type: "tel" },
    { name: "password", label: "New password", type: "password", minLength: 8 },
  ],
  submitLabel: "Save changes",
  sendingLabel: "Saving...",
  editLabel: "Edit profile",
  cancelEditLabel: "Stop editing",
  logoutLabel: "Log out",
  readOnlyHint: "Editing is off. Click edit to make changes.",
  popup: {
    successTitle: "Profile updated",
    successMessage: "Your profile details were saved.",
    errorTitle: "Update failed",
    errorMessage: "Something went wrong. Please try again.",
    closeLabel: "OK",
  },
};
