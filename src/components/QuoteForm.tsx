import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react';
import { CheckCircle2, AlertCircle, Send, Loader2, Upload, X, Phone } from 'lucide-react';
import { getPaintingServices, getCleaningServices } from '@/data/services';
import { useSearchParams } from 'react-router-dom';
import { company } from '@/data/company';
import { trackGenerateLead, trackPhoneClick } from '@/lib/analytics';

type FormValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  propertyType: string;
  service: string;
  surfaceArea: string;
  timeline: string;
  budget: string;
  message: string;
  website: string;
};

type Errors = Partial<Record<keyof Omit<FormValues, 'website'>, string>>;

const cities = [
  'Helsinki', 'Espoo', 'Vantaa', 'Kauniainen', 'Kirkkonummi',
  'Kerava', 'Järvenpää', 'Hyvinkää', 'Nurmijärvi', 'Sipoo', 'Muu',
];

const propertyTypes = [
  'Kerrostalo-asunto', 'Omakotitalo', 'Rivitalo', 'Toimisto / toimitila', 'Muu',
];

const timelines = [
  'Heti', '1–2 viikon sisällä', 'Kuukauden sisällä', '2–3 kuukauden sisällä', 'Joustava',
];

const budgets = [
  'Alle 500 €', '500–1 500 €', '1 500–5 000 €', '5 000–10 000 €', 'Yli 10 000 €', 'En tiedä',
];

const MAX_FILES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const MAX_TOTAL_FILE_BYTES = 12 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

const initialValues: FormValues = {
  name: '', phone: '', email: '', address: '', city: '',
  propertyType: '', service: '', surfaceArea: '', timeline: '', budget: '',
  message: '', website: '',
};

const QUOTE_ENDPOINT = '/send-mail.php';

