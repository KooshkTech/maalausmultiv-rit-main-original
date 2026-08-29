import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Download, Eraser, ImagePlus, Sparkles, Undo2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { images } from '@/config/images';

type CleaningMode = 'light' | 'standard' | 'deep';
type Mark = { x: number; y: number; size: number; color: string };
const roomTypes = ['WC', 'Kylpyhuone', 'Keittiö', 'Toimisto', 'Ikkunat', 'Lattia', 'Koti', 'Yritystila'];
const tasks = ['Pöly', 'Lika', 'Tahrat', 'Rasva', 'Kalkki', 'Homeen kaltainen värjäymä', 'Roskat', 'Tavarat ja tavaroiden järjestely', 'Lattialika', 'Ikkunat'];
const modes: { id: CleaningMode; label: string; range: string; amount: number }[] = [
  { id: 'light', label: 'Kevyt siivous', range: '60–100 €', amount: 80 },
  { id: 'standard', label: 'Perussiivous', range: '100–180 €', amount: 140 },
  { id: 'deep', label: 'Tehopuhdistus', range: '180–300 €', amount: 240 },
];

export function CleaningStudioPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [room, setRoom] = useState('Kylpyhuone');
  const [mode, setMode] = useState<CleaningMode>('standard');
  const [selectedTasks, setSelectedTasks] = useState<string[]>(['Lika', 'Tahrat', 'Kalkki']);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [before, setBefore] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [frequency, setFrequency] = useState('Kerran');
  const currentMode = modes.find((item) => item.id === mode) ?? modes[1];
  const estimate = Math.max(60, currentMode.amount + Math.max(0, selectedTasks.length - 3) * 12 + (frequency === 'Viikoittain' ? -20 : frequency === '2 viikon välein' ? -10 : 0));
  const estimateRange = `${Math.max(60, estimate - 40)}–${estimate + 40} €`;

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      canvas.getContext('2d')?.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const loadDemo = () => {
    setImageUrl(images.projects['project-08']);
    setMarks([]);
  };
  const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) return;
    setImageUrl(URL.createObjectURL(file));
    setMarks([]);
  };
  const mark = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (before || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setMarks((previous) => [...previous, { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height, size: 7, color: '#F4B942' }]);
  };
  const exportImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = `multivari-cleaning-preview-${Date.now()}.png`;
    link.click();
  };
  const previewText = before ? 'Ennen' : 'Esikatselu';

  return <>
    <Seo title="Siivousstudio | Maalaus Multiväri" description="Merkitse puhdistettavat alueet ja suunnittele siivouspalvelu omalle tilallesi." path="/cleaning-studio" breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: 'Siivousstudio', path: '/cleaning-studio' }]} />
    <main className="min-h-screen bg-navy-50">
      <header className="sticky top-0 z-40 border-b border-navy-100 bg-white shadow-soft"><div className="container-base flex items-center justify-between px-5 py-4 sm:px-7"><Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600"><ArrowLeft className="h-4 w-4" />Takaisin</Link><h1 className="font-display text-lg font-bold text-navy-950">Siivousstudio</h1><button type="button" onClick={exportImage} className="btn-primary !px-4 !py-2"><Download className="h-4 w-4" />Lataa</button></div></header>
      <div className="container-base px-5 py-6 sm:px-7"><div className="mb-6 max-w-2xl"><p className="eyebrow">Multiväri Home Transformation Studio</p><h2 className="mt-2 text-3xl font-bold text-navy-950 sm:text-4xl">Näe ero. Me hoidamme loput.</h2><p className="mt-3 text-navy-600">Merkitse tilan puhdistettavat alueet ja tee suuntaa-antava siivoussuunnitelma. Tämä on paikallinen esikatselu, ei automaattinen diagnoosi.</p></div>
        {!imageUrl ? <div className="rounded-2xl border-2 border-dashed border-navy-200 bg-white p-12 text-center"><ImagePlus className="mx-auto h-12 w-12 text-navy-300" /><h2 className="mt-4 text-xl font-bold text-navy-950">Aloita omalla kuvallasi tai kokeile esimerkkiä</h2><p className="mt-2 text-sm text-navy-600">Kuva käsitellään tässä selaimessa. JPG, PNG tai WebP, enintään 10 Mt.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><button type="button" onClick={() => fileRef.current?.click()} className="btn-primary"><ImagePlus className="h-5 w-5" />Lataa kuva</button><button type="button" onClick={loadDemo} className="btn-outline"><Sparkles className="h-5 w-5" />Kokeile esimerkkiä</button></div><input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={upload} className="hidden" /></div> : <div className="grid gap-6 lg:grid-cols-[1fr_320px]"><section className="space-y-4"><div className="relative overflow-hidden rounded-2xl bg-navy-900"><canvas ref={canvasRef} onPointerDown={(event) => { setIsDrawing(true); mark(event); }} onPointerMove={(event) => isDrawing && mark(event)} onPointerUp={() => setIsDrawing(false)} onPointerLeave={() => setIsDrawing(false)} className="block w-full touch-none" style={{ filter: before ? 'none' : 'brightness(1.08) contrast(1.06) saturate(0.9)' }} /><img src={imageUrl} alt="Alkuperäinen tila" className="absolute inset-0 hidden h-full w-full object-contain" />{marks.map((item, index) => <span key={index} className="pointer-events-none absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-amber-400/80 shadow" style={{ left: `${item.x * 100}%`, top: `${item.y * 100}%` }} />)}<span className="absolute bottom-3 left-3 rounded-full bg-navy-950/75 px-3 py-1.5 text-xs font-bold text-white">{previewText}</span><button type="button" onClick={() => setBefore((value) => !value)} className="absolute bottom-3 right-3 rounded-full bg-navy-950/75 px-3 py-1.5 text-xs font-bold text-white">{before ? 'Näytä esikatselu' : 'Näytä alkuperäinen'}</button></div><div className="flex flex-wrap gap-2"><button type="button" className="btn-outline !px-3 !py-2" onClick={() => setMarks([])}><Eraser className="h-4 w-4" />Tyhjennä merkinnät</button><button type="button" className="btn-outline !px-3 !py-2" onClick={() => setMarks((items) => items.slice(0, -1))}><Undo2 className="h-4 w-4" />Kumoa</button><button type="button" className="btn-outline !px-3 !py-2" onClick={loadDemo}>Vaihda kuva</button></div></section>
          <aside className="space-y-5"><div className="card space-y-4 p-5"><p className="text-xs font-bold uppercase tracking-wider text-navy-700">Tilan tyyppi</p><div className="grid grid-cols-2 gap-2">{roomTypes.map((item) => <button type="button" key={item} onClick={() => setRoom(item)} className={`rounded-lg border px-3 py-2 text-sm font-semibold ${room === item ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-700'}`}>{item}</button>)}</div></div><div className="card space-y-4 p-5"><p className="text-xs font-bold uppercase tracking-wider text-navy-700">Mitä tila tarvitsee?</p><div className="grid gap-2">{tasks.map((item) => <label key={item} className="flex items-center gap-3 text-sm text-navy-700"><input type="checkbox" checked={selectedTasks.includes(item)} onChange={() => setSelectedTasks((current) => current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item])} />{item}</label>)}</div></div><div className="card space-y-3 p-5"><p className="text-xs font-bold uppercase tracking-wider text-navy-700">Puhdistuksen taso</p>{modes.map((item) => <button type="button" key={item.id} onClick={() => setMode(item.id)} className={`flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left ${mode === item.id ? 'border-orange-500 bg-orange-50' : 'border-navy-200'}`}><span className="font-semibold text-navy-800">{item.label}</span><span className="text-sm text-navy-500">{item.range}</span></button>)}</div><div className="card space-y-4 bg-navy-950 p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-orange-300">Suuntaa-antava arvio</p><p className="mt-2 text-3xl font-bold">{estimateRange}</p><label className="block text-sm text-navy-100">Siivouksen toistuvuus<select value={frequency} onChange={(event) => setFrequency(event.target.value)} className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-white"><option>Kerran</option><option>Viikoittain</option><option>2 viikon välein</option><option>Kuukausittain</option><option>Yrityssiivous</option></select></label><p className="mt-2 text-xs leading-5 text-navy-200">Arvio perustuu tilan tyyppiin, valittuun tasoon ja merkintöihin. Lopullinen hinta varmistetaan kohteessa.</p></div><Link to="/yhteystiedot" className="btn-primary w-full justify-center"><Check className="h-4 w-4" />Pyydä siivoustarjous</Link></aside></div>}
      </div>
    </main>
  </>;
}
