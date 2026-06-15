export interface RegisterCopy {
  eyebrow: string;
  heading: string;
  description: string;
  formHeading: string;
  formDescription: string;
  emailLabel: string;
  passwordLabel: string;
  retypePasswordLabel: string;
  nameLabel: string;
  phoneLabel: string;
  showPassword: string;
  hidePassword: string;
  submitLabel: string;
  submittingLabel: string;
  requiredMessage: string;
  invalidEmailMessage: string;
  passwordLengthMessage: string;
  passwordPatternMessage: string;
  invalidCredentialsMessage: string;
  unavailableMessage: string;
  passwordMismatchMessage: string;
  successHeading: string;
  successMessage: string;
  supportHeading: string;
  supportMessage: string;
  supportLinkLabel: string;
  registerAuth?: {
    message: string;
    buttonLabel: string;
  };
}
