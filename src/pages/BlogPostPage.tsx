import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Clock, User, Calendar, Paintbrush } from 'lucide-react';
import { Seo } from '@/components/Seo';
import { Reveal } from '@/components/Reveal';
import { ContactCTA } from '@/sections/ContactCTA';
import { getBlogPost, blogPosts } from '@/data/blog';
import { getService } from '@/data/services';
import { priorityLocalServiceSlugs } from '@/data/localSeo';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) return <Navigate to="/blogi" replace />;

  const others = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const relatedServiceItems = post.relatedServices
    .map((slug) => getService(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        path={`/blogi/${post.slug}`}
        image={post.image}
        type="article"
        breadcrumbs={[
          { name: 'Etusivu', path: '/' },
          { name: 'Blogi', path: '/blogi' },
          { name: post.title, path: `/blogi/${post.slug}` },
        ]}
        articleSchema={{
          headline: post.title,
          description: post.excerpt,
          image: post.image,
          datePublished: post.date,
          author: post.author,
        }}
      />

      <article className="bg-navy-950 pt-16 text-white lg:pt-20">
        <div className="container-base py-16 lg:py-24">
          <nav className="flex items-center gap-1.5 text-xs text-navy-300">
            <Link to="/" className="transition hover:text-white">Etusivu</Link>
            <span>/</span>
            <Link to="/blogi" className="transition hover:text-white">Blogi</Link>
            <span>/</span>
            <span className="text-orange-400">{post.category}</span>
          </nav>

          <span className="eyebrow-orange mt-6 bg-white/10 text-orange-300">{post.category}</span>

          <h1 className="mt-5 max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-navy-200">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-orange-400" /> {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-orange-400" />
              {new Date(post.date).toLocaleDateString('fi-FI', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-orange-400" /> {post.readingTime}
            </span>
          </div>
        </div>

        <div className="container-base">
          <img
            src={post.image}
            alt={post.title}
            className="aspect-[21/9] w-full rounded-t-3xl object-cover shadow-lift"
            loading="eager"
          />
        </div>
      </article>

      <section className="bg-white pb-4">
        <div className="container-base">
          <div className="mx-auto max-w-3xl -translate-y-12 rounded-3xl bg-white p-8 shadow-lift sm:p-12">
            <p className="text-lg font-medium leading-relaxed text-navy-800 sm:text-xl">
              {post.excerpt}
            </p>
            <div className="mt-8 space-y-6">
              {post.content.map((para, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p className="text-base leading-relaxed text-navy-700">{para}</p>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-4 border-t border-navy-100 pt-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">
                {post.author.charAt(0)}
              </span>
              <div>
                <p className="text-sm font-bold text-navy-900">{post.author}</p>
                <p className="text-xs text-navy-500">Asiantuntija · {post.category}</p>
              </div>
            </div>

            {relatedServiceItems.length > 0 && (
              <div className="mt-8 border-t border-navy-100 pt-6">
                <p className="text-sm font-bold text-navy-900">Aiheeseen liittyvät palvelut</p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {relatedServiceItems.map((service) => (
                    <Link
                      key={service.slug}
                      to={`/palvelut/${service.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white px-4 py-2 text-sm font-semibold text-navy-800 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                    >
                      <Paintbrush className="h-3.5 w-3.5 text-orange-500" />
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedServiceItems.some((service) => (priorityLocalServiceSlugs as readonly string[]).includes(service.slug)) && (
              <div className="mt-8 border-t border-navy-100 pt-6">
                <p className="text-sm font-bold text-navy-900">Paikalliset maalauspalvelut</p>
                <p className="mt-1 text-sm text-navy-600">Jos kohteesi on pääkaupunkiseudulla, tutustu palveluun suoraan omalla alueellasi.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {relatedServiceItems
                    .filter((service) => (priorityLocalServiceSlugs as readonly string[]).includes(service.slug))
                    .flatMap((service) => ['helsinki', 'espoo', 'vantaa'].map((city) => ({ service, city })))
                    .map(({ service, city }) => (
                      <Link
                        key={`${service.slug}-${city}`}
                        to={`/palvelut/${service.slug}/${city}`}
                        className="rounded-full bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-700 transition hover:bg-orange-50 hover:text-orange-700"
                      >
                        {service.title} {city.charAt(0).toUpperCase() + city.slice(1)}
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy-50/60">
        <div className="container-base">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow-orange">Lue lisää</span>
              <h2 className="mt-4 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                Muita mielenkiintoisia artikkeleita
              </h2>
            </div>
            <Link to="/blogi" className="hidden btn-outline sm:inline-flex">
              <ArrowLeft className="h-4 w-4" />
              Kaikki artikkelit
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link
                  to={`/blogi/${p.slug}`}
                  className="card group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                      {p.category}
                    </span>
                    <h3 className="mt-2 font-display text-base font-bold leading-tight text-navy-900">
                      {p.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 transition group-hover:gap-2.5">
                      Lue
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
