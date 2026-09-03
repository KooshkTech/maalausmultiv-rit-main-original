import { Link } from 'react-router-dom';
import { ArrowRight, Check, Palette, Sparkles } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { images } from '@/config/images';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { ContactCTA } from '@/sections/ContactCTA';
import { getPaintingServices } from '@/data/services';

export function ServicesPage() {
  const services = getPaintingServices();

  return (
    <>
      <Seo
        title="Maalauspalvelut Helsinki, Espoo ja Vantaa | Maalaus Multiväri"
        description="Maalauspalvelut Helsingissä, Espoossa, Vantaalla ja Uudellamaalla: sisämaalaus, talon maalaus, ulkomaalaus, julkisivumaalaus, kattomaalaus ja muut maalaustyöt. Pyydä maksuton arvio."
        path="/palvelut"
        breadcrumbs={[
          { name: 'Etusivu', path: '/' },
          { name: 'Maalauspalvelut', path: '/palvelut' },
        ]}
      />
      <PageHero
        eyebrow="Maalauspalvelut"
        crumb="Maalauspalvelut"
        title="Maalauspalvelut koteihin, taloyhtiöille ja yrityksille"
        description="Sisä- ja ulkomaalaus, talon maalaus, julkisivut, katot ja muut maalaustyöt Helsingissä, Espoossa, Vantaalla ja muualla Uudellamaalla."
        image={images.pages.services}
      />

      <section className="relative z-20 -mt-9 px-5">
        <div className="container-base grid gap-4 md:grid-cols-2">
          <div className="card p-6 sm:p-8">
            <span className="eyebrow-orange">VäriKamu</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-navy-950">Näe uusi ilme ennen maalausta</h2>
            <p className="mt-2 leading-relaxed text-navy-600">Kokeile värejä omassa kuvassasi ja jatka suunnitelmasta tarjouspyyntöön.</p>
            <Link to="/varikamu" className="btn-primary mt-5">Kokeile VäriKamua <Palette className="h-4 w-4" /></Link>
          </div>
          <div className="card p-6 sm:p-8">
            <span className="eyebrow-orange">Etsitkö siivousta?</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-navy-950">Siivouspalvelut ovat omalla sivullaan</h2>
            <p className="mt-2 leading-relaxed text-navy-600">Maalaus ja siivous on erotettu selkeiksi palvelupoluiksi, jotta löydät oikean palvelun nopeasti.</p>
            <Link to="/palvelut/siivous" className="btn-outline mt-5">Siivouspalvelut <Sparkles className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-base">
          <SectionHeading
            align="left"
            eyebrow="Maalaus"
            eyebrowOrange
            title="Valitse maalauspalvelu"
            description="Tutustu työvaiheisiin, kohteisiin ja palvelusisältöön. Hinta määräytyy kohteen kunnon, pinta-alan, pohjatöiden ja toteutuksen mukaan."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60}>
                <article className="card group flex h-full flex-col overflow-hidden p-4 sm:p-5">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      width="800"
                      height="500"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Maalauspalvelu</span>
                    <h2 className="mt-2 font-display text-2xl font-bold text-navy-900">{service.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-navy-600">{service.description}</p>
                    <ul className="mt-5 grid gap-2">
                      {service.bullets.slice(0, 4).map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-navy-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap gap-3 pt-6">
                      <Link to={`/palvelut/${service.slug}`} className="btn-primary">
                        Lue lisää <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link to={`/yhteystiedot?service=${service.slug}`} className="btn-outline">Pyydä tarjous</Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy-50">
        <div className="container-base grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <span className="eyebrow-orange">Hinta ja arvio</span>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy-950">Selvitä mistä maalaustyön hinta muodostuu</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-navy-600">Emme kopioi kilpailijoiden hintoja tai lupaa yhtä neliöhintaa kaikille kohteille. Katso hinnan tärkeimmät tekijät ja tee alustava arvio omilla tiedoillasi.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/hinnat" className="btn-primary">Maalausten hinnat <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/maalauslaskuri" className="btn-outline">Laske maalauksen hinta</Link>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
