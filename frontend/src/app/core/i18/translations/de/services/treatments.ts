import type { ServicesTreatmentsCopy } from '../../../../interfaces/services';

export const deServicesTreatmentsCopy: ServicesTreatmentsCopy = {
  eyebrow: 'Unsere Behandlungen',
  heading: 'Die passende Pflege für jedes Fahrzeug',
  description:
    'Wählen Sie zwischen kompletter Fahrzeugpflege, gezielter Innen- oder Außenbehandlung, Scheinwerferaufbereitung und einer Ozonbehandlung gegen hartnäckige Gerüche.',
  includedLabel: 'Enthaltene Leistungen',
  detailLinkLabel: 'Mehr erfahren',
  benefitsLabel: 'Ihre Vorteile',
  processLabel: 'So läuft die Behandlung ab',
  backLabel: 'Zurück zu allen Services',
  bookLabel: 'Termin vereinbaren',
  bookLink: '/book',
  notFoundTitle: 'Service nicht gefunden',
  items: [
    {
      slug: 'total-treatment',
      title: 'Total Treatment',
      description:
        'Eine komplette Auffrischung innen und außen für Fahrzeuge, die das volle Poets Anders Finish brauchen.',
      longDescription:
        'Die Totalbehandlung verbindet eine gründliche Innenraumreinigung mit sorgfältiger Außenpflege. Alle wichtigen Flächen werden systematisch behandelt, damit das Fahrzeug innen frisch wirkt und außen wieder ein gepflegtes, gleichmäßiges Finish erhält.',
      image: '/beautiful-car-washing-service.jpg',
      services: ['Innenraumbehandlung', 'Außenbehandlung'],
      benefits: ['Komplette Pflege in einem Termin', 'Abgestimmte Behandlung innen und außen', 'Ideal für stark beanspruchte Fahrzeuge'],
      process: ['Fahrzeugzustand gemeinsam prüfen', 'Innenraum gründlich reinigen', 'Außenflächen waschen, polieren und schützen', 'Abschlusskontrolle durchführen'],
      details: {
        sections: [
          {
            heading: 'Lassen Sie Ihr Auto innen und außen wieder glänzen',
            paragraphs: [
              'Glänzt der Lack Ihres Autos nicht mehr wie früher und ist der Innenraum verschmutzt oder matt geworden? Die Totalbehandlung von Poets Anders verbindet professionelle Innen- und Außenpflege, damit das gesamte Fahrzeug wieder frisch und gepflegt aussieht.',
              'Im Innenraum reinigen wir geeignete Polster und behandeln Kunststoffflächen für eine saubere, aufgefrischte Kabine. Die Behandlung wird an Materialien und Zustand des Innenraums angepasst.',
            ],
          },
          {
            heading: 'Komplette Außenpflege',
            paragraphs: [
              'Die Außenseite wird vom Lack bis zu den Rädern umfassend aufgefrischt. Je nach Fahrzeugzustand gehören Grob- und Feinpolitur, Handwachs, Felgenreinigung, Reifenbehandlung und Lackschutz zum Umfang.',
              'Geeignete Beschriftungen oder Aufkleber können ebenfalls professionell entfernt werden. Zuvor prüfen wir den Lack, da sich die Fläche unter älteren Aufklebern vom umliegenden Finish unterscheiden kann.',
            ],
          },
        ],
        odorsHeading: 'Was gehört zur Totalbehandlung?',
        odorsDescription: 'Die Komplettbehandlung verbindet folgende Innen- und Außenleistungen:',
        odors: [
          'Innenraumbehandlung',
          'Geeignete Polster reinigen',
          'Kunststoffbehandlung',
          'Außenbehandlung',
          'Grobpolitur',
          'Feinpolitur',
          'Handwachs',
          'Felgenreinigung',
          'Reifenbehandlung',
          'Lackschutz',
          'Professionelle Aufkleberentfernung',
        ],
        priceLabel: 'Behandlung ab',
        price: '135 €',
        ctaHeading: 'Lassen Sie Ihr Auto innen und außen glänzen',
        safetyNote:
          'Der genaue Umfang und Endpreis hängen von Fahrzeuggröße, Materialien, Verschmutzungsgrad und Lackzustand ab. Wir prüfen das Fahrzeug vor Beginn.',
      },
    },
    {
      slug: 'interior-treatment',
      title: 'Innenraumbehandlung',
      description:
        'Gründliche Innenraumpflege für Komfort, Frische und die Flächen, die Sie täglich berühren.',
      longDescription:
        'Bei der Innenraumbehandlung werden Sitze, Teppiche, Kunststoffe und häufig berührte Bereiche gründlich gereinigt. Der Umfang wird an Material und Verschmutzungsgrad angepasst, damit der Innenraum sauber, frisch und gepflegt zurückkommt.',
      image: '/Image_wash.jpg',
      services: ['Polster reinigen', 'Geruchsbehandlung', 'Kunststoff behandeln'],
      benefits: ['Spürbar frischeres Fahrzeuggefühl', 'Materialgerechte Reinigung', 'Mehr Komfort im Alltag'],
      process: ['Innenraum und Materialien prüfen', 'Lose Verschmutzungen entfernen', 'Polster, Teppiche und Kunststoffe reinigen', 'Flächen pflegen und Ergebnis kontrollieren'],
      details: {
        sections: [
          {
            heading: 'Ihr Innenraum wieder wie neu',
            paragraphs: [
              'Wirkt der Innenraum Ihres Autos schmutzig, matt oder grau? Die Innenraumbehandlung frischt die Kabine gründlich auf, damit sie wieder sauber, komfortabel und gepflegt wirkt.',
              'Zunächst prüfen und reinigen wir die Polster. Mit moderner Extraktionstechnik behandeln wir bei geeigneten Stoffpolstern nicht nur die sichtbare Oberfläche, sondern lösen auch tiefer sitzende Verschmutzungen.',
            ],
          },
          {
            heading: 'Frische Pflege für Kunststoffflächen',
            paragraphs: [
              'Armaturenbrett, Türverkleidungen, Mittelkonsole und weitere Kunststoffflächen werden gereinigt und für ein frisches, gleichmäßiges Erscheinungsbild behandelt.',
              'Die Behandlung wird an Material und Zustand des Innenraums angepasst. Empfindliche Flächen werden sorgfältig bearbeitet und das Ergebnis vor der Fahrzeugübergabe kontrolliert.',
            ],
          },
          {
            heading: 'Polster professionell reinigen',
            paragraphs: [
              'Wenn Sie den Innenraum und die Polster Ihres Autos professionell reinigen lassen möchten, behandelt Poets Anders Sitze und geeignete Stoffflächen sorgfältig. Neben der sichtbaren Oberfläche erreichen wir mit Extraktionstechnik auch tiefer im Polster sitzende Verschmutzungen.',
              'Ein Fahrzeuginnenraum wird intensiv genutzt. Essen und Getränke, Kinder, Haustiere, Arbeitsmaterial und alltägliche Fahrten können Flecken und Gerüche hinterlassen. Eine professionelle Polsterreinigung verbessert das Erscheinungsbild; eine optionale Ozonbehandlung kann anschließend gegen hartnäckige Gerüche eingesetzt werden.',
              'Zusätzlich zur Polsterreinigung können wir den übrigen Innenraum reinigen, Kunststoffflächen behandeln und geeignete Aufkleber oder Kleberückstände professionell entfernen.',
            ],
          },
          {
            heading: 'Kunststoffbehandlung',
            paragraphs: [
              'Mit der Zeit können Kunststoffflächen im Innenraum grau, staubig und matt wirken. Wir reinigen und behandeln Armaturenbrett, Türverkleidungen, Konsolen und weitere geeignete Kunststoffteile materialschonend, damit sie wieder frisch und gleichmäßig aussehen.',
              'Produkte und Verfahren werden auf das jeweilige Material abgestimmt. Die Behandlung lässt sich mit Polster-, Felgen- oder Scheinwerferpflege zu einer umfassenderen Fahrzeugauffrischung kombinieren.',
              'Fragen Sie bei der Terminvereinbarung nach den verfügbaren Abhol- und Rückgabemöglichkeiten.',
            ],
          },
        ],
        odorsHeading: 'Was behandeln wir bei der Innenraumbehandlung?',
        odorsDescription: 'Im Mittelpunkt stehen die Flächen, die das saubere und frische Gefühl im Innenraum bestimmen:',
        odors: [
          'Geeignete Stoffpolster reinigen',
          'Tiefer sitzenden Schmutz aus Polstern lösen',
          'Teppiche und zugängliche Innenraumflächen reinigen',
          'Kunststoffflächen reinigen und behandeln',
          'Häufig berührte Bereiche auffrischen',
          'Optionale Ozonbehandlung bei hartnäckigen Gerüchen',
          'Geeignete Aufkleber professionell entfernen',
        ],
        priceLabel: 'Behandlung ab',
        price: '95 €',
        ctaHeading: 'Lassen Sie Ihren Innenraum wieder frisch aussehen',
        safetyNote:
          'Die Trocknungszeit hängt von Material, Wetter und erforderlicher Tiefenreinigung ab. Bestehende Flecken oder dauerhafte Materialschäden lassen sich möglicherweise nicht vollständig entfernen.',
      },
    },
    {
      slug: 'exterior-treatment',
      title: 'Außenbehandlung',
      description:
        'Lack, Felgen, Reifen und Finish werden Schritt für Schritt für einen hochwertigen Look behandelt.',
      longDescription:
        'Die Außenbehandlung entfernt anhaftenden Schmutz und arbeitet den Lack schrittweise auf. Politur, Handwachs sowie die Pflege von Felgen und Reifen sorgen für mehr Glanz und einen sauber abgestimmten Gesamteindruck.',
      image: '/hero_Image.jpg',
      services: ['Grob polieren', 'Fein polieren', 'Handwachs', 'Felgenreinigung', 'Reifenbehandlung'],
      benefits: ['Mehr Glanz und Farbtiefe', 'Gepflegtes Gesamtbild', 'Schutz durch abschließendes Handwachs'],
      process: ['Lack und Außenflächen prüfen', 'Fahrzeug schonend vorreinigen', 'Lack grob und fein polieren', 'Wachs und Finish auftragen'],
      details: {
        sections: [
          {
            heading: 'Bringen Sie Ihr Auto wieder zum Glänzen',
            paragraphs: [
              'Sieht Ihr Auto nicht mehr so gepflegt aus wie früher? Die Außenbehandlung stellt Glanz und ein frisches, hochwertiges Finish wieder her, das an den Auftritt eines Fahrzeugs im Ausstellungsraum erinnert.',
              'Wir pflegen die gesamte Außenseite, polieren den Lack, tragen Handwachs auf, reinigen die Felgen und behandeln die Reifen. Ein zusätzlicher Lackschutz hilft, das erneuerte Finish vor Umwelteinflüssen und alltäglichen Verschmutzungen zu schützen.',
            ],
          },
          {
            heading: 'Professionelle Aufkleberentfernung',
            paragraphs: [
              'Alte Beschriftungen, Folien und Aufkleber können ein Fahrzeug ungepflegt wirken lassen oder sichtbare Kleberückstände hinterlassen. Auf Wunsch entfernen wir geeignete Aufkleber professionell und reinigen die betroffenen Bereiche.',
              'Der Lack unter einem Aufkleber kann sich je nach Alter und Zustand vom umliegenden Lack unterscheiden. Deshalb prüfen wir die Fläche vor der Entfernung und besprechen das zu erwartende Ergebnis mit Ihnen.',
            ],
          },
        ],
        odorsHeading: 'Was gehört zur Außenbehandlung?',
        odorsDescription: 'Die Behandlung kann folgende Schritte der Außenpflege umfassen:',
        odors: [
          'Grobpolitur',
          'Feinpolitur',
          'Handwachs',
          'Felgenreinigung',
          'Reifenbehandlung',
          'Lackschutz',
          'Professionelle Aufkleberentfernung',
        ],
        priceLabel: 'Behandlung ab',
        price: '95 €',
        ctaHeading: 'Lassen Sie Ihr Auto wieder wie neu aussehen',
        safetyNote:
          'Der genaue Umfang wird an den Lackzustand angepasst. Tiefe Kratzer, Steinschläge und Lackschäden können eine Reparatur statt einer Politur erfordern.',
      },
    },
    {
      slug: 'headlight-treatment',
      title: 'Scheinwerferbehandlung',
      description:
        'Ihre Scheinwerfer werden wieder klar und werten die Front sowie die Sicht bei Nacht auf.',
      longDescription:
        'Matte oder vergilbte Scheinwerfer werden kontrolliert aufgearbeitet. Die Oberfläche wird vorbereitet, geglättet und auf Klarheit poliert, damit die Fahrzeugfront gepflegter wirkt und das Licht wieder besser austreten kann.',
      image: '/bg_heroo.jpg',
      services: ['Klare Oberfläche wiederherstellen'],
      benefits: ['Klarere Scheinwerferoberfläche', 'Gepflegtere Fahrzeugfront', 'Verbesserte Lichtausbeute bei Dunkelheit'],
      process: ['Zustand der Scheinwerfer prüfen', 'Umgebung sorgfältig abkleben', 'Oberfläche mehrstufig aufarbeiten', 'Klarheit und Finish kontrollieren'],
      details: {
        sections: [
          {
            heading: 'Matte Kunststoffscheinwerfer wieder klar machen',
            paragraphs: [
              'Sind die Scheinwerfer Ihres Autos matt, vergilbt oder weniger hell geworden? Eine reduzierte Lichtausbeute beeinträchtigt sowohl die Optik des Fahrzeugs als auch die Sicht bei Dunkelheit. Poets Anders bereitet Kunststoffscheinwerfer durch das Polieren der verwitterten Oberfläche auf.',
              'Der Austausch kompletter Scheinwerfereinheiten kann teuer sein. Mit professioneller Ausrüstung, modernen Materialien und einem sorgfältigen mehrstufigen Verfahren lassen sich vorhandene Kunststoffscheinwerfer häufig für einen Bruchteil der Austauschkosten wiederherstellen.',
            ],
          },
          {
            heading: 'Warum werden Scheinwerfer mit der Zeit matt?',
            paragraphs: [
              'Moderne Scheinwerfer bestehen meist aus transparentem Kunststoff mit einer Schutzbeschichtung. Im normalen Fahrbetrieb greifen UV-Strahlung, Straßenschmutz, Feuchtigkeit, saurer Regen und andere Umwelteinflüsse diese Beschichtung an und verfärben sie.',
              'Mit der Zeit entstehen feine Kratzer und Oxidation im Kunststoff. Das Ergebnis ist eine matte oder gelbliche Oberfläche, die ungepflegt aussieht und weniger Licht durchlässt.',
            ],
          },
          {
            heading: 'Wir bereiten Ihre Scheinwerfer wieder auf',
            paragraphs: [
              'Verwitterte Scheinwerfer werden sorgfältig vorbereitet, in mehreren Stufen verfeinert und poliert. Ziel ist eine klare, gleichmäßige Oberfläche sowie eine Verbesserung der Optik und der nutzbaren Lichtausbeute.',
              'Stark verwitterte Scheinwerfer können außerdem bei der Fahrzeugprüfung zu Problemen führen. Eine Aufbereitung ist häufig deutlich günstiger als der Austausch des kompletten Scheinwerfers.',
            ],
          },
        ],
        odorsHeading: 'Vorteile der Scheinwerferpolitur',
        odorsDescription: 'Eine professionelle Aufbereitung bietet mehrere praktische Vorteile:',
        odors: [
          'Klarere Kunststoffoberfläche',
          'Verbesserte Lichtausbeute',
          'Bessere Sicht bei Dunkelheit',
          'Gepflegtere Fahrzeugoptik',
          'Günstiger als ein Austausch',
          'Für verwitterte und vergilbte Scheinwerfer geeignet',
        ],
        priceLabel: 'Behandlung ab',
        price: '50 € pro Scheinwerfer',
        ctaHeading: 'Scheinwerfer wieder klar aufbereiten lassen',
        safetyNote:
          'Das Endergebnis hängt von der Tiefe der Schäden und vom Zustand des Kunststoffs ab. Wir prüfen jeden Scheinwerfer vor Beginn der Behandlung.',
      },
    },
    {
      slug: 'ozone-treatment',
      title: 'Ozonbehandlung',
      description:
        'Eine intensive Ozonbehandlung neutralisiert hartnäckigen Rauchgeruch und andere unangenehme Gerüche im Fahrzeuginnenraum.',
      longDescription:
        'Die Ozonbehandlung ist für Fahrzeuge mit hartnäckigem Rauch-, Tier- oder Modergeruch gedacht. Nach einer passenden Innenraumvorbereitung wird Ozon kontrolliert im geschlossenen Fahrzeug eingesetzt und anschließend vollständig ausgelüftet.',
      image: '/Image_wash.jpg',
      services: ['Rauchgeruch neutralisieren', 'Unangenehme Gerüche entfernen'],
      benefits: ['Behandlung schwer erreichbarer Bereiche', 'Neutralisierung statt Überdeckung', 'Geeignet bei Rauch- und starken Fremdgerüchen'],
      process: ['Geruchsquelle und Innenraum prüfen', 'Fahrzeug für die Behandlung vorbereiten', 'Ozon kontrolliert einwirken lassen', 'Fahrzeug gründlich auslüften und kontrollieren'],
      details: {
        sections: [
          {
            heading: 'Schlechte Gerüche mit einer Ozonbehandlung entfernen',
            paragraphs: [
              'Leiden Sie unter hartnäckigen Gerüchen durch Zigarettenrauch, Haustiere, Feuchtigkeit oder verschüttete Getränke? Poets Anders setzt eine professionelle Ozonbehandlung ein, um die Ursache unangenehmer Gerüche zu neutralisieren und dem Innenraum wieder einen sauberen, frischen Eindruck zu geben.',
              'Anders als Produkte, die einen Geruch nur vorübergehend überdecken, verteilt sich Ozon im gesamten Innenraum und im Lüftungssystem. Dadurch erreicht die Behandlung auch Luftkanäle und andere Stellen, die von Hand nur schwer zu reinigen sind.',
            ],
          },
          {
            heading: 'Was ist Ozon?',
            paragraphs: [
              'Ozon (O3) ist eine Form von Sauerstoff, die auch natürlich in der Atmosphäre vorkommt. Das reaktive Gas kann geruchsverursachende Verbindungen abbauen. Da Ozon instabil ist, wandelt es sich nach der Behandlung wieder in Sauerstoff um.',
            ],
          },
          {
            heading: 'Wie gehen wir vor?',
            paragraphs: [
              'Die erforderliche Behandlungsdauer hängt von Art und Stärke des Geruchs ab. Rauch, stehendes Regenwasser, Tiergerüche, Schimmel oder verschüttete Flüssigkeiten können jeweils einen anderen Behandlungszyklus erfordern.',
              'Der Ozongenerator wird im Fahrzeug platziert und für einen sorgfältig gewählten Zeitraum betrieben. Das Umluftsystem verteilt das Gas im Innenraum und in den Luftkanälen. Anschließend wird das Fahrzeug gründlich gelüftet und kontrolliert.',
            ],
          },
        ],
        odorsHeading: 'Welche schlechten Gerüche können wir entfernen?',
        odorsDescription: 'Die Behandlung kann viele hartnäckige Fahrzeuggerüche neutralisieren, darunter:',
        odors: [
          'Zigarettenrauch',
          'Tiergerüche',
          'Gerüche im Umluftsystem',
          'Stehendes Regenwasser',
          'Schimmel nach einer Undichtigkeit',
          'Verschüttete Getränke',
          'Erbrochenes',
          'Körpergerüche',
          'Brandgeruch',
        ],
        priceLabel: 'Behandlung ab',
        price: '50 €',
        ctaHeading: 'Unangenehme Gerüche aus Ihrem Auto entfernen',
        safetyNote:
          'Die Ozonbehandlung erfolgt im geschlossenen, unbesetzten Fahrzeug. Vor der erneuten Nutzung wird das Auto gründlich gelüftet.',
      },
    },
  ],
};
