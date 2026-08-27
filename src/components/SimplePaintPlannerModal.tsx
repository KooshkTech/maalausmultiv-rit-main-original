import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, ImagePlus, Loader2, RotateCcw, Send, X } from 'lucide-react';

const QUOTE_ENDPOINT = '/send-mail.php';
type Step = 1 | 2 | 3 | 4;
type Surface = 'walls' | 'ceiling' | 'trim';
type Colors = Record<Surface, string>;

const palette = [
  ['Lämmin valkoinen', '#F2EFE6'], ['Pehmeä beige', '#D8C9B5'], ['Vaalea harmaa', '#C9CBC8'],
  ['Lämmin harmaa', '#B8B0A4'], ['Salvia', '#A7B19B'], ['Utuisen sininen', '#9FB4C3'],
  ['Terrakotta', '#B86F52'], ['Syvä vihreä', '#496255'], ['Grafiitti', '#45494B'], ['Musta', '#1D2022'],
] as const;
const defaults: Colors = { walls: '#F2EFE6', ceiling: '#FFFFFF', trim: '#FFFFFF' };
const cities = ['Helsinki', 'Espoo', 'Vantaa', 'Kauniainen', 'Kirkkonummi', 'Muu'];

function analytics(event: string, data: Record<string, unknown> = {}) {
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}

