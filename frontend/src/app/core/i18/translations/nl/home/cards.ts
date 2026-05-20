import type { HomeCardsSectionCopy } from '../../../../interfaces/types';

export const nlHomeCardsCopy: HomeCardsSectionCopy = {
  eyebrow: 'Behandelingspakketten',
  heading: 'Kies de zorg die je auto verdient.',
  description: 'Van een nauwkeurige interieur opfrisbeurt tot een complete premium behandeling: elk pakket is duidelijk opgebouwd, zodat je precies weet wat je auto krijgt. Kies gerichte cabineverzorging, exterieurpolijsting met bescherming, koplampherstel of een volledige behandeling van binnen en buiten passend bij de staat van je voertuig.',
  info: [
    { label: 'Bedrijf', value: 'Poets Anders' },
    { label: 'Adres', value: 'Vondellaan 164, 3351 HG Papendrecht' },
    { label: 'Telefoon', value: '078-6933340', href: 'tel:+31786933340' },
    { label: 'Mobiel', value: '06-34341514', href: 'tel:+31634341514' },
    { label: 'E-mail', value: 'info@poetsanders.nl', href: 'mailto:info@poetsanders.nl' },
    { label: 'Website', value: 'poetsanders.nl', href: 'http://poetsanders.nl/' },
    { label: 'Google Maps', value: 'Locatie openen', href: 'https://maps.app.goo.gl/WZacia8LvDi4aGKQA' },
    { label: 'Coördinaten', value: '51.8300852, 4.6861988' },
  ],
  highlight: {
    eyebrow: 'Signature verzorging',
    title: 'Een schonere auto, behandeld met geduld en precisie.',
    body: 'Poets Anders combineert zorgvuldig handwerk met hoogwaardige afwerking, zodat je auto fris, beschermd en klaar voor de weg is.',
    image: '/beautiful-car-washing-service.jpg',
    stats: [
      { value: '4', label: 'Behandelingsopties' },
      { value: 'NL', label: 'Nederlandse servicestandaard' },
      { value: '1', label: 'Helder einddoel' },
    ],
  },
  items: [
    {
      title: 'Buitenwas',
      body: 'Zachte reiniging, velgenzorg en een droog schoon resultaat voor priveauto\'s en zakelijke wagens.',
    },
    {
      title: 'Interieur opfrissen',
      body: 'Stofzuigen, dashboardreiniging en cabineverzorging zodat elke rit schoon en rustig aanvoelt.',
    },
    {
      title: 'Premium detailing',
      body: 'Extra aandacht voor lak, glas, trim en afwerking wanneer je auto de volledige behandeling nodig heeft.',
    },
  ],
  treatments: [
    {
      title: 'Total Treatment',
      description: 'Een complete opfrisbeurt van binnen en buiten voor auto\'s die de volledige Poets Anders afwerking nodig hebben.',
      image: '/beautiful-car-washing-service.jpg',
      featured: true,
      featuredLabel: 'Meest compleet',
      services: ['Interieurbehandeling', 'Exterieurbehandeling'],
    },
    {
      title: 'Interior Treatment',
      description: 'Diepe cabineverzorging gericht op comfort, frisheid en de oppervlakken die je dagelijks aanraakt.',
      image: '/Image_wash.jpg',
      featured: false,
      services: ['Bekleding reinigen', 'Geurbehandeling', 'Kunststof behandelen'],
    },
    {
      title: 'Exterior Treatment',
      description: 'Lak, velgen, banden en afwerking worden stap voor stap behandeld voor een premium uitstraling.',
      image: '/hero_Image.jpg',
      featured: false,
      services: ['Grof polijsten', 'Fijn polijsten', 'Handwax', 'Velgen reinigen', 'Bandenbehandeling'],
    },
    {
      title: 'Koplampbehandeling',
      description: 'Je koplampen worden weer helder, voor een betere voorkant en beter zicht in het donker.',
      image: '/bg_heroo.jpg',
      featured: false,
      services: ['Heldere afwerking herstellen'],
    },
  ],
};
