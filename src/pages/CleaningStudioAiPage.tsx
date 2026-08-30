import { useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Camera, Download, ImagePlus, Loader2, RefreshCcw, Send, Sparkles, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

const AI_ENDPOINT = '/ai-image-transform.php';
const QUOTE_ENDPOINT = '/send-mail.php';

type CleaningIntensity = 'light' | 'standard' | 'deep';
type QuoteForm = { name: string; phone: string; city: string; message: string };

const roomTypes = ['Kylpyhuone', 'Keittiö', 'Olohuone', 'Makuuhuone', 'Koti', 'Toimisto', 'Yritystila'];
const taskOptions = ['Pinnat', 'Lattiat', 'WC ja saniteettitilat', 'Keittiö', 'Rasva', 'Kalkkijäämät', 'Ikkunat', 'Muuttosiivous'];
const intensityLabels: Record<CleaningIntensity, string> = { light: 'Kevyt', standard: 'Perusteellinen', deep: 'Syväpuhdistus' };

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
    return new File([blob], 'siivouskamu-input.jpg', { type: 'image/jpeg' });
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

export function CleaningStudioAiPage() {
  const { session } = useCustomerAuth();
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [room, setRoom] = useState('Kylpyhuone');
  const [intensity, setIntensity] = useState<CleaningIntensity>('standard');
  const [tasks, setTasks] = useState<string[]>(['Pinnat', 'Lattiat']);
  const [compareAt, setCompareAt] = useState(50);
  const [status, setStatus] = useState<'idle' | 'preparing' | 'generating' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [quote, setQuote] = useState<QuoteForm>({ name: '', phone: '', city: '', message: '' });
  const [quoteState, setQuoteState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const taskSummary = useMemo(() => tasks.join(', ') || 'Yleissiivous', [tasks]);

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

  const toggleTask = (task: string) => setTasks((current) => current.includes(task) ? current.filter((item) => item !== task) : [...current, task]);

  const generate = async () => {
    if (!sourceFile) return;
    setStatus('generating');
    setError('');
    setResultUrl(null);
    try {
      const form = new FormData();
      form.append('mode', 'clean');
      form.append('image', sourceFile);
      form.append('room', room);
      form.append('intensity', intensityLabels[intensity]);
      form.append('tasks', taskSummary);
      const response = await fetch(AI_ENDPOINT, { method: 'POST', body: form });
      const payload = await response.json().catch(() => ({})) as { image?: string; imageUrl?: string; error?: string; code?: string };
      if (!response.ok) {
        if (payload.code === 'AI_NOT_CONFIGURED') throw new Error('AI-kuvapalvelun API-avain puuttuu palvelimelta.');
        throw new Error(payload.error || 'Realistisen siivouskuvan luonti epäonnistui.');
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
    link.download = `siivouskamu-${Date.now()}.jpg`;
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
      form.append('propertyType', room);
      form.append('service', 'siivous');
      form.append('surfaceArea', '');
      form.append('timeline', 'Joustava');
      form.append('budget', 'Arvio pyydetään');
      form.append('website', '');
      form.append('message', `SiivousKamu AI-suunnitelma. Tila: ${room}. Taso: ${intensityLabels[intensity]}. Kohteet: ${taskSummary}. ${quote.message}`.trim());
      form.append('files[]', resultBlob, 'siivouskamu-ai-lopputulos.jpg');
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
          <Link to="/siivouskamu" className="flex size-10 items-center justify-center rounded-xl border border-navy-200 bg-white" aria-label="Takaisin"><ArrowLeft className="size-4" /></Link>
          <div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">SiivousKamu AI</p><h1 className="font-display text-xl font-extrabold text-navy-950 sm:text-2xl">Näe realistinen siivouksen jälkeinen tila</h1></div>
        </div>

        {!sourceUrl ? (
          <div className="mx-auto max-w-3xl rounded-3xl border-2 border-dashed border-navy-200 bg-white p-6 text-center sm:p-12">
            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><ImagePlus className="size-8" /></span>
            <h2 className="mt-5 font-display text-3xl font-bold text-navy-950">Lisää kuva siivottavasta tilasta</h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-navy-600">Ota kuva kameralla tai lataa olemassa oleva kuva. SiivousKamu tekee AI-muokkauksen, joka pyrkii näyttämään saman tilan oikeasti siivottuna — ei vain vaalennettuna.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => cameraRef.current?.click()} className="btn-primary w-full"><Camera className="size-5" />Ota kuva</button>
              <button type="button" onClick={() => uploadRef.current?.click()} className="btn-outline w-full"><Upload className="size-5" />Lataa kuva</button>
            </div>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => void chooseFile(e.target.files?.[0])} />
            <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={(e) => void chooseFile(e.target.files?.[0])} />
            <p className="mt-4 text-xs text-navy-500">AI-esikatselu on havainnollistava arvio. Se ei lupaa, että jokainen pysyvä vaurio tai tahra voidaan poistaa todellisessa työssä.</p>
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
                    <img src={resultUrl} alt="AI-siivoustulos" className="absolute inset-0 h-full w-full object-contain" />
                    <div className="absolute inset-y-0 left-0 overflow-hidden bg-navy-950" style={{ width: `${compareAt}%` }}>
                      <img src={sourceUrl} alt="Ennen siivousta" className="h-full max-w-none object-contain" style={{ width: '100vw', maxWidth: 'none' }} />
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white shadow" style={{ left: `${compareAt}%` }} />
                    <span className="absolute left-3 top-3 rounded-full bg-navy-950/80 px-3 py-1 text-xs font-bold text-white">Ennen</span>
                    <span className="absolute right-3 top-3 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">AI-jälkeen</span>
                    <input aria-label="Ennen ja jälkeen" type="range" min="5" max="95" value={compareAt} onChange={(e) => setCompareAt(Number(e.target.value))} className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0" />
                  </div>
                )}
              </div>

              {resultUrl && (
                <div className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-green-700">Valmis lopputulos</p><h2 className="font-display text-2xl font-bold text-navy-950">Realistinen siivousesikatselu</h2></div><button type="button" onClick={download} className="btn-primary"><Download className="size-4" />Lataa JPG</button></div>
                  <p className="mt-3 text-sm leading-6 text-navy-600">Esikatselu näyttää tavoitetason. Todellinen lopputulos riippuu pintamateriaaleista, kulumisesta ja siitä, ovatko jäljet puhdistettavissa vai pysyviä.</p>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="card p-5"><p className="text-xs font-bold uppercase tracking-wider text-navy-500">1. Tila</p><div className="mt-3 grid grid-cols-2 gap-2">{roomTypes.map((item) => <button key={item} type="button" onClick={() => setRoom(item)} className={`rounded-xl border px-3 py-3 text-sm font-bold ${room === item ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-700'}`}>{item}</button>)}</div></div>

              <div className="card p-5"><p className="text-xs font-bold uppercase tracking-wider text-navy-500">2. Siivouksen taso</p><div className="mt-3 grid grid-cols-3 gap-2">{(['light', 'standard', 'deep'] as CleaningIntensity[]).map((value) => <button key={value} type="button" onClick={() => setIntensity(value)} className={`rounded-xl border px-2 py-3 text-xs font-bold ${intensity === value ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-700'}`}>{intensityLabels[value]}</button>)}</div></div>

              <div className="card p-5"><p className="text-xs font-bold uppercase tracking-wider text-navy-500">3. Mitä puhdistetaan?</p><div className="mt-3 flex flex-wrap gap-2">{taskOptions.map((task) => <button key={task} type="button" onClick={() => toggleTask(task)} className={`rounded-full border px-3 py-2 text-xs font-bold ${tasks.includes(task) ? 'border-green-600 bg-green-50 text-green-800' : 'border-navy-200 text-navy-700'}`}>{task}</button>)}</div></div>

              <button type="button" disabled={status === 'generating'} onClick={() => void generate()} className="btn-primary w-full !py-4 text-base disabled:cursor-not-allowed disabled:opacity-60">{status === 'generating' ? <><Loader2 className="size-5 animate-spin" />Luodaan siivoustulosta…</> : <><Sparkles className="size-5" />Luo realistinen siivoustulos</>}</button>
              {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}

              <button type="button" onClick={() => { setSourceFile(null); setSourceUrl(null); setResultUrl(null); setError(''); setStatus('idle'); }} className="btn-outline w-full"><RefreshCcw className="size-4" />Vaihda kuva</button>

              {resultUrl && (
                <form onSubmit={submitQuote} className="card p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-600">4. Lähetä lopputulos</p>
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
