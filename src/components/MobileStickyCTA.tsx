import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { company } from '@/data/company';
import { trackPhoneClick, trackWhatsAppClick, trackCtaClick } from '@/lib/analytics';

export function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-navy-100 bg-white/95 p-2 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
        <a
          href={company.phoneHref}
          onClick={() => trackPhoneClick('mobile_sticky_cta')}
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white px-2 text-xs font-bold text-navy-800"
          aria-label="Soita meille"
        >
          <Phone className="h-4 w-4" /> Soita
        </a>
        <a
          href={company.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('mobile_sticky_cta')}
          className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-navy-200 bg-white px-2 text-xs font-bold text-navy-800"
          aria-label="Laita WhatsApp-viesti"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <Link
          to="/yhteystiedot"
          onClick={() => trackCtaClick('Tarjous', 'mobile_sticky_cta')}
          className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-orange-500 px-2 text-xs font-extrabold text-white shadow-sm"
          aria-label="Pyydä tarjous"
        >
          Tarjous <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
