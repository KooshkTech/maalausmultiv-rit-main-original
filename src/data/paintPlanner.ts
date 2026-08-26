export type PlannerCategory = 'interior' | 'exterior' | 'roof' | 'other';
export type SurfaceCondition = 'good' | 'fair' | 'poor' | 'unknown';
export type PaintQuality = 'standard' | 'premium';

export type PlannerSurface = {
  key: string;
  label: string;
  category: PlannerCategory;
  unit: 'm2' | 'piece';
  baseRate: number;
  description: string;
};

export const plannerCategories: Array<{ id: PlannerCategory; label: string; description: string }> = [
  { id: 'interior', label: 'Sisätilat', description: 'Seinät, katot, ovet, ikkunat, listat ja muut sisäpinnat.' },
  { id: 'exterior', label: 'Talon ulkopinnat', description: 'Julkisivu, ovet, ikkunat, räystäät, aidat, portit ja piharakenteet.' },
  { id: 'roof', label: 'Katto', description: 'Maalattavat peltikatot sekä niihin liittyvät metalliosat ja esikäsittelyt.' },
  { id: 'other', label: 'Muu maalattava kohde', description: 'Autotallit, varastot, hallit, pergolat ja muut soveltuvat pinnat.' },
];

export const plannerSurfaces: PlannerSurface[] = [
  { key: 'interior-walls', label: 'Seinät', category: 'interior', unit: 'm2', baseRate: 12, description: 'Sisäseinien valmistelu ja maalaus.' },
  { key: 'interior-ceiling', label: 'Katto', category: 'interior', unit: 'm2', baseRate: 14, description: 'Sisäkaton maalaus.' },
  { key: 'bathroom-paintable', label: 'Kylpyhuoneen maalattavat pinnat', category: 'interior', unit: 'm2', baseRate: 18, description: 'Vain maalaamiseen soveltuvat ja asianmukaisesti valmistellut pinnat.' },
  { key: 'interior-door', label: 'Ovet', category: 'interior', unit: 'piece', baseRate: 95, description: 'Oven maalaus, yksi kappale.' },
  { key: 'interior-door-frame', label: 'Oven karmit', category: 'interior', unit: 'piece', baseRate: 55, description: 'Karmien ja peitelistojen maalaus.' },
  { key: 'interior-window', label: 'Ikkunat ja puitteet', category: 'interior', unit: 'piece', baseRate: 85, description: 'Maalattavien ikkunapuitteiden käsittely.' },
  { key: 'interior-trim', label: 'Jalka- ja kattolistat', category: 'interior', unit: 'm2', baseRate: 10, description: 'Listojen maalaus laskennallisena työmääränä.' },
  { key: 'interior-cabinets', label: 'Kaapit ja kalusteovet', category: 'interior', unit: 'piece', baseRate: 75, description: 'Maalattavaksi soveltuvat kaappi- ja kalusteovet.' },
  { key: 'interior-stairs', label: 'Portaat ja kaiteet', category: 'interior', unit: 'piece', baseRate: 240, description: 'Portaikon tai kaidekokonaisuuden pintakäsittely.' },
  { key: 'radiator', label: 'Patterit ja maalattavat putket', category: 'interior', unit: 'piece', baseRate: 70, description: 'Soveltuvien metallipintojen maalaus.' },

  { key: 'facade', label: 'Julkisivu / ulkoseinät', category: 'exterior', unit: 'm2', baseRate: 18, description: 'Talon maalattavan julkisivupinnan käsittely.' },
  { key: 'plinth', label: 'Sokkeli', category: 'exterior', unit: 'm2', baseRate: 16, description: 'Maalattavaksi soveltuvan sokkelipinnan käsittely.' },
  { key: 'exterior-door', label: 'Ulko-ovet', category: 'exterior', unit: 'piece', baseRate: 135, description: 'Ulko-oven valmistelu ja maalaus.' },
  { key: 'exterior-window', label: 'Ikkunat ja ikkunanpuitteet', category: 'exterior', unit: 'piece', baseRate: 120, description: 'Ulkopuolisten maalattavien ikkunapuitteiden käsittely.' },
  { key: 'fascia', label: 'Otsa- ja räystäslaudat', category: 'exterior', unit: 'm2', baseRate: 20, description: 'Räystäs- ja otsalautojen maalaus.' },
  { key: 'balcony', label: 'Parveke ja kaiteet', category: 'exterior', unit: 'm2', baseRate: 22, description: 'Maalattavien parveke- ja kaidepintojen käsittely.' },
  { key: 'fence', label: 'Aita', category: 'exterior', unit: 'm2', baseRate: 17, description: 'Puu- tai muun soveltuvan aidan maalaus.' },
  { key: 'gate', label: 'Portti', category: 'exterior', unit: 'piece', baseRate: 145, description: 'Maalattavaksi soveltuvan portin käsittely.' },
  { key: 'deck', label: 'Terassi / ulkorakenne', category: 'exterior', unit: 'm2', baseRate: 15, description: 'Maalattavaksi tai käsiteltäväksi soveltuva ulkorakenne.' },
  { key: 'shed', label: 'Piharakennus / varasto', category: 'exterior', unit: 'm2', baseRate: 18, description: 'Piharakennuksen maalattavat ulkopinnat.' },

  { key: 'metal-roof', label: 'Peltikaton maalaus', category: 'roof', unit: 'm2', baseRate: 21, description: 'Peltikaton pintakäsittely. Soveltuvuus varmistetaan aina ennen työtä.' },
  { key: 'roof-gutters', label: 'Vesikourut', category: 'roof', unit: 'm2', baseRate: 19, description: 'Maalattavaksi soveltuvien kourujen käsittely.' },
  { key: 'roof-downpipes', label: 'Syöksytorvet', category: 'roof', unit: 'piece', baseRate: 75, description: 'Maalattavaksi soveltuvien syöksytorvien käsittely.' },
  { key: 'roof-flashings', label: 'Räystäspellit ja pellitykset', category: 'roof', unit: 'm2', baseRate: 22, description: 'Maalattavien metallipellitysten käsittely.' },

  { key: 'garage', label: 'Autotalli / autokatos', category: 'other', unit: 'm2', baseRate: 18, description: 'Maalattavien sisä- tai ulkopintojen arvio.' },
  { key: 'warehouse', label: 'Varasto / halli / työtila', category: 'other', unit: 'm2', baseRate: 16, description: 'Maalattavien pintojen arvio kohteen mukaan.' },
  { key: 'pergola', label: 'Pergola / piharakennelma', category: 'other', unit: 'm2', baseRate: 18, description: 'Maalattavaksi soveltuvan piharakennelman käsittely.' },
  { key: 'custom', label: 'Muu kohde', category: 'other', unit: 'm2', baseRate: 18, description: 'Muu maalaamiseen soveltuva pinta. Lopullinen hinta tarkistetaan aina kohdekohtaisesti.' },
];

