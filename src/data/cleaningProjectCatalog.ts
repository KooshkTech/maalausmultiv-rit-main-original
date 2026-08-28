import { services } from '@/data/services';

export type CleaningPlannerService = {
  slug: string;
  title: string;
  surfaces: string[];
  keywords: string[];
};

const surfacesBySlug: Record<string, string[]> = {
  'julkisivun-pesu': ['Julkisivu', 'Rappaus', 'Tiili', 'Puupinta'],
  'ikkunan-pesu': ['Ikkunat', 'Karmit', 'Kehykset'],
  kattosiivous: ['Katto', 'Rännit', 'Räystäät'],
  yrityssiivous: ['Työpisteet', 'Lattiat', 'WC-tilat', 'Keittiö', 'Yhteiset tilat'],
  toimistosiivous: ['Työpisteet', 'Lattiat', 'WC-tilat', 'Keittiö', 'Neuvottelutilat'],
  kotisiivous: ['Keittiö', 'Kylpyhuone', 'WC', 'Lattiat', 'Pinnat'],
  muuttosiivous: ['Keittiö', 'Kylpyhuone', 'WC', 'Kaapit', 'Lattiat', 'Pinnat'],
};

export const cleaningPlannerServices: CleaningPlannerService[] = services
  .filter((service) => service.category === 'cleaning')
  .map((service) => ({
    slug: service.slug,
    title: service.title,
    surfaces: surfacesBySlug[service.slug] ?? ['Pinnat', 'Lattiat', 'Erityiskohteet'],
    keywords: [
      service.title.toLowerCase(),
      `${service.title.toLowerCase()} hinta`,
      `${service.title.toLowerCase()} Helsinki`,
      `${service.title.toLowerCase()} Espoo`,
      `${service.title.toLowerCase()} Vantaa`,
      `${service.title.toLowerCase()} Uusimaa`,
    ],
  }));

export const searchConsoleCleaningPriorities = [
  'toimistosiivous Vantaa',
  'yrityssiivous Vantaa',
  'yrityssiivous Espoo',
  'toimistosiivous Espoo',
  'yrityssiivous',
];

export const cleaningPlannerSeoKeywords = [
  'siivous Helsinki',
  'siivous Espoo',
  'siivous Vantaa',
  'siivous Uusimaa',
  'siivouspalvelu',
  'siivousfirma',
  'siivousyritys',
  'siivooja',
  'siivous hinta',
  'siivous hinta-arvio',
  'siivous tarjous',
  'siivouslaskuri',
  'yrityssiivous',
  'yrityssiivous Helsinki',
  'yrityssiivous Espoo',
  'yrityssiivous Vantaa',
  'toimistosiivous',
  'toimistosiivous Helsinki',
  'toimistosiivous Espoo',
  'toimistosiivous Vantaa',
  'toimitilasiivous',
  'kotisiivous',
  'perussiivous',
  'perusteellinen siivous',
  'muuttosiivous',
  'loppusiivous',
  'WC:n siivous',
  'kylpyhuoneen siivous',
  'keittiön siivous',
];
