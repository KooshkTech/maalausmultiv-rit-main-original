import { useMemo, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowLeft, Camera, Download, Eraser, Eye, ImagePlus, Layers3, MapPin, Paintbrush, Redo2, RotateCcw, Save, SlidersHorizontal, Sparkles, Undo2, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

const QUOTE_ENDPOINT = '/send-mail.php';
const STORAGE_KEY = 'mvv-siivouskamu-v20-saved';

type CleaningIntensity = 'light' | 'standard' | 'deep';
type Frequency = 'once' | 'weekly' | 'biweekly' | 'monthly';
type Tool = 'marker' | 'brush' | 'eraser';
type QuoteForm = { name: string; phone: string; city: string; message: string };
type HistoryFrame = string;

const roomTypes = ['WC', 'Kylpyhuone', 'Keittiö', 'Olohuone', 'Makuuhuone', 'Koti', 'Toimisto', 'Yritystila'];
const cleaningTasks = ['Pintojen pyyhintä', 'Lattiat', 'WC ja saniteettitilat', 'Keittiö', 'Rasva ja pinttynyt lika', 'Kalkkijäämät', 'Ikkunat', 'Roskat', 'Muuttosiivous', 'Ylläpitosiivous'];
const intensityLabels: Record<CleaningIntensity, string> = { light: 'Kevyt ylläpitosiivous', standard: 'Perussiivous', deep: 'Perusteellinen siivous' };
const frequencyLabels: Record<Frequency, string> = { once: 'Kertaluonteinen', weekly: 'Viikoittain', biweekly: 'Joka toinen viikko', monthly: 'Kuukausittain' };

function analytics(event: string, data: Record<string, unknown> = {}) {
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}

export function CleaningStudioPage() {
  const { session } = useCustomerAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const [advanced, setAdvanced] = useState(false);
  const [room, setRoom] = useState('Kylpyhuone');
  const [area, setArea] = useState(15);
  const [frequency, setFrequency] = useState<Frequency>('once');
  const [intensity, setIntensity] = useState<CleaningIntensity>('standard');
  const [tasks, setTasks] = useState<string[]>(['Pintojen pyyhintä', 'Lattiat', 'WC ja saniteettitilat']);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [tool, setTool] = useState<Tool>('marker');
  const [brushSize, setBrushSize] = useState(28);
  const [zoom, setZoom] = useState(1);
  const [before, setBefore] = useState(false);
  const [preview, setPreview] = useState(false);
  const [history, setHistory] = useState<HistoryFrame[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [savedMessage, setSavedMessage] = useState('');
  const [quote, setQuote] = useState<QuoteForm>({ name: '', phone: '', city: '', message: '' });
  const [quoteState, setQuoteState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const scope = useMemo(() => {
    let score = Math.min(5, Math.max(1, Math.ceil(area / 25)));
    score += intensity === 'deep' ? 2 : intensity === 'standard' ? 1 : 0;
    score += Math.min(2, Math.floor(tasks.length / 4));
    return { score, level: score <= 3 ? 'Kevyt' : score <= 6 ? 'Keskitasoinen' : 'Laaja' };
  }, [area, intensity, tasks.length]);

  const toggleTask = (task: string) => setTasks((current) => current.includes(task) ? current.filter((item) => item !== task) : [...current, task]);

  const loadFile = (file?: File) => {
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) return;
    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setPreview(false); setBefore(false); setSnapshots([]); setHistory([]); setHistoryIndex(-1);
    analytics('cleaning_photo_uploaded', { type: file.type, size: file.size });
  };

  const onImageLoad = () => {
    const img = imageRef.current; const canvas = canvasRef.current;
    if (!img || !canvas) return;
    const scale = Math.min(1, 1600 / img.naturalWidth);
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    setImageSize({ width, height });
    canvas.width = width; canvas.height = height;
    canvas.getContext('2d')?.clearRect(0, 0, width, height);
    window.requestAnimationFrame(() => {
      const frame = canvas.toDataURL('image/png');
      setHistory([frame]); setHistoryIndex(0);
    });
  };

  const pointFromEvent = (event: ReactPointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage || !imageSize.width) return null;
    const rect = stage.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * imageSize.width, y: ((event.clientY - rect.top) / rect.height) * imageSize.height };
  };

  const draw = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = tool === 'marker' ? Math.max(18, brushSize * 1.5) : brushSize;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = tool === 'marker' ? 'rgba(245,158,11,.72)' : tool === 'eraser' ? '#000' : 'rgba(14,116,144,.72)';
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke(); ctx.restore();
  };

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!imageUrl || before) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFromEvent(event); if (!point) return;
    drawingRef.current = true; lastPointRef.current = point; draw(point, point);
  };

  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current || !lastPointRef.current) return;
    const point = pointFromEvent(event); if (!point) return;
    draw(lastPointRef.current, point); lastPointRef.current = point;
  };

  const pushHistory = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const next = [...history.slice(0, historyIndex + 1), canvas.toDataURL('image/png')].slice(-20);
    setHistory(next); setHistoryIndex(next.length - 1);
  };

  const pointerUp = () => {
    if (drawingRef.current) { drawingRef.current = false; lastPointRef.current = null; pushHistory(); analytics('cleaning_annotation_used', { tool }); }
  };

  const restore = (index: number) => {
    const canvas = canvasRef.current; const frame = history[index]; if (!canvas || !frame || index < 0 || index >= history.length) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const img = new Image();
    img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0); setHistoryIndex(index); };
    img.src = frame;
  };

  const resetAnnotations = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height); pushHistory();
  };

  const composite = () => {
    if (!imageRef.current || !imageSize.width) return null;
    const out = document.createElement('canvas'); out.width = imageSize.width; out.height = imageSize.height;
    const ctx = out.getContext('2d'); if (!ctx) return null;
    ctx.filter = preview ? 'brightness(1.08) contrast(1.04) saturate(.92)' : 'none';
    ctx.drawImage(imageRef.current, 0, 0, imageSize.width, imageSize.height); ctx.filter = 'none';
    if (!before && canvasRef.current) ctx.drawImage(canvasRef.current, 0, 0);
    return out;
  };

  const createSnapshot = () => {
    const out = composite(); if (!out) return;
    const url = out.toDataURL('image/jpeg', 0.8); setSnapshots((current) => [...current.slice(-3), url]);
    analytics('cleaning_snapshot_saved');
  };

  const exportImage = () => {
    const out = composite(); if (!out) return;
    const link = document.createElement('a'); link.download = `siivouskamu-${Date.now()}.jpg`; link.href = out.toDataURL('image/jpeg', 0.9); link.click(); analytics('cleaning_export');
  };

  const savePlan = () => {
    try {
      const payload = { room, area, frequency, intensity, tasks, image: composite()?.toDataURL('image/jpeg', 0.65) || null, savedAt: Date.now() };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); setSavedMessage('Siivoussuunnitelma tallennettu tähän selaimeen.');
    } catch { setSavedMessage('Tallennus ei onnistunut selaimen tallennustilan vuoksi.'); }
  };

  const restorePlan = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY); if (!raw) return setSavedMessage('Tallennettua suunnitelmaa ei löytynyt.');
      const saved = JSON.parse(raw) as { room?: string; area?: number; frequency?: Frequency; intensity?: CleaningIntensity; tasks?: string[]; image?: string | null };
      setRoom(saved.room || room); setArea(saved.area || area); setFrequency(saved.frequency || frequency); setIntensity(saved.intensity || intensity); setTasks(saved.tasks || tasks); if (saved.image) setImageUrl(saved.image); setSavedMessage('Tallennettu suunnitelma palautettu.');
    } catch { setSavedMessage('Tallennetun suunnitelman palautus epäonnistui.'); }
  };

  const submitQuote = async (event: FormEvent) => {
    event.preventDefault();
    if (!quote.name.trim() || !quote.phone.trim() || !quote.city.trim()) return;
    setQuoteState('sending');
    try {
      const summary = `SiivousKamu-suunnitelma\nTila: ${room}\nPinta-ala: noin ${area} m²\nTiheys: ${frequencyLabels[frequency]}\nTaso: ${intensityLabels[intensity]}\nLaajuusluokka: ${scope.level}\nTehtävät: ${tasks.join(', ')}\n${quote.message}`;
      const response = await fetch(QUOTE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        name: quote.name.trim(), phone: quote.phone.trim(), email: session?.user.email || '', city: quote.city.trim(), address: '', propertyType: room, service: 'siivous', surfaceArea: `${area} m²`, timeline: frequencyLabels[frequency], budget: 'Hinta vahvistetaan tarjouksessa', message: summary, website: '', formType: 'quote',
      }) });
      if (!response.ok) throw new Error('send failed');
      setQuoteState('sent'); analytics('cleaning_quote_submitted', { city: quote.city, room });
    } catch { setQuoteState('error'); }
  };

  return (
    <section className="min-h-[calc(100vh-64px)] bg-navy-50 px-3 py-4 sm:px-5 sm:py-6">
      <div className="container-base">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><Link to="/palvelut/siivous" className="flex size-10 items-center justify-center rounded-xl border border-navy-200 bg-white" aria-label="Takaisin siivouspalveluihin"><ArrowLeft className="size-4" /></Link><div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">SiivousKamu</p><h1 className="font-display text-xl font-extrabold text-navy-950">Siivoussuunnittelija</h1></div></div>
          <button type="button" onClick={() => setAdvanced((value) => !value)} className="btn-outline !px-3 !py-2"><SlidersHorizontal className="size-4" />{advanced ? 'Simple Mode' : 'Advanced Mode'}</button>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_350px]">
          <div className="space-y-4">
            <div className="card p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">1. Tila ja tarve</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-navy-950">Mitä haluat siivota?</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{roomTypes.map((item) => <button key={item} type="button" onClick={() => { setRoom(item); analytics('cleaning_room_selected', { room: item }); }} className={`rounded-xl border px-3 py-3 text-sm font-bold ${room === item ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-700'}`}>{item}</button>)}</div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3"><label className="text-sm font-bold text-navy-700">Pinta-ala noin <strong>{area} m²</strong><input className="mt-2 w-full accent-orange-500" type="range" min="5" max="500" step="5" value={area} onChange={(event) => setArea(Number(event.target.value))} /></label><label className="text-sm font-bold text-navy-700">Toistuvuus<select value={frequency} onChange={(event) => setFrequency(event.target.value as Frequency)} className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-3 py-3 font-normal"><option value="once">Kertaluonteinen</option><option value="weekly">Viikoittain</option><option value="biweekly">Joka toinen viikko</option><option value="monthly">Kuukausittain</option></select></label><label className="text-sm font-bold text-navy-700">Siivouksen taso<select value={intensity} onChange={(event) => setIntensity(event.target.value as CleaningIntensity)} className="mt-2 w-full rounded-xl border border-navy-200 bg-white px-3 py-3 font-normal"><option value="light">Kevyt ylläpito</option><option value="standard">Perussiivous</option><option value="deep">Perusteellinen</option></select></label></div>
            </div>

            <div className="card p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-wider text-orange-600">2. Tehtävät</p><h2 className="mt-2 font-display text-2xl font-bold text-navy-950">Valitse tarvittavat työt</h2><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{cleaningTasks.map((task) => <label key={task} className={`flex min-h-12 items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold ${tasks.includes(task) ? 'border-orange-300 bg-orange-50 text-navy-900' : 'border-navy-200 text-navy-700'}`}><input type="checkbox" checked={tasks.includes(task)} onChange={() => toggleTask(task)} className="size-4 accent-orange-500" />{task}</label>)}</div></div>

            <div className="card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">3. Kuva ja merkinnät</p><h2 className="mt-2 font-display text-2xl font-bold text-navy-950">Lisää kuva halutessasi</h2></div><button type="button" onClick={() => fileRef.current?.click()} className="btn-outline"><ImagePlus className="size-4" />{imageUrl ? 'Vaihda kuva' : 'Lataa kuva'}</button><input ref={fileRef} type="file" className="hidden" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(event) => loadFile(event.target.files?.[0])} /></div>
              {!imageUrl ? <div className="mt-5 rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50 p-8 text-center"><Camera className="mx-auto size-9 text-navy-300" /><p className="mt-3 text-sm font-semibold text-navy-700">Kuva on valinnainen. Voit tehdä koko suunnitelman myös ilman kuvaa.</p></div> : <div className="mt-5 space-y-3"><div className="overflow-hidden rounded-2xl bg-navy-950 p-2"><div className="flex min-h-60 items-center justify-center overflow-hidden"><div ref={stageRef} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} className="relative max-w-full touch-none select-none" style={{ width: imageSize.width ? `${imageSize.width}px` : undefined, maxWidth: '100%', transform: `scale(${zoom})`, transformOrigin: 'center' }}><img ref={imageRef} src={imageUrl} onLoad={onImageLoad} alt="SiivousKamu työkuva" className={`block h-auto w-full ${preview && !before ? 'brightness-110 contrast-105 saturate-90' : ''}`} draggable={false} /><canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${before ? 'hidden' : ''}`} aria-hidden="true" /></div></div></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setBefore((value) => !value)} className="btn-outline !px-3 !py-2"><Eye className="size-4" />{before ? 'Näytä suunnitelma' : 'Ennen'}</button><button type="button" onClick={() => { setPreview((value) => !value); analytics('cleaning_visualization_started'); }} className={`btn-outline !px-3 !py-2 ${preview ? '!border-orange-500 !text-orange-700' : ''}`}><Sparkles className="size-4" />Puhdas esikatselu</button><button type="button" onClick={() => restore(historyIndex - 1)} disabled={historyIndex <= 0} className="btn-outline !px-3 !py-2 disabled:opacity-40"><Undo2 className="size-4" /></button><button type="button" onClick={() => restore(historyIndex + 1)} disabled={historyIndex >= history.length - 1} className="btn-outline !px-3 !py-2 disabled:opacity-40"><Redo2 className="size-4" /></button><button type="button" onClick={resetAnnotations} className="btn-outline !px-3 !py-2"><RotateCcw className="size-4" /></button></div><p className="text-xs leading-5 text-navy-500">“Puhdas esikatselu” on vain visuaalinen havainnollistus. Se ei ole AI:n takaama eikä luvattu todellinen lopputulos.</p></div>}
            </div>

            {advanced && imageUrl && <div className="card p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">Advanced Mode</p><h2 className="mt-2 font-display text-xl font-bold text-navy-950">Annotointi ja työkalut</h2></div><Layers3 className="size-5 text-navy-400" /></div><div className="mt-4 grid grid-cols-3 gap-2">{([{ id: 'marker', label: 'Merkki', icon: MapPin }, { id: 'brush', label: 'Sivellin', icon: Paintbrush }, { id: 'eraser', label: 'Pyyhekumi', icon: Eraser }] as const).map((item) => <button key={item.id} type="button" onClick={() => setTool(item.id)} className={`rounded-xl border p-3 text-xs font-bold ${tool === item.id ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-700'}`}><item.icon className="mx-auto mb-1 size-5" />{item.label}</button>)}</div><label className="mt-4 block text-xs font-bold text-navy-700">Työkalun koko: {brushSize}px<input type="range" min="8" max="100" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} className="mt-2 w-full accent-orange-500" /></label><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => setZoom((value) => Math.min(2.2, value + 0.15))} className="btn-outline"><ZoomIn className="size-4" />Zoom +</button><button type="button" onClick={() => setZoom((value) => Math.max(0.7, value - 0.15))} className="btn-outline"><ZoomOut className="size-4" />Zoom −</button></div></div>}

            {snapshots.length > 0 && <div className="card p-5"><h2 className="font-display text-xl font-bold text-navy-950">Snapshotit</h2><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{snapshots.map((url, index) => <img key={`${url.slice(-20)}-${index}`} src={url} alt={`SiivousKamu snapshot ${index + 1}`} className="aspect-[4/3] w-full rounded-xl object-cover" />)}</div></div>}
          </div>

          <aside className="space-y-4">
            <div className="card p-5"><p className="text-xs font-bold uppercase tracking-wider text-orange-600">Alustava arvio</p><h2 className="mt-2 font-display text-2xl font-bold text-navy-950">{scope.level} kokonaisuus</h2><div className="mt-4 space-y-2 text-sm text-navy-700"><p><strong>Tila:</strong> {room}</p><p><strong>Pinta-ala:</strong> noin {area} m²</p><p><strong>Taso:</strong> {intensityLabels[intensity]}</p><p><strong>Tiheys:</strong> {frequencyLabels[frequency]}</p><p><strong>Valittuja tehtäviä:</strong> {tasks.length}</p></div><div className="mt-4 rounded-xl bg-orange-50 p-4 text-sm leading-6 text-navy-700"><strong>Hinta:</strong> Hinta vahvistetaan tarjouksessa. Emme näytä keksittyä euromäärää ilman hyväksyttyä liiketoiminnan hinnastoa ja riittäviä kohdetietoja.</div></div>

            <div className="card space-y-3 p-5"><div className="grid grid-cols-2 gap-2"><button type="button" onClick={createSnapshot} disabled={!imageUrl} className="btn-outline !px-3 !py-2 disabled:opacity-40"><Camera className="size-4" />Snapshot</button><button type="button" onClick={savePlan} className="btn-outline !px-3 !py-2"><Save className="size-4" />Tallenna</button></div><button type="button" onClick={restorePlan} className="w-full text-xs font-bold text-navy-600 hover:text-orange-600">Palauta tallennettu suunnitelma</button>{savedMessage && <p className="text-xs leading-5 text-navy-500">{savedMessage}</p>}<button type="button" onClick={exportImage} disabled={!imageUrl} className="btn-outline w-full disabled:opacity-40"><Download className="size-4" />Vie JPG</button>{imageUrl && <button type="button" onClick={() => { if (imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl); setImageUrl(null); }} className="w-full text-xs font-bold text-navy-500 hover:text-orange-600"><Upload className="mr-1 inline size-3" />Poista kuva</button>}</div>

            <form onSubmit={submitQuote} className="card p-5"><p className="text-xs font-bold uppercase tracking-wider text-orange-600">Pyydä siivoustarjous</p><h2 className="mt-2 font-display text-xl font-bold text-navy-950">Lähetä valmis suunnitelma</h2><div className="mt-4 grid gap-3"><input required placeholder="Nimi" value={quote.name} onChange={(event) => setQuote({ ...quote, name: event.target.value })} className="rounded-xl border border-navy-200 px-3 py-3 text-sm" /><input required placeholder="Puhelin" type="tel" value={quote.phone} onChange={(event) => setQuote({ ...quote, phone: event.target.value })} className="rounded-xl border border-navy-200 px-3 py-3 text-sm" /><input required placeholder="Kaupunki" value={quote.city} onChange={(event) => setQuote({ ...quote, city: event.target.value })} className="rounded-xl border border-navy-200 px-3 py-3 text-sm" /><textarea placeholder="Lisätiedot" rows={2} value={quote.message} onChange={(event) => setQuote({ ...quote, message: event.target.value })} className="rounded-xl border border-navy-200 px-3 py-3 text-sm" /></div><button disabled={quoteState === 'sending' || quoteState === 'sent'} className="btn-primary mt-3 w-full disabled:opacity-60">{quoteState === 'sending' ? 'Lähetetään…' : quoteState === 'sent' ? 'Tarjouspyyntö lähetetty' : 'Pyydä siivoustarjous'}</button>{quoteState === 'error' && <p className="mt-2 text-xs text-red-600">Lähetys epäonnistui. Voit myös käyttää yhteydenottosivua.</p>}</form>
          </aside>
        </div>
      </div>
    </section>
  );
}
