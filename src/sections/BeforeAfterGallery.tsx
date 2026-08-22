import { useState } from 'react';
import { SectionHeading } from '@/components/SectionHeading';
import { Reveal } from '@/components/Reveal';
import { BeforeAfter } from '@/components/BeforeAfter';
import {
  beforeAfterItems,
  beforeAfterCategories,
  type BeforeAfterFilter,
} from '@/data/beforeAfter';

export function BeforeAfterGallery() {
  const [filter, setFilter] = useState<BeforeAfterFilter>('all');
  const [active, setActive] = useState(0);

  const items =
    filter === 'all'
      ? beforeAfterItems
      : beforeAfterItems.filter((i) => i.category === filter);

  const safeActive = Math.min(active, items.length - 1);
  const current = items[safeActive];

  return (
    <section className="section-pad bg-navy-50/60">
      <div className="container-base">
        <SectionHeading
          eyebrow="Ennen ja jälkeen"
          eyebrowOrange
          title="Näet eron omilla silmilläsi"
          description="Raahaa liukusäädintä vertaillaksesi tilannetta ennen ja jälkeen ammattimaisen maalauksemme tai siivouksemme."
        />

        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-full border border-navy-100 bg-white p-1">
            {beforeAfterCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setFilter(c.id);
                  setActive(0);
                }}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  filter === c.id
                    ? 'bg-navy-800 text-white shadow-soft'
                    : 'text-navy-500 hover:text-navy-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-7">
            <BeforeAfter
              before={current.beforeImage}
              after={current.afterImage}
              alt={current.altText}
            />
          </Reveal>

          <Reveal delay={150} className="lg:col-span-5">
            <div className="flex flex-col gap-3">
              {items.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition-all ${
                    i === safeActive
                      ? 'border-orange-300 bg-white shadow-lift'
                      : 'border-navy-100 bg-white/60 hover:border-navy-200 hover:bg-white'
                  }`}
                >
                  <img
                    src={p.afterImage}
                    alt={p.altText}
                    className="h-16 w-20 shrink-0 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-bold text-navy-900">{p.title}</p>
                    <p className="text-xs text-navy-500">
                      {p.service} · {p.location}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
