import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, ImagePlus, Loader2, Paintbrush, RotateCcw, Send, X } from 'lucide-react';

const QUOTE_ENDPOINT = '/send-mail.php';

type PlannerStep = 1 | 2 | 3 | 4;
type SurfaceKey = 'walls' | 'ceiling' | 'trim';

type PlannerColors = Record<SurfaceKey, string>;

const palette = [
  { name: 'Lämmin valkoinen', value: '#F2EFE6' },
  { name: 'Pehmeä beige', value: '#D8C9B5' },
  { name: 'Vaalea harmaa', value: '#C9CBC8' },
  { name: 'Lämmin harmaa', value: '#B8B0A4' },
  { name: 'Salvia', value: '#A7B19B' },
  { name: 'Utuisen sininen', value: '#9FB4C3' },
  { name: 'Terrakotta', value: '#B86F52' },
  { name: 'Syvä vihreä', value: '#496255' },
  { name: 'Grafiitti', value: '#45494B' },
  { name: 'Musta', value: '#1D2022' },
];

const defaultColors: PlannerColors = {
  walls: '#F2EFE6',
  ceiling: '#FFFFFF',
  trim: '#FFFFFF',
};

const cities = ['Helsinki', 'Espoo', 'Vantaa', 'Kauniainen', 'Kirkkonummi', 'Muu'];

function track(event: string, extra: Record<string, unknown> = {}) {
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...extra });
}

