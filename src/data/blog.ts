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
    slug: 'talon-maalauksen-hinta-mista-kustannus-muodostuu',
    title: 'Talon maalauksen hinta: mistä kustannus muodostuu?',
    excerpt:
      'Talon maalauksen hintaan vaikuttavat ennen kaikkea julkisivun kunto, esikäsittelyn määrä, rakennuksen koko ja työn vaativuus. Näin tarjous muodostuu käytännössä.',
    image: images.blog['ulkomaalauksen-ajankohta'],
    date: '2026-08-23',
    author: 'Maalaus Multiväri',
    category: 'Talon maalaus',
    readingTime: '6 min',
    relatedServices: ['talon-maalaus', 'ulkomaalaus', 'julkisivumaalaus', 'huoltomaalaus'],
    content: [
      'Talon maalaukselle ei ole yhtä luotettavaa neliöhintaa, joka sopisi kaikkiin kohteisiin. Kaksi samankokoista taloa voivat vaatia hyvin erilaisen työmäärän, jos toisen maalipinta on hyvässä kunnossa ja toisessa tarvitaan paljon kaavintaa, pesua, pohjustusta tai puuosien korjausta.',
      'Suurin hintaan vaikuttava tekijä on usein esikäsittely. Kestävä lopputulos edellyttää, että irtoava maali poistetaan, pinnat puhdistetaan ja paljaat tai vaurioituneet kohdat käsitellään oikein ennen pintamaalausta. Esityön vähentäminen voi pienentää työmäärää hetkellisesti, mutta samalla uuden maalipinnan käyttöikä voi kärsiä.',
      'Rakennuksen koko ja muoto vaikuttavat sekä maalattavaan pinta-alaan että työn etenemiseen. Korkeat päädyt, monimuotoiset julkisivut, kuistit, räystäät, listat ja muut yksityiskohdat lisäävät työvaiheita verrattuna yksinkertaiseen seinäpintaan.',
      'Myös pääsy julkisivulle vaikuttaa työn suunnitteluun. Telineiden, henkilönostimen tai muun turvallisen työskentelyratkaisun tarve arvioidaan kohteen mukaan. Tarjouksessa kannattaa siksi tarkastella kokonaisuutta eikä pelkkää maalattavien neliöiden määrää.',
      'Maalijärjestelmä ja materiaalit valitaan olemassa olevan pinnan, julkisivumateriaalin ja aikaisemman käsittelyn perusteella. Oikea tuotevalinta on osa kokonaiskustannusta, mutta ennen kaikkea se vaikuttaa työn kestävyyteen ja siihen, miten pinta voidaan huoltaa myöhemmin.',
      'Hyvä tarjous kertoo selkeästi, mitä työhön kuuluu: suojaus, pesu, irtoavan maalin poisto, mahdollinen pohjustus, pintamaalaus, tarvittavat työvälineet sekä loppusiivous. Näin eri tarjouksia voi verrata sisällön eikä vain loppusumman perusteella.',
      'Maalaus Multivärin arvio tehdään kohteen todellisen kunnon perusteella. Kun julkisivu ja tarvittavat työvaiheet tarkistetaan ennen tarjousta, saat realistisemman kuvan työn laajuudesta ja voit suunnitella maalauksen ilman tarpeettomia yllätyksiä.',
    ],
  },
  {
    slug: 'milloin-talo-pitaa-maalata-uudelleen',
    title: 'Milloin talo pitää maalata uudelleen? 7 merkkiä, jotka kannattaa tarkistaa',
    excerpt:
      'Ulkomaalauksen tarvetta ei kannata arvioida vain kalenterista. Tarkista nämä maalipinnan, puun ja julkisivun merkit ennen kuin vauriot ehtivät kasvaa.',
    image: images.blog['ulkomaalauksen-ajankohta'],
    date: '2026-08-23',
    author: 'Maalaus Multiväri',
    category: 'Talon maalaus',
    readingTime: '6 min',
    relatedServices: ['talon-maalaus', 'ulkomaalaus', 'julkisivumaalaus', 'huoltomaalaus'],
    content: [
      'Talon uudelleenmaalaukselle ei ole yhtä kaikille rakennuksille sopivaa aikataulua. Maalijärjestelmä, julkisivun materiaali, ilmansuunnat, kosteusrasitus ja aikaisemman työn laatu vaikuttavat siihen, milloin huoltomaalaus on ajankohtainen. Siksi julkisivun kunto kannattaa tarkistaa säännöllisesti eikä odottaa siihen asti, että pinta on selvästi vaurioitunut.',
      'Ensimmäinen merkki on maalipinnan voimakas haalistuminen tai liituuntuminen. Väri voi muuttua etenkin aurinkoisilla seinillä nopeammin kuin varjon puolella. Pelkkä sävyn muutos ei aina tarkoita kiireellistä maalaustarvetta, mutta se on hyvä syy tarkastaa pinta lähempää.',
      'Toinen merkki on maalin halkeilu, hilseily tai irtoaminen. Kun suojaava maalikalvo rikkoutuu, kosteus pääsee helpommin pintamateriaaliin. Irtoavat kohdat on syytä selvittää ennen uutta maalausta, jotta esikäsittely ja uusi maalijärjestelmä voidaan valita oikein.',
      'Kolmas merkki on puupinnan paljastuminen. Jos puu näkyy maalikerroksen alta, huoltoa ei kannata pitkittää. Samalla tarkistetaan, onko puu edelleen kovaa ja tervettä vai tarvitaanko paikallisia korjauksia ennen pohjustusta ja pintamaalausta.',
      'Neljäs ja viides merkki ovat levä-, home- tai muu kasvusto sekä jatkuvasti likaisena pysyvä julkisivu. Kaikki lika ei tarkoita maalaustarvetta: joskus oikea ratkaisu on huolellinen julkisivun pesu. Pesun jälkeen maalipinnan todellinen kunto on helpompi arvioida.',
      'Kuudes merkki on saumojen, listojen, nurkkien tai muiden yksityiskohtien heikkeneminen. Julkisivu kannattaa tarkastaa kokonaisuutena, koska veden kulkureitit ja liittymät voivat vaikuttaa maalipinnan kestävyyteen enemmän kuin suuri tasainen seinäpinta.',
      'Seitsemäs merkki on se, että eri seinät ovat kuluneet eri tahtiin. Etelä- ja länsijulkisivut voivat saada enemmän aurinko- ja säärasitusta kuin suojaisat seinät. Ammattilaisen kuntokartoituksessa voidaan arvioida, tarvitaanko koko talon maalaus vai riittääkö rajatumpi huoltotoimenpide.',
      'Kun olet epävarma, pyydä kohteesta arvio ennen päätöstä. Maalaus Multiväri tarkistaa pinnan kunnon, esikäsittelyn tarpeen ja kohteeseen sopivan työmenetelmän. Näin tarjous perustuu rakennuksen todelliseen tilanteeseen eikä pelkkään neliömäärään.',
    ],
  },
  {
    slug: 'vahapaastoiset-maalit-ja-m1-luokitus',
    title: 'Vähäpäästöiset maalit ja M1-luokitus: mitä ne tarkoittavat?',
    excerpt:
      'M1-merkki näkyy yhä useamman maalipurkin kyljessä. Kerromme, mitä luokitus oikeasti tarkoittaa, mihin se perustuu ja miksi se kannattaa huomioida etenkin sisätiloissa.',
    image: images.blog['sisamaalauksen-kustannukset'],
    date: '2025-03-04',
    author: 'Maalaus Multiväri',
    category: 'Terveellinen sisäympäristö',
    readingTime: '5 min',
    relatedServices: ['sisamaalaus', 'huoneistomaalaus', 'toimistomaalaus'],
    content: [
      'M1 on suomalainen, Rakennustietosäätiö RTS:n ylläpitämä päästöluokitus rakennusmateriaaleille, myös maaleille. Se on vapaaehtoinen: Suomessa ei ole lakisääteistä velvoitetta testata maalien sisäilmapäästöjä, mutta luokitus on yleisesti käytössä ja usein vaatimuksena julkisissa hankinnoissa.',
      'Luokitus perustuu laboratoriotestiin, jossa tuote sijoitetaan testikammioon noin neljäksi viikoksi ja siitä mitataan huoneilmaan vapautuvat kemialliset päästöt, kuten haihtuvat orgaaniset yhdisteet (VOC) ja formaldehydi. Päästöluokkia on kolme — M1, M2 ja M3 — joista M1 on tiukin. M1-luokitellulta tuotteelta vaaditaan alhaisten päästöjen lisäksi myös hyväksyttävää hajua.',
      'Käytännössä M1-merkintä auttaa vertailemaan tuotteita, kun tavoitteena on hyvä sisäilma — esimerkiksi makuuhuoneissa, lasten tiloissa tai kohteissa, joissa asukkailla on hengitystie- tai ihooireita. Työterveyslaitoksen mukaan sisäilman VOC-pitoisuudet esimerkiksi toimistoissa ovat yleensä vähäisiä, eikä hajusta suoraan voi päätellä, että materiaalista aiheutuisi terveyshaittaa — mutta riittävä ilmanvaihto ja vähäpäästöisten materiaalien valinta ovat silti järkeviä, todennettuja keinoja parantaa sisäilmaa.',
      'Yleisenä nyrkkisääntönä vesiohenteiset maalit sisältävät tyypillisesti vähemmän liuottimia kuin liuoteohenteiset, mikä näkyy usein myös vähäisempänä hajuna kuivumisen aikana. Emme kuitenkaan väitä yksittäisen maalin parantavan terveyttä — luotettavin tapa varmistaa tuotteen päästötaso on tarkistaa, onko sillä virallinen M1-luokitus Rakennustiedon julkisesta tietokannasta.',
      'Kysy meiltä kohteeseesi sopivaa, vähäpäästöistä maalivaihtoehtoa — kerromme mielellämme, mitä valittu tuote tarkoittaa käytännössä juuri sinun tilassasi.',
    ],
  },
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
