export type Testimonial = {
  id: string;
  name: string;
  text: string;
  service: string;
  location: string;
  rating: number;
  verified: boolean;
};

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Mika L.',
    text: 'Esikäsittely tehtiin huolellisesti ja ulkomaalaus on pysynyt moitteettomana. Käytännönläheinen ja reilu palvelu.',
    service: 'Ulkomaalaus',
    location: 'Helsinki',
    rating: 5,
    verified: true,
  },
  {
    id: 't2',
    name: 'Anna K.',
    text: 'Sisämaalaus tehtiin siististi ja nopeasti. Kalusteet suojattiin ja asunto oli lopuksi puhdas.',
    service: 'Sisämaalaus',
    location: 'Espoo',
    rating: 5,
    verified: true,
  },
  {
    id: 't3',
    name: 'Jukka R.',
    text: 'Toimistomme maalattiin viikonloppuna, jolloin työ ei keskeytynyt. Matalahajuisen maalin ansiosta tilat olivat heti maanantaina käytettävissä.',
    service: 'Toimistomaalaus',
    location: 'Vantaa',
    rating: 5,
    verified: true,
  },
  {
    id: 't4',
    name: 'Sanna M.',
    text: 'Muuttosiivous onnistui joustavasti muuttoaikataulumme mukaan. Vanha asunto oli valmis avaimenluovutukseen.',
    service: 'Muuttosiivous',
    location: 'Kirkkonummi',
    rating: 5,
    verified: true,
  },
  {
    id: 't5',
    name: 'Timo H.',
    text: 'Huoltomaalaussopimus on pelastus. Saamme keväällä muistutuksen ja tarkastuskäynnin, eikä pintamme pääse koskaan huonoon kuntoon.',
    service: 'Huoltomaalaus',
    location: 'Hyvinkää',
    rating: 5,
    verified: true,
  },
  {
    id: 't6',
    name: 'Pirjo N.',
    text: 'Julkisivun pesu palautti talon alkuperäisen ilmeen. Lika ja sammal hävisivät hellävaraisesti oikeilla pesuaineilla.',
    service: 'Julkisivun pesu',
    location: 'Kerava',
    rating: 4,
    verified: true,
  },
  {
    id: 't7',
    name: 'Henri V.',
    text: 'Rakennussiivous tehtiin ajoissa ennen avaimenluovutusta. Asunto oli valmis muuttamaan ja pöly oli poistettu huolellisesti.',
    service: 'Rakennussiivous',
    location: 'Järvenpää',
    rating: 5,
    verified: true,
  },
  {
    id: 't8',
    name: 'Liisa T.',
    text: 'Kotisiivous on tuonut arkeen helpotusta. Luotettava ja joustava sopimus, ja Kotitalousvähennyskelpoinen lasku.',
    service: 'Kotisiivous',
    location: 'Helsinki',
    rating: 5,
    verified: true,
  },
];
