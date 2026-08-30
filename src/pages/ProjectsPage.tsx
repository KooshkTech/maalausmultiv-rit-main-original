import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Maximize2, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { Reveal } from '@/components/Reveal';
import { Lightbox } from '@/components/Lightbox';
import { ContactCTA } from '@/sections/ContactCTA';
import { projects, projectCategories } from '@/data/projects';
import { getServiceByTitle } from '@/data/services';
import { images } from '@/config/images';

const priorityCitySlugs: Record<string, string> = { Helsinki: 'helsinki', Espoo: 'espoo', Vantaa: 'vantaa' };
const localPaintingServices = new Set(['talon-maalaus', 'ulkomaalaus', 'sisamaalaus', 'julkisivumaalaus', 'kattomaalaus']);

export function ProjectsPage() {
  const [filter, setFilter] = useState('Kaikki');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = filter === 'Kaikki' ? projects : projects.filter((p) => p.category === filter);
  const lightboxImages = filtered.map((p) => ({ url: p.image, alt: p.title, caption: `${p.title} — ${p.location}, ${p.year}` }));

  return (
    <>
      <Seo
        title="Referenssit – maalaus- ja siivouskohteet Uudellamaalla"
        description="Tutustu Maalaus Multivärin toteutettuihin maalaus- ja siivouskohteisiin Uudellamaalla. Katso kohde, sijainti, palvelut ja asiakkaan palaute silloin kun se on saatavilla."
        path="/projektit"
        breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: 'Referenssit', path: '/projektit' }]}
      />
      <PageHero
        eyebrow="Referenssit"
        crumb="Referenssit"
        title="Oikeita kohteita ja tehtyjä töitä"
        description="Tutustu toteutettuihin kohteisiin palvelun ja paikkakunnan mukaan. Näytämme vain projektitiedot, kuvat ja palautteet, jotka ovat oikeasti käytettävissä."
        image={images.pages.projects}
      />

      <section className="relative z-20 -mt-9 px-5">
        <div className="container-base grid gap-4 md:grid-cols-2">
          <Link to="/palvelut" className="card group p-6 transition hover:-translate-y-1 hover:shadow-lift">
            <span className="eyebrow-orange">Maalaus</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-navy-950">Maalausreferenssit</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">Tutustu maalauspalveluihin ja paikallisiin kohteisiin Helsingissä, Espoossa, Vantaalla ja Uudellamaalla.</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-600">Maalauspalveluihin <ArrowRight className="h-4 w-4" /></span>
          </Link>
          <Link to="/palvelut/siivous" className="card group p-6 transition hover:-translate-y-1 hover:shadow-lift">
            <span className="eyebrow-orange">Siivous</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-navy-950">Siivousreferenssit</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">Siivouspalvelut on erotettu omaksi palvelupolukseen, jotta maalaus- ja siivousasiakkaat löytävät oikean sisällön nopeasti.</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-600">Siivouspalveluihin <ArrowRight className="h-4 w-4" /></span>
          </Link>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-base">
          <Reveal className="mb-10 flex flex-wrap justify-center gap-2">
            {projectCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${filter === cat ? 'bg-navy-800 text-white shadow-soft' : 'bg-navy-50 text-navy-700 hover:bg-navy-100'}`}
              >
                {cat}
              </button>
            ))}
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, i) => (
              <Reveal key={project.id} delay={(i % 3) * 80}>
                <article className="card group h-full overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={project.image} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <button type="button" onClick={() => setLightboxIndex(i)} className="absolute inset-0 flex items-center justify-center bg-navy-950/0 opacity-0 transition-all duration-300 group-hover:bg-navy-950/40 group-hover:opacity-100" aria-label="Avaa kuva">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-navy-900 shadow-lift"><Maximize2 className="h-5 w-5" /></span>
                    </button>
                    <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">{project.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold text-navy-900">{project.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-600">{project.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.services.map((s) => {
                        const matchedService = getServiceByTitle(s);
                        if (matchedService) {
                          const citySlug = priorityCitySlugs[project.location];
                          const servicePath = citySlug && localPaintingServices.has(matchedService.slug)
                            ? `/palvelut/${matchedService.slug}/${citySlug}`
                            : `/palvelut/${matchedService.slug}`;
                          return <Link key={s} to={servicePath} className="inline-flex items-center gap-1 rounded-md bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-600 transition hover:bg-orange-50 hover:text-orange-700"><CheckCircle2 className="h-3 w-3 text-green-500" />{s}</Link>;
                        }
                        return <span key={s} className="inline-flex items-center gap-1 rounded-md bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-600"><CheckCircle2 className="h-3 w-3 text-green-500" />{s}</span>;
                      })}
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-xs text-navy-500">
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-orange-500" />{project.location}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-orange-500" />{project.year}</span>
                    </div>
                    {project.review && (
                      <div className="mt-4 border-t border-navy-100 pt-4">
                        <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-3.5 w-3.5 ${index < project.review!.rating ? 'fill-orange-400 text-orange-400' : 'text-navy-200'}`} />)}</div>
                        <p className="mt-2 text-xs italic leading-relaxed text-navy-600">&ldquo;{project.review.text}&rdquo;</p>
                        <p className="mt-1.5 text-xs font-semibold text-navy-700">— {project.review.author}</p>
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => i === null ? null : (i - 1 + lightboxImages.length) % lightboxImages.length)}
        onNext={() => setLightboxIndex((i) => i === null ? null : (i + 1) % lightboxImages.length)}
      />

      <ContactCTA />
    </>
  );
}