export function SimplePaintPlannerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<PlannerStep>(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [colors, setColors] = useState<PlannerColors>(defaultColors);
  const [activeSurface, setActiveSurface] = useState<SurfaceKey>('walls');
  const [showAfter, setShowAfter] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', message: '' });

  useEffect(() => {
    if (!open) return;
    track('paint_planner_open');
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    requestAnimationFrame(() => dialogRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  const selectedNames = useMemo(() => {
    const label = (hex: string) => palette.find((c) => c.value === hex)?.name || hex;
    return {
      walls: label(colors.walls),
      ceiling: label(colors.ceiling),
      trim: label(colors.trim),
    };
  }, [colors]);

  if (!open) return null;

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setImageName('');
    setStep(1);
    setColors(defaultColors);
    setActiveSurface('walls');
    setShowAfter(true);
    setSubmitted(false);
    setError(null);
    setForm({ name: '', phone: '', email: '', city: '', message: '' });
  };

  const selectFile = (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Valitse JPG-, PNG- tai WebP-kuva.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Kuva on liian suuri. Valitse enintään 10 Mt kuva.');
      return;
    }
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setImageName(file.name);
    setError(null);
    track('paint_planner_image_upload', { file_type: file.type });
    setStep(2);
  };

  const selectColor = (value: string) => {
    setColors((current) => ({ ...current, [activeSurface]: value }));
    track(`paint_planner_${activeSurface}_color_selected`, { color: value });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.city) {
      setError('Täytä nimi, puhelin, sähköposti ja kaupunki.');
      return;
    }
    setSubmitting(true);
    const designSummary = [
      'Paint Planner -suunnitelma',
      `Seinät: ${selectedNames.walls} (${colors.walls})`,
      `Katto: ${selectedNames.ceiling} (${colors.ceiling})`,
      `Ovet/listat: ${selectedNames.trim} (${colors.trim})`,
      imageName ? `Kuvan nimi: ${imageName}` : '',
      form.message ? `Lisätiedot: ${form.message}` : '',
    ].filter(Boolean).join('\n');

    try {
      const response = await fetch(QUOTE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          city: form.city,
          address: '',
          propertyType: 'Maalaussuunnittelija',
          service: 'sisamaalaus',
          surfaceArea: '',
          timeline: 'Joustava',
          budget: 'En tiedä',
          message: designSummary,
          website: '',
          formType: 'quote',
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || 'Tarjouspyynnön lähetys epäonnistui.');
      }
      setSubmitted(true);
      track('paint_planner_quote_submitted', { city: form.city });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tarjouspyynnön lähetys epäonnistui.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-navy-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="paint-planner-title" className="flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl outline-none sm:max-h-[92vh] sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-600">Maalaus Multiväri</p>
            <h2 id="paint-planner-title" className="font-display text-xl font-extrabold text-navy-950 sm:text-2xl">Maalisuunnittelija</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-200 text-navy-700 hover:bg-navy-50" aria-label="Sulje suunnittelija"><X className="h-5 w-5" /></button>
        </div>

        <div className="border-b border-navy-100 px-5 py-3 sm:px-7">
          <div className="flex items-center gap-2" aria-label={`Vaihe ${step}/4`}>
            {[1, 2, 3, 4].map((number) => <span key={number} className={`h-2 flex-1 rounded-full ${number <= step ? 'bg-orange-500' : 'bg-navy-100'}`} />)}
          </div>
          <p className="mt-2 text-xs font-semibold text-navy-500">Vaihe {step}/4 · {step === 1 ? 'Lataa kuva' : step === 2 ? 'Valitse värit' : step === 3 ? 'Katso lopputulos' : 'Pyydä tarjous'}</p>
        </div>

        <div className="overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
          {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          {step === 1 && (
            <div className="mx-auto max-w-2xl text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><ImagePlus className="h-8 w-8" /></span>
              <h3 className="mt-5 font-display text-3xl font-bold text-navy-950">Lataa kuva huoneestasi</h3>
              <p className="mx-auto mt-3 max-w-lg leading-relaxed text-navy-600">Näe muutamassa minuutissa, miltä huoneesi voisi näyttää uusilla seinä-, katto- ja ovi-/listaväreillä.</p>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="hidden" onChange={(e) => selectFile(e.target.files?.[0])} />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-primary mt-7 min-h-12 px-7"><ImagePlus className="h-5 w-5" /> Lataa kuva</button>
              <p className="mt-4 text-xs text-navy-500">JPG, PNG tai WebP · enintään 10 Mt. Kuvaa käytetään selaimessa esikatseluun eikä sitä tallenneta tässä vaiheessa.</p>
            </div>
          )}

          {step === 2 && imageUrl && (
            <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
              <Preview imageUrl={imageUrl} colors={colors} showAfter />
              <div>
                <h3 className="font-display text-2xl font-bold text-navy-950">Valitse värit</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">Aloita seinistä. Katto ja ovet/listat ovat oletuksena valkoiset. Esikatselu päivittyy heti.</p>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {([
                    ['walls', 'Seinät'], ['ceiling', 'Katto'], ['trim', 'Ovet/listat'],
                  ] as Array<[SurfaceKey, string]>).map(([key, label]) => (
                    <button key={key} type="button" onClick={() => setActiveSurface(key)} className={`rounded-xl border px-3 py-3 text-sm font-bold ${activeSurface === key ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-700'}`}>{label}</button>
                  ))}
                </div>
                <div className="mt-5 grid grid-cols-5 gap-3 sm:grid-cols-10 lg:grid-cols-5">
                  {palette.map((color) => {
                    const selected = colors[activeSurface] === color.value;
                    return <button key={color.value} type="button" onClick={() => selectColor(color.value)} title={color.name} aria-label={`${color.name}${selected ? ', valittu' : ''}`} className={`relative aspect-square rounded-full border-2 shadow-sm ${selected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-white ring-1 ring-navy-200'}`} style={{ backgroundColor: color.value }}>{selected && <Check className={`absolute inset-0 m-auto h-4 w-4 ${['#F2EFE6','#D8C9B5','#C9CBC8','#B8B0A4','#FFFFFF'].includes(color.value) ? 'text-navy-800' : 'text-white'}`} />}</button>;
                  })}
                </div>
                <label className="mt-5 block text-sm font-semibold text-navy-800">Oma sävy
                  <input type="color" value={colors[activeSurface]} onChange={(e) => selectColor(e.target.value)} className="mt-2 h-11 w-full cursor-pointer rounded-xl border border-navy-200 bg-white p-1" />
                </label>
              </div>
            </div>
          )}

          {step === 3 && imageUrl && (
            <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr] lg:items-start">
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-display text-2xl font-bold text-navy-950">Huoneesi esikatselu</h3>
                  <div className="flex rounded-xl border border-navy-200 p-1 text-sm font-semibold">
                    <button type="button" onClick={() => setShowAfter(false)} className={`rounded-lg px-3 py-2 ${!showAfter ? 'bg-navy-950 text-white' : 'text-navy-600'}`}>Ennen</button>
                    <button type="button" onClick={() => { setShowAfter(true); track('paint_planner_before_after_used'); }} className={`rounded-lg px-3 py-2 ${showAfter ? 'bg-orange-500 text-white' : 'text-navy-600'}`}>Jälkeen</button>
                  </div>
                </div>
                <Preview imageUrl={imageUrl} colors={colors} showAfter={showAfter} />
                <p className="mt-3 text-xs leading-relaxed text-navy-500">Esikatselu on suuntaa-antava visualisointi. Todellinen sävy vaihtelee valaistuksen, pinnan ja näytön mukaan. Lopullinen väri kannattaa varmistaa fyysisellä värimallilla.</p>
              </div>
              <div className="rounded-2xl border border-navy-100 bg-navy-50/70 p-5">
                <h4 className="font-display text-lg font-bold text-navy-950">Valitut värit</h4>
                <ColorSummary label="Seinät" value={colors.walls} name={selectedNames.walls} />
                <ColorSummary label="Katto" value={colors.ceiling} name={selectedNames.ceiling} />
                <ColorSummary label="Ovet/listat" value={colors.trim} name={selectedNames.trim} />
                <button type="button" onClick={() => setStep(2)} className="btn-outline mt-5 w-full"><RotateCcw className="h-4 w-4" /> Muokkaa värejä</button>
              </div>
            </div>
          )}

          {step === 4 && (
            submitted ? (
              <div className="mx-auto max-w-xl py-8 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700"><Check className="h-8 w-8" /></span>
                <h3 className="mt-5 font-display text-3xl font-bold text-navy-950">Kiitos tarjouspyynnöstä!</h3>
                <p className="mt-3 leading-relaxed text-navy-600">Värisuunnitelmasi tiedot lähetettiin tarjouspyynnön mukana. Otamme sinuun yhteyttä mahdollisimman pian.</p>
                <button type="button" onClick={reset} className="btn-outline mt-6">Tee uusi suunnitelma</button>
              </div>
            ) : (
              <form onSubmit={submit} className="mx-auto max-w-2xl">
                <h3 className="font-display text-3xl font-bold text-navy-950">Pidätkö lopputuloksesta?</h3>
                <p className="mt-2 text-navy-600">Me voimme toteuttaa sen. Lähetä lyhyt tarjouspyyntö — suunnitelmasi värit liitetään viestiin automaattisesti.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Nimi *"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="planner-input" autoComplete="name" /></Field>
                  <Field label="Puhelin *"><input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="planner-input" autoComplete="tel" /></Field>
                  <Field label="Sähköposti *"><input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="planner-input" autoComplete="email" /></Field>
                  <Field label="Kaupunki *"><select required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="planner-input"><option value="">Valitse...</option>{cities.map((city) => <option key={city}>{city}</option>)}</select></Field>
                </div>
                <Field label="Lisätiedot (valinnainen)"><textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="planner-input resize-none" placeholder="Esim. haluan maalata koko huoneen." /></Field>
                <button disabled={submitting} className="btn-primary mt-5 min-h-12 w-full disabled:opacity-60">{submitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Lähetetään…</> : <><Send className="h-5 w-5" /> Pyydä tarjous</>}</button>
                <p className="mt-3 text-center text-xs text-navy-500">Tarjouspyyntö ei sido sinua mihinkään.</p>
              </form>
            )
          )}
        </div>

        {!submitted && step > 1 && (
          <div className="flex items-center justify-between gap-3 border-t border-navy-100 bg-white px-5 py-4 sm:px-7">
            <button type="button" onClick={() => setStep((current) => Math.max(1, current - 1) as PlannerStep)} className="btn-outline"><ArrowLeft className="h-4 w-4" /> Takaisin</button>
            {step < 4 && <button type="button" onClick={() => { const next = Math.min(4, step + 1) as PlannerStep; setStep(next); if (next === 3) track('paint_planner_preview_generated'); if (next === 4) track('paint_planner_quote_started'); }} className="btn-primary">{step === 2 ? 'Katso lopputulos' : 'Pyydä tarjous'} <ArrowRight className="h-4 w-4" /></button>}
          </div>
        )}
      </div>
    </div>
  );
}

