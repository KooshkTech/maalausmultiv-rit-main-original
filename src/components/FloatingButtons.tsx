import { Phone, MessageCircle } from 'lucide-react';
import { company } from '@/data/company';
import { ScrollToTopButton } from './ScrollToTopButton';
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics';

export function FloatingButtons() {
  const handleWhatsAppClick = () => trackWhatsAppClick('floating_button');
  const handlePhoneClick = () => trackPhoneClick('floating_button');

  return (
    <>
      {/* Desktop/tablet floating shortcuts. Hidden on mobile because the
          mobile contact bar below already provides the same actions. */}
      <a
        href={company.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        className="fixed bottom-8 left-8 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-all duration-300 hover:scale-105 sm:flex"
        aria-label="WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-pulse-ring" />
        <MessageCircle className="relative h-7 w-7" />
      </a>

      <a
        href={company.phoneHref}
        onClick={handlePhoneClick}
        className="fixed bottom-8 right-8 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lift transition-all duration-300 hover:scale-105 hover:bg-orange-600 sm:flex"
        aria-label="Soita nyt"
      >
        <span className="absolute inset-0 rounded-full bg-orange-500 opacity-60 animate-pulse-ring" />
        <Phone className="relative h-6 w-6" />
      </a>

      {/* Mobile: one clean sticky action bar only. Safe-area padding keeps
          the controls clear of the iPhone home indicator. */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t border-navy-100 bg-white/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_rgba(15,42,82,0.12)] backdrop-blur sm:hidden">
        <a
          href={company.phoneHref}
          onClick={handlePhoneClick}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-3 py-3 text-sm font-bold text-white"
        >
          <Phone className="h-4 w-4 shrink-0" />
          Soita
        </a>
        <a
          href={company.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-sm font-bold text-white"
        >
          <MessageCircle className="h-4 w-4 shrink-0" />
          WhatsApp
        </a>
      </div>

      <ScrollToTopButton />
    </>
  );
}
