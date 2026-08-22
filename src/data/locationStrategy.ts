export type LocationTier = 'core' | 'growth' | 'expansion' | 'research';

export type LocationTarget = {
  slug: string;
  name: string;
  tier: LocationTier;
  priority: 'P1' | 'P2' | 'P3';
  status: 'active-page' | 'candidate' | 'research-first';
  note: string;
};

/**
 * Location strategy for the 200 km commercial service radius.
 *
 * IMPORTANT:
 * - These are marketing/SEO targets, not a claim that every location is currently served.
 * - Candidate locations must be validated for travel feasibility, demand and actual service availability
 *   before a dedicated SEO page is published.
 * - Do not generate thin city pages programmatically.
 */
export const locationStrategy: LocationTarget[] = [
  { slug: 'vantaa', name: 'Vantaa', tier: 'core', priority: 'P1', status: 'active-page', note: 'Home market and primary local SEO area.' },
  { slug: 'helsinki', name: 'Helsinki', tier: 'core', priority: 'P1', status: 'active-page', note: 'Largest nearby market and high commercial intent.' },
  { slug: 'espoo', name: 'Espoo', tier: 'core', priority: 'P1', status: 'active-page', note: 'Large nearby residential and business market.' },
  { slug: 'kauniainen', name: 'Kauniainen', tier: 'core', priority: 'P1', status: 'active-page', note: 'Nearby premium residential market.' },
  { slug: 'kerava', name: 'Kerava', tier: 'core', priority: 'P1', status: 'active-page', note: 'Immediate commuter-area market.' },
  { slug: 'jarvenpaa', name: 'Järvenpää', tier: 'core', priority: 'P1', status: 'active-page', note: 'Immediate northern growth market.' },
  { slug: 'kirkkonummi', name: 'Kirkkonummi', tier: 'core', priority: 'P1', status: 'active-page', note: 'Nearby western/rural-residential market.' },
  { slug: 'nurmijarvi', name: 'Nurmijärvi', tier: 'core', priority: 'P1', status: 'active-page', note: 'Large residential municipality with strong detached-home potential.' },
  { slug: 'sipoo', name: 'Sipoo', tier: 'core', priority: 'P1', status: 'active-page', note: 'Nearby eastern residential market.' },
  { slug: 'hyvinkaa', name: 'Hyvinkää', tier: 'core', priority: 'P1', status: 'active-page', note: 'Established northern Uusimaa market.' },

  { slug: 'porvoo', name: 'Porvoo', tier: 'growth', priority: 'P2', status: 'candidate', note: 'High-priority expansion candidate; validate demand and travel economics.' },
  { slug: 'lohja', name: 'Lohja', tier: 'growth', priority: 'P2', status: 'candidate', note: 'Western Uusimaa growth candidate.' },
  { slug: 'vihti', name: 'Vihti', tier: 'growth', priority: 'P2', status: 'candidate', note: 'Natural expansion from the western/northwestern corridor.' },
  { slug: 'tuusula', name: 'Tuusula', tier: 'growth', priority: 'P2', status: 'candidate', note: 'Strong proximity and residential demand candidate.' },
  { slug: 'maentsaelae', name: 'Mäntsälä', tier: 'growth', priority: 'P2', status: 'candidate', note: 'Northern Uusimaa expansion candidate.' },
  { slug: 'raasepori', name: 'Raasepori', tier: 'growth', priority: 'P2', status: 'candidate', note: 'Longer western-Uusimaa candidate; verify travel feasibility.' },
  { slug: 'hanko', name: 'Hanko', tier: 'growth', priority: 'P2', status: 'candidate', note: 'Longer-distance coastal candidate; verify project economics.' },
  { slug: 'loviisa', name: 'Loviisa', tier: 'growth', priority: 'P2', status: 'candidate', note: 'Eastern Uusimaa candidate.' },
  { slug: 'riihimaeki', name: 'Riihimäki', tier: 'growth', priority: 'P2', status: 'candidate', note: 'Northern corridor candidate.' },

  { slug: 'hameenlinna', name: 'Hämeenlinna', tier: 'expansion', priority: 'P3', status: 'candidate', note: 'Potential longer-distance market; validate search demand before page creation.' },
  { slug: 'lahti', name: 'Lahti', tier: 'expansion', priority: 'P3', status: 'candidate', note: 'Potential high-volume market; requires travel and competition analysis.' },
  { slug: 'kotka', name: 'Kotka', tier: 'expansion', priority: 'P3', status: 'candidate', note: 'Eastern expansion candidate; validate project economics.' },
  { slug: 'kouvola', name: 'Kouvola', tier: 'expansion', priority: 'P3', status: 'candidate', note: 'Longer eastern expansion candidate.' },
  { slug: 'salo', name: 'Salo', tier: 'expansion', priority: 'P3', status: 'candidate', note: 'Southwestern expansion candidate.' },
  { slug: 'turku', name: 'Turku', tier: 'expansion', priority: 'P3', status: 'candidate', note: 'Large market but farther away; validate profitability first.' },
  { slug: 'tampere', name: 'Tampere', tier: 'expansion', priority: 'P3', status: 'research-first', note: 'Large market but distance may exceed practical service economics; verify before targeting.' },
];

export const uniqueLocationStrategy = locationStrategy.filter(
  (location, index, all) => all.findIndex((item) => item.slug === location.slug) === index,
);

export const locationTierLabels: Record<LocationTier, string> = {
  core: 'Lähialueet',
  growth: 'Kasvualueet',
  expansion: 'Laajentumisalueet',
  research: 'Tutkittavat alueet',
};
