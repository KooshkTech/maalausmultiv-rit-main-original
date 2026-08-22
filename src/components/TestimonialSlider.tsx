import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, MapPin, Star, BadgeCheck } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import { Reveal } from './Reveal';

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy-700 to-navy-900 text-sm font-bold text-white">
      {initials}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} / 5 tähteä`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-orange-400 text-orange-400' : 'text-navy-200'}`}
        />
      ))}
    </div>
  );
}

export function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;

  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  const t = testimonials[index];

  return (
    <div className="relative mx-auto max-w-4xl">
      <Reveal className="card relative overflow-hidden p-8 sm:p-12">
        <Quote className="absolute right-6 top-6 h-16 w-16 text-navy-50" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <Stars rating={t.rating} />
            {t.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                Vahvistettu
              </span>
            )}
          </div>
          <blockquote className="mt-5 text-lg leading-relaxed text-navy-800 sm:text-xl sm:leading-relaxed">
            &ldquo;{t.text}&rdquo;
          </blockquote>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar name={t.name} />
              <div>
                <p className="text-sm font-bold text-navy-900">{t.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-navy-500">
                  <MapPin className="h-3.5 w-3.5 text-orange-500" />
                  <span className="font-semibold text-navy-700">{t.service}</span>
                  <span>· {t.location}</span>
                </div>
              </div>
            </div>
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-50 text-navy-800 transition hover:bg-navy-100"
                aria-label="Edellinen arvostelu"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-50 text-navy-800 transition hover:bg-navy-100"
                aria-label="Seuraava arvostelu"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="mt-6 flex justify-center gap-1.5">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-orange-500' : 'w-2 bg-navy-200'
            }`}
            aria-label={`Arvostelu ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </div>
  );
}
