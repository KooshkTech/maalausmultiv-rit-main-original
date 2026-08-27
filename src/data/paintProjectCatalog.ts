import { services } from '@/data/services';

export type PaintProjectCategory = 'interior' | 'exterior' | 'commercial';

export type PaintProjectService = {
  slug: string;
  title: string;
  category: PaintProjectCategory;
  surfaces: string[];
  keywords: string[];
};

const categoryBySlug: Record<string, PaintProjectCategory> = {
  sisamaalaus: 'interior',
  huoneistomaalaus: 'interior',
  toimistomaalaus: 'commercial',
  ulkomaalaus: 'exterior',
  kattomaalaus: 'exterior',
  julkisivumaalaus: 'exterior',
  'aidan-maalaus': 'exterior',
  huoltomaalaus: 'exterior',
  'talon-maalaus': 'exterior',
};

const surfacesBySlug: Record<string, string[]> = {
  sisamaalaus: ['Seinät', 'Katot', 'Ovet', 'Karmit', 'Listat'],
  huoneistomaalaus: ['Huoneet', 'Seinät', 'Katot', 'Ovet', 'Listat'],
  toimistomaalaus: ['Seinät', 'Katot', 'Toimitilat'],
  ulkomaalaus: ['Julkisivu', 'Ovet', 'Ikkunapuitteet', 'Listat'],
  kattomaalaus: ['Peltikatto', 'Räystäät', 'Kourut'],
  julkisivumaalaus: ['Rappaus', 'Tiili', 'Puujulkisivu'],
  'aidan-maalaus': ['Puuaita', 'Metalliaita', 'Portit'],
  huoltomaalaus: ['Huoltokohteet', 'Paikkamaalaus'],
  'talon-maalaus': ['Julkisivu', 'Listat', 'Muut ulkopinnat'],
};

export const paintProjectServices: PaintProjectService[] = services
  .filter((service) => service.category === 'painting')
  .map((service) => ({
    slug: service.slug,
    title: service.title,
    category: categoryBySlug[service.slug] ?? 'exterior',
    surfaces: surfacesBySlug[service.slug] ?? [],
    keywords: [
      service.title.toLowerCase(),
      `${service.title.toLowerCase()} hinta`,
      `${service.title.toLowerCase()} Helsinki`,
      `${service.title.toLowerCase()} Espoo`,
      `${service.title.toLowerCase()} Vantaa`,
      `${service.title.toLowerCase()} Uusimaa`,
    ],
  }));

export const projectBuilderSeoKeywords = [
  'maalaus hinta', 'maalaus hinta-arvio', 'maalauslaskuri', 'maalaustyön hinta',
  'sisämaalaus hinta', 'seinien maalaus hinta', 'katon maalaus hinta',
  'huoneiston maalaus hinta', 'talon maalaus hinta', 'ulkomaalaus hinta',
  'julkisivumaalaus hinta', 'kattomaalaus hinta', 'maalaus Helsinki',
  'maalaus Espoo', 'maalaus Vantaa', 'maalaus Uusimaa', 'maalaus tarjous',
  'pyydä maalaustarjous', 'suunnittele maalaus', 'kokeile seinän väriä',
  'huoneen värisuunnittelu',
];
