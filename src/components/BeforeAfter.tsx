import { useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

type BeforeAfterProps = {
  before: string;
  after: string;
  alt?: string;
  className?: string;
};

export function BeforeAfter({ before, after, alt = '', className = '' }: BeforeAfterProps) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  };

  return (
    <div
      ref={containerRef}
      className={`ba-slider relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl shadow-card ${className}`}
      onMouseMove={(e) => e.buttons === 1 && updateFromClientX(e.clientX)}
      onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
    >
      <img
        src={after}
        alt={`${alt} – jälkeen`}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={before}
          alt={`${alt} – ennen`}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ width: `${(100 / pos) * 100}%` }}
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-navy-900/85 px-3 py-1 text-xs font-semibold text-white">
          Ennen
        </span>
      </div>
      <span className="absolute right-4 top-4 rounded-full bg-orange-500/95 px-3 py-1 text-xs font-semibold text-white">
        Jälkeen
      </span>

      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow-lg"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange-500 text-white shadow-lift ring-4 ring-white/40">
          <MoveHorizontal className="h-5 w-5" />
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        aria-label="Raahaa vertaillaksesi ennen ja jälkeen"
      />
    </div>
  );
}
