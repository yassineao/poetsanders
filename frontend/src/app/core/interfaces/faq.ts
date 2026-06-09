export interface FaqCopy {
  eyebrow: string;
  heading: string;
  description: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
  ctaHeading: string;
  ctaDescription: string;
  ctaLabel: string;
}
