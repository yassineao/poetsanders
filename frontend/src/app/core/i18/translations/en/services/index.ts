import { ServicesCopy } from "../../../../interfaces/services";
import { enServicesHeroCopy } from "./hero";


export const enServicesCopy: ServicesCopy = {
  meta: enServicesHeroCopy,
  hero: enServicesHeroCopy,
  features: {
    eyebrow: 'What you get',
    heading: 'Car care you can see right away',
    description:
      'From a quick refresh to detailed reconditioning: every service is planned clearly, handled gently, and matched to your vehicle.',
    items: [
      {
        title: 'Interior cleaning',
        body: 'Seats, plastics, carpets, and small details are cleaned thoroughly so your car feels fresh again.',
        icon: 'sparkle',
      },
      {
        title: 'Paint care',
        body: 'Careful washing, polishing, and protection restore depth and help keep the paint looking sharp.',
        icon: 'shield',
      },
      {
        title: 'Flexible appointments',
        body: 'Clear communication, fair time windows, and a process that fits neatly into your day.',
        icon: 'clock',
      },
      {
        title: 'Detail work',
        body: 'Rims, glass, door shuts, and hard-to-reach areas get the attention that makes the finish feel complete.',
        icon: 'drop',
      },
    ],
  },
};
