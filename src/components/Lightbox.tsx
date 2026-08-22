import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { trackPortfolioView } from '@/components/LeadPopups';

type LightboxProps = {
  images: { url: string; alt: string; caption?: string }[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const isOpen = index !== null;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    trackPortfolioView();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || index === null) return null;

  const current = images[index];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20"
        aria-label="Sulje"
      >
        <X className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:left-8"
        aria-label="Edellinen"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <figure
        className="max-h-[85vh] max-w-5xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.url}
          alt={current.alt}
          className="max-h-[80vh] w-auto rounded-xl object-contain shadow-lift"
          loading="eager"
        />
        {current.caption && (
          <figcaption className="mt-3 text-center text-sm text-white/80">
            {current.caption}
          </figcaption>
        )}
      </figure>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 sm:right-8"
        aria-label="Seuraava"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs text-white/80">
        {index + 1} / {images.length}
      </span>
    </div>
  );
}
