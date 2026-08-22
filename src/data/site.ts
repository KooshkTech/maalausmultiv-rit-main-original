export type ServiceArea = {
  name: string;
};

export const serviceAreas: ServiceArea[] = [
  { name: 'Helsinki' },
  { name: 'Espoo' },
  { name: 'Vantaa' },
  { name: 'Kauniainen' },
  { name: 'Kirkkonummi' },
  { name: 'Hyvinkää' },
  { name: 'Kerava' },
  { name: 'Järvenpää' },
  { name: 'Nurmijärvi' },
  { name: 'Sipoo' },
];

export type Stat = {
  value: number;
  suffix: string;
  label: string;
  description: string;
  icon: 'projects' | 'customers' | 'experience' | 'warranty';
};

// Verified business figures — never invent or inflate these values.
// Source: approved company data for Maalaus Multiväri.
export const stats: Stat[] = [
  {
    value: 120,
    suffix: '+',
    label: 'Valmistunutta projektia',
    description: 'Maalaus- ja siivouskohteita Uudellamaalla',
    icon: 'projects',
  },
  {
    value: 95,
    suffix: '+',
    label: 'Tyytyväistä asiakasta',
    description: 'Asiakkaita, jotka suosittelevat meitä eteenpäin',
    icon: 'customers',
  },
  {
    value: 15,
    suffix: '+',
    label: 'Vuoden kokemus',
    description: 'Ammattimaista työtä vuodesta 2010',
    icon: 'experience',
  },
  {
    value: 2,
    suffix: ' v',
    label: 'Työtakuu',
    description: 'Kirjallinen takuu työjäljestä',
    icon: 'warranty',
  },
];

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
  icon: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Ilmainen arvio',
    description:
      'Ota yhteyttä ja käymme paikan päällä tutkimassa kohteen. Laadimme tarkan, sitouttamattoman tarjouksen työvaiheineen ja aikatauluineen.',
    icon: 'clipboard',
  },
  {
    number: '02',
    title: 'Esikäsittely',
    description:
      'Puhdistamme pinnat, poistamme irtoavan maalin ja korjaamme halkeamat. Esikäsittely on työn kestävyyden perusta.',
    icon: 'sparkles',
  },
  {
    number: '03',
    title: 'Toteutus',
    description:
      'Pohjustamme pinnat ja levitämme maalin tai suoritamme siivouksen ammattimaisesti. Työ tehdään siististi ja aikataulussa.',
    icon: 'brush',
  },
  {
    number: '04',
    title: 'Takuu ja lopetus',
    description:
      'Tarkistamme lopputuloksen kanssasi ja siivoamme työalueen. Annamme kirjallisen takuun työjäljestä jopa 5 vuotta.',
    icon: 'shield',
  },
];
