import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Phone, Send, Gift, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { company } from '@/data/company';
import { trackCtaClick, trackPhoneClick } from '@/lib/analytics';

type PopupVariant = 'exit' | 'time' | 'scroll' | 'portfolio' | 'calculator';
type PopupState = {
  variant: PopupVariant;
  headline: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  primaryIcon: 'send' | 'phone';
  showCallButton: boolean;
};

const POPUPS: Record<PopupVariant, PopupState> = {
  exit: {
    variant: 'exit',
    headline: 'Ilmainen maalaustarjous',
    body: 'Ammattimaista maalausta Helsingissä, Espoossa, Vantaalla ja Uudellamaalla. Saat sitouttamattoman tarjouksen 24 tunnin sisällä.',
    primaryLabel: 'Pyydä ilmainen tarjous',
    primaryHref: '/yhteystiedot',
    primaryIcon: 'send',
    showCallButton: true,
  },
  time: {
    variant: 'time',
    headline: 'Tuo talosi kuntoon',
    body: 'Varaa ilmainen arviokäynti jo tänään. Meiltä saat ammattilaisten työn ja 2 vuoden kirjallisen takuun.',
    primaryLabel: 'Pyydä tarjous',
    primaryHref: '/yhteystiedot',
    primaryIcon: 'send',
    showCallButton: true,
  },
  scroll: {
    variant: 'scroll',
    headline: 'Inspiraatiota projektisi?',
    body: 'Ammattitaitoinen tiimimme auttaa sinua oikean ratkaisun löytämisessä. Pyydä ilmainen tarjous jo tänään.',
    primaryLabel: 'Pyydä tarjous',
    primaryHref: '/yhteystiedot',
    primaryIcon: 'send',
    showCallButton: true,
  },
  portfolio: {
    variant: 'portfolio',
    headline: 'Innostuitko työstämme?',
    body: 'Maalataan sinun kotisi seuraavaksi. Pyydä maksuton ja sitoutumaton arvio kohteestasi.',
    primaryLabel: 'Pyydä ilmainen tarjous',
    primaryHref: '/yhteystiedot',
    primaryIcon: 'send',
    showCallButton: false,
  },
  calculator: {
    variant: 'calculator',
    headline: 'Arviosi on valmis!',
    body: 'Lataa kuvat kohteestasi ja pyydä kohdetietoihin perustuva tarjous.',
    primaryLabel: 'Pyydä maksuton tarjous',
    primaryHref: '/yhteystiedot',
    primaryIcon: 'send',
    showCallButton: true,
  },
};

const STORAGE_KEY = 'mm-popup-shown';
const COOLDOWN_DAYS = 30;

function canShowPopup(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const timestamp = JSON.parse(raw);
    return Date.now() - timestamp > COOLDOWN_DAYS * 86400000;
  } catch {
    return true;
  }
}

function markPopupShown() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Date.now()));
  } catch { /* ignore */ }
}

export type LeadPopupHandle = {
  triggerPopup: (variant: PopupVariant) => void;
};

export function LeadPopups() {
  const [active, setActive] = useState<PopupVariant | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const portfolioViewsRef = useRef(0);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const trigger = useCallback((variant: PopupVariant) => {
    if (isMobile) return; // No popups on mobile — sticky CTA bar handles it
    if (triggeredRef.current) return;
    if (!canShowPopup()) return;
    triggeredRef.current = true;
    setActive(variant);
    markPopupShown();
  }, [isMobile]);

  // Exit intent (desktop only)
  useEffect(() => {
    if (isMobile) return;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger('exit');
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isMobile, trigger]);

  // Time delay popup (35 seconds)
  useEffect(() => {
    if (isMobile) return;
    const timer = setTimeout(() => {
      if (!triggeredRef.current) trigger('time');
    }, 35000);
    return () => clearTimeout(timer);
  }, [isMobile, trigger]);

  // Scroll popup (60%)
  useEffect(() => {
    if (isMobile) return;
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= 0.6 && !triggeredRef.current) trigger('scroll');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, trigger]);

  // Portfolio popup — listen for lightbox opens
  useEffect(() => {
    const handleLightbox = () => {
      portfolioViewsRef.current += 1;
      if (portfolioViewsRef.current >= 3) trigger('portfolio');
    };
    window.addEventListener('lightbox-open', handleLightbox);
    return () => window.removeEventListener('lightbox-open', handleLightbox);
  }, [trigger]);

  // Calculator popup — listen for calc complete event
  useEffect(() => {
    const handleCalc = () => trigger('calculator');
    window.addEventListener('calc-complete', handleCalc);
    return () => window.removeEventListener('calc-complete', handleCalc);
  }, [trigger]);

  const close = useCallback(() => {
    setActive(null);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!active) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [active, close]);

  if (!active) return null;
  const popup = POPUPS[active];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={popup.headline}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm popup-fade-in"
        onClick={close}
      />
      <div className="popup-scale-in relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-lift">
        <button
          onClick={close}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-navy-500 transition hover:bg-navy-100 hover:text-navy-800"
          aria-label="Sulje"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
          <div className="flex items-center gap-2 text-orange-100">
            {active === 'calculator' ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <Gift className="h-5 w-5" />
            )}
            <span className="text-xs font-semibold uppercase tracking-wider">Ilmainen tarjous</span>
          </div>
          <h3 className="mt-3 font-display text-xl font-bold leading-tight">{popup.headline}</h3>
        </div>

        <div className="p-6">
          <p className="text-sm leading-relaxed text-navy-600">{popup.body}</p>

          <div className="mt-5 space-y-3">
            <Link
              to={popup.primaryHref}
              onClick={() => {
                trackCtaClick(popup.primaryLabel, `popup_${active}`);
                close();
              }}
              className="btn-primary w-full"
            >
              {popup.primaryIcon === 'phone' ? (
                <Phone className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {popup.primaryLabel}
            </Link>
            {popup.showCallButton && (
              <a
                href={company.phoneHref}
                onClick={() => {
                  trackPhoneClick(`popup_${active}`);
                  close();
                }}
                className="btn-outline w-full"
              >
                <Phone className="h-4 w-4" />
                Soita {company.phone}
              </a>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-navy-400">
            Maksuton · Sitoutumaton tarjouspyyntö
          </p>
        </div>
      </div>
    </div>
  );
}