export function QuoteForm() {
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState<FormValues>(() => {
    const requested = searchParams.get('service');
    const serviceMap: Record<string, string> = {
      maalaus: 'Maalaus',
      siivous: 'Siivous',
      molemmat: 'Maalaus ja siivous',
    };
    const service = requested ? serviceMap[requested] ?? '' : '';
    return service ? { ...initialValues, service } : initialValues;
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [showInactivityPrompt, setShowInactivityPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const formStartedRef = useRef(false);

  const validate = (): boolean => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = 'Nimi on pakollinen.';
    if (!values.phone.trim()) {
      next.phone = 'Puhelin on pakollinen.';
    } else if (!/^[+\d\s()-]{6,}$/.test(values.phone)) {
      next.phone = 'Tarkista puhelinnumero.';
    }
    if (!values.email.trim()) {
      next.email = 'Sähköposti on pakollinen.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = 'Tarkista sähköpostiosoite.';
    }
    if (!values.city) next.city = 'Valitse kaupunki.';
    if (!values.service) next.service = 'Valitse palvelu.';
    if (!values.message.trim() || values.message.trim().length < 10) {
      next.message = 'Kerro lyhyesti projektistasi (vähintään 10 merkkiä).';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep = (targetStep: number): boolean => {
    const next: Errors = {};
    if (targetStep === 1) {
      if (!values.service) next.service = 'Valitse palvelu.';
      if (!values.city) next.city = 'Valitse kaupunki.';
    }
    if (targetStep === 2 && (!values.message.trim() || values.message.trim().length < 10)) {
      next.message = 'Kerro lyhyesti projektistasi (vähintään 10 merkkiä).';
    }
    if (targetStep === 3) {
      if (!values.name.trim()) next.name = 'Nimi on pakollinen.';
      if (!values.phone.trim()) next.phone = 'Puhelin on pakollinen.';
      else if (!/^[+\d\s()-]{6,}$/.test(values.phone)) next.phone = 'Tarkista puhelinnumero.';
      if (!values.email.trim()) next.email = 'Sähköposti on pakollinen.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Tarkista sähköpostiosoite.';
    }
    setErrors((current) => ({ ...current, ...next }));
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) setStep((current) => Math.min(3, current + 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((current) => Math.max(1, current - 1));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (values.website) return;
    if (!validate()) return;
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries({ ...values, formType: 'quote' }).forEach(([key, value]) => {
        payload.append(key, value);
      });
      files.forEach((file) => payload.append('files[]', file, file.name));

      const res = await fetch(QUOTE_ENDPOINT, {
        method: 'POST',
        body: payload,
      });

      if (res.status === 400 || res.status === 413) {
        const body = await res.json().catch(() => ({}));
        if (body.errors) {
          setErrors(body.errors as Errors);
          setServerError('Tarkista lomakkeen tiedot.');
        } else {
          setServerError(body.message ?? 'Tarkista lomakkeen tiedot ja kuvat.');
        }
        return;
      }

      if (res.status === 429) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.message ?? 'Liikaa pyyntöjä. Yritä myöhemmin uudelleen.');
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.message ?? 'Viestin lähetys epäonnistui. Yritä uudelleen.');
        return;
      }

      trackGenerateLead('quote_form', values.service, {
        city: values.city,
        budget: values.budget,
        timeline: values.timeline,
      });
      setSubmitted(true);
      setValues(initialValues);
      setStep(1);
      setFiles([]);
    } catch (err) {
      if (import.meta.env.DEV) console.error('QuoteForm submit error:', err);
      setServerError('Yhteysvirhe. Tarkista internet-yhteys ja yritä uudelleen.');
    } finally {
      setSubmitting(false);
    }
  };

  const update = useCallback(<K extends keyof FormValues>(key: K, v: string) => {
    setValues((s) => ({ ...s, [key]: v }));
    if (errors[key as keyof Errors]) setErrors((s) => ({ ...s, [key]: undefined }));
    if (serverError) setServerError(null);
    if (!formStartedRef.current) formStartedRef.current = true;
    setShowInactivityPrompt(false);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      if (!submitted) setShowInactivityPrompt(true);
    }, 25000);
  }, [errors, submitted, serverError]);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (selected.length === 0) return;

    const remainingSlots = MAX_FILES - files.length;
    if (remainingSlots <= 0) {
      setServerError(`Voit lisätä enintään ${MAX_FILES} kuvaa.`);
      return;
    }

    const accepted: File[] = [];
    let totalBytes = files.reduce((sum, file) => sum + file.size, 0);

    for (const file of selected.slice(0, remainingSlots)) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        setServerError('Sallitut kuvatyypit ovat JPG, PNG, WebP, HEIC ja HEIF.');
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setServerError(`Yksi kuva saa olla enintään ${Math.floor(MAX_FILE_BYTES / 1024 / 1024)} Mt.`);
        continue;
      }
      if (totalBytes + file.size > MAX_TOTAL_FILE_BYTES) {
        setServerError(`Kuvien yhteiskoko saa olla enintään ${Math.floor(MAX_TOTAL_FILE_BYTES / 1024 / 1024)} Mt.`);
        break;
      }
      accepted.push(file);
      totalBytes += file.size;
    }

    if (selected.length > remainingSlots) {
      setServerError(`Voit lisätä enintään ${MAX_FILES} kuvaa.`);
    } else if (accepted.length > 0 && accepted.length === selected.length) {
      setServerError(null);
    }

    if (accepted.length > 0) setFiles((prev) => [...prev, ...accepted]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setServerError(null);
  };

  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  if (submitted) {
    return (
      <div className="card flex flex-col items-center gap-4 p-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="font-display text-2xl font-bold text-navy-900">Kiitos tarjouspyynnöstä!</h3>
        <p className="max-w-md text-navy-600">
          Olemme vastaanottaneet tarjouspyyntösi ja mahdolliset kuvat. Palaamme asiaan 24 tunnin sisällä.
          Tarjoamme ilmaisen, sitouttamattoman tarkastuskäynnin kohteeseesi.
        </p>
        <button type="button" onClick={() => setSubmitted(false)} className="btn-outline mt-2">
          Lähetä uusi tarjouspyyntö
        </button>
      </div>
    );
  }

  const stepTitles = ['Palvelu ja sijainti', 'Projektin tiedot', 'Yhteystiedot'];

  return (
    <form onSubmit={onSubmit} noValidate className="card flex flex-col gap-5 p-6 sm:p-8">
      {serverError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-3" aria-label="Tarjouspyynnön vaiheet">
        {stepTitles.map((title, index) => {
          const number = index + 1;
          const active = number === step;
          const complete = number < step;
          return (
            <div key={title} className="flex min-w-0 items-center gap-2">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                active || complete ? 'bg-orange-500 text-white' : 'bg-navy-100 text-navy-500'
              }`}>{complete ? '✓' : number}</span>
              <span className={`hidden text-xs font-semibold sm:block ${active ? 'text-navy-900' : 'text-navy-500'}`}>{title}</span>
              {number < 3 && <span className="hidden h-px w-6 bg-navy-200 sm:block lg:w-12" />}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-navy-50/60 px-4 py-3">
        <p className="text-sm font-semibold text-navy-900">{stepTitles[step - 1]}</p>
        <p className="mt-0.5 text-xs text-navy-500">Vaihe {step}/3 · Voit palata takaisin milloin tahansa.</p>
      </div>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="cf-website">Älä täytä</label>
        <input id="cf-website" type="text" tabIndex={-1} autoComplete="off"
          value={values.website} onChange={(e) => update('website', e.target.value)} />
      </div>

      {step === 1 && (
        <>
          <FormField label="Mitä tarvitset? *" error={errors.service} htmlFor="qf-service">
            <select id="qf-service" value={values.service} onChange={(e) => update('service', e.target.value)}
              className={fieldClass(!!errors.service)}>
              <option value="">Valitse palvelu...</option>
              <optgroup label="Maalauspalvelut">
                {getPaintingServices().map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
              </optgroup>
              <optgroup label="Siivouspalvelut">
                {getCleaningServices().map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
              </optgroup>
              <option value="muu">Muu / en tiedä vielä</option>
            </select>
          </FormField>

          <FormField label="Missä kohde sijaitsee? *" error={errors.city} htmlFor="qf-city">
            <select id="qf-city" value={values.city} onChange={(e) => update('city', e.target.value)}
              className={fieldClass(!!errors.city)}>
              <option value="">Valitse kaupunki...</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>

          <FormField label="Osoite (valinnainen)" error={errors.address} htmlFor="qf-address">
            <input id="qf-address" type="text" value={values.address} onChange={(e) => update('address', e.target.value)}
              className={fieldClass(!!errors.address)} placeholder="Katuosoite" autoComplete="street-address" />
          </FormField>
        </>
      )}

      {step === 2 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Kiinteistön tyyppi" error={errors.propertyType} htmlFor="qf-prop">
              <select id="qf-prop" value={values.propertyType} onChange={(e) => update('propertyType', e.target.value)}
                className={fieldClass(!!errors.propertyType)}>
                <option value="">Valitse...</option>
                {propertyTypes.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </FormField>
            <FormField label="Pinta-ala (m²), valinnainen" error={errors.surfaceArea} htmlFor="qf-area">
              <input id="qf-area" type="number" min={0} value={values.surfaceArea} onChange={(e) => update('surfaceArea', e.target.value)}
                className={fieldClass(!!errors.surfaceArea)} placeholder="esim. 60" inputMode="numeric" />
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Aikataulu" error={errors.timeline} htmlFor="qf-timeline">
              <select id="qf-timeline" value={values.timeline} onChange={(e) => update('timeline', e.target.value)}
                className={fieldClass(!!errors.timeline)}>
                <option value="">Valitse...</option>
                {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Budjetti, valinnainen" error={errors.budget} htmlFor="qf-budget">
              <select id="qf-budget" value={values.budget} onChange={(e) => update('budget', e.target.value)}
                className={fieldClass(!!errors.budget)}>
                <option value="">Valitse...</option>
                {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Kerro lyhyesti projektistasi *" error={errors.message} htmlFor="qf-message">
            <textarea id="qf-message" value={values.message} rows={5} onChange={(e) => update('message', e.target.value)}
              className={fieldClass(!!errors.message)} placeholder="Mitä haluat maalata tai siivota? Kerro tärkeimmät toiveesi..." />
          </FormField>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-800">Kuvat kohteesta (valinnainen)</label>
            <div onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-navy-200 bg-navy-50/30 px-4 py-6 text-center transition hover:border-orange-300 hover:bg-orange-50/30">
              <Upload className="h-6 w-6 text-navy-400" />
              <span className="text-sm text-navy-500">Lisää kuvia (max 5 · yhteensä max 12 Mt)</span>
              <span className="text-xs text-navy-400">JPG, PNG, WebP, HEIC tai HEIF</span>
            </div>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple className="hidden" onChange={handleFiles} />
            {files.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <div key={`${f.name}-${f.lastModified}-${i}`} className="flex items-center gap-2 rounded-lg bg-navy-50 px-3 py-1.5 text-xs text-navy-700">
                    <span className="max-w-[150px] truncate">{f.name}</span>
                    <span className="text-navy-400">{(f.size / 1024 / 1024).toFixed(1)} Mt</span>
                    <button type="button" onClick={() => removeFile(i)} className="text-navy-400 hover:text-red-500" aria-label={`Poista ${f.name}`}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Nimi *" error={errors.name} htmlFor="qf-name">
              <input id="qf-name" type="text" value={values.name} onChange={(e) => update('name', e.target.value)}
                className={fieldClass(!!errors.name)} placeholder="Etunimi Sukunimi" autoComplete="name" />
            </FormField>
            <FormField label="Puhelin *" error={errors.phone} htmlFor="qf-phone">
              <input id="qf-phone" type="tel" value={values.phone} onChange={(e) => update('phone', e.target.value)}
                className={fieldClass(!!errors.phone)} placeholder="040 123 4567" autoComplete="tel" />
            </FormField>
          </div>

          <FormField label="Sähköposti *" error={errors.email} htmlFor="qf-email">
            <input id="qf-email" type="email" value={values.email} onChange={(e) => update('email', e.target.value)}
              className={fieldClass(!!errors.email)} placeholder="nimi@esimerkki.fi" autoComplete="email" />
          </FormField>

          {showInactivityPrompt && (
            <div className="flex flex-col gap-3 rounded-xl border border-orange-200 bg-orange-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium text-navy-700">Tarvitsetko apua? Soita tai pyydä soittopyyntö.</span>
              </div>
              <a href={company.phoneHref} onClick={() => trackPhoneClick('quote_form_help')} className="btn-primary !py-2 text-sm"><Phone className="h-4 w-4" /> Soita</a>
            </div>
          )}

          <div className="rounded-xl bg-navy-50/50 px-4 py-3">
            <p className="text-sm font-semibold text-navy-800">Valmis lähettämään?</p>
            <p className="mt-1 text-xs leading-relaxed text-navy-500">Tarkista yhteystietosi. Vastaamme tarjouspyyntöön mahdollisimman pian.</p>
            {files.length > 0 && <p className="mt-1 text-xs font-semibold text-orange-700">{files.length} kuvaa liitetään tarjouspyyntöön.</p>}
          </div>
        </>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-navy-100 pt-5 sm:flex-row sm:justify-between">
        <button type="button" onClick={goBack} disabled={step === 1 || submitting}
          className="btn-outline w-full disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">Takaisin</button>
        {step < 3 ? (
          <button type="button" onClick={goNext} className="btn-primary w-full sm:w-auto">Jatka <span aria-hidden="true">→</span></button>
        ) : (
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-70 sm:w-auto">
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Lähetetään...</> : <>Lähetä tarjouspyyntö<Send className="h-4 w-4" /></>}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-navy-500">Tietosi ja mahdolliset kuvat käsitellään luottamuksellisesti. Voit pyytää tarjouksen ilman sitoutumista.</p>
    </form>
  );
}

const fieldClass = (hasError: boolean) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy-900 transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 ${hasError ? 'border-red-300 bg-red-50/40' : 'border-navy-200'}`;

function FormField({ label, error, htmlFor, children }: {
  label: string; error?: string; htmlFor: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-navy-800">{label}</label>
      {children}
      {error && <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
        <AlertCircle className="h-3.5 w-3.5" />{error}
      </p>}
    </div>
  );
}
