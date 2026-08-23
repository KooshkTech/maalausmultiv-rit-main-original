export const priorityLocalServiceSlugs = [
  'talon-maalaus',
  'ulkomaalaus',
  'sisamaalaus',
  'julkisivumaalaus',
  'kattomaalaus',
] as const;

export const priorityLocalCitySlugs = ['helsinki', 'espoo', 'vantaa'] as const;

export const hasPriorityLocalPage = (serviceSlug: string, citySlug: string) =>
  (priorityLocalServiceSlugs as readonly string[]).includes(serviceSlug) &&
  (priorityLocalCitySlugs as readonly string[]).includes(citySlug);

export const localServicePath = (serviceSlug: string, citySlug: string) =>
  hasPriorityLocalPage(serviceSlug, citySlug)
    ? `/palvelut/${serviceSlug}/${citySlug}`
    : `/palvelut/${serviceSlug}`;
