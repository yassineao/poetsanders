import type { HomeCardsSectionCopy } from '../../../../interfaces/types';

export const deHomeCardsCopy: HomeCardsSectionCopy = {
  eyebrow: 'Behandlungspakete',
  heading: 'Waehlen Sie die Pflege, die Ihr Auto verdient.',
  description: 'Von der praezisen Innenraumauffrischung bis zur kompletten Premium-Behandlung ist jedes Paket klar aufgebaut, damit Sie genau wissen, was Ihr Auto bekommt. Waehlen Sie gezielte Innenraumpflege, Aussenpolitur mit Schutz, Scheinwerferaufbereitung oder eine vollstaendige Behandlung innen und aussen passend zum Zustand Ihres Fahrzeugs.',
  highlight: {
    eyebrow: 'Signature-Pflege',
    title: 'Ein saubereres Auto, mit Geduld und Praezision behandelt.',
    body: 'Poets Anders verbindet sorgfaeltige Handarbeit mit hochwertigen Finish-Schritten, damit Ihr Auto frisch, geschuetzt und bereit fuer die Strasse ist.',
    image: '/beautiful-car-washing-service.jpg',
    stats: [
      { value: '4', label: 'Behandlungsoptionen' },
      { value: 'NL', label: 'Niederlaendischer Standard' },
      { value: '1', label: 'Klares Finish-Ziel' },
    ],
  },
  items: [
    {
      title: 'Aussenwaesche',
      body: 'Schonende Waesche, Felgenpflege und ein sauber getrocknetes Finish fuer private und gewerbliche Fahrzeuge.',
    },
    {
      title: 'Innenraum-Refresh',
      body: 'Saugen, Armaturenpflege und Kabinenreinigung, damit sich jede Fahrt ruhig und sauber anfuehlt.',
    },
    {
      title: 'Premium-Detailing',
      body: 'Extra Aufmerksamkeit fuer Lack, Glas, Verkleidung und Finish, wenn Ihr Auto die volle Pflege braucht.',
    },
  ],
  treatments: [
    {
      title: 'Total Treatment',
      description: 'Eine komplette Auffrischung innen und aussen fuer Fahrzeuge, die das volle Poets Anders Finish brauchen.',
      image: '/beautiful-car-washing-service.jpg',
      featured: true,
      featuredLabel: 'Am umfassendsten',
      services: ['Innenraumbehandlung', 'Aussenbehandlung'],
    },
    {
      title: 'Interior Treatment',
      description: 'Gruendliche Innenraumpflege fuer Komfort, Frische und die Flaechen, die Sie taeglich beruehren.',
      image: '/Image_wash.jpg',
      featured: false,
      services: ['Polster reinigen', 'Geruchsbehandlung', 'Kunststoff behandeln'],
    },
    {
      title: 'Exterior Treatment',
      description: 'Lack, Felgen, Reifen und Finish werden Schritt fuer Schritt fuer einen hochwertigen Look behandelt.',
      image: '/hero_Image.jpg',
      featured: false,
      services: ['Grob polieren', 'Fein polieren', 'Handwachs', 'Felgenreinigung', 'Reifenbehandlung'],
    },
    {
      title: 'Scheinwerferbehandlung',
      description: 'Ihre Scheinwerfer werden wieder klar und werten die Front sowie die Sicht bei Nacht auf.',
      image: '/bg_heroo.jpg',
      featured: false,
      services: ['Klare Oberflaeche wiederherstellen'],
    },
  ],
};
