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
  placeholder?: string;
  required?: boolean;
}

export interface FormPageContent {
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
}

