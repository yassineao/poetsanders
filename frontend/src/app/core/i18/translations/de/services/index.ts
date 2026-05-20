import { ServicesCopy } from "../../../../interfaces/services";
import { deServicesHeroCopy } from "./hero";


export const deServicesCopy: ServicesCopy = {
  meta: deServicesHeroCopy,
  hero: deServicesHeroCopy,
  features: {
    eyebrow: 'Was Sie bekommen',
    heading: 'Pflege, die man sofort sieht',
    description:
      'Von schneller Auffrischung bis intensiver Aufbereitung: jeder Service wird sauber geplant, schonend ausgeführt und passend zum Zustand Ihres Fahrzeugs gewählt.',
    items: [
      {
        title: 'Innenraumreinigung',
        body: 'Sitze, Kunststoffe, Teppiche und Details werden gründlich gereinigt, damit sich Ihr Auto wieder frisch anfühlt.',
        icon: 'sparkle',
      },
      {
        title: 'Lackpflege',
        body: 'Schonende Wäsche, Politur und Schutz bringen Tiefe zurück und helfen, den Lack länger gepflegt zu halten.',
        icon: 'shield',
      },
      {
        title: 'Flexible Termine',
        body: 'Klare Absprachen, faire Zeitfenster und ein Ablauf, der gut in Ihren Tag passt.',
        icon: 'clock',
      },
      {
        title: 'Detailarbeit',
        body: 'Felgen, Glas, Einstiege und schwer erreichbare Stellen bekommen die Aufmerksamkeit, die den Unterschied macht.',
        icon: 'drop',
      },
    ],
  },
};
