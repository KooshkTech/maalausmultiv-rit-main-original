export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  date: string;
  author: string;
  category: string;
  readingTime: string;
  /** Slugs of related service pages (src/data/services.ts) shown as internal links. */
  relatedServices: string[];
};

import { images } from '@/config/images';

export const blogPosts: BlogPost[] = [
  {
    slug: 'ulkomaalauksen-ajankohta',
    title: 'Milloin ulkomaalaus kannattaa tehdä? Opas ajankohdan valintaan',
    excerpt:
      'Oikea ajankohta on ratkaiseva ulkomaalauksen onnistumiselle. Kerromme, milloin sääolosuhteet ovat parhaat ja miten varaudut sesongin ruuhkaan.',
    image: images.blog['ulkomaalauksen-ajankohta'],
    date: '2024-10-12',
    author: 'Maalaus Multiväri',
    category: 'Ulkomaalaus',
    readingTime: '5 min',
    relatedServices: ['ulkomaalaus', 'julkisivumaalaus', 'talon-maalaus'],
    content: [
      'Ulkomaalaus on investointi, joka kannattaa ajoittaa oikein. Maalipinnan kestävyys riippuu suuresti siitä, että maali pääsee kuivumaan ja tarttumaan pintaan oikeissa olosuhteissa. Liian kylmä, liian kostea tai liian kuuma ilma voi heikentää lopputulosta merkittävästi.',
      'Paras maalaussää vallitsee tyypillisesti toukokuun puolivälistä syyskuun alkuun. Tällöin lämpötila pysyy yli +10 asteessa, suhteellinen kosteus on sopiva ja pinta on ehtinyt kuivua kevään sateista. Kesäkuu ja heinäkuu ovat sesonkia, jolloin ammattilaisten kalenterit täyttyvät nopeasti.',
      'Varaa aikaa ajoissa. Suosittelemme ottamaan yhteyttä jo helmikuussa tai maaliskuussa, jotta ehdit sopimaan parhaat ajankohdat ennen kuin kausi käynnistyy. Esikäsittely voidaan aloittaa jo viileässä, mutta itse maalaus vaatii lämmintä säätä.',
      'Syyskuun alku on usein aliarvostettu ajankohta. Ilmat ovat vielä riittävän lämpimät, mutta sesonkipaine on jo lauennut ja aikataulut joustavat paremmin. Vältä kuitenkaan lokakuuta, sillä yöpakkaset voivat yllättää.',
      'Yhteenvetona: paras ajankohta on kuiva, yli +10 asteinen jakso toukokuun puolivälin ja syyskuun alun välillä. Varhainen varaus takaa parhaat ajankohdat ja riittävän miettimisajan tarjoukselle.',
    ],
  },
  {
    slug: 'julkisivun-hoito-ja-pesu',
    title: 'Julkisivun hoito ja painepesu: pidä talosi nuorena',
    excerpt:
      'Säännöllinen pesu ja hoito pidentävät maalipinnan elinikää useilla vuosilla. Näin teet sen oikein.',
    image: images.blog['julkisivun-hoito-ja-pesu'],
    date: '2024-09-28',
    author: 'Maalaus Multiväri',
    category: 'Ulkomaalaus',
    readingTime: '4 min',
    relatedServices: ['julkisivun-pesu', 'julkisivumaalaus', 'huoltomaalaus'],
    content: [
      'Julkisivun säännöllinen hoito on edullisin tapa ylläpitää talosi arvoa. Likainen julkisivu ei vain näytä huonolta — sammal, levä ja lika pidättävät kosteutta ja lyhentävät maalipinnan ikää.',
      'Painepesu on tehokas tapa poistaa likaa ja kasvustoa. Pesu kannattaa tehdä kerran vuodessa tai kahden vuoden välein, riippuen kohteen sijainnista ja ympäristöstä. Varjoisat ja kosteat paikat vaativat useampaa pesua.',
      'Pesussa on tärkeää käyttää oikeaa painetta ja pesuainetta. Liian kova paine voi vahingoittaa maalipintaa tai puuta, ja väärä pesuaine voi kirjautua pintoihin. Ammattilainen osaa valita oikeat menetelmät eri materiaaleille.',
      'Pesun jälkeen pinta kannattaa tarkastaa huolellisesti. Jos maalipinnassa on irtoavaa maalia, halkeamia tai paljaita kohtia, ne kannattaa korjata pian ennen kuin vaurio pahenee. Pieni paikkaus on aina edullisempaa kuin kokonaisuudistus.',
      'Säännöllinen hoito ja oikea-aikainen kunnossapito pidentävät maalipinnan elinikää useilla vuosilla ja säästävät pitkällä tähtäimellä huomattavasti kuluja.',
    ],
  },
  {
    slug: 'mita-valita-puunsuoja-tiili',
    title: 'Maalityypin valinta: puunsuoja vai tiilijulkisivun maali?',
    excerpt:
      'Eri pinnat vaativat eri maalityypit. Käymme läpi yleisimmät pintamateriaalit ja niihin sopivat tuotteet.',
    image: images.blog['mita-valita-puunsuoja-tiili'],
    date: '2024-09-05',
    author: 'Maalaus Multiväri',
    category: 'Maalausvinkit',
    readingTime: '6 min',
    relatedServices: ['julkisivumaalaus', 'ulkomaalaus', 'kattomaalaus'],
    content: [
      'Oikean maalityypin valinta on ratkaisevaa työn kestävyydelle. Eri pintamateriaalit vaativat erilaisia tuotteita, ja väärä valinta voi lyhentää maalipinnan ikää useilla vuosilla.',
      'Puujulkisivut on perinteisesti maalattu puunsuojamaalilla, joka imeytyy puuhun ja muodostaa hengittävän pinnoitteen. Vaihtoehtoja ovat peittävä akrylaattimaali, joka muodostaa kalvon pinnalle, sekä puunsuoja, joka korostaa puun rakennetta. Valinta riippuu halutusta lopputuloksesta ja pintamateriaalin kunnosta.',
      'Rapatut julkisivut vaativat mineraali- tai silikoonimaalia, jotka hengittävät ja kestävät alkalisia pintoja. Muovimaali ei sovi rapatulle pinnalle, koska se estää kosteuden haihtumisen ja voi johtaa rapautumiseen.',
      'Tiili- ja kivityyppiset pinnat maalataan joko mineraalimaalilla tai erikoisvalmisteisella tiilimaalilla. Pesu ja mahdollinen ruosteenpoisto ovat usein edellytyksenä tarttuvuudelle.',
      'Peltopinnat, kuten katot ja räystäät, vaativat ruostetta kestävän erikoismaalin. Pinnoitus tulisi tehdä säännöllisin väliajoin, jotta ruoste ei pääse etenemään.',
      'Yhteenvetona: maalityypin valinta on ammattilaisen työtä. Esikatselussa arvioimme pintamateriaalin, kunnon ja halutun lopputuloksen, ja suosittelemme oikeaa tuotetta kullekin kohteelle.',
    ],
  },
  {
    slug: 'valitse-vari-julkisivuun',
    title: 'Näin valitset täydellisen värin julkisivuun',
    excerpt:
      'Värivalinta vaikuttaa talosi ilmeeseen vuosikymmenten ajan. Asiantuntijan vinkit auttavat päättämään.',
    image: images.blog['valitse-vari-julkisivuun'],
    date: '2024-08-15',
    author: 'Maalaus Multiväri',
    category: 'Väri-inspiraatio',
    readingTime: '4 min',
    relatedServices: ['julkisivumaalaus', 'ulkomaalaus'],
    content: [
      'Värivalinta on yksi julkisivumaalauksen tärkeimmistä päätöksistä. Väri vaikuttaa talasi ilmeeseen, ympäristön sopivuuteen ja jopa kiinteistön arvoon. Siksi valintaan kannattaa käyttää tarpeeksi aikaa.',
      'Aloita ympäristön tarkastelusta. Katso naapuruston värejä ja talon arkkitehtuuria. Perinteinen puutalo sopii usein klassisiin sävyihin, kuten punamultaan, keltaiseen tai vaaleansiniseen. Modernimpi talo kestää rohkeampia sävyjä ja suurempia kontrasteja.',
      'Muista, että väri näyttää erilaiselta suurilla pinnoilla kuin pienessä näytekappaleessa. Aina kannattaa maalata näyte suoraan julkisivuun ja tarkastella sitä eri valon aikoina: aamulla, keskipäivällä ja illalla.',
      'Listat, ikkunapielet ja ovet antavat mahdollisuuden kontrasteihin. Vaalea runko ja tummat listat luovat klassisen ilmeen, kun taas yhtenäinen väri antaa modernin ja rauhallisen vaikutelman.',
      'Lopuksi: kuuntele intuition lisäksi asiantuntijaa. Maalausammattilainen näkee tuhansia kohteita ja osaa suositella sävyjä, jotka toimivat parhaiten juuri sinun talollesi ja ympäristöösi.',
    ],
  },
  {
    slug: 'sisamaalauksen-kustannukset',
    title: 'Mitä sisämaalaus maksaa? Kustannusopas asunnon maalaukseen',
    excerpt:
      'Laskimme esimerkkejä sisämaalauksen hinnoista eri asunnoissa. Katso, miten pinta-ala, maalin laatu ja pintojen kunto vaikuttavat hintaan.',
    image: images.blog['sisamaalauksen-kustannukset'],
    date: '2024-07-20',
    author: 'Maalaus Multiväri',
    category: 'Maalauskustannukset',
    readingTime: '5 min',
    relatedServices: ['sisamaalaus', 'huoneistomaalaus'],
    content: [
      'Sisämaalauksen hinta muodostuu kolmesta päätekijästä: pinta-alasta, maalin laadusta ja pintojen kunnosta. Yksittäisen huoneen maalaus maksaa tyypillisesti 150–400 €, kun taas koko asunnon maalaus 50–80 m² vaihtelee 800–2 500 € välillä.',
      'Maalin laatu vaikuttaa hintaan merkittävästi. Vakiotason maali maksaa noin 7 €/m², premium-tason noin 10 €/m² ja luksustason jopa 14 €/m². Ero näkyy maalipinnan kestävyydessä ja peittävyydessä.',
      'Pintojen kunto on kolmas merkittävä tekijä. Jos pinnat ovat hyvässä kunnossa ja maalataan suoraan, hinta pysyy alarajalla. Jos taas tarvitaan tasoitusta, tapetin poistoa tai halkeamien korjausta, hinta nousee 20–60 %.',
      'Kattojen maalaus lisää kustannuksia noin 30 %. Usein katot kannattaa maalata samalla kertaa, koska työ on silloin tehokkaampaa ja lopputulos yhtenäisempi.',
      'Suosittelemme käyttämään ilmaista kustannuslaskuriamme suuntaa-antavan arvion saamiseksi ja pyytämään sen jälkeen virallisen tarjouksen. Jokainen koti on erilainen, ja tarkka hinta selviää vasta paikan päällä tehtävässä arviossa.',
    ],
  },
  {
    slug: 'tapetin-poisto-ja-pinnan-valmistelu',
    title: 'Tapetin poisto ja pinnan valmistelu: vaiheittainen ohje',
    excerpt:
      'Vanhan tapetin poisto on usein ensimmäinen askel sisämaalauksessa. Näin teet sen oikein ja vältät yleisimmät virheet.',
    image: images.blog['tapetin-poisto-ja-pinnan-valmistelu'],
    date: '2024-06-30',
    author: 'Maalaus Multiväri',
    category: 'Sisustus',
    readingTime: '4 min',
    relatedServices: ['sisamaalaus', 'huoneistomaalaus'],
    content: [
      'Tapetin poisto on usein välttämätön askel ennen seinien maalausta. Jos tapetti jätetään paikoilleen ja maalataan päälle, lopputulos voi olla epätasainen ja maali ei tartu kunnolla.',
      'Aloita tapetin kostuttamisella. Käytä lämmintä vettä ja tarvittaessa tapetinpoistoainetta. Anna veden imeytyä 10–15 minuuttia, jotta liima pehmenee. Tämän jälkeen tapetti irtoaa helpommin.',
      'Käytä tapetinpoistoveitsen tai kaavinraudan apuna. Työskentele ylhäältä alas ja varo vaurioittamasta seinän pintaa. Jos tapetti on sitkeää, toista kostutus ja odota hetki ennen uutta yritystä.',
      'Tapetin poiston jälkeen pinta on tarkistettava ja tasoitettava. Irtoavat tasoitekohdat ja halkeamat korjataan tasoitteella, ja pinta hiotaan sileäksi ennen pohjustusta ja maalausta.',
      'Jos epäröit, kannattaa kääntyä ammattilaisen puoleen. Tapetin poisto ja pinnan valmistelu ovat työvaiheita, jotka vaikuttavat suoraan maalauksen lopputulokseen ja kestävyyteen.',
    ],
  },
  {
    slug: 'kattomaalauksen-tarve',
    title: 'Milloin peltokatto kannattaa maalata? Merkit, jotka kannattaa tuntea',
    excerpt:
      'Peltokaton pinnoitus on edullisin tapa pidentää katon ikää. Tässä merkit, jotka kertovat, milloin on aika toimia.',
    image: images.blog['kattomaalauksen-tarve'],
    date: '2024-06-10',
    author: 'Maalaus Multiväri',
    category: 'Ulkomaalaus',
    readingTime: '3 min',
    relatedServices: ['kattomaalaus', 'julkisivun-pesu'],
    content: [
      'Peltokaton maalaus eli pinnoitus on edullisin tapa pidentää katon ikää. Oikein tehty pinnoitus voi pidentää katon elinikää useilla vuosilla ja estää ruostumista.',
      'Ensimmäinen merkki on välin heikkeneminen. Jos katon väri on haalistunut ja pinta on mennyt mattaan, on aika harkita pinnoitusta. Toinen merkki on ruosteen ilmestyminen saumoissa tai nauloissa.',
      'Katon pesu on ensimmäinen vaihe. Sammal, levä ja lika poistetaan hellävaraisella painepesulla. Tämän jälkeen ruostekohdat käsitellään eristysmaalilla ennen varsinaista pinnoitusta.',
      'Käytämme lämpösäteilyä heijastavia kattomaaleja, jotka vähentävät lämmön imeytymistä ja pidentävät katon ikää. Pinnoitus tehdään tyypillisesti kahdella kerroksella.',
      'Suosittelemme tarkistamaan katon kunnon 10 vuoden välein. Jos epäröit, tilaa ilmainen arviokäynti — tarkistamme katon kunnon ja kerromme, onko pinnoituksen aika.',
    ],
  },
];

export const blogCategories: string[] = [
  'Kaikki',
  ...Array.from(new Set(blogPosts.map((p) => p.category))),
];

export const getBlogPost = (slug: string): BlogPost | undefined =>
  blogPosts.find((p) => p.slug === slug);
