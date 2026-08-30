import { useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Camera, Download, ImagePlus, Loader2, PaintRoller, RefreshCcw, Send, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

const AI_ENDPOINT = '/ai-image-transform.php';
const QUOTE_ENDPOINT = '/send-mail.php';

type Surface = 'walls' | 'ceiling' | 'doors' | 'trim';
type QuoteForm = { name: string; phone: string; city: string; message: string };

const surfaces: Array<{ id: Surface; label: string }> = [
  { id: 'walls', label: 'Seinät' },
  { id: 'ceiling', label: 'Katto' },
  { id: 'doors', label: 'Ovet' },
  { id: 'trim', label: 'Listat' },
];

const palette = [
  ['Lämmin valkoinen', '#F2EFE6'], ['Pehmeä beige', '#D8C9B5'], ['Vaalea harmaa', '#C9CBC8'],
  ['Hiekka', '#C7B69E'], ['Salvia', '#A7B19B'], ['Utuisen sininen', '#9FB4C3'],
  ['Terrakotta', '#B86F52'], ['Syvä vihreä', '#496255'], ['Grafiitti', '#45494B'], ['Musta', '#1D2022'],
] as const;

async function normalizeImage(file: File): Promise<File> {
  if (file.size > 18 * 1024 * 1024) throw new Error('Kuva on liian suuri. Valitse enintään 18 Mt kuva.');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const maxSide = 1800;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Kuvan käsittely ei onnistunut.');
    ctx.drawImage(image, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    if (!blob) throw new Error('Kuvan käsittely ei onnistunut.');
    return new File([blob], 'varikamu-input.jpg', { type: 'image/jpeg' });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, data] = dataUrl.split(',');
  const mime = meta.match(/data:(.*?);base64/)?.[1] || 'image/jpeg';
  const binary = atob(data);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export function PaintStudioAiPage() {
  const { session } = useCustomerAuth();
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [surface, setSurface] = useState<Surface>('walls');
  const [color, setColor] = useState('#D8C9B5');
  const [compareAt, setCompareAt] = useState(50);
  const [status, setStatus] = useState<'idle' | 'preparing' | 'generating' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [quote, setQuote] = useState<QuoteForm>({ name: '', phone: '', city: '', message: '' });
  const [quoteState, setQuoteState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const surfaceLabel = useMemo(() => surfaces.find((item) => item.id === surface)?.label || 'Seinät', [surface]);

  const chooseFile = async (file?: File) => {
    if (!file) return;
    setStatus('preparing');
    setError('');
    try {
      const normalized = await normalizeImage(file);
      if (sourceUrl?.startsWith('blob:')) URL.revokeObjectURL(sourceUrl);
      const url = URL.createObjectURL(normalized);
      setSourceFile(normalized);
      setSourceUrl(url);
      setResultUrl(null);
      setStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kuvan lataus epäonnistui.');
      setStatus('error');
    }
  };

  const generate = async () => {
    if (!sourceFile) return;
    setStatus('generating');
    setError('');
    setResultUrl(null);
    try {
      const form = new FormData();
      form.append('mode', 'paint');
      form.append('image', sourceFile);
      form.append('surface', surface);
      form.append('color', color);
      const response = await fetch(AI_ENDPOINT, { method: 'POST', body: form });
      const payload = await response.json().catch(() => ({})) as { image?: string; imageUrl?: string; error?: string; code?: string };
      if (!response.ok) {
        if (payload.code === 'AI_NOT_CONFIGURED') throw new Error('AI-kuvapalvelun API-avain puuttuu palvelimelta.');
        throw new Error(payload.error || 'Realistisen maalauskuvan luonti epäonnistui.');
      }
      const next = payload.image || payload.imageUrl;
      if (!next) throw new Error('AI-palvelu ei palauttanut lopputuloskuvaa.');
      setResultUrl(next);
      setCompareAt(50);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI-kuvan luonti epäonnistui.');
      setStatus('error');
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `varikamu-${surface}-${color.replace('#', '')}.jpg`;
    link.click();
  };

  const submitQuote = async (event: FormEvent) => {
    event.preventDefault();
    if (!resultUrl || !quote.name.trim() || !quote.phone.trim() || !quote.city.trim()) return;
    setQuoteState('sending');
    try {
      const resultBlob = resultUrl.startsWith('data:') ? dataUrlToBlob(resultUrl) : await fetch(resultUrl).then((r) => r.blob());
      const form = new FormData();
      form.append('formType', 'quote');
      form.append('name', quote.name.trim());
      form.append('phone', quote.phone.trim());
      form.append('email', session?.user.email || '');
      form.append('city', quote.city.trim());
      form.append('address', '');
      form.append('propertyType', 'VäriKamu');
      form.append('service', 'sisamaalaus');
      form.append('surfaceArea', '');
      form.append('timeline', 'Joustava');
      form.append('budget', 'Arvio pyydetään');
      form.append('website', '');
      form.append('message', `VäriKamu AI-suunnitelma. Pinta: ${surfaceLabel}. Sävy: ${color}. ${quote.message}`.trim());
      form.append('files[]', resultBlob, 'varikamu-ai-suunnitelma.jpg');
      const response = await fetch(QUOTE_ENDPOINT, { method: 'POST', body: form });
      if (!response.ok) throw new Error('Tarjouspyynnön lähetys epäonnistui.');
      setQuoteState('sent');
    } catch {
      setQuoteState('error');
    }
  };

  return (
    <section className="min-h-screen bg-navy-50 px-3 py-4 sm:px-5 sm:py-6">
      <div className="container-base max-w-6xl pb-10">
        <div className="mb-5 flex items-center gap-3">
          <Link to="/varikamu" className="flex size-10 items-center justify-center rounded-xl border border-navy-200 bg-white" aria-label="Takaisin"><ArrowLeft className="size-4" /></Link>
          <div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">VäriKamu AI</p><h1 className="font-display text-xl font-extrabold text-navy-950 sm:text-2xl">Näe oikea maalaustulos ennen tarjousta</h1></div>
        </div>

        {!sourceUrl ? (
          <div className="mx-auto max-w-3xl rounded-3xl border-2 border-dashed border-navy-200 bg-white p-6 text-center sm:p-12">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><ImagePlus className="size-8" /></span>
            <h2 className="mt-5 font-display text-3xl font-bold text-navy-950">Lisää kuva maalattavasta tilasta</h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-navy-600">Ota uusi kuva kameralla tai lataa olemassa oleva kuva. VäriKamu luo realistisen AI-esikatselun, ei pelkkää väri- tai kontrastisuodatinta.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => cameraRef.current?.click()} className="btn-primary w-full"><Camera className="size-5" />Ota kuva</button>
              <button type="button" onClick={() => uploadRef.current?.click()} className="btn-outline w-full"><Upload className="size-5" />Lataa kuva</button>
            </div>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => void chooseFile(e.target.files?.[0])} />
            <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={(e) => void chooseFile(e.target.files?.[0])} />
            <p className="mt-4 text-xs text-navy-500">Kuva pienennetään turvallisesti selaimessa ennen käsittelyä. AI-käsittely lähettää kuvan palvelimen kautta kuvamuokkauspalveluun.</p>
            {status === 'preparing' && <p className="mt-4 text-sm font-semibold text-orange-700">Valmistellaan kuvaa…</p>}
            {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
              <div className="card overflow-hidden p-3 sm:p-4">
                {!resultUrl ? (
                  <img src={sourceUrl} alt="Alkuperäinen tila" className="max-h-[68vh] w-full rounded-2xl object-contain" />
                ) : (
                  <div className="ba-slider relative overflow-hidden rounded-2xl bg-navy-950" style={{ aspectRatio: '4 / 3' }}>
                    <img src={resultUrl} alt="AI-maalaustulos" className="absolute inset-0 h-full w-full object-contain" />
                    <div className="absolute inset-y-0 left-0 overflow-hidden bg-navy-950" style={{ width: `${compareAt}%` }}>
                      <img src={sourceUrl} alt="Ennen maalausta" className="h-full max-w-none object-contain" style={{ width: '100vw', maxWidth: 'none' }} />
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow" style={{ left: `${compareAt}%` }} />
                    <span className="absolute left-3 top-3 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-bold text-white">Ennen</span>
                    <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">AI-jälkeen</span>
                    <input aria-label="Ennen ja jälkeen" type="range" min="5" max="95" value={compareAt} onChange={(e) => setCompareAt(Number(e.target.value))} className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0" />
                  </div>
                )}
              </div>

              {resultUrl && (
                <div className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">Valmis lopputulos</p><h2 className="font-display text-2xl font-bold text-navy-950">Realistinen maalausesikatselu</h2></div><button type="button" onClick={download} className="btn-primary"><Download className="size-4" />Lataa JPG</button></div>
                  <p className="mt-3 text-sm leading-6 text-navy-600">AI-esikatselu on suunnittelun apuväline. Lopulliseen sävyyn vaikuttavat valo, alusta ja maalin kiiltoaste.</p>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="card p-5"><p className="text-xs font-bold uppercase tracking-wider text-navy-500">1. Maalattava pinta</p><div className="mt-3 grid grid-cols-2 gap-2">{surfaces.map((item) => <button key={item.id} type="button" onClick={() => setSurface(item.id)} className={`rounded-xl border px-3 py-3 text-sm font-bold ${surface === item.id ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-700'}`}>{item.label}</button>)}</div></div>

              <div className="card p-5"><p className="text-xs font-bold uppercase tracking-wider text-navy-500">2. Sävy</p><div className="mt-3 grid grid-cols-5 gap-2">{palette.map(([name, hex]) => <button key={hex} type="button" title={name} aria-label={name} onClick={() => setColor(hex)} className={`aspect-square rounded-full border-2 ${color === hex ? 'border-orange-500 ring-2 ring-orange-200' : 'border-white ring-1 ring-navy-200'}`} style={{ backgroundColor: hex }} />)}</div><div className="mt-4 flex items-center gap-2"><input type="color" value={color} onChange={(e) => setColor(e.target.value.toUpperCase())} className="h-11 w-14 rounded-xl border border-navy-200 p-1" /><input value={color} onChange={(e) => setColor(e.target.value.toUpperCase())} className="planner-input font-mono uppercase" maxLength={7} /></div></div>

              <button type="button" disabled={status === 'generating'} onClick={() => void generate()} className="btn-primary w-full !py-4 text-base disabled:cursor-not-allowed disabled:opacity-60">{status === 'generating' ? <><Loader2 className="size-5 animate-spin" />Luodaan realistista kuvaa…</> : <><PaintRoller className="size-5" />Luo realistinen maalaustulos</>}</button>
              {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

              <button type="button" onClick={() => { setSourceFile(null); setSourceUrl(null); setResultUrl(null); setError(''); setStatus('idle'); }} className="btn-outline w-full"><RefreshCcw className="size-4" />Vaihda kuva</button>

              {resultUrl && (
                <form onSubmit={submitQuote} className="card p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-600">3. Lähetä lopputulos</p>
                  <h2 className="mt-2 font-display text-xl font-bold text-navy-950">Pyydä tarjous tämän kuvan kanssa</h2>
                  <div className="mt-4 space-y-3"><input required className="planner-input" placeholder="Nimi" value={quote.name} onChange={(e) => setQuote({ ...quote, name: e.target.value })} /><input required className="planner-input" placeholder="Puhelin" value={quote.phone} onChange={(e) => setQuote({ ...quote, phone: e.target.value })} /><input required className="planner-input" placeholder="Kaupunki" value={quote.city} onChange={(e) => setQuote({ ...quote, city: e.target.value })} /><textarea className="planner-input min-h-24" placeholder="Lisätiedot" value={quote.message} onChange={(e) => setQuote({ ...quote, message: e.target.value })} /></div>
                  <button disabled={quoteState === 'sending'} className="btn-primary mt-4 w-full"><Send className="size-4" />{quoteState === 'sending' ? 'Lähetetään…' : 'Lähetä kuva ja tarjouspyyntö'}</button>
                  {quoteState === 'sent' && <p className="mt-3 text-sm font-semibold text-green-700">Lopputulos ja tarjouspyyntö lähetettiin onnistuneesti.</p>}
                  {quoteState === 'error' && <p className="mt-3 text-sm font-semibold text-red-700">Lähetys epäonnistui. Yritä uudelleen.</p>}
                </form>
              )}
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
