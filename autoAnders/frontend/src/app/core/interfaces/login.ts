export interface LoginCopy {
  eyebrow: string;
  heading: string;
  description: string;
  formHeading: string;
  formDescription: string;
  emailLabel: string;
  passwordLabel: string;
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
  successHeading: string;
  successMessage: string;
  supportHeading: string;
  supportMessage: string;
  supportLinkLabel: string;
  loginAuth?: {
    message: string;
    buttonLabel: string;
  };
}
