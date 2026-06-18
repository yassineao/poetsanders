import type { PageMetadata } from "./LocaleDictionary";

export interface Infos  {
  title: string;
  description: string;
  fields: {
    companyName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
  };
  placeholders: {
    companyName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
  };
  consent: {
    prefix: string;
    terms: string;
    and: string;
    privacyPolicy: string;
    suffix: string;
  };
  submitLabel: string;
  popup: {
    successTitle: string;
    successMessage: string;
    errorTitle: string;
    errorMessage: string;
    closeLabel: string;
  };
  testimonial: {
    quote: string;
    author: string;
    imageAlt: string;
    imageUrl: string;
  };
};

export interface FormField {
  name: string;
  label: string;
  type: string;
  options?: {
    label: string;
    value: string;
  }[];
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  matchField?: string;
  errors?: {
    required?: string;
    email?: string;
    minlength?: string;
    maxlength?: string;
    pattern?: string;
    mismatch?: string;
  };
}

export interface FormPageContent {
  metadata?: PageMetadata;
  eyebrow?: string;
  title: string;
  description: string;
  fields: FormField[];
  textarea?: {
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    rows?: number;
  };
  consent?: Infos["consent"];
  submitLabel: string;
  sendingLabel: string;
  popup: Infos["popup"];
  testimonial?: Infos["testimonial"];
  registerAuth?: {
    message: string;
    buttonLabel: string;
  };
  loginAuth?: {
    message: string;
    buttonLabel: string;
  };
}



