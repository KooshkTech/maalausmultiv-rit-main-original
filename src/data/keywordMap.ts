export type KeywordIntent = 'transactional' | 'commercial' | 'informational';
export type KeywordCluster = 'painting' | 'cleaning' | 'combined';
export type KeywordPriority = 'P1' | 'P2' | 'P3';

export type KeywordTarget = {
  keyword: string;
  cluster: KeywordCluster;
  intent: KeywordIntent;
  location: string | 'general';
  priority: KeywordPriority;
  targetPath: string;
  notes: string;
};

/**
 * Master SEO map v1.
 * Search-volume numbers are intentionally NOT invented here. Validate volume,
 * CPC and current rankings in Google Search Console / Keyword Planner before
 * assigning numeric opportunity scores.
 */
export const keywordMap: KeywordTarget[] = [
  { keyword: 'maalaus', cluster: 'painting', intent: 'commercial', location: 'general', priority: 'P1', targetPath: '/palvelut', notes: 'Core category; homepage/services support.' },
  { keyword: 'maalausliike', cluster: 'painting', intent: 'commercial', location: 'general', priority: 'P1', targetPath: '/palvelut', notes: 'High commercial intent.' },
  { keyword: 'maalaustyöt', cluster: 'painting', intent: 'commercial', location: 'general', priority: 'P1', targetPath: '/palvelut', notes: 'Broad service term.' },
  { keyword: 'sisämaalaus', cluster: 'painting', intent: 'transactional', location: 'general', priority: 'P1', targetPath: '/palvelut/sisamaalaus', notes: 'Primary residential painting service.' },
  { keyword: 'ulkomaalaus', cluster: 'painting', intent: 'transactional', location: 'general', priority: 'P1', targetPath: '/palvelut/ulkomaalaus', notes: 'Primary exterior service.' },
  { keyword: 'julkisivumaalaus', cluster: 'painting', intent: 'transactional', location: 'general', priority: 'P1', targetPath: '/palvelut/julkisivumaalaus', notes: 'Strong project intent.' },
  { keyword: 'talon maalaus', cluster: 'painting', intent: 'transactional', location: 'general', priority: 'P1', targetPath: '/palvelut/talon-maalaus', notes: 'Dedicated service page; supports house-painting intent.' },
  { keyword: 'asunnon maalaus', cluster: 'painting', intent: 'transactional', location: 'general', priority: 'P1', targetPath: '/palvelut/huoneistomaalaus', notes: 'Residential intent.' },
  { keyword: 'huoneistomaalaus', cluster: 'painting', intent: 'transactional', location: 'general', priority: 'P1', targetPath: '/palvelut/huoneistomaalaus', notes: 'Existing service page.' },
  { keyword: 'toimistomaalaus', cluster: 'painting', intent: 'transactional', location: 'general', priority: 'P2', targetPath: '/palvelut/toimistomaalaus', notes: 'B2B service.' },
  { keyword: 'kattomaalaus', cluster: 'painting', intent: 'transactional', location: 'general', priority: 'P2', targetPath: '/palvelut/kattomaalaus', notes: 'Existing service page.' },
  { keyword: 'aidan maalaus', cluster: 'painting', intent: 'transactional', location: 'general', priority: 'P3', targetPath: '/palvelut/aidan-maalaus', notes: 'Long-tail service.' },

  { keyword: 'siivous', cluster: 'cleaning', intent: 'commercial', location: 'general', priority: 'P1', targetPath: '/palvelut/siivous', notes: 'Core cleaning category.' },
  { keyword: 'siivouspalvelu', cluster: 'cleaning', intent: 'commercial', location: 'general', priority: 'P1', targetPath: '/palvelut/siivous', notes: 'Core commercial term.' },
  { keyword: 'kotisiivous', cluster: 'cleaning', intent: 'transactional', location: 'general', priority: 'P1', targetPath: '/palvelut/kotisiivous', notes: 'High-intent residential service.' },
  { keyword: 'yrityssiivous', cluster: 'cleaning', intent: 'transactional', location: 'general', priority: 'P1', targetPath: '/palvelut/siivous', notes: 'Map to cleaning pillar; split later if demand supports.' },
  { keyword: 'toimistosiivous', cluster: 'cleaning', intent: 'transactional', location: 'general', priority: 'P1', targetPath: '/palvelut/toimistosiivous', notes: 'B2B intent.' },
  { keyword: 'muuttosiivous', cluster: 'cleaning', intent: 'transactional', location: 'general', priority: 'P1', targetPath: '/palvelut/muuttosiivous', notes: 'Strong event-driven intent.' },
  { keyword: 'loppusiivous', cluster: 'cleaning', intent: 'transactional', location: 'general', priority: 'P1', targetPath: '/palvelut/muuttosiivous', notes: 'Map to moving/end-of-tenancy cleaning; verify service wording.' },
  { keyword: 'remonttisiivous', cluster: 'cleaning', intent: 'transactional', location: 'general', priority: 'P1', targetPath: '/palvelut/remonttisiivous', notes: 'Important combined-project opportunity; verify exact existing slug before creating.' },
  { keyword: 'rakennussiivous', cluster: 'cleaning', intent: 'transactional', location: 'general', priority: 'P2', targetPath: '/palvelut/rakennussiivous', notes: 'B2B/project cleaning.' },
  { keyword: 'suursiivous', cluster: 'cleaning', intent: 'transactional', location: 'general', priority: 'P2', targetPath: '/palvelut/siivous', notes: 'Potential dedicated page if search demand supports it.' },
  { keyword: 'ikkunanpesu', cluster: 'cleaning', intent: 'transactional', location: 'general', priority: 'P2', targetPath: '/palvelut/ikkunan-pesu', notes: 'Existing service concept; verify slug consistency.' },
  { keyword: 'porrassiivous', cluster: 'cleaning', intent: 'transactional', location: 'general', priority: 'P3', targetPath: '/palvelut/siivous', notes: 'Do not create a page unless actually offered and demand is validated.' },

  { keyword: 'maalaus Helsinki', cluster: 'painting', intent: 'transactional', location: 'Helsinki', priority: 'P1', targetPath: '/palvelualueet/helsinki', notes: 'Location pillar.' },
  { keyword: 'maalaus Vantaa', cluster: 'painting', intent: 'transactional', location: 'Vantaa', priority: 'P1', targetPath: '/palvelualueet/vantaa', notes: 'Home-market location pillar.' },
  { keyword: 'maalaus Espoo', cluster: 'painting', intent: 'transactional', location: 'Espoo', priority: 'P1', targetPath: '/palvelualueet/espoo', notes: 'Large nearby market.' },
  { keyword: 'maalaus Porvoo', cluster: 'painting', intent: 'transactional', location: 'Porvoo', priority: 'P2', targetPath: '/palvelualueet/porvoo', notes: 'Candidate; publish only after service/travel validation.' },
  { keyword: 'sisämaalaus Helsinki', cluster: 'painting', intent: 'transactional', location: 'Helsinki', priority: 'P1', targetPath: '/sisamaalaus-helsinki', notes: 'Dedicated service + location landing page.' },
  { keyword: 'ulkomaalaus Vantaa', cluster: 'painting', intent: 'transactional', location: 'Vantaa', priority: 'P1', targetPath: '/ulkomaalaus-vantaa', notes: 'Dedicated service + location landing page.' },
  { keyword: 'julkisivumaalaus Helsinki', cluster: 'painting', intent: 'transactional', location: 'Helsinki', priority: 'P1', targetPath: '/julkisivumaalaus-helsinki', notes: 'Dedicated service + location landing page.' },

  { keyword: 'siivous Helsinki', cluster: 'cleaning', intent: 'transactional', location: 'Helsinki', priority: 'P1', targetPath: '/palvelualueet/helsinki', notes: 'Location pillar.' },
  { keyword: 'siivous Vantaa', cluster: 'cleaning', intent: 'transactional', location: 'Vantaa', priority: 'P1', targetPath: '/palvelualueet/vantaa', notes: 'Home-market location pillar.' },
  { keyword: 'siivous Espoo', cluster: 'cleaning', intent: 'transactional', location: 'Espoo', priority: 'P1', targetPath: '/palvelualueet/espoo', notes: 'Large nearby market.' },
  { keyword: 'kotisiivous Helsinki', cluster: 'cleaning', intent: 'transactional', location: 'Helsinki', priority: 'P1', targetPath: '/palvelualueet/helsinki', notes: 'High-intent residential combination.' },
  { keyword: 'kotisiivous Vantaa', cluster: 'cleaning', intent: 'transactional', location: 'Vantaa', priority: 'P1', targetPath: '/palvelualueet/vantaa', notes: 'High-intent residential combination.' },
  { keyword: 'yrityssiivous Helsinki', cluster: 'cleaning', intent: 'transactional', location: 'Helsinki', priority: 'P2', targetPath: '/palvelualueet/helsinki', notes: 'B2B local intent.' },
  { keyword: 'toimistosiivous Vantaa', cluster: 'cleaning', intent: 'transactional', location: 'Vantaa', priority: 'P2', targetPath: '/palvelualueet/vantaa', notes: 'B2B local intent.' },
  { keyword: 'muuttosiivous Helsinki', cluster: 'cleaning', intent: 'transactional', location: 'Helsinki', priority: 'P1', targetPath: '/palvelualueet/helsinki', notes: 'Strong event-driven local intent.' },

  { keyword: 'maalaus ja siivous', cluster: 'combined', intent: 'commercial', location: 'general', priority: 'P2', targetPath: '/palvelut', notes: 'Create a dedicated combined page only after validating demand and actual bundled offering.' },
  { keyword: 'remontti maalaus ja siivous', cluster: 'combined', intent: 'transactional', location: 'general', priority: 'P2', targetPath: '/palvelut', notes: 'Potential high-value project journey.' },
];
