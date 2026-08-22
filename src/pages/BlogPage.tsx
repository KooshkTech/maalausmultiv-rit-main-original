import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { PageHero } from '@/sections/PageHero';
import { images } from '@/config/images';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { ContactCTA } from '@/sections/ContactCTA';
import { blogPosts, blogCategories } from '@/data/blog';

export function BlogPage() {
  const [filter, setFilter] = useState('Kaikki');
  const featured = blogPosts[0];
  const rest = blogPosts.slice(1);
  const filtered =
    filter === 'Kaikki' ? rest : rest.filter((p) => p.category === filter);

  return (
    <>
      <Seo
        title="Blogi — vinkkejä maalaukseen ja siivoukseen"
        description="Vinkkejä ja oppaita maalaukseen, julkisivujen hoitoon, materiaalien valintaan ja siivoustyöhön Uudenmaan olosuhteisiin. Lue Maalaus Multivärin blogista."
        path="/blogi"
        breadcrumbs={[
          { name: 'Etusivu', path: '/' },
          { name: 'Blogi', path: '/blogi' },
        ]}
      />
      <PageHero
        eyebrow="Blogi"
        crumb="Blogi"
        title="Tietoa ja vinkkejä maalaukseen ja siivoukseen"
        description="Asiantuntijoidemme kirjoituksia maalauksen ajankohdasta, materiaaleista, pintohohtamisesta ja siivoustyöstä."
        image={images.pages.blog}
      />

      <section className="section-pad bg-white">
        <div className="container-base">
          <Reveal>
            <Link
              to={`/blogi/${featured.slug}`}
              className="card group grid overflow-hidden lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                  Suositeltu · {featured.category}
                </span>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <div className="flex items-center gap-4 text-xs text-navy-500">
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" /> {featured.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {featured.readingTime}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-navy-900 sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-navy-600">
                  {featured.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition group-hover:gap-2.5">
                  Lue artikkeli
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>

          <div className="mt-16">
            <SectionHeading
              align="left"
              eyebrow="Kaikki artikkelit"
              eyebrowOrange
              title="Selaile artikkeleita"
            />

            <Reveal className="mt-8 flex flex-wrap gap-2">
              {blogCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    filter === cat
                      ? 'bg-navy-800 text-white'
                      : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post, i) => (
                <Reveal key={post.slug} delay={(i % 3) * 80}>
                  <Link
                    to={`/blogi/${post.slug}`}
                    className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-800">
                        {post.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3 text-xs text-navy-500">
                        <span>{new Date(post.date).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {post.readingTime}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-bold leading-tight text-navy-900">
                        {post.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">
                        {post.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition group-hover:gap-2.5">
                        Lue lisää
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
