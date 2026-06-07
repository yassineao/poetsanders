import type { HomeCardsSectionCopy } from '../../../../interfaces/types';

export const deHomeCardsCopy: HomeCardsSectionCopy = {
  eyebrow: 'Behandlungspakete',
  heading: 'Wählen Sie die Pflege, die Ihr Auto verdient.',
  description: 'Von der präzisen Innenraumauffrischung bis zur kompletten Premium-Behandlung ist jedes Paket klar aufgebaut, damit Sie genau wissen, was Ihr Auto bekommt. Wählen Sie gezielte Innenraumpflege, Außenpolitur mit Schutz, Scheinwerferaufbereitung oder eine vollständige Behandlung innen und außen passend zum Zustand Ihres Fahrzeugs.',
  detailLinkLabel: 'Mehr erfahren',
  info: [
    { label: 'Firma', value: 'Poets Anders' },
    { label: 'Adresse', value: 'Vondellaan 164, 3351 HG Papendrecht' },
    { label: 'Telefon', value: '078-6933340', href: 'tel:+31786933340' },
    { label: 'Mobil', value: '06-34341514', href: 'tel:+31634341514' },
    { label: 'E-Mail', value: 'info@poetsanders.nl', href: 'mailto:info@poetsanders.nl' },
    { label: 'Website', value: 'poetsanders.nl', href: 'http://poetsanders.nl/' },
    { label: 'Google Maps', value: 'Standort öffnen', href: 'https://maps.app.goo.gl/WZacia8LvDi4aGKQA' },
    { label: 'Koordinaten', value: '51.8300852, 4.6861988' },
  ],
  highlight: {
    eyebrow: 'Signature-Pflege',
    title: 'Ein saubereres Auto, mit Geduld und Präzision behandelt.',
    body: 'Poets Anders verbindet sorgfältige Handarbeit mit hochwertigen Finish-Schritten, damit Ihr Auto frisch, geschützt und bereit für die Straße ist.',
    image: '/beautiful-car-washing-service.jpg',
    stats: [
      { value: '5', label: 'Behandlungsoptionen' },
      { value: 'NL', label: 'Niederländischer Standard' },
      { value: '1', label: 'Klares Finish-Ziel' },
    ],
  },
  items: [
    {
      title: 'Außenwäsche',
      body: 'Schonende Wäsche, Felgenpflege und ein sauber getrocknetes Finish für private und gewerbliche Fahrzeuge.',
    },
    {
      title: 'Innenraum-Refresh',
      body: 'Saugen, Armaturenpflege und Kabinenreinigung, damit sich jede Fahrt ruhig und sauber anfühlt.',
    },
    {
      title: 'Premium-Detailing',
      body: 'Extra Aufmerksamkeit für Lack, Glas, Verkleidung und Finish, wenn Ihr Auto die volle Pflege braucht.',
    },
  ],
  treatments: [
    {
      slug: 'total-treatment',
      title: 'Total Treatment',
      description: 'Eine komplette Auffrischung innen und außen für Fahrzeuge, die das volle Poets Anders Finish brauchen.',
      image: '/beautiful-car-washing-service.jpg',
      featured: true,
      featuredLabel: 'Am umfassendsten',
      services: ['Innenraumbehandlung', 'Außenbehandlung'],
    },
    {
      slug: 'interior-treatment',
      title: 'Interior Treatment',
      description: 'Gründliche Innenraumpflege für Komfort, Frische und die Flächen, die Sie täglich berühren.',
      image: '/Image_wash.jpg',
      featured: false,
      services: ['Polster reinigen', 'Geruchsbehandlung', 'Kunststoff behandeln'],
    },
    {
      slug: 'exterior-treatment',
      title: 'Exterior Treatment',
      description: 'Lack, Felgen, Reifen und Finish werden Schritt für Schritt für einen hochwertigen Look behandelt.',
      image: '/hero_Image.jpg',
      featured: false,
      services: ['Grob polieren', 'Fein polieren', 'Handwachs', 'Felgenreinigung', 'Reifenbehandlung'],
    },
    {
      slug: 'headlight-treatment',
      title: 'Scheinwerferbehandlung',
      description: 'Ihre Scheinwerfer werden wieder klar und werten die Front sowie die Sicht bei Nacht auf.',
      image: '/bg_heroo.jpg',
      featured: false,
      services: ['Klare Oberfläche wiederherstellen'],
    },
    {
      slug: 'ozone-treatment',
      title: 'Ozonbehandlung',
      description: 'Eine intensive Ozonbehandlung neutralisiert hartnäckigen Rauchgeruch und andere unangenehme Gerüche im Fahrzeuginnenraum.',
      image: '/Image_wash.jpg',
      featured: false,
      services: ['Rauchgeruch neutralisieren', 'Unangenehme Gerüche entfernen'],
    },
  ],
};