function Preview({ imageUrl, colors, showAfter }: { imageUrl: string; colors: PlannerColors; showAfter: boolean }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy-100 shadow-inner">
      <img src={imageUrl} alt="Asiakkaan huoneen esikatselu" className="h-full w-full object-cover" />
      {showAfter && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[23%] opacity-30 mix-blend-multiply" style={{ backgroundColor: colors.ceiling }} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[23%] opacity-26 mix-blend-multiply" style={{ backgroundColor: colors.walls, opacity: 0.28 }} />
          <div className="pointer-events-none absolute bottom-[10%] right-[8%] h-[48%] w-[18%] rounded-sm border-[8px] opacity-35 mix-blend-multiply" style={{ borderColor: colors.trim, backgroundColor: `${colors.trim}33` }} />
        </>
      )}
      <span className="absolute bottom-3 left-3 rounded-full bg-navy-950/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">{showAfter ? 'Jälkeen · suuntaa-antava' : 'Ennen'}</span>
    </div>
  );
}

function ColorSummary({ label, value, name }: { label: string; value: string; name: string }) {
  return <div className="mt-4 flex items-center gap-3 rounded-xl bg-white p-3"><span className="h-9 w-9 shrink-0 rounded-full border border-navy-200" style={{ backgroundColor: value }} /><div><p className="text-xs font-semibold uppercase tracking-wide text-navy-500">{label}</p><p className="text-sm font-bold text-navy-900">{name}</p></div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="mt-4 block text-sm font-bold text-navy-800">{label}<div className="mt-1.5">{children}</div></label>;
}
