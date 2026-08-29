import { useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowLeft, Camera, Check, Download, Eraser, Eye, EyeOff, ImagePlus, Layers3, Move, Paintbrush, PaintRoller, Redo2, RotateCcw, Save, SlidersHorizontal, Undo2, Upload, ZoomIn, ZoomOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '@/context/CustomerAuthContext';

const QUOTE_ENDPOINT = '/send-mail.php';

type Surface = 'walls' | 'ceiling' | 'doors' | 'trim';
type Tool = 'brush' | 'roller' | 'eraser' | 'pan';
type HistoryFrame = Record<Surface, string>;
type PanPoint = { x: number; y: number };

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

const STORAGE_KEY = 'mvv-varikamu-v20-saved';

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function rgbToHsl(r: number, g: number, b: number) {
  const rr = r / 255; const gg = g / 255; const bb = b / 255;
  const max = Math.max(rr, gg, bb); const min = Math.min(rr, gg, bb);
  let h = 0; let s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rr) h = (gg - bb) / d + (gg < bb ? 6 : 0);
    else if (max === gg) h = (bb - rr) / d + 2;
    else h = (rr - gg) / d + 4;
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function analytics(event: string, data: Record<string, unknown> = {}) {
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}

export function PaintStudioPage() {
  const { session } = useCustomerAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Partial<Record<Surface, HTMLCanvasElement>>>({});
  const drawingRef = useRef(false);
  const lastPointRef = useRef<PanPoint | null>(null);
  const panStartRef = useRef<PanPoint | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [advanced, setAdvanced] = useState(false);
  const [surface, setSurface] = useState<Surface>('walls');
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState('#D8C9B5');
  const [opacity, setOpacity] = useState(0.34);
  const [brushSize, setBrushSize] = useState(34);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<PanPoint>({ x: 0, y: 0 });
  const [layerVisible, setLayerVisible] = useState<Record<Surface, boolean>>({ walls: true, ceiling: true, doors: true, trim: true });
  const [history, setHistory] = useState<HistoryFrame[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [before, setBefore] = useState(false);
  const [compare, setCompare] = useState(false);
  const [compareAt, setCompareAt] = useState(50);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [exportType, setExportType] = useState<'png' | 'jpg'>('png');
  const [savedMessage, setSavedMessage] = useState('');
  const [quote, setQuote] = useState<QuoteForm>({ name: '', phone: '', city: '', message: '' });
  const [quoteState, setQuoteState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const rgb = useMemo(() => hexToRgb(color), [color]);
  const hsl = useMemo(() => rgbToHsl(rgb.r, rgb.g, rgb.b), [rgb]);

  useEffect(() => {
    analytics('paint_planner_open', { app: 'varikamu' });
    return () => { if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl); };
  }, [imageUrl]);

  const snapshotLayers = () => {
    const frame = {} as HistoryFrame;
    surfaces.forEach(({ id }) => { frame[id] = layerRefs.current[id]?.toDataURL('image/png') || ''; });
    return frame;
  };

  const pushHistory = () => {
    const next = history.slice(0, historyIndex + 1);
    next.push(snapshotLayers());
    const bounded = next.slice(-20);
    setHistory(bounded);
    setHistoryIndex(bounded.length - 1);
  };

  const restoreFrame = async (frame: HistoryFrame) => {
    await Promise.all(surfaces.map(({ id }) => new Promise<void>((resolve) => {
      const canvas = layerRefs.current[id];
      if (!canvas) return resolve();
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!frame[id]) return resolve();
      const img = new Image();
      img.onload = () => { ctx.drawImage(img, 0, 0); resolve(); };
      img.onerror = () => resolve();
      img.src = frame[id];
    })));
  };

  const undo = async () => {
    if (historyIndex <= 0) return;
    const nextIndex = historyIndex - 1;
    setHistoryIndex(nextIndex);
    await restoreFrame(history[nextIndex]);
    analytics('paint_undo');
  };

  const redo = async () => {
    if (historyIndex >= history.length - 1) return;
    const nextIndex = historyIndex + 1;
    setHistoryIndex(nextIndex);
    await restoreFrame(history[nextIndex]);
    analytics('paint_redo');
  };

  const initializeLayers = (width: number, height: number) => {
    surfaces.forEach(({ id }) => {
      const canvas = layerRefs.current[id];
      if (!canvas) return;
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')?.clearRect(0, 0, width, height);
    });
    window.requestAnimationFrame(() => {
      const frame = snapshotLayers();
      setHistory([frame]);
      setHistoryIndex(0);
    });
  };

  const loadFile = (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) return;
    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setHistory([]); setHistoryIndex(-1); setSnapshots([]); setZoom(1); setPan({ x: 0, y: 0 });
    analytics('paint_photo_uploaded', { type: file.type, size: file.size });
  };

  const onImageLoad = () => {
    const img = imageRef.current;
    if (!img) return;
    const maxWidth = 1800;
    const scale = Math.min(1, maxWidth / img.naturalWidth);
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));
    setImageSize({ width, height });
    window.requestAnimationFrame(() => initializeLayers(width, height));
  };

  const pointFromEvent = (event: ReactPointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage || !imageSize.width || !imageSize.height) return null;
    const rect = stage.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(imageSize.width, ((event.clientX - rect.left) / rect.width) * imageSize.width)),
      y: Math.max(0, Math.min(imageSize.height, ((event.clientY - rect.top) / rect.height) * imageSize.height)),
    };
  };

  const drawLine = (from: PanPoint, to: PanPoint) => {
    const canvas = layerRefs.current[surface];
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.globalAlpha = tool === 'eraser' ? 1 : opacity;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = tool === 'eraser' ? '#000000' : color;
    ctx.fillStyle = tool === 'eraser' ? '#000000' : color;
    ctx.lineCap = tool === 'roller' ? 'square' : 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = tool === 'roller' ? brushSize * 2.6 : brushSize;
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
    ctx.restore();
  };

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!imageUrl || before || compare) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    if (tool === 'pan') {
      panStartRef.current = { x: event.clientX - pan.x, y: event.clientY - pan.y };
      return;
    }
    const point = pointFromEvent(event);
    if (!point) return;
    drawingRef.current = true;
    lastPointRef.current = point;
    drawLine(point, point);
  };

  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (tool === 'pan' && panStartRef.current) {
      setPan({ x: event.clientX - panStartRef.current.x, y: event.clientY - panStartRef.current.y });
      return;
    }
    if (!drawingRef.current || !lastPointRef.current) return;
    const point = pointFromEvent(event);
    if (!point) return;
    drawLine(lastPointRef.current, point);
    lastPointRef.current = point;
  };

  const pointerUp = () => {
    if (drawingRef.current) {
      drawingRef.current = false;
      lastPointRef.current = null;
      pushHistory();
      analytics(tool === 'roller' ? 'paint_roller_used' : tool === 'eraser' ? 'paint_eraser_used' : 'paint_brush_used', { surface, color });
    }
    panStartRef.current = null;
  };

  const reset = () => {
    surfaces.forEach(({ id }) => {
      const canvas = layerRefs.current[id];
      canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    });
    setZoom(1); setPan({ x: 0, y: 0 });
    window.requestAnimationFrame(pushHistory);
    analytics('paint_reset');
  };

  const composite = async () => {
    if (!imageRef.current || !imageSize.width) return null;
    const out = document.createElement('canvas');
    out.width = imageSize.width; out.height = imageSize.height;
    const ctx = out.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(imageRef.current, 0, 0, imageSize.width, imageSize.height);
    surfaces.forEach(({ id }) => { const layer = layerRefs.current[id]; if (layer && layerVisible[id]) ctx.drawImage(layer, 0, 0); });
    return out;
  };

  const createSnapshot = async () => {
    const out = await composite(); if (!out) return;
    const url = out.toDataURL('image/jpeg', 0.78);
    setSnapshots((current) => [...current.slice(-3), url]);
    analytics('paint_design_saved', { kind: 'snapshot' });
  };

  const saveDesign = async () => {
    const out = await composite(); if (!out) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ image: out.toDataURL('image/jpeg', 0.7), surface, color, savedAt: Date.now() }));
      setSavedMessage('Suunnitelma tallennettu tähän selaimeen.');
      analytics('paint_design_saved', { kind: 'local' });
    } catch { setSavedMessage('Tallennus ei onnistunut selaimen tallennustilan vuoksi.'); }
  };

  const restoreDesign = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY); if (!raw) return setSavedMessage('Tallennettua suunnitelmaa ei löytynyt.');
      const saved = JSON.parse(raw) as { image?: string; color?: string };
      if (saved.image) { setImageUrl(saved.image); setColor(saved.color || color); setSavedMessage('Tallennettu suunnitelma palautettu litistettynä kuvana.'); }
    } catch { setSavedMessage('Tallennetun suunnitelman palautus epäonnistui.'); }
  };

  const exportDesign = async () => {
    const out = await composite(); if (!out) return;
    const link = document.createElement('a');
    link.download = `varikamu-${Date.now()}.${exportType === 'jpg' ? 'jpg' : 'png'}`;
    link.href = exportType === 'jpg' ? out.toDataURL('image/jpeg', 0.9) : out.toDataURL('image/png');
    link.click();
    analytics('paint_export', { type: exportType });
  };

  const submitQuote = async (event: FormEvent) => {
    event.preventDefault();
    if (!quote.name.trim() || !quote.phone.trim() || !quote.city.trim()) return;
    setQuoteState('sending');
    try {
      const response = await fetch(QUOTE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        name: quote.name.trim(), phone: quote.phone.trim(), email: session?.user.email || '', city: quote.city.trim(), address: '', propertyType: 'VäriKamu', service: 'sisamaalaus', surfaceArea: '', timeline: 'Joustava', budget: 'Arvio pyydetään',
        message: `VäriKamu-suunnitelma. Aktiivinen pinta: ${surfaces.find((item) => item.id === surface)?.label}. Sävy: ${color}. ${quote.message}`,
        website: '', formType: 'quote',
      }) });
      if (!response.ok) throw new Error('send failed');
      setQuoteState('sent'); analytics('painting_quote_submitted', { city: quote.city });
    } catch { setQuoteState('error'); }
  };

  return (
    <section className="min-h-[calc(100vh-64px)] bg-navy-50 px-3 py-4 sm:px-5 sm:py-6">
      <div className="container-base">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><Link to="/varikamu" className="flex size-10 items-center justify-center rounded-xl border border-navy-200 bg-white" aria-label="Takaisin VäriKamun esittelyyn"><ArrowLeft className="size-4" /></Link><div><p className="text-xs font-bold uppercase tracking-wider text-orange-600">VäriKamu</p><h1 className="font-display text-xl font-extrabold text-navy-950">Maalisuunnittelija</h1></div></div>
          <div className="flex items-center gap-2"><span className="text-xs font-semibold text-navy-500">{advanced ? 'Advanced Mode' : 'Simple Mode'}</span><button type="button" onClick={() => setAdvanced((value) => !value)} className="btn-outline !px-3 !py-2"><SlidersHorizontal className="size-4" />{advanced ? 'Yksinkertainen' : 'Lisätyökalut'}</button></div>
        </div>

        {!imageUrl ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <div className="rounded-3xl border-2 border-dashed border-navy-200 bg-white p-8 text-center sm:p-14">
              <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><ImagePlus className="size-8" /></span>
              <h2 className="mt-5 font-display text-3xl font-bold text-navy-950">Lataa kuva huoneestasi</h2>
              <p className="mx-auto mt-3 max-w-xl text-navy-600">Aloita omalla kuvalla. VäriKamu pienentää työkuvan selaimessa enintään noin 1800 pikselin leveyteen, jotta editori pysyy nopeana myös puhelimella.</p>
              <button type="button" onClick={() => fileRef.current?.click()} className="btn-primary mt-6"><Camera className="size-5" />Valitse tai ota kuva</button>
              <input ref={fileRef} type="file" className="hidden" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={(event) => loadFile(event.target.files?.[0])} />
              <p className="mt-3 text-xs text-navy-500">JPG, PNG tai WebP · enintään 10 Mt</p>
            </div>
            <div className="card p-6"><h2 className="font-display text-xl font-bold text-navy-950">Näin Simple Mode toimii</h2><div className="mt-5 space-y-4 text-sm text-navy-700">{['Valitse pinta: seinä, katto, ovi tai lista.', 'Valitse sävy paletista tai oma HEX-väri.', 'Maalaa kuvassa siveltimellä. Rulla ja pyyhekumi löytyvät Advanced Modesta.', 'Vertaa ennen/jälkeen ja pyydä tarjous.'].map((item, index) => <div key={item} className="flex gap-3"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700">{index + 1}</span><p>{item}</p></div>)}</div></div>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl bg-navy-950 p-2 sm:p-3">
                <div className="relative overflow-hidden rounded-2xl bg-black/20" style={{ minHeight: 240 }}>
                  <div className="flex items-center justify-center overflow-hidden p-2 sm:p-4" style={{ minHeight: 240 }}>
                    <div
                      ref={stageRef}
                      onPointerDown={pointerDown}
                      onPointerMove={pointerMove}
                      onPointerUp={pointerUp}
                      onPointerCancel={pointerUp}
                      className={`relative max-w-full touch-none select-none ${tool === 'pan' ? 'cursor-grab' : 'cursor-crosshair'}`}
                      style={{ width: imageSize.width ? `${imageSize.width}px` : undefined, maxWidth: '100%', transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}
                    >
                      <img ref={imageRef} src={imageUrl} onLoad={onImageLoad} alt="VäriKamu työkuva" className="block h-auto w-full select-none" draggable={false} />
                      {surfaces.map(({ id }) => <canvas key={id} ref={(node) => { if (node) layerRefs.current[id] = node; }} className={`pointer-events-none absolute inset-0 h-full w-full ${layerVisible[id] ? '' : 'hidden'}`} aria-hidden="true" />)}
                      {before && <img src={imageUrl} alt="Alkuperäinen kuva" className="pointer-events-none absolute inset-0 h-full w-full object-contain" draggable={false} />}
                      {compare && <div className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${compareAt}%` }}><img src={imageUrl} alt="Ennen vertailussa" className="h-full max-w-none object-contain" style={{ width: stageRef.current?.clientWidth || '100%' }} /></div>}
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-navy-950/80 px-3 py-1.5 text-xs font-bold text-white">{before ? 'Ennen' : compare ? 'Vertailu' : 'Suunnitelma'}</div>
                </div>
                {compare && <label className="mt-3 flex items-center gap-3 px-2 text-xs font-bold text-white"><span>Ennen</span><input className="w-full accent-orange-500" type="range" min="5" max="95" value={compareAt} onChange={(event) => setCompareAt(Number(event.target.value))} /><span>Jälkeen</span></label>}
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setBefore((value) => !value)} className="btn-outline !px-3 !py-2">{before ? <Eye className="size-4" /> : <EyeOff className="size-4" />}Ennen</button>
                <button type="button" onClick={() => { setCompare((value) => !value); setBefore(false); }} className="btn-outline !px-3 !py-2">Vertailuliukusäädin</button>
                <button type="button" onClick={() => void undo()} disabled={historyIndex <= 0} className="btn-outline !px-3 !py-2 disabled:opacity-40"><Undo2 className="size-4" />Kumoa</button>
                <button type="button" onClick={() => void redo()} disabled={historyIndex >= history.length - 1} className="btn-outline !px-3 !py-2 disabled:opacity-40"><Redo2 className="size-4" />Tee uudelleen</button>
                <button type="button" onClick={reset} className="btn-outline !px-3 !py-2"><RotateCcw className="size-4" />Nollaa</button>
                <button type="button" onClick={() => { if (imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl); setImageUrl(null); }} className="btn-outline !px-3 !py-2 sm:ml-auto"><Upload className="size-4" />Uusi kuva</button>
              </div>

              {snapshots.length > 0 && <div className="card p-4"><div className="flex items-center justify-between"><h2 className="font-bold text-navy-950">Snapshotit</h2><span className="text-xs text-navy-500">Viimeiset {snapshots.length}</span></div><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">{snapshots.map((url, index) => <img key={`${url.slice(-20)}-${index}`} src={url} alt={`Snapshot ${index + 1}`} className="aspect-[4/3] w-full rounded-xl object-cover" />)}</div></div>}
            </div>

            <aside className="space-y-4">
              <div className="card p-5"><p className="text-xs font-bold uppercase tracking-wider text-navy-500">1. Valitse pinta</p><div className="mt-3 grid grid-cols-2 gap-2">{surfaces.map((item) => <button key={item.id} type="button" onClick={() => { setSurface(item.id); analytics('paint_surface_selected', { surface: item.id }); }} className={`rounded-xl border px-3 py-3 text-sm font-bold ${surface === item.id ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-700'}`}>{item.label}</button>)}</div></div>

              <div className="card p-5"><p className="text-xs font-bold uppercase tracking-wider text-navy-500">2. Valitse väri</p><div className="mt-3 grid grid-cols-5 gap-2">{palette.map(([name, hex]) => <button key={hex} type="button" title={name} aria-label={name} onClick={() => { setColor(hex); analytics('paint_color_selected', { color: hex, surface }); }} className={`relative aspect-square rounded-full border-2 ${color === hex ? 'border-orange-500 ring-2 ring-orange-200' : 'border-white ring-1 ring-navy-200'}`} style={{ backgroundColor: hex }}>{color === hex && <Check className="absolute inset-0 m-auto size-4 text-navy-950" />}</button>)}</div><div className="mt-4 grid grid-cols-[52px_1fr] gap-2"><input type="color" value={color} onChange={(event) => setColor(event.target.value.toUpperCase())} className="h-11 w-full rounded-xl border border-navy-200 p-1" aria-label="Värivalitsin" /><input value={color} onChange={(event) => /^#[0-9A-Fa-f]{6}$/.test(event.target.value) && setColor(event.target.value.toUpperCase())} className="rounded-xl border border-navy-200 px-3 text-sm font-semibold uppercase" aria-label="HEX-väri" /></div><div className="mt-3 rounded-xl bg-navy-50 p-3 text-xs text-navy-600"><p><strong>RGB:</strong> {rgb.r}, {rgb.g}, {rgb.b}</p><p className="mt-1"><strong>HSL:</strong> {hsl.h}°, {hsl.s}%, {hsl.l}%</p></div></div>

              <div className="card p-5"><p className="text-xs font-bold uppercase tracking-wider text-navy-500">3. Maalaa</p><div className="mt-3 grid grid-cols-3 gap-2">{([{ id: 'brush', label: 'Sivellin', icon: Paintbrush }, { id: 'roller', label: 'Rulla', icon: PaintRoller }, { id: 'eraser', label: 'Pyyhe', icon: Eraser }] as const).map((item) => <button key={item.id} type="button" onClick={() => setTool(item.id)} className={`rounded-xl border p-3 text-xs font-bold ${tool === item.id ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-700'} ${!advanced && item.id !== 'brush' ? 'hidden' : ''}`}><item.icon className="mx-auto mb-1 size-5" />{item.label}</button>)}</div></div>

              {advanced && <div className="card space-y-4 p-5"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-navy-500">Advanced Mode</p><Layers3 className="size-4 text-navy-500" /></div><label className="block text-xs font-bold text-navy-700">Siveltimen koko: {brushSize}px<input className="mt-2 w-full accent-orange-500" type="range" min="6" max="120" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} /></label><label className="block text-xs font-bold text-navy-700">Peittävyys: {Math.round(opacity * 100)}%<input className="mt-2 w-full accent-orange-500" type="range" min="0.08" max="0.9" step="0.02" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /></label><div><p className="text-xs font-bold text-navy-700">Kerrokset / maskit</p><div className="mt-2 grid grid-cols-2 gap-2">{surfaces.map((item) => <label key={item.id} className="flex items-center gap-2 rounded-xl bg-navy-50 px-3 py-2 text-xs font-semibold text-navy-700"><input type="checkbox" checked={layerVisible[item.id]} onChange={() => setLayerVisible((current) => ({ ...current, [item.id]: !current[item.id] }))} />{item.label}</label>)}</div></div><div className="grid grid-cols-3 gap-2"><button type="button" onClick={() => setZoom((value) => Math.min(2.5, value + 0.15))} className="btn-outline !px-2 !py-2"><ZoomIn className="size-4" /></button><button type="button" onClick={() => setZoom((value) => Math.max(0.6, value - 0.15))} className="btn-outline !px-2 !py-2"><ZoomOut className="size-4" /></button><button type="button" onClick={() => setTool(tool === 'pan' ? 'brush' : 'pan')} className={`btn-outline !px-2 !py-2 ${tool === 'pan' ? '!border-orange-500 !text-orange-700' : ''}`}><Move className="size-4" /></button></div></div>}

              <div className="card space-y-3 p-5"><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => void createSnapshot()} className="btn-outline !px-3 !py-2"><Camera className="size-4" />Snapshot</button><button type="button" onClick={() => void saveDesign()} className="btn-outline !px-3 !py-2"><Save className="size-4" />Tallenna</button></div><button type="button" onClick={restoreDesign} className="w-full text-xs font-bold text-navy-600 hover:text-orange-600">Palauta selaimeen tallennettu suunnitelma</button>{savedMessage && <p className="text-xs leading-5 text-navy-500">{savedMessage}</p>}<div className="flex gap-2"><select value={exportType} onChange={(event) => setExportType(event.target.value as 'png' | 'jpg')} className="rounded-xl border border-navy-200 px-3 text-sm"><option value="png">PNG</option><option value="jpg">JPG</option></select><button type="button" onClick={() => void exportDesign()} className="btn-primary flex-1"><Download className="size-4" />Vie kuva</button></div></div>

              <form onSubmit={submitQuote} className="card p-5"><p className="text-xs font-bold uppercase tracking-wider text-orange-600">Pyydä maalaustarjous</p><h2 className="mt-2 font-display text-xl font-bold text-navy-950">Valmis suunnitelma? Ota maalari mukaan.</h2><div className="mt-4 grid gap-3"><input required placeholder="Nimi" value={quote.name} onChange={(event) => setQuote({ ...quote, name: event.target.value })} className="rounded-xl border border-navy-200 px-3 py-3 text-sm" /><input required placeholder="Puhelin" type="tel" value={quote.phone} onChange={(event) => setQuote({ ...quote, phone: event.target.value })} className="rounded-xl border border-navy-200 px-3 py-3 text-sm" /><input required placeholder="Kaupunki" value={quote.city} onChange={(event) => setQuote({ ...quote, city: event.target.value })} className="rounded-xl border border-navy-200 px-3 py-3 text-sm" /><textarea placeholder="Lisätiedot" rows={2} value={quote.message} onChange={(event) => setQuote({ ...quote, message: event.target.value })} className="rounded-xl border border-navy-200 px-3 py-3 text-sm" /></div><button disabled={quoteState === 'sending' || quoteState === 'sent'} className="btn-primary mt-3 w-full disabled:opacity-60">{quoteState === 'sending' ? 'Lähetetään…' : quoteState === 'sent' ? 'Tarjouspyyntö lähetetty' : 'Pyydä maalaustarjous'}</button>{quoteState === 'error' && <p className="mt-2 text-xs text-red-600">Lähetys epäonnistui. Voit myös käyttää yhteydenottosivua.</p>}</form>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
