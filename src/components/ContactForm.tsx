import { useState, type FormEvent } from 'react';
import { CheckCircle2, AlertCircle, Send, Loader2 } from 'lucide-react';
import { getPaintingServices, getCleaningServices } from '@/data/services';
import { trackContactSubmit } from '@/lib/analytics';

type Errors = Partial<Record<'name' | 'email' | 'phone' | 'service' | 'message', string>>;

// PHP endpoint on the same origin (HostGator). Vite dev server proxies /send-mail.php
// via the proxy config in vite.config.ts so local dev hits the same origin too.
const CONTACT_ENDPOINT = '/send-mail.php';

export function ContactForm() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    website: '', // honeypot — must stay empty; bots tend to fill every field
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Server-side error shown above the submit button when delivery fails.
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = (): boolean => {
    const next: Errors = {};
    if (!values.name.trim()) next.name = 'Nimi on pakollinen.';
    if (!values.email.trim()) {
      next.email = 'Sähköposti on pakollinen.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = 'Tarkista sähköpostiosoite.';
    }
    if (!values.phone.trim()) {
      next.phone = 'Puhelin on pakollinen.';
    } else if (!/^[+\d\s()-]{6,}$/.test(values.phone)) {
      next.phone = 'Tarkista puhelinnumero.';
    }
    if (!values.service) next.service = 'Valitse palvelu.';
    if (!values.message.trim() || values.message.trim().length < 10) {
      next.message = 'Kerro lyhyesti projektistasi (vähintään 10 merkkiä).';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // Submit handler: validates, then POSTs to the edge function. The success
  // screen is only shown after the server confirms both emails were sent.
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (values.website) return; // honeypot triggered — silently ignore bot
    if (!validate()) return;
    setSubmitting(true);

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, formType: 'contact' }),
      });

      // 400 = server-side validation errors. Map them onto the fields.
      if (res.status === 400) {
        const body = await res.json().catch(() => ({}));
        if (body.errors) {
          setErrors(body.errors as Errors);
          setServerError('Tarkista lomakkeen tiedot.');
        } else {
          setServerError(body.message ?? 'Tarkista lomakkeen tiedot.');
        }
        return;
      }

      // 429 = rate limited.
      if (res.status === 429) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.message ?? 'Liikaa pyyntöjä. Yritä myöhemmin uudelleen.');
        return;
      }

      // 500 or other failure — keep form data so the customer can retry.
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.message ?? 'Viestin lähetys epäonnistui. Yritä uudelleen.');
        return;
      }

      // Success — emails were sent. Now safe to show confirmation and clear.
      trackContactSubmit('contact_form', {
        service_type: values.service,
      });
      setSubmitted(true);
      setValues({ name: '', email: '', phone: '', service: '', message: '', website: '' });
    } catch (err) {
      // Network error / server unreachable.
      if (import.meta.env.DEV) console.error('ContactForm submit error:', err);
      setServerError('Yhteysvirhe. Tarkista internet-yhteys ja yritä uudelleen.');
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: keyof typeof values, v: string) => {
    setValues((s) => ({ ...s, [key]: v }));
    if (errors[key as keyof Errors]) setErrors((s) => ({ ...s, [key]: undefined }));
    if (serverError) setServerError(null);
  };

  if (submitted) {
    return (
      <div className="card flex flex-col items-center gap-4 p-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="font-display text-2xl font-bold text-navy-900">Kiitos yhteydenotostasi!</h3>
        <p className="max-w-md text-navy-600">
          Olemme vastaanottaneet viestisi ja palaamme asiaan 24 tunnin sisällä. Tarjoamme
          ilmainen, sitoutumattoman tarkastuskäynnin kohteeseesi.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn-outline mt-2"
        >
          Lähetä uusi viesti
        </button>
      </div>
    );
  }

  const fieldClass = (key: keyof typeof values) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-navy-900 transition focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 ${
      errors[key as keyof Errors] ? 'border-red-300 bg-red-50/40' : 'border-navy-200'
    }`;

  return (
    <form onSubmit={onSubmit} noValidate className="card flex flex-col gap-5 p-6 sm:p-8">
      {serverError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="cf-website-hp">Älä täytä</label>
        <input
          id="cf-website-hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-sm font-semibold text-navy-800">
            Nimi *
          </label>
          <input
            id="cf-name"
            type="text"
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            className={fieldClass('name')}
            placeholder="Etunimi Sukunimi"
          />
          {errors.name && <FieldError message={errors.name} />}
        </div>
        <div>
          <label htmlFor="cf-phone" className="mb-1.5 block text-sm font-semibold text-navy-800">
            Puhelin *
          </label>
          <input
            id="cf-phone"
            type="tel"
            value={values.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={fieldClass('phone')}
            placeholder="040 242 9650"
          />
          {errors.phone && <FieldError message={errors.phone} />}
        </div>
      </div>

      <div>
        <label htmlFor="cf-email" className="mb-1.5 block text-sm font-semibold text-navy-800">
          Sähköposti *
        </label>
        <input
          id="cf-email"
          type="email"
          value={values.email}
          onChange={(e) => update('email', e.target.value)}
          className={fieldClass('email')}
          placeholder="nimi@esimerkki.fi"
        />
        {errors.email && <FieldError message={errors.email} />}
      </div>

      <div>
        <label htmlFor="cf-service" className="mb-1.5 block text-sm font-semibold text-navy-800">
          Palvelu *
        </label>
        <select
          id="cf-service"
          value={values.service}
          onChange={(e) => update('service', e.target.value)}
          className={fieldClass('service')}
        >
          <option value="">Valitse palvelu...</option>
          <optgroup label="Maalauspalvelut">
            {getPaintingServices().map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </optgroup>
          <optgroup label="Siivouspalvelut">
            {getCleaningServices().map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </optgroup>
          <option value="muu">Muu / en tiedä vielä</option>
        </select>
        {errors.service && <FieldError message={errors.service} />}
      </div>

      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-sm font-semibold text-navy-800">
          Viesti *
        </label>
        <textarea
          id="cf-message"
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
          rows={4}
          className={fieldClass('message')}
          placeholder="Kerro kohteestasi, osoitteesta ja toiveistasi..."
        />
        {errors.message && <FieldError message={errors.message} />}
      </div>

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-70">
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Lähetetään...
          </>
        ) : (
          <>
            Lähetä tarjouspyyntö
            <Send className="h-4 w-4" />
          </>
        )}
      </button>
      <p className="text-center text-xs text-navy-500">
        Vastaamme yhteydenottoon mahdollisimman pian. Tietosi käsitellään luottamuksellisesti.
      </p>
    </form>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
      <AlertCircle className="h-3.5 w-3.5" />
      {message}
    </p>
  );
}
