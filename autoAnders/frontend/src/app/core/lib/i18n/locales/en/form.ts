import type { Copy } from "../../../../interfaces/types";

export const enFormCopy: Copy["form"] = {
      metadata: {
        title: "Contact AutoAnders | Buy or Sell a Car",
        description:
          "Contact AutoAnders to ask about a car, request a trade-in offer, sell your vehicle, or get help with financing.",
        locale: "en_US",
        keywords: [
          "contact autoanders",
          "buy a car",
          "sell my car",
          "car trade in",
          "car financing inquiry",
        ],
      },
      content: {
        title: "Get in Touch",
        description:
          "Have a question about a vehicle, selling your car, or financing? Our team is ready to help.",
        fields: {
          companyName: "Vehicle or Topic",
          lastName: "Last Name",
          email: "Email",
          phoneNumber: "Phone Number",
          message: "Message",
        },
        placeholders: {
          companyName: "BMW 320i, trade-in, financing...",
          lastName: "Smith",
          email: "name@example.com",
          phoneNumber: "+1 123 456789",
          message: "Tell us which car you are interested in or which vehicle you want to sell",
        },
        consent: {
          prefix: "You agree to our",
          terms: "Terms",
          and: "and",
          privacyPolicy: "Privacy Policy",
          suffix: ".",
        },
        submitLabel: "Send Message",
        popup: {
          successTitle: "Message sent",
          successMessage: "Thank you. Your message has been sent. Check your mail.",
          errorTitle: "Message not sent",
          errorMessage: "Something went wrong. Please try again.",
          closeLabel: "OK",
        },
        testimonial: {
          quote:
            "A good car decision starts with clear information, fair pricing, and someone who takes your questions seriously.",
          author: "AutoAnders Team",
          imageAlt: "Car background in the contact form",
          imageUrl: "/hero.jpg",
        },
      },
      seo: {
        areaServed: ["Germany", "Europe", "International"],
        knowsAbout: [
          "Used Cars",
          "Car Sales",
          "Trade-In Service",
          "Car Financing",
        ],
        offerCatalogName: "Car Contact and Consultation",
        services: [
          "Available Cars",
          "Sell Your Car",
          "Trade-In Service",
          "Car Financing",
        ],
      },
    };
