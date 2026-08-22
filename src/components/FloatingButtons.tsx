import { Phone, MessageCircle } from 'lucide-react';
import { company } from '@/data/company';
import { ScrollToTopButton } from './ScrollToTopButton';
import { trackPhoneClick, trackWhatsAppClick } from '@/lib/analytics';

export function FloatingButtons() {
  const handleWhatsAppClick = () => trackWhatsAppClick('floating_button');
  const handlePhoneClick = () => trackPhoneClick('floating_button');

  return (
    <>
      <a
        href={company.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        className="fixed bottom-5 left-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-all duration-300 hover:scale-105 sm:bottom-8 sm:left-8"
        aria-label="WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-pulse-ring" />
        <MessageCircle className="relative h-7 w-7" />
      </a>

      <a
        href={company.phoneHref}
        onClick={handlePhoneClick}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lift transition-all duration-300 hover:scale-105 hover:bg-orange-600 sm:bottom-8 sm:right-8"
        aria-label="Soita nyt"
      >
        <span className="absolute inset-0 rounded-full bg-orange-500 opacity-60 animate-pulse-ring" />
        <Phone className="relative h-6 w-6" />
      </a>

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 p-3 sm:hidden">
        <a
          href={company.phoneHref}
          onClick={handlePhoneClick}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-lift"
        >
          <Phone className="h-4 w-4" />
          Soita
        </a>
        <a
          href={company.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white shadow-lift"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>

      <ScrollToTopButton />
    </>
  );
}
