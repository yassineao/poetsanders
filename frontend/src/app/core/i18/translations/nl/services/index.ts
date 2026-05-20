import { ServicesCopy } from "../../../../interfaces/services";
import { nlServicesHeroCopy } from "./hero";


export const nlServicesCopy: ServicesCopy = {
  meta: nlServicesHeroCopy,
  hero: nlServicesHeroCopy,
  features: {
    eyebrow: 'Wat u krijgt',
    heading: 'Autoverzorging die u direct ziet',
    description:
      'Van een snelle opfrisbeurt tot een uitgebreide behandeling: elke service wordt helder gepland, zorgvuldig uitgevoerd en afgestemd op uw auto.',
    items: [
      {
        title: 'Interieurreiniging',
        body: 'Stoelen, kunststof, tapijt en kleine details worden grondig gereinigd zodat uw auto weer fris aanvoelt.',
        icon: 'sparkle',
      },
      {
        title: 'Lakverzorging',
        body: 'Zorgvuldig wassen, polijsten en beschermen brengen diepte terug en houden de lak langer mooi.',
        icon: 'shield',
      },
      {
        title: 'Flexibele afspraken',
        body: 'Duidelijke communicatie, eerlijke tijdvakken en een werkwijze die goed in uw dag past.',
        icon: 'clock',
      },
      {
        title: 'Detailwerk',
        body: 'Velgen, glas, instaplijsten en moeilijk bereikbare plekken krijgen de aandacht die het verschil maakt.',
        icon: 'drop',
      },
    ],
  },
};
