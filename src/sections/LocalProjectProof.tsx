import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { projects } from '@/data/projects';

const featured = [
  { id: 'p1', service: 'ulkomaalaus', city: 'helsinki' },
  { id: 'p2', service: 'kattomaalaus', city: 'espoo' },
  { id: 'p4', service: 'aidan-maalaus', city: 'vantaa' },
] as const;

export function LocalProjectProof() {
  const items = featured
    .map((item) => ({ ...item, project: projects.find((project) => project.id === item.id) }))
    .filter((item): item is typeof item & { project: NonNullable<typeof item.project> } => Boolean(item.project));

  return (
    <section className="section-pad bg-white" aria-labelledby="local-project-proof-title">
      <div className="container-base">
        <SectionHeading
          eyebrow="Paikallisia kohteita"
          eyebrowOrange
          title="Esimerkkejä töistä Helsingissä, Espoossa ja Vantaalla"
          description="Tutustu toteutettuihin kohteisiin ja siirry suoraan vastaavaan palveluun omalla alueellasi."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {items.map(({ project, service, city }, index) => {
            const servicePath = service === 'aidan-maalaus'
              ? `/palvelut/${service}`
              : `/palvelut/${service}/${city}`;
            return (
              <Reveal key={project.id} delay={index * 80}>
                <article className="card group h-full overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image}
                      alt={`${project.title}, ${project.location}`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold text-orange-600">
                      <MapPin className="h-4 w-4" />
                      {project.location} · {project.year}
                    </div>
                    <h3 className="mt-2 font-display text-xl font-bold text-navy-900">{project.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-navy-600">{project.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-navy-700">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      Kohde-esimerkki toteutetusta työstä
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link to={servicePath} className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:underline">
                        Katso vastaava palvelu <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link to="/projektit" className="text-sm font-semibold text-navy-600 hover:text-navy-900">
                        Kaikki projektit
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