export const conditionMultipliers: Record<SurfaceCondition, number> = {
  good: 1,
  fair: 1.2,
  poor: 1.5,
  unknown: 1.25,
};

export const qualityMultipliers: Record<PaintQuality, number> = {
  standard: 1,
  premium: 1.18,
};

export const preparationPrices = {
  washing: 3.5,
  scraping: 5,
  sanding: 4,
  repairs: 7,
  primer: 4.5,
  mouldTreatment: 3,
  rustTreatment: 6,
} as const;

export const plannerPricing = {
  minimumJob: 350,
  secondCoatMultiplier: 1.22,
  difficultAccessMultiplier: 1.18,
  estimateLowMultiplier: 0.9,
  estimateHighMultiplier: 1.15,
  currency: 'EUR',
  pricingVersion: 'v17-initial-review-required',
};

export const commonColors = [
  { name: 'Valkoinen', hex: '#F7F5EF' },
  { name: 'Lämmin valkoinen', hex: '#EFE9DD' },
  { name: 'Vaalea harmaa', hex: '#C9CBC8' },
  { name: 'Harmaa', hex: '#8A8E8B' },
  { name: 'Grafiitti', hex: '#3D4142' },
  { name: 'Musta', hex: '#17191A' },
  { name: 'Beige', hex: '#C6B59D' },
  { name: 'Punamulta', hex: '#8A3F32' },
  { name: 'Tummanvihreä', hex: '#334A3E' },
  { name: 'Sinisenharmaa', hex: '#667785' },
];