export function SimplePaintPlannerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>(1);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');
  const [colors, setColors] = useState<Colors>(defaults);
  const [surface, setSurface] = useState<Surface>('walls');
  const [after, setAfter] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '', email: '', city: '', message: '' });
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    analytics('paint_planner_open');
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', key); };
  }, [open, onClose]);

  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);

  const names = useMemo(() => {
    const find = (value: string) => palette.find(([, hex]) => hex === value)?.[0] || value;
    return { walls: find(colors.walls), ceiling: find(colors.ceiling), trim: find(colors.trim) };
  }, [colors]);

  if (!open) return null;

  const pickImage = (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return setError('Valitse JPG-, PNG- tai WebP-kuva.');
    if (file.size > 10 * 1024 * 1024) return setError('Kuva on liian suuri. Enimmäiskoko on 10 Mt.');
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setImageName(file.name);
    setError(null);
    analytics('paint_planner_image_upload', { type: file.type });
    setStep(2);
  };

  const chooseColor = (value: string) => {
    setColors((c) => ({ ...c, [surface]: value }));
    analytics(`paint_planner_${surface}_color_selected`, { color: value });
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.city) return setError('Täytä nimi, puhelin, sähköposti ja kaupunki.');
    setSending(true);
    const summary = `Paint Planner -suunnitelma\nSeinät: ${names.walls} (${colors.walls})\nKatto: ${names.ceiling} (${colors.ceiling})\nOvet/listat: ${names.trim} (${colors.trim})\n${imageName ? `Kuvan nimi: ${imageName}\n` : ''}${form.message}`;
    try {
      const response = await fetch(QUOTE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), city: form.city,
        address: '', propertyType: 'Maalisuunnittelija', service: 'sisamaalaus', surfaceArea: '', timeline: 'Joustava', budget: 'En tiedä',
        message: summary, website: '', formType: 'quote',
      }) });
      if (!response.ok) { const body = await response.json().catch(() => ({})); throw new Error(body.message || 'Tarjouspyynnön lähetys epäonnistui.'); }
      setSent(true);
      analytics('paint_planner_quote_submitted', { city: form.city });
    } catch (err) { setError(err instanceof Error ? err.message : 'Tarjouspyynnön lähetys epäonnistui.'); }
    finally { setSending(false); }
  };

  const next = () => {
    const n = Math.min(4, step + 1) as Step;
    setStep(n);
    if (n === 3) analytics('paint_planner_preview_generated');
    if (n === 4) analytics('paint_planner_quote_started');
  };

  return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-navy-950/70 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div role="dialog" aria-modal="true" aria-labelledby="planner-title" className="flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[92vh] sm:rounded-3xl">
      <header className="flex items-center justify-between border-b border-navy-100 px-5 py-4 sm:px-7">
        <div><p className="text-xs font-bold uppercase tracking-widest text-orange-600">Maalaus Multiväri</p><h2 id="planner-title" className="font-display text-xl font-extrabold text-navy-950 sm:text-2xl">Maalisuunnittelija</h2></div>
        <button type="button" onClick={onClose} aria-label="Sulje" className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-200"><X className="h-5 w-5" /></button>
      </header>
      <div className="border-b border-navy-100 px-5 py-3 sm:px-7"><div className="flex gap-2">{[1,2,3,4].map((n) => <span key={n} className={`h-2 flex-1 rounded-full ${n <= step ? 'bg-orange-500' : 'bg-navy-100'}`} />)}</div><p className="mt-2 text-xs font-semibold text-navy-500">Vaihe {step}/4</p></div>
      <main className="overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
        {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {step === 1 && <div className="mx-auto max-w-2xl text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><ImagePlus className="h-8 w-8" /></span><h3 className="mt-5 font-display text-3xl font-bold text-navy-950">Lataa kuva huoneestasi</h3><p className="mt-3 text-navy-600">Näe miltä huoneesi voisi näyttää uusilla väreillä.</p><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="hidden" onChange={(e) => pickImage(e.target.files?.[0])} /><button type="button" onClick={() => inputRef.current?.click()} className="btn-primary mt-7"><ImagePlus className="h-5 w-5" /> Lataa kuva</button><p className="mt-4 text-xs text-navy-500">Kuvaa käytetään selaimessa esikatseluun eikä sitä tallenneta tässä vaiheessa.</p></div>}
        {step === 2 && imageUrl && <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]"><Preview src={imageUrl} colors={colors} after /><div><h3 className="font-display text-2xl font-bold text-navy-950">Valitse värit</h3><p className="mt-2 text-sm text-navy-600">Valitse pinta ja sitten sävy. Esikatselu päivittyy heti.</p><div className="mt-5 grid grid-cols-3 gap-2">{([['walls','Seinät'],['ceiling','Katto'],['trim','Ovet/listat']] as Array<[Surface,string]>).map(([key,label]) => <button key={key} type="button" onClick={() => setSurface(key)} className={`rounded-xl border px-3 py-3 text-sm font-bold ${surface === key ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-700'}`}>{label}</button>)}</div><div className="mt-5 grid grid-cols-5 gap-3">{palette.map(([name,value]) => <button key={value} type="button" onClick={() => chooseColor(value)} title={name} aria-label={name} className={`relative aspect-square rounded-full border-2 ${colors[surface] === value ? 'border-orange-500 ring-2 ring-orange-200' : 'border-white ring-1 ring-navy-200'}`} style={{ backgroundColor: value }}>{colors[surface] === value && <Check className="absolute inset-0 m-auto h-4 w-4 text-navy-900" />}</button>)}</div><label className="mt-5 block text-sm font-bold text-navy-800">Oma sävy<input type="color" value={colors[surface]} onChange={(e) => chooseColor(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-navy-200 p-1" /></label></div></div>}
        {step === 3 && imageUrl && <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]"><div><div className="mb-3 flex items-center justify-between"><h3 className="font-display text-2xl font-bold text-navy-950">Huoneesi esikatselu</h3><div className="flex rounded-xl border p-1 text-sm font-semibold"><button type="button" onClick={() => setAfter(false)} className={`rounded-lg px-3 py-2 ${!after ? 'bg-navy-950 text-white' : ''}`}>Ennen</button><button type="button" onClick={() => { setAfter(true); analytics('paint_planner_before_after_used'); }} className={`rounded-lg px-3 py-2 ${after ? 'bg-orange-500 text-white' : ''}`}>Jälkeen</button></div></div><Preview src={imageUrl} colors={colors} after={after} /><p className="mt-3 text-xs leading-relaxed text-navy-500">Esikatselu on suuntaa-antava. Todellinen sävy vaihtelee valaistuksen, pinnan ja näytön mukaan.</p></div><div className="rounded-2xl bg-navy-50 p-5"><h4 className="font-display text-lg font-bold">Valitut värit</h4><Summary label="Seinät" color={colors.walls} name={names.walls} /><Summary label="Katto" color={colors.ceiling} name={names.ceiling} /><Summary label="Ovet/listat" color={colors.trim} name={names.trim} /><button type="button" onClick={() => setStep(2)} className="btn-outline mt-5 w-full"><RotateCcw className="h-4 w-4" /> Muokkaa</button></div></div>}
        {step === 4 && (sent ? <div className="mx-auto max-w-xl py-8 text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700"><Check className="h-8 w-8" /></span><h3 className="mt-5 font-display text-3xl font-bold">Kiitos tarjouspyynnöstä!</h3><p className="mt-3 text-navy-600">Värivalintasi lähetettiin tarjouspyynnön mukana.</p></div> : <form onSubmit={submit} className="mx-auto max-w-2xl"><h3 className="font-display text-3xl font-bold">Pidätkö lopputuloksesta?</h3><p className="mt-2 text-navy-600">Me voimme toteuttaa sen. Lähetä lyhyt tarjouspyyntö.</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Nimi *"><input className="planner-input" required value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} /></Field><Field label="Puhelin *"><input className="planner-input" required type="tel" value={form.phone} onChange={(e) => setForm({...form,phone:e.target.value})} /></Field><Field label="Sähköposti *"><input className="planner-input" required type="email" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} /></Field><Field label="Kaupunki *"><select className="planner-input" required value={form.city} onChange={(e) => setForm({...form,city:e.target.value})}><option value="">Valitse...</option>{cities.map((city) => <option key={city}>{city}</option>)}</select></Field></div><Field label="Lisätiedot"><textarea className="planner-input resize-none" rows={3} value={form.message} onChange={(e) => setForm({...form,message:e.target.value})} /></Field><button disabled={sending} className="btn-primary mt-5 w-full">{sending ? <><Loader2 className="h-5 w-5 animate-spin" /> Lähetetään…</> : <><Send className="h-5 w-5" /> Pyydä tarjous</>}</button></form>)}
      </main>
      {!sent && step > 1 && <footer className="flex justify-between gap-3 border-t border-navy-100 px-5 py-4 sm:px-7"><button type="button" onClick={() => setStep(Math.max(1, step - 1) as Step)} className="btn-outline"><ArrowLeft className="h-4 w-4" /> Takaisin</button>{step < 4 && <button type="button" onClick={next} className="btn-primary">{step === 2 ? 'Katso lopputulos' : 'Pyydä tarjous'} <ArrowRight className="h-4 w-4" /></button>}</footer>}
    </div>
  </div>;
}

function Preview({ src, colors, after }: { src: string; colors: Colors; after: boolean }) {
  return <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-navy-100"><img src={src} alt="Huoneen esikatselu" className="h-full w-full object-cover" />{after && <><div className="absolute inset-x-0 top-0 h-[23%] mix-blend-multiply" style={{ backgroundColor: colors.ceiling, opacity: .3 }} /><div className="absolute inset-x-0 bottom-0 top-[23%] mix-blend-multiply" style={{ backgroundColor: colors.walls, opacity: .28 }} /><div className="absolute bottom-[10%] right-[8%] h-[48%] w-[18%] border-[8px] mix-blend-multiply" style={{ borderColor: colors.trim, opacity: .35 }} /></>}<span className="absolute bottom-3 left-3 rounded-full bg-navy-950/75 px-3 py-1.5 text-xs font-bold text-white">{after ? 'Jälkeen · suuntaa-antava' : 'Ennen'}</span></div>;
}
function Summary({ label, color, name }: { label: string; color: string; name: string }) { return <div className="mt-4 flex items-center gap-3 rounded-xl bg-white p-3"><span className="h-9 w-9 rounded-full border" style={{ backgroundColor: color }} /><div><p className="text-xs uppercase text-navy-500">{label}</p><p className="text-sm font-bold">{name}</p></div></div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="mt-4 block text-sm font-bold text-navy-800">{label}<div className="mt-1.5">{children}</div></label>; }
