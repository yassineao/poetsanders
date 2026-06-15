import type { Copy } from "../../../../interfaces/types";

export const enAuthCopy: Copy["auth"] = {
  metadata: {
    title: "Sign in | AutoAnders",
    description: "Sign in to access your AutoAnders account and services.",
    locale: "en_US",
    keywords: ["autoanders sign in", "autoanders login", "car account"],
  },
  badge: "Sign in",
  title: "Welcome back to AutoAnders",
  description: "Sign in to access your account and personalized services.",
  fields: {
    email: "Email address",
    password: "Password",
    name: "Name",
    phoneNumber: "Phone number",
  },
  placeholders: {
    email: "Enter your email address",
    password: "Enter your password",
    name: "Enter your full name",
    phoneNumber: "Enter your phone number",
  },
  consent: {
    prefix: "By signing in, you agree to our",
    terms: "Terms",
    and: "and",
    privacyPolicy: "Privacy Policy",
    suffix: ".",
  },
  submitLabel: "Sign in",
  sendingLabel: "Signing in...",
  popup: {
    successTitle: "Signed in",
    successMessage: "You have signed in successfully.",
    errorTitle: "Sign-in failed",
    errorMessage: "The email address or password is incorrect.",
    closeLabel: "Close",
  },
  loginAuth: {
    message: "Don't have an account yet?",
    buttonLabel: "Create an account",
  },
  registerAuth: {
    message: "Already have an account?",
    buttonLabel: "Sign in",
  },
};
