import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumb: string;
  image: string;
};

export function PageHero({ eyebrow, title, description, crumb, image }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pt-16 text-white lg:pt-20">
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover opacity-25"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/60" />
      </div>

      <div className="container-base relative z-10 py-16 lg:py-24">
        <nav className="flex items-center gap-1.5 text-xs text-navy-300">
          <Link to="/" className="transition hover:text-white">Etusivu</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-orange-400">{crumb}</span>
        </nav>

        {eyebrow && (
          <span className="eyebrow-orange mt-6 bg-white/10 text-orange-300">
            {eyebrow}
          </span>
        )}

        <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        {description && (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-100 sm:text-lg">
            {description}
          </p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
