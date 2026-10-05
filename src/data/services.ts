export type ServiceCategory = 'painting' | 'cleaning';

export type Service = {
  slug: string;
  title: string;
  category: ServiceCategory;
  short: string;
  description: string;
  bullets: string[];
  image: string;
};

export const serviceCategories: {
  id: ServiceCategory;
  label: string;
  shortLabel: string;
}[] = [
  {
    id: 'painting',
    label: 'Maalauspalvelut',
    shortLabel: 'Maalaus',
  },
  {
    id: 'cleaning',
    label: 'Siivouspalvelut',
    shortLabel: 'Siivous',
  },
];

import { images } from '@/config/images';

const PRICE_TAG = 'Pyydä ilmainen tarjous';

export const services: Service[] = [
  // ============================================================
  // PAINTING SERVICES
  // ============================================================

  {
    slug: 'ulkomaalaus',
    title: 'Ulkomaalaus',
    category: 'painting',
    short: 'Kokonaisvaltainen ulkomaalaus talosi kuntoon.',
    description:
      'Kokonaisvaltainen ulkomaalaus ammattimaisesti toteutettuna. Huolehdimme pintojen esikäsittelystä, pohjustuksesta ja maalauksesta alusta loppuun, jotta talosi kestää sään ja ajan. Käy[...]',
    bullets: [
      'Poraus-, harjaus- ja painepesu esikäsittely',
      'Pohjustus ja halkeamien kunnostus',
      'Kaksi maalauskerrosta sääluokiteltua maalia',
      'Koristelistojen ja ikkunapäiden maalaus',
      'Takuu työjäljestä 2 vuotta',
    ],
    image: images.services.ulkomaalaus,
  },

  {
    slug: 'kattomaalaus',
    title: 'Kattomaalaus',
    category: 'painting',
    short: 'Peltokattojen pesu, pinnoitus ja uudelleenmaalaus.',
    description:
      'Peltokattojen ammattimainen pesu, ruosteenpoisto ja pinnoitus. Palautamme katon alkuperäiseen kuntoon ja suojaamme sen ruostumiselta. Käytämme kattomaaleja, jotka heijastavat lämpösät[...]',
    bullets: [
      'Katon pesu ja rikkaruohojen poisto',
      'Ruosteen poisto ja eristysmaalaus',
      'Lämpösäteilyä heijastava kattopinnoite',
      'Räystäiden ja kourujen käsittely',
      'Väri ja kiilto kestäväksi',
    ],
    image: images.services.kattomaalaus,
  },

  {
    slug: 'julkisivumaalaus',
    title: 'Julkisivumaalaus',
    category: 'painting',
    short: 'Rappaus-, tiili- ja paneelijulkisivujen maalaus.',
    description:
      'Julkisivujen maalaus rappaus-, tiili- ja puujulkisivuille. Valitsemme oikean maalityypin julkisivumateriaalin mukaan ja varmistamme, että lopputulos on kestävä ja visuaalisesti yhtenäin[...]',
    bullets: [
      'Materiaalikohtainen pintakäsittely',
      'Halkeamien ja kolhioiden korjaus',
      'Hengittävät ja sääkestävät maalit',
      'Värikartoitus ja näytemaalaus',
      'Sopii omakoti- ja kerrostaloille',
    ],
    image: images.services.julkisivumaalaus,
  },

  {
    slug: 'sisamaalaus',
    title: 'Sisämaalaus',
    category: 'painting',
    short: 'Kodin sisäpintojen maalaus ammattimaisesti.',
    description:
      'Sisämaalaus koteihin, asuntoihin ja toimitiloihin. Maalaamme seinät, katot, listat ja ovet siististi ja nopeasti. Suojamme kalusteet ja lattiat huolellisesti, ja jätämme tilan puhtaana.[...]',
    bullets: [
      'Seinien, kattojen ja listojen maalaus',
      'Ovien ja karmien maalaus',
      'Matalahajuiset sisämaalit',
      'Kalusteiden ja lattian suojaus',
      'Siisti ja nopea toteutus',
    ],
    image: images.services.sisamaalaus,
  },

  {
    slug: 'huoneistomaalaus',
    title: 'Huoneistomaalaus',
    category: 'painting',
    short: 'Asuntojen maalaus muuton, remontin tai päivityksen yhteydessä.',
    description:
      'Huoneistomaalaus asuntoihin — olipa kyseessä muutto, remontti tai päivitys. Maalaamme koko asunnon tai yksittäiset huoneet ammattimaisesti. Sovimme ajankohdan joustavasti, ja työn j[...]',
    bullets: [
      'Koko asunnon tai yksittäisten huoneiden maalaus',
      'Listat, ovet ja karmien maalaus',
      'Tapetin poisto ja pintojen tasoitus',
      'Joustavat ajankohdat',
      'Siisti lopputulos',
    ],
    image: images.services.huoneistomaalaus,
  },

  {
    slug: 'toimistomaalaus',
    title: 'Toimistomaalaus',
    category: 'painting',
    short: 'Toimistojen ja toimitilojen maalaus häiritsemättä arkea.',
    description:
      'Toimistomaalaus yrityksille ja toimitiloille. Maalaamme toimistot, vastaanotot ja kokoontumistilat ammattimaisesti — joustavasti ilta- tai viikonlopputöinä, jotta työsi ei keskeydy. K[...]',
    bullets: [
      'Toimistojen ja toimitilojen maalaus',
      'Ilta- ja viikonlopputöinä mahdollista',
      'Matalahajuiset ja nopeasti kuivuvat maalit',
      'Kalusteiden suojaus ja siistius',
      'Joustavat sopimukset yrityksille',
    ],
    image: images.services.toimistomaalaus,
  },

  {
    slug: 'aidan-maalaus',
    title: 'Aidan maalaus',
    category: 'painting',
    short: 'Puuaitojen, metalliaitojen ja porttien maalaus.',
    description:
      'Puuaitojen, metalliaitojen ja porttien maalaus ja pinnoitus. Puhdistamme pinnat perusteellisesti, korjaamme irtoavat laudat ja levitämme suojaavan maalipinnoitteen, joka kestää kosteutt[...]',
    bullets: [
      'Puhdistus ja irtoavan maalin poisto',
      'Pohjustus laudoille ja metallille',
      'Kaksi maalauskerrosta UV-suojaista maalia',
      'Porttien ja sarakkeiden käsittely',
      'Nopea ja siisti toteutus',
    ],
    image: images.services.aidanMaalaus,
  },

  {
    slug: 'huoltomaalaus',
    title: 'Huoltomaalaus',
    category: 'painting',
    short: 'Säännöllinen huolto pitää pinnat aina kunnossa.',
    description:
      'Säännöllinen huoltomaalaus on edullisin tapa ylläpitää talosi arvoa ja estää suuremmat korjaustyöt. Käymme paikan päällä sopivin väliajoin tarkistamassa pintakunnon ja teemme[...]',
    bullets: [
      'Vuotuiset tarkastuskäynnit',
      'Paikkaus- ja uusintamaalaustyöt',
      'Materiaalien ja pintojen kunnon seuranta',
      'Joustavat sopimusasiakashinnat',
      'Muistutukset ennen sesonkia',
    ],
    image: images.services.huoltomaalaus,
  },

  {
    slug: 'talon-maalaus',
    title: 'Talon maalaus',
    category: 'painting',
    short: 'Omakotitalon ja pientalon maalaus ulkoa ja tarvittaessa sisältä.',
    description:
      'Talon maalaus kokonaisuutena suunniteltuna pientaloille ja omakotitaloille. Arvioimme pintojen kunnon, teemme tarvittavat esityöt ja toteutamme maalauksen siististi sovitun aikataulun muk[...]',
    bullets: [
      'Pintojen kuntotarkastus ja ilmainen tarjous',
      'Pesu, kaapiminen ja tarvittavat korjaukset',
      'Pohjustus ja materiaalille sopiva maali',
      'Julkisivun, listojen ja muiden sovittujen pintojen maalaus',
      'Huolellinen suojaus ja siisti loppusiivous',
    ],
    image: images.services.ulkomaalaus,
  },

  // ============================================================
  // CLEANING SERVICES
  // ============================================================

  {
    slug: 'julkisivun-pesu',
    title: 'Julkisivun pesu',
    category: 'cleaning',
    short: 'Julkisivujen ammattimainen pesu ja puhdistus.',
    description:
      'Julkisivujen ammattimainen pesu ja puhdistus kaikille pintatyypeille. Poistamme lian, sammaleen ja ilmansaasteet hellävaraisesti oikeanlaisilla menetelmillä ja pesuaineilla, jotta julkis[...]',
    bullets: [
      'Rappaus-, tiili- ja paneelijulkisivujen pesu',
      'Sammaleen, levän ja ilmansaasteiden poisto',
      'Materiaaliystävälliset pesuaineet',
      'Korkeapainepesu ja harjaus',
      'Suojataan kasvillisuus ja pihat',
    ],
    image: images.services.julkisivunPesu,
  },

  {
    slug: 'ikkunan-pesu',
    title: 'Ikkunanpesu',
    category: 'cleaning',
    short: 'Kodin ja yrityksen ikkunoiden ammattimainen pesu.',
    description:
      'Ikkunoiden ammattimainen pesu koteihin, taloyhtiöihin ja yrityksiin. Pesemme lasit, karmit ja kehykset huolellisesti turvallisilla menetelmillä — myös yläkerroksissa. Kirkkaat ikkuna[...]',
    bullets: [
      'Lasipintojen, karmin ja kehysten pesu',
      'Tikkaat ja turvavaljaat yläkerroksiin',
      'Pintavesien käsittely ja kiillotus',
      'Sopii kodeille, taloyhtiöille ja yrityksille',
      'Sesonkisopimukset keväälle ja syksylle',
    ],
    image: images.services.ikkunanPesu,
  },

  {
    slug: 'kattosiivous',
    title: 'Katon siivous',
    category: 'cleaning',
    short: 'Kattojen puhdistus sammaleesta, lehvistä ja liasta.',
    description:
      'Kattojen ammattimainen puhdistus ja siivous. Poistamme sammaleen, lehvät, oksat ja lian katolta hellävaraisilla menetelmillä, jotka eivät vahingoita katteen pintaa. Puhdas katto näytt[...]',
    bullets: [
      'Sammaleen ja levän poisto katolta',
      'Lehvien ja oksien siivous',
      'Rännien ja räystäiden puhdistus',
      'Katon kunnon tarkastus samalla',
      'Turvalliset menetelmät ja varusteet',
    ],
    image: images.services.kattosiivous,
  },

  {
    slug: 'remonttisiivous',
    title: 'Remonttisiivous',
    category: 'cleaning',
    short: 'Remontin jälkeinen perusteellinen siivous ennen käyttöönottoa tai luovutusta.',
    description:
      'Remonttisiivous poistaa rakennus- ja remonttipölyn, roiskeet sekä muun työn jälkeisen lian, jotta tila on valmis käyttöön. Palvelu sopii koteihin, asuntoihin, toimitiloihin ja raken[...]',
    bullets: [
      'Rakennus- ja remonttipölyn perusteellinen poisto',
      'Maalijäämien ja muiden työn jälkien puhdistus sovituilta pinnoilta',
      'Lattioiden, pintojen ja ikkunoiden puhdistus tarpeen mukaan',
      'Käyttöönottoa tai luovutusta varten tehtävä loppusiivous',
      'Kohdekohtainen tarjous ja aikataulu',
    ],
    image: images.services.rakennussiivous,
  },

  {
    slug: 'toimistosiivous',
    title: 'Toimistosiivous',
    category: 'cleaning',
    short: 'Toimistojen ja toimitilojen säännöllinen siivous yrityksille.',
    description:
      'Ammattimaisesti toteutettu toimistosiivous eli yrityssiivous toimistoihin, neuvottelutiloihin, vastaanottoihin ja muihin toimitiloihin. Sovitamme siivouksen tilojen kokoon, käyttöön ja aikatauluun — säännöllisesti, kertaluonteisesti tai joustavasti työajan ulkopuolella. Huolehdimme, että työympäristö pysyy puhtaana ilman turhaa häiriötä. Palvelemme pieniä toimistoja, suurempia toimitiloja ja yritysten asiakaspalvelutiloja koko Uudellamaalla.',
    bullets: [
      'Säännöllinen tai kertaluonteinen toimistosiivous',
      'Työpisteiden, pintojen ja kosketuspintojen puhdistus',
      'Lattioiden, keittiötilojen ja saniteettitilojen siivous',
      'Aikataulutus työajan ulkopuolelle tarvittaessa',
      'Selkeä palvelusisältö ja luotettava toiminta',
    ],
    image: images.services.toimistosiivous,
  },

  {
    slug: 'rakennussiivous',
    title: 'Rakennussiivous',
    category: 'cleaning',
    short: 'Loppusiivous rakennustyömaan jälkeen.',
    description:
      'Rakennussiivous eli loppusiivous uuden tai remontoidun kohteen valmistuttua. Poistamme rakennuspölyn, maaliroiskeet ja jätteet valmiista tilasta, jotta asunto tai toimitila on valmis kä[...]',
    bullets: [
      'Loppusiivous valmiiseen kohteeseen',
      'Rakennuspölyn ja maaliroiskeiden poisto',
      'Ikkunoiden, pintojen ja lattioiden puhdistus',
      'Jätteiden poiskorjaus',
      'Sopii rakennusliikkeille ja yksityisille',
    ],
    image: images.services.rakennussiivous,
  },

  {
    slug: 'muuttosiivous',
    title: 'Muuttosiivous',
    category: 'cleaning',
    short: 'Muuton yhteydessä tehtävä siivous — sisään tai ulos.',
    description:
      'Muuttosiivous asuntoon muutettaessa tai sieltä pois muutettaessa. Siivoamme vanhan asunnon ennen avaimenluovutusta tai uuden asunnon ennen kalustamista. Joustamme aikataulun muuttoaikatau[...]',
    bullets: [
      'Sisään- tai ulosmuuttosiivous',
      'Lattiat, pinnat, kylpyhuone ja keittiö',
      'Joustava aikataulu muuton mukaan',
      'Kotitalousvähennyskelpoinen',
      'Asunto valmis avaimenluovutukseen',
    ],
    image: images.services.muuttosiivous,
  },

  {
    slug: 'paivakodin-siivous',
    title: 'Päiväkodin siivous',
    category: 'cleaning',
    short: 'Päiväkotien säännöllinen siivous — turvallinen ja hellävarainen.',
    description:
      'Päiväkotien ja leikkikoulujen ammattimainen siivous. Käytämme ympäristöystävällisiä ja lapsille turvallisia puhdistusaineita. Siivoamme tilat lasten ollessa poissa, jotta leikki- [...]',
    bullets: [
      'Säännöllinen siivoussopimus',
      'Lapsille turvalliset puhdistusaineet',
      'Lasten ollessa poissa',
      'Leikki-, ruokailu- ja saniteettitilat',
      'Ympäristöystävällinen ja hellävarainen',
    ],
    image: images.services.paivakodinSiivous,
  },

  {
    slug: 'koulun-siivous',
    title: 'Koulun siivous',
    category: 'cleaning',
    short: 'Koulujen ja oppilaitosten säännöllinen siivous.',
    description:
      'Koulujen, oppilaitosten ja lukioiden ammattimainen siivous. Siivoamme luokkahuoneet, käytävät, voimistelutilat ja saniteettitilat oppilaiden ollessa poissa. Huolehdimme hygieniatason ka[...]',
    bullets: [
      'Säännöllinen siivoussopimus',
      'Luokkahuoneet, käytävät ja saniteettitilat',
      'Oppilaiden ollessa poissa',
      'Ympäristöystävälliset puhdistusaineet',
      'Joustavat sopimukset oppilaitoksille',
    ],
    image: images.services.koulunSiivous,
  },

  {
    slug: 'hoivakodin-siivous',
    title: 'Hoivakodin siivous',
    category: 'cleaning',
    short: 'Hoivakotien ja hoivayksiköiden ammattimainen siivous.',
    description:
      'Hoivakotien, palvelutalojen ja hoivayksiköiden siivous. Huolehdimme korkeasta hygieniatasosta herkillä puhdistusaineilla, jotka sopivat iäkkäille ja allergisille asukkaille. Siivoamme [...]',
    bullets: [
      'Säännöllinen siivoussopimus',
      'Herkät ja hajuttomat puhdistusaineet',
      'Asuin- ja yhteistilat sekä saniteettitilat',
      'Asukkaiden arkea kunnioittaen',
      'Korkea hygieniataso',
    ],
    image: images.services.hoivakodinSiivous,
  },

  {
    slug: 'pihan-kunnostus',
    title: 'Pihan ja terassin kunnostus',
    category: 'cleaning',
    short: 'Pihojen, terassien ja laatoitusten pesu ja hoito.',
    description:
      'Pihojen, terassien, laatoitusten ja kivipintojen ammattimainen pesu ja kunnostus. Pesemme likaantuneet pinnat korkeapainepesulla, poistamme sammaleen ja levän sekä suojaamme puupinnat uu[...]',
    bullets: [
      'Kivilaatoitusten ja betonin pesu',
      'Puuterassien pesu ja öljyäys/suojaus',
      'Sammaleen ja rikkaruohojen poisto',
      'Ritilöiden ja rännien puhdistus',
      'Suojaus sää- ja likahaittoja vastaan',
    ],
    image: images.services.pihanKunnostus,
  },
];

export const getService = (slug: string) =>
  services.find((s) => s.slug === slug);

/** Looks up a service by its exact display title — used to link free-text
 * category labels (e.g. project cards) back to their service page. */
export const getServiceByTitle = (title: string) =>
  services.find((s) => s.title === title);

export const getServicesByCategory = (category: ServiceCategory) =>
  services.filter((s) => s.category === category);

export const getPaintingServices = () =>
  getServicesByCategory('painting');

export const getCleaningServices = () =>
  getServicesByCategory('cleaning');

export const priceTag = PRICE_TAG;
