import { useState, useEffect } from 'react';
import { Cookie, X, Check, Settings } from 'lucide-react';

type ConsentChoice = 'all' | 'essential' | 'custom';
type ConsentState = {
  choice: ConsentChoice;
  analytics: boolean;
  marketing: boolean;
} | null;

const STORAGE_KEY = 'mm-cookie-consent';
const CONSENT_DURATION_DAYS = 180;

function getStoredConsent(): ConsentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const age = Date.now() - (parsed.timestamp ?? 0);
    if (age > CONSENT_DURATION_DAYS * 86400000) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(state: Omit<NonNullable<ConsentState>, never> & { timestamp?: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, timestamp: Date.now() }));
  } catch { /* ignore */ }
  window.__mmConsent = { analytics: state.analytics, marketing: state.marketing };
  window.dispatchEvent(new Event('mm-consent-update'));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    // Returning visitor: the banner stays hidden, but the consent state
    // must still be rehydrated into window.__mmConsent on every fresh
    // page load, or analytics.ts silently blocks every event forever.
    setAnalytics(stored.analytics);
    setMarketing(stored.marketing);
    window.__mmConsent = { analytics: stored.analytics, marketing: stored.marketing };
    window.dispatchEvent(new Event('mm-consent-update'));
  }, []);

  const acceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    saveConsent({ choice: 'all', analytics: true, marketing: true });
    setVisible(false);
  };

  const rejectNonEssential = () => {
    setAnalytics(false);
    setMarketing(false);
    saveConsent({ choice: 'essential', analytics: false, marketing: false });
    setVisible(false);
  };

  const saveCustom = () => {
    saveConsent({ choice: 'custom', analytics, marketing });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Evästeasetukset"
      className="fixed inset-x-0 bottom-0 z-[70] p-4 sm:p-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-navy-100 bg-white p-5 shadow-lift sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <Cookie className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="font-display text-base font-bold text-navy-900">Evästeet ja yksityisyys</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-navy-600">
              Käytämme evästeitä palvelun toimivuuden varmistamiseen ja kokemuksen parantamiseen.
              Valitse haluamasi evästeet. Lue lisää{' '}
              <a href="/tietosuojaseloste" className="font-semibold text-orange-600 underline">
                tietosuojaselosteestamme
              </a>.
            </p>

            {showSettings && (
              <div className="mt-4 space-y-3 rounded-xl bg-navy-50 p-4">
                <ConsentToggle
                  label="Välttämättömät evästeet"
                  description="Tarvitaan sivuston toimintaan. Aina käytössä."
                  checked={true}
                  disabled={true}
                />
                <ConsentToggle
                  label="Analytiikka"
                  description="Google Analytics — auttaa ymmärtämään sivuston käyttöä."
                  checked={analytics}
                  onChange={() => setAnalytics((v) => !v)}
                />
                <ConsentToggle
                  label="Markkinointi"
                  description="Meta Pixel ja mainonnan mittaus."
                  checked={marketing}
                  onChange={() => setMarketing((v) => !v)}
                />
                <button onClick={saveCustom} className="btn-primary mt-2 w-full">
                  <Check className="h-4 w-4" /> Tallenna asetukset
                </button>
              </div>
            )}

            {!showSettings && (
              <div className="mt-4 flex flex-wrap gap-3">
                <button onClick={acceptAll} className="btn-primary">
                  Hyväksy kaikki
                </button>
                <button onClick={rejectNonEssential} className="btn-outline">
                  Hylkää ei-välttämättömät
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-3.5 text-sm font-semibold text-navy-600 transition hover:text-navy-900"
                >
                  <Settings className="h-4 w-4" /> Mukauta
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-navy-400 transition hover:text-navy-700"
            aria-label="Sulje"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ConsentToggle({ label, description, checked, disabled, onChange }: {
  label: string; description: string; checked: boolean; disabled?: boolean; onChange?: () => void;
}) {
  return (
    <label className={`flex items-start gap-3 ${disabled ? 'opacity-60' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="mt-1 h-5 w-5 accent-orange-500"
      />
      <div>
        <div className="text-sm font-semibold text-navy-800">{label}</div>
        <div className="text-xs text-navy-500">{description}</div>
      </div>
    </label>
  );
}
