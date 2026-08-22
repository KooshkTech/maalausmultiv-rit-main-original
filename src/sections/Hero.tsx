import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Clock,
  Sparkles,
  Paintbrush,
  ThumbsUp,
  Wrench,
} from 'lucide-react';
import { company } from '@/data/company';
import { Reveal } from '@/components/Reveal';
import { images } from '@/config/images';

const trustBadges = [
  { icon: Paintbrush, label: 'Ammattilaismaalareita' },
  { icon: Sparkles, label: 'Ilmainen arvio' },
  { icon: Wrench, label: 'Laatumateriaalit' },
  { icon: Clock, label: 'Luotettava aikataulu' },
  { icon: ThumbsUp, label: 'Asiakastyytyväisyys' },
  { icon: ShieldCheck, label: 'Siisti työjälki' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 pt-16 text-white lg:pt-20">
      <div className="absolute inset-0">
        <img
          src={images.hero.main}
          alt="Ammattitaitoinen maalari maalaamassa puutalon julkisivua rullalla Uudellamaalla"
          className="h-full w-full object-cover opacity-35"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/85 to-navy-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/40" />
      </div>

      <div className="container-base relative z-10 grid gap-8 py-12 sm:py-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-28">
        <div className="lg:col-span-7">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-orange-400" />
              Helsinki · Espoo · Vantaa · Uusimaa
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-5 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              Ammattimaista maalausta
              <span className="block text-orange-400">Uudellamaalla</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-navy-100 sm:mt-6 sm:text-lg">
              {company.name} tarjoaa laadukkaita maalaus- ja siivouspalveluja
              yksityisille ja yrityksille. Ulkomaalausta, sisämaalausta,
              toimistomaalausta ja ammattimaista siivoustyötä — yhdestä paikasta.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center">
              <Link to="/yhteystiedot" className="btn-primary text-base">
                Pyydä ilmainen tarjous
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href={company.phoneHref} className="btn-ghost-light text-base">
                <Phone className="h-5 w-5" />
                Soita nyt
              </a>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-3 sm:mt-10 sm:grid-cols-3">
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 text-sm font-medium text-navy-100">
                  <badge.icon className="h-5 w-5 shrink-0 text-orange-400" />
                  {badge.label}
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={300} className="lg:col-span-5">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                <Sparkles className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-white">
                  Ilmainen arvio
                </p>
                <p className="text-xs text-navy-200">Sitoutumaton tarjous 24 h sisällä</p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-white/90">
              Soita tai täytä tarjouspyyntö, niin käymme paikan päällä tutkimassa
              kohteen ja laadimme tarkan aikataulun ja hinta-arvion. Kilpailukykyiset
              hinnat ja takuu työjäljestä jopa 5 vuotta.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-6">
              <div>
                <p className="font-display text-2xl font-extrabold text-orange-400">15+</p>
                <p className="text-[11px] text-navy-200">Vuotta alalla</p>
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold text-orange-400">5 v</p>
                <p className="text-[11px] text-navy-200">Takuu</p>
              </div>
              <div>
                <p className="font-display text-2xl font-extrabold text-orange-400">200 km</p>
                <p className="text-[11px] text-navy-200">Palvelualue</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
