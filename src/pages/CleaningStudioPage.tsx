import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Eraser, ImagePlus, Sparkles, Undo2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { images } from '@/config/images';

type Mark = { x: number; y: number };
const roomTypes = ['WC', 'Kylpyhuone', 'Keittiö', 'Koti', 'Toimisto', 'Yritystila'];
const cleaningTypes = ['Perussiivous', 'Tehopuhdistus', 'Muuttosiivous', 'Toimistosiivous', 'Yrityssiivous'];
const tasks = ['Pöly', 'Lika', 'Tahrat', 'Rasva', 'Kalkki', 'Roskat', 'Lattialika', 'Ikkunat'];

function analytics(event: string, data: Record<string, unknown> = {}) {
  const w = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...data });
}

export function CleaningStudioPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [room, setRoom] = useState('WC');
  const [cleaningType, setCleaningType] = useState('Perussiivous');
  const [selectedTasks, setSelectedTasks] = useState<string[]>(['Lika', 'Tahrat']);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [before, setBefore] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [size, setSize] = useState(20);
  const [rooms, setRooms] = useState(1);
  const [frequency, setFrequency] = useState('Kertaluonteinen');

  useEffect(() => analytics('cleaning_planner_open'), []);

  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      canvas.getContext('2d')?.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const setNewImage = (url: string, source: string) => {
    setImageUrl(url);
    setMarks([]);
    setBefore(false);
    analytics('cleaning_photo_uploaded', { source });
  };

  const loadDemo = () => setNewImage(images.projects['project-08'], 'demo');

  const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) return;
    setNewImage(URL.createObjectURL(file), 'customer');
  };

  const mark = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (before || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setMarks((current) => [...current.slice(-249), {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    }]);
  };

  const toggleTask = (item: string) => {
    setSelectedTasks((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  };

  const summary = `${cleaningType}, ${room}, ${rooms} tila(a), ${frequency.toLowerCase()}`;

  return (
    <>
      <Seo
        title="Siivoussuunnittelija – arvioi siivoustarve ja pyydä tarjous"
        description="Lataa kuva WC:stä, kylpyhuoneesta, kodista tai toimistosta, merkitse puhdistettavat alueet ja pyydä siivoustarjous Helsingissä, Espoossa tai Vantaalla."
        path="/siivoussuunnittelija"
        breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: 'Siivoussuunnittelija', path: '/siivoussuunnittelija' }]}
      />
      <main className="min-h-screen bg-navy-50">
        <header className="border-b border-navy-100 bg-white">
          <div className="container-base flex items-center justify-between px-5 py-4 sm:px-7">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600"><ArrowLeft className="h-4 w-4" />Takaisin</Link>
            <h1 className="font-display text-lg font-bold text-navy-950">Siivoussuunnittelija</h1>
            <Link to="/maalauslaskuri" className="text-sm font-semibold text-orange-600">Maalaussuunnittelija</Link>
          </div>
        </header>

        <div className="container-base px-5 py-8 sm:px-7">
          <div className="mx-auto mb-7 max-w-3xl text-center">
            <p className="eyebrow-orange">Siivous Helsinki · Espoo · Vantaa</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-navy-950 sm:text-4xl">Näytä meille, mitä pitäisi puhdistaa</h2>
            <p className="mt-3 text-navy-600">Lataa kuva likaisesta tilasta, merkitse tärkeät alueet ja valitse tarvitsemasi siivous. Saat tarjouspyyntöön valmiin yhteenvedon ilman rekisteröitymistä.</p>
          </div>

          {!imageUrl ? (
            <div className="mx-auto max-w-3xl rounded-3xl border-2 border-dashed border-navy-200 bg-white p-10 text-center">
              <ImagePlus className="mx-auto h-12 w-12 text-navy-300" />
              <h2 className="mt-4 text-xl font-bold text-navy-950">Lataa kuva tilasta</h2>
              <p className="mt-2 text-sm text-navy-600">JPG, PNG tai WebP, enintään 10 Mt. Puhelimella voit käyttää kameraa.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => fileRef.current?.click()} className="btn-primary"><ImagePlus className="h-5 w-5" />Lataa kuva</button>
                <button type="button" onClick={loadDemo} className="btn-outline"><Sparkles className="h-5 w-5" />Kokeile esimerkkiä</button>
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={upload} className="hidden" />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <section className="space-y-4">
                <div className="relative overflow-hidden rounded-3xl bg-navy-900">
                  <canvas
                    ref={canvasRef}
                    onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setDrawing(true); mark(event); }}
                    onPointerMove={(event) => drawing && mark(event)}
                    onPointerUp={(event) => { setDrawing(false); event.currentTarget.releasePointerCapture(event.pointerId); }}
                    className="block w-full touch-none"
                    style={{ filter: before ? 'none' : 'brightness(1.09) contrast(1.04) saturate(.93)' }}
                  />
                  {marks.map((item, index) => <span key={`${item.x}-${item.y}-${index}`} className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-orange-400/70" style={{ left: `${item.x * 100}%`, top: `${item.y * 100}%`, width: size, height: size }} />)}
                  <span className="absolute bottom-3 left-3 rounded-full bg-navy-950/80 px-3 py-1.5 text-xs font-bold text-white">{before ? 'Ennen' : 'Esikatselu jälkeen'}</span>
                  <button type="button" onClick={() => { setBefore((value) => !value); analytics('cleaning_before_after_used'); }} className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-navy-900">{before ? 'Näytä esikatselu' : 'Näytä alkuperäinen'}</button>
                </div>
                <p className="text-xs leading-5 text-navy-500"><strong>Huom:</strong> esikatselu on suuntaa-antava visuaalinen havainnollistus, ei AI:n lupaama tai taattu lopputulos. Todellinen tulos riippuu pinnoista, lian tyypistä ja kohteen kunnosta.</p>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" className="btn-outline !px-3 !py-2" onClick={() => setMarks((items) => items.slice(0, -1))}><Undo2 className="h-4 w-4" />Kumoa</button>
                  <button type="button" className="btn-outline !px-3 !py-2" onClick={() => setMarks([])}><Eraser className="h-4 w-4" />Poista merkinnät</button>
                  <label className="ml-auto flex items-center gap-2 text-sm font-semibold text-navy-700">Merkki <input type="range" min="12" max="46" value={size} onChange={(e) => setSize(Number(e.target.value))} /></label>
                </div>
              </section>

              <aside className="space-y-5">
                <div className="card p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy-700">1. Tila</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">{roomTypes.map((item) => <button type="button" key={item} onClick={() => setRoom(item)} className={`rounded-xl border px-3 py-2 text-sm font-semibold ${room === item ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-700'}`}>{item}</button>)}</div>
                </div>

                <div className="card p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy-700">2. Palvelu</p>
                  <div className="mt-3 grid gap-2">{cleaningTypes.map((item) => <button type="button" key={item} onClick={() => { setCleaningType(item); analytics('cleaning_type_selected', { type: item }); }} className={`rounded-xl border px-3 py-2 text-left text-sm font-semibold ${cleaningType === item ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-700'}`}>{item}</button>)}</div>
                </div>

                <div className="card p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-navy-700">3. Tarve</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">{tasks.map((item) => <label key={item} className="flex items-center gap-2 text-sm text-navy-700"><input type="checkbox" checked={selectedTasks.includes(item)} onChange={() => toggleTask(item)} />{item}</label>)}</div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <label className="text-sm font-semibold text-navy-700">Tiloja<input type="number" min="1" max="50" value={rooms} onChange={(e) => setRooms(Math.max(1, Number(e.target.value) || 1))} className="planner-input mt-1" /></label>
                    <label className="text-sm font-semibold text-navy-700">Tiheys<select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="planner-input mt-1"><option>Kertaluonteinen</option><option>Viikoittainen</option><option>2× viikossa</option><option>Kuukausittainen</option></select></label>
                  </div>
                </div>

                <div className="rounded-2xl bg-navy-950 p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-orange-300">Tarjouspyynnön yhteenveto</p>
                  <p className="mt-2 font-bold">{summary}</p>
                  <p className="mt-2 text-sm text-navy-200">Tarpeet: {selectedTasks.length ? selectedTasks.join(', ') : 'ei valittuja erityistarpeita'}.</p>
                  <p className="mt-3 text-xs leading-5 text-navy-300">Emme näytä keksittyä hintaa. Lopullinen arvio riippuu kohteen koosta, kunnosta, palvelutasosta ja työn laajuudesta.</p>
                </div>

                <Link to={`/yhteystiedot?service=${encodeURIComponent(cleaningType)}&source=siivoussuunnittelija`} onClick={() => analytics('cleaning_quote_started', { room, cleaningType })} className="btn-primary w-full justify-center"><Check className="h-4 w-4" />Pyydä siivoustarjous</Link>
              </aside>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
