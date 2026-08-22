import { images } from '@/config/images';

export type BeforeAfterItem = {
  id: string;
  title: string;
  category: 'painting' | 'cleaning';
  service: string;
  location: string;
  beforeImage: string;
  afterImage: string;
  altText: string;
};

export const beforeAfterItems: BeforeAfterItem[] = [
  {
    id: 'ba1',
    title: 'Olohuoneen sisämaalaus',
    category: 'painting',
    service: 'Sisämaalaus',
    location: 'Helsinki',
    beforeImage: images.beforeAfter['ba-01-before'],
    afterImage: images.beforeAfter['ba-01-after'],
    altText: 'Sisämaalaus olohuone ennen ja jälkeen Helsingissä',
  },
  {
    id: 'ba2',
    title: 'Omakotitalon ulkomaalaus',
    category: 'painting',
    service: 'Ulkomaalaus',
    location: 'Espoo',
    beforeImage: images.beforeAfter['ba-02-before'],
    afterImage: images.beforeAfter['ba-02-after'],
    altText: 'Ennen ja jälkeen ulkomaalaus Espoossa',
  },
  {
    id: 'ba3',
    title: 'Huoneiston maalaus',
    category: 'painting',
    service: 'Huoneistomaalaus',
    location: 'Vantaa',
    beforeImage: images.beforeAfter['ba-03-before'],
    afterImage: images.beforeAfter['ba-03-after'],
    altText: 'Huoneistomaalaus asunnossa ennen ja jälkeen Vantaalla',
  },
  {
    id: 'ba4',
    title: 'Omakotitalon julkisivumaalaus',
    category: 'painting',
    service: 'Julkisivumaalaus',
    location: 'Kirkkonummi',
    beforeImage: images.beforeAfter['ba-04-before'],
    afterImage: images.beforeAfter['ba-04-after'],
    altText: 'Omakotitalon julkisivumaalaus ennen ja jälkeen Kirkkonummella',
  },
  {
    id: 'ba5',
    title: 'Toimiston maalaus',
    category: 'painting',
    service: 'Toimistomaalaus',
    location: 'Helsinki',
    beforeImage: images.beforeAfter['ba-05-before'],
    afterImage: images.beforeAfter['ba-05-after'],
    altText: 'Toimistomaalaus ennen ja jälkeen Helsingissä',
  },
  {
    id: 'ba6',
    title: 'Toimiston siivous',
    category: 'cleaning',
    service: 'Toimistosiivous',
    location: 'Espoo',
    beforeImage: images.beforeAfter['ba-06-before'],
    afterImage: images.beforeAfter['ba-06-after'],
    altText: 'Toimistosiivous ennen ja jälkeen Espoossa',
  },
  {
    id: 'ba7',
    title: 'Asunnon muuttosiivous',
    category: 'cleaning',
    service: 'Muuttosiivous',
    location: 'Vantaa',
    beforeImage: images.beforeAfter['ba-07-before'],
    afterImage: images.beforeAfter['ba-07-after'],
    altText: 'Asunnon muuttosiivous ennen ja jälkeen Vantaalla',
  },
  {
    id: 'ba8',
    title: 'Rakennussiivous valmiissa kohteessa',
    category: 'cleaning',
    service: 'Rakennussiivous',
    location: 'Hyvinkää',
    beforeImage: images.beforeAfter['ba-08-before'],
    afterImage: images.beforeAfter['ba-08-after'],
    altText: 'Rakennussiivous ennen ja jälkeen Hyvinkäällä',
  },
  {
    id: 'ba9',
    title: 'Puuaidan maalaus',
    category: 'painting',
    service: 'Aidan maalaus',
    location: 'Järvenpää',
    beforeImage: images.beforeAfter['ba-09-before'],
    afterImage: images.beforeAfter['ba-09-after'],
    altText: 'Puuaidan maalaus ennen ja jälkeen Järvenpäässä',
  },
];

export const beforeAfterCategories = [
  { id: 'all', label: 'Kaikki' },
  { id: 'painting', label: 'Maalaus' },
  { id: 'cleaning', label: 'Siivous' },
] as const;

export type BeforeAfterFilter = (typeof beforeAfterCategories)[number]['id'];
