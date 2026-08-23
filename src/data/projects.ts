import { images } from '@/config/images';

export type Project = {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image: string;
  beforeImage: string;
  afterImage: string;
  services: string[];
  review?: { author: string; text: string; rating: number };
};

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'Omakotitalon ulkomaalaus',
    category: 'Ulkomaalaus',
    location: 'Helsinki',
    year: '2024',
    description:
      'Puutalon täysi ulkomaalaus. Vanha maali poistettiin harjaamalla ja pinnat pohjustettiin ennen kahden kerroksen sääluokiteltua maalausta. Takuu työjäljestä 2 vuotta.',
    image: images.projects['project-01'],
    beforeImage: images.beforeAfter['ba-02-before'],
    afterImage: images.beforeAfter['ba-02-after'],
    services: ['Ulkomaalaus', 'Esikäsittely', 'Pohjustus'],
    review: { author: 'Mika L., Helsinki', text: 'Esikäsittely tehtiin huolellisesti ja ulkomaalaus on pysynyt moitteettomana.', rating: 5 },
  },
  {
    id: 'p2',
    title: 'Peltokaton pinnoitus rivitaloyhtiölle',
    category: 'Kattomaalaus',
    location: 'Espoo',
    year: '2024',
    description:
      'Rivitaloyhtiön peltokatto puhdistettiin ja pinnoitettiin ruosteenestomaalilla. Työ tehtiin yhden viikonlopun aikana häiritsemättä asukkaita.',
    image: images.projects['project-02'],
    beforeImage: images.projects['project-02'],
    afterImage: images.projects['project-02'],
    services: ['Kattomaalaus', 'Katon pesu', 'Ruosteen poisto'],
  },
  {
    id: 'p3',
    title: 'Rapattu julkisivu kerrostalossa',
    category: 'Julkisivumaalaus',
    location: 'Helsinki',
    year: '2023',
    description:
      'Kerrostalon rapattu julkisivu maalattiin mineraalimaalilla. Työ sisälsi halkeamien korjauksen ja koko talon värikartoituksen asukastapaamisessa.',
    image: images.projects['project-03'],
    beforeImage: images.beforeAfter['ba-04-before'],
    afterImage: images.beforeAfter['ba-04-after'],
    services: ['Julkisivumaalaus', 'Halkeamien korjaus', 'Värikartoitus'],
    review: { author: 'Taloyhtiö Aurora, Helsinki', text: 'Ammattitaitoinen tiimi ja värikartoitus asukastapaamisessa oli erinomainen idea.', rating: 5 },
  },
  {
    id: 'p4',
    title: 'Puuaidan ja portin kunnostus',
    category: 'Aidan maalaus',
    location: 'Vantaa',
    year: '2024',
    description:
      'Vanha puuaita kunnostettiin ja maalattiin uudelleen. Laudat puhdistettiin painepesulla, irtoavat naulat vaihdettiin ja pintaan vedettiin kaksi kerrosta UV-suojaista maalia.',
    image: images.projects['project-04'],
    beforeImage: images.projects['project-04'],
    afterImage: images.projects['project-04'],
    services: ['Aidan maalaus', 'Puhdistus', 'UV-suojaus'],
  },
  {
    id: 'p5',
    title: 'Sisämaalaus omakotitalossa',
    category: 'Sisämaalaus',
    location: 'Kirkkonummi',
    year: '2024',
    description:
      'Omakotitalon olohuone, keittiö ja käytävät maalattiin. Kalusteet ja lattiat suojattiin huolellisesti, ja työn jälkeen tilat olivat puhtaana ja valmiina.',
    image: images.projects['project-05'],
    beforeImage: images.beforeAfter['ba-01-before'],
    afterImage: images.beforeAfter['ba-01-after'],
    services: ['Sisämaalaus', 'Kattojen maalaus', 'Listojen maalaus'],
    review: { author: 'Anna K., Kirkkonummi', text: 'Sisämaalaus tehtiin siististi ja nopeasti. Kalusteet suojattiin ja asunto oli lopuksi puhdas.', rating: 5 },
  },
  {
    id: 'p6',
    title: 'Toimiston maalaus viikonloppuna',
    category: 'Toimistomaalaus',
    location: 'Helsinki',
    year: '2024',
    description:
      'Toimiston seinät ja katot maalattiin viikonloppuna, jolloin työ ei keskeytynyt. Matalahajuisen maalin ansiosta tilat olivat heti maanantaina käytettävissä.',
    image: images.projects['project-06'],
    beforeImage: images.beforeAfter['ba-05-before'],
    afterImage: images.beforeAfter['ba-05-after'],
    services: ['Toimistomaalaus', 'Kattojen maalaus', 'Ovien maalaus'],
    review: { author: 'Jukka R., Helsinki', text: 'Toimistomme maalattiin viikonloppuna — työ ei keskeytynyt. Suosittelen!', rating: 5 },
  },
  {
    id: 'p7',
    title: 'Huoneistomaalaus muuton yhteydessä',
    category: 'Huoneistomaalaus',
    location: 'Vantaa',
    year: '2024',
    description:
      'Kahden huoneen asunto maalattiin muuton yhteydessä. Tapetit poistettiin, pinnat tasoitettiin ja maalattiin ennen uusien asukkaiden muuttoa.',
    image: images.projects['project-07'],
    beforeImage: images.beforeAfter['ba-03-before'],
    afterImage: images.beforeAfter['ba-03-after'],
    services: ['Huoneistomaalaus', 'Tapetin poisto', 'Tasoitus'],
  },
  {
    id: 'p8',
    title: 'Kerrostalon ikkunoiden pesu',
    category: 'Ikkunanpesu',
    location: 'Helsinki',
    year: '2024',
    description:
      'Kerrostalon kaikkien ikkunoiden ammattimainen pesu. Työ tehtiin turvavaljaiden ja tikkaiden avulla yhden viikonlopun aikana häiritsemättä asukkaiden arkea.',
    image: images.projects['project-08'],
    beforeImage: images.projects['project-08'],
    afterImage: images.projects['project-08'],
    services: ['Ikkunanpesu', 'Kehysten pesu'],
  },
  {
    id: 'p9',
    title: 'Toimistosiivous säännöllisellä sopimuksella',
    category: 'Toimistosiivous',
    location: 'Espoo',
    year: '2024',
    description:
      'Toimistotilojen säännöllinen siivous sopimuksella. Siivous tehdään työaikojen ulkopuolella, ja huolehdimme hygieniatason jokaisessa tilassa.',
    image: images.projects['project-09'],
    beforeImage: images.beforeAfter['ba-06-before'],
    afterImage: images.beforeAfter['ba-06-after'],
    services: ['Toimistosiivous', 'Lattioiden hoito', 'Saniteettitilojen siivous'],
  },
  {
    id: 'p10',
    title: 'Muuttosiivous',
    category: 'Muuttosiivous',
    location: 'Vantaa',
    year: '2024',
    description:
      'Asunnon muuttosiivous ennen avaimenluovutusta. Lattiat, pinnat, kylppäri ja keittiö puhdistettiin, jotta asunto oli valmis uusille asukkaille.',
    image: images.projects['project-10'],
    beforeImage: images.beforeAfter['ba-07-before'],
    afterImage: images.beforeAfter['ba-07-after'],
    services: ['Muuttosiivous', 'Ikkunanpesu', 'Lattioiden pesu'],
    review: { author: 'Sanna M., Vantaa', text: 'Muuttosiivous onnistui joustavasti muuttoaikataulumme mukaan. Vanha asunto oli valmis avaimenluovutukseen.', rating: 5 },
  },
  {
    id: 'p11',
    title: 'Rakennussiivous valmiissa kohteessa',
    category: 'Rakennussiivous',
    location: 'Hyvinkää',
    year: '2024',
    description:
      'Valmiin kohteen loppusiivous. Rakennuspöly, maaliroiskeet ja jäte poistettiin, jotta asunto oli valmis muuttamaan.',
    image: images.projects['project-11'],
    beforeImage: images.beforeAfter['ba-08-before'],
    afterImage: images.beforeAfter['ba-08-after'],
    services: ['Rakennussiivous', 'Pölynpoisto', 'Ikkunanpesu'],
    review: { author: 'Henri V., Järvenpää', text: 'Rakennussiivous tehtiin ajoissa ennen avaimenluovutusta. Asunto oli valmis muuttamaan.', rating: 5 },
  },
  {
    id: 'p12',
    title: 'Katon siivous ja sammaleen poisto',
    category: 'Katon siivous',
    location: 'Järvenpää',
    year: '2024',
    description:
      'Peltokaton sammale- ja leväkasvusto poistettiin hellävaraisella painepesulla. Samalla rännit puhdistettiin ja katon kunto tarkastettiin.',
    image: images.projects['project-12'],
    beforeImage: images.projects['project-12'],
    afterImage: images.projects['project-12'],
    services: ['Katon siivous', 'Rännien puhdistus', 'Kunnon tarkastus'],
  },
];

export const projectCategories = [
  'Kaikki',
  ...Array.from(new Set(projects.map((p) => p.category))),
];
