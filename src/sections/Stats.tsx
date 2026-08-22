import { Briefcase, HeartHandshake, CalendarClock, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { stats, type Stat } from '@/data/site';

const ICONS: Record<Stat['icon'], LucideIcon> = {
  projects: Briefcase,
  customers: HeartHandshake,
  experience: CalendarClock,
  warranty: ShieldCheck,
};

export function Stats() {
  return (
    <section className="relative -mt-12 z-20" aria-label="Yrityksen avainluvut">
      <div className="container-base">
        <Reveal className="card grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-navy-100/60 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = ICONS[stat.icon];
            return (
              <div
                key={stat.label}
                className="group flex flex-col items-center justify-center bg-white px-4 py-8 text-center transition-colors duration-300 hover:bg-orange-50/40 sm:py-10"
              >
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                </span>
                <p className="font-display text-4xl font-extrabold text-navy-900 sm:text-5xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-semibold text-navy-800">{stat.label}</p>
                <p className="mt-1 hidden text-xs text-navy-500 sm:block">{stat.description}</p>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
