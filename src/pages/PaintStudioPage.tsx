'use client';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Download, RotateCcw, Undo2, Redo2, Palette, ImagePlus, Eye, EyeOff, Paintbrush, PaintRoller, Eraser } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/Seo';
import { images } from '@/config/images';
type ToolType = 'brush' | 'roller' | 'eraser' | 'selector';
type Layer = {
  id: string;
  name: string;
  color: string;
  opacity: number;
  visible: boolean;
  data: ImageData | null;
};

type HistoryEntry = {
  layers: Layer[];
};

const COLORS = [
  { name: 'Lämmin valkoinen', hex: '#F2EFE6' },
  { name: 'Pehmeä beige', hex: '#D8C9B5' },
  { name: 'Vaalea harmaa', hex: '#C9CBC8' },
  { name: 'Harmaa', hex: '#8A8E8B' },
  { name: 'Terrakotta', hex: '#B86F52' },
  { name: 'Syvä vihreä', hex: '#496255' },
  { name: 'Grafiitti', hex: '#45494B' },
  { name: 'Musta', hex: '#1D2022' },
];

export function PaintStudioPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [tool, setTool] = useState<ToolType>('brush');
  const [color, setColor] = useState('#D8C9B5');
  const [isDrawing, setIsDrawing] = useState(false);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [before, setBefore] = useState(false);
  const [opacity, setOpacity] = useState(0.28);
  const [brushSize, setBrushSize] = useState(24);
  const [hardness, setHardness] = useState(0.65);
  const [surface, setSurface] = useState('Seinät');
  const [finish, setFinish] = useState('Matta');
  const [width, setWidth] = useState(5);
  const [length, setLength] = useState(7);
  const [height, setHeight] = useState(2.7);
  const [coats, setCoats] = useState(2);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const area = Math.max(5, Math.round(width * length * 2 + width * length * 0.7));
  const liters = Math.ceil((area * coats) / 8);
  const estimate = Math.round(area * (18 + coats * 3) + 190);

  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      if (layers.length === 0) {
        setLayers([
          { id: '1', name: 'Seinät', color: '#D8C9B5', opacity: 0.28, visible: true, data: null },
          { id: '2', name: 'Katto', color: '#FFFFFF', opacity: 0.25, visible: true, data: null },
          { id: '3', name: 'Ovet/listat', color: '#FFFFFF', opacity: 0.3, visible: true, data: null },
        ]);
        setHistory([{ layers: [] }]);
        setHistoryIndex(0);
      }
    };
    img.src = imageUrl;
  }, [imageUrl, layers.length]);

  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ layers: JSON.parse(JSON.stringify(layers)) });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  const loadImageUrl = (url: string) => {
    setImageUrl(url);
    setLayers([]);
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return;
    if (file.size > 10 * 1024 * 1024) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setLayers([]);
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || tool === 'selector' || before) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
    draw(x, y);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || before) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
    draw(x, y);
  };

  const handleCanvasMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const draw = (x: number, y: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = tool === 'eraser' ? brushSize : tool === 'roller' ? brushSize * 2.5 : brushSize;
    ctx.globalAlpha = tool === 'eraser' ? 1 : opacity;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : finish === 'Kiiltävä' ? 'screen' : 'multiply';
    ctx.fillStyle = tool === 'eraser' ? 'rgba(0,0,0,1)' : color;
    if (tool === 'roller') {
      ctx.fillRect(x - size, y - size / 2, size * 2, size);
    } else {
      const gradient = ctx.createRadialGradient(x, y, size * hardness * 0.2, x, y, size / 2);
      gradient.addColorStop(0, tool === 'eraser' ? 'rgba(0,0,0,1)' : color);
      gradient.addColorStop(1, tool === 'eraser' ? 'rgba(0,0,0,0)' : `${color}00`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  const downloadDesign = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.href = canvasRef.current.toDataURL('image/png');
    link.download = `maalaus-design-${Date.now()}.png`;
    link.click();
  };

  const createSnapshot = () => {
    if (!canvasRef.current) return;
    setSnapshots((current) => [...current.slice(-3), canvasRef.current!.toDataURL('image/jpeg', 0.75)]);
  };

  const resetCanvas = () => {
    if (!canvasRef.current || !imageUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      setLayers(layers.map(l => ({ ...l, data: null })));
      saveToHistory();
    };
    img.src = imageUrl;
  };

  return (
    <>
      <Seo
        title="Maalausstudio | Maalaus Multiväri"
        description="Suunnittele huoneen värit interaktiivisen maalisuunnittelijoiden avulla. Lataa kuva, maalaa värit ja näe suuntaa-antava lopputulos."
        path="/paint-studio"
        breadcrumbs={[{ name: 'Etusivu', path: '/' }, { name: 'Maalausstudio', path: '/paint-studio' }]}
      />

      <main className="min-h-screen bg-navy-50">
        <header className="sticky top-0 z-40 border-b border-navy-100 bg-white shadow-soft">
          <div className="container-base flex items-center justify-between px-5 py-4 sm:px-7">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy-600 hover:text-navy-800">
              <ArrowLeft className="h-4 w-4" />Takaisin
            </Link>
            <div className="flex items-center gap-4"><h1 className="font-display text-lg font-bold text-navy-950">Maalausstudio</h1><Link to="/cleaning-studio" className="hidden text-xs font-bold text-navy-500 hover:text-orange-600 sm:inline">Siivousstudio</Link></div>
            <button type="button" onClick={downloadDesign} className="btn-primary !px-4 !py-2">
              <Download className="h-4 w-4" />Lataa
            </button>
          </div>
        </header>

        <div className="container-base px-5 py-6 sm:px-7">
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {!imageUrl ? (
              <div className="rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/50 p-12 text-center">
                <ImagePlus className="mx-auto h-12 w-12 text-navy-300" />
                <p className="mt-4 text-lg font-bold text-navy-900">Lataa kuva huoneestasi</p>
                <p className="mt-2 text-sm text-navy-600">JPG, PNG tai WebP, enintään 10 Mt</p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary"
                  >
                    <ImagePlus className="h-5 w-5" />Valitse kuva
                  </button>
                  <button
                    type="button"
                    onClick={() => loadImageUrl(images.projects['project-05'])}
                    className="btn-outline"
                  >
                    Kokeile esimerkkihuonetta
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl bg-navy-900">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                    className="block w-full cursor-crosshair"
                    style={{ display: before ? 'none' : 'block' }}
                  />
                  {before && imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Alkuperäinen kuva"
                      className="block w-full"
                      crossOrigin="anonymous"
                    />
                  )}
                  <div className="absolute bottom-3 left-3 rounded-full bg-navy-950/75 px-3 py-1.5 text-xs font-bold text-white">
                    {before ? 'Ennen' : 'Jälkeen'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setBefore(!before)}
                    className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-navy-950/75 px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-950"
                  >
                    {before ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="btn-outline !px-3 !py-2 disabled:opacity-40"
                  >
                    <Undo2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="btn-outline !px-3 !py-2 disabled:opacity-40"
                  >
                    <Redo2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={resetCanvas}
                    className="btn-outline !px-3 !py-2"
                  >
                    <RotateCcw className="h-4 w-4" />Tyhjennä
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl(null);
                      setLayers([]);
                      setHistory([]);
                    }}
                    className="btn-outline !px-3 !py-2 ml-auto"
                  >
                    Lataa uusi kuva
                  </button>
                </div>
              </div>
            )}

            {imageUrl && (
              <div className="space-y-5 h-fit">
                <div className="card space-y-3 p-5">
                  <p className="text-xs font-bold uppercase text-navy-700">Välineet</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'brush', icon: Paintbrush, label: 'Sivellin' },
                      { id: 'roller', icon: PaintRoller, label: 'Rulla' },
                      { id: 'eraser', icon: Eraser, label: 'Pyyhekumi' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTool(t.id as ToolType)}
                        className={`rounded-lg border px-3 py-2 text-sm font-bold transition ${
                          tool === t.id
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-navy-200 text-navy-700'
                        }`}
                      >
                        <t.icon className="mx-auto h-4 w-4" />
                        <span className="sr-only">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card space-y-3 p-5">
                  <p className="text-xs font-bold uppercase text-navy-700">Maalauspinta</p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Seinät', 'Katto', 'Ovet', 'Listat', 'Ikkunat', 'Oma alue'].map((item) => (
                      <button key={item} type="button" onClick={() => setSurface(item)} className={`rounded-lg border px-2 py-2 text-xs font-bold ${surface === item ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-navy-200 text-navy-600'}`}>{item}</button>
                    ))}
                  </div>
                </div>

                <div className="card space-y-3 p-5">
                  <p className="text-xs font-bold uppercase text-navy-700">Väri</p>
                  <div className="grid grid-cols-4 gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setColor(c.hex)}
                        className={`h-10 rounded-lg border-2 transition ${
                          color === c.hex ? 'border-orange-500' : 'border-white shadow-sm'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        aria-label={c.name}
                      />
                    ))}
                  </div>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-full cursor-pointer rounded-lg border border-navy-200 p-1" aria-label="Valitse väri" />
                  <label className="block text-xs font-bold text-navy-600">HEX-väri<input value={color} onChange={(e) => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && setColor(e.target.value)} className="mt-1 w-full rounded-lg border border-navy-200 px-3 py-2 font-mono text-sm" aria-label="HEX-väri" /></label>
                  <div className="flex flex-wrap gap-2 pt-1"><span className="text-xs font-bold text-navy-500">Väri-ideat:</span>{[color, '#E8D8C3', '#5D7564', '#293746'].map((hex) => <button key={hex} type="button" onClick={() => setColor(hex)} className="h-6 w-6 rounded-full border border-white shadow" style={{ backgroundColor: hex }} aria-label={`Valitse väri ${hex}`} />)}</div>
                </div>

                <div className="card space-y-3 p-5">
                  <label className="text-xs font-bold uppercase text-navy-700">Työkalun asetukset</label>
                  <label className="block text-xs font-bold text-navy-600">Koko: {brushSize}px<input type="range" min="8" max="80" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full" /></label>
                  <label className="block text-xs font-bold text-navy-600">Pehmeys: {Math.round(hardness * 100)}%<input type="range" min="0.15" max="1" step="0.05" value={hardness} onChange={(e) => setHardness(Number(e.target.value))} className="w-full" /></label>
                </div>

                <div className="card space-y-3 p-5">
                  <label className="text-xs font-bold uppercase text-navy-700">
                    Läpinäkyvyys: {Math.round(opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="card space-y-3 p-5">
                  <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase text-navy-700">Inspiraatio</p><span className="text-xs text-navy-400">Valitse tyyli</span></div>
                  <div className="grid grid-cols-2 gap-2">{[{ name: 'Nordic', hex: '#D8C9B5' }, { name: 'Luonnollinen', hex: '#A8B39E' }, { name: 'Moderni', hex: '#8A8E8B' }, { name: 'Rohkea', hex: '#B86F52' }].map((style) => <button key={style.name} type="button" onClick={() => setColor(style.hex)} className="flex items-center gap-2 rounded-lg border border-navy-200 px-2 py-2 text-left text-xs font-bold text-navy-700"><span className="h-5 w-5 rounded-full" style={{ backgroundColor: style.hex }} />{style.name}</button>)}</div>
                  <button type="button" onClick={() => setColor(COLORS[Math.floor(Math.random() * COLORS.length)].hex)} className="w-full rounded-lg bg-orange-50 px-3 py-2 text-xs font-bold text-orange-700 hover:bg-orange-100">Yllätä minut</button>
                </div>

                <div className="card space-y-3 p-5"><div className="flex items-center justify-between"><p className="text-xs font-bold uppercase text-navy-700">Tilannekuvat</p><button type="button" onClick={createSnapshot} className="text-xs font-bold text-orange-600">Ota kuva</button></div>{snapshots.length === 0 ? <p className="text-xs text-navy-500">Tallenna vertailua varten suunnitelman eri versioita.</p> : <div className="grid grid-cols-4 gap-2">{snapshots.map((shot, index) => <img key={`${shot}-${index}`} src={shot} alt={`Suunnitelman versio ${index + 1}`} className="aspect-square rounded object-cover" />)}</div>}</div>

                <div className="card space-y-3 p-5">
                  <p className="text-xs font-bold uppercase text-navy-700">Tasot</p>
                  <div className="space-y-2">
                    {layers.map((layer) => (
                      <div key={layer.id} className="flex items-center gap-2 rounded-lg border border-navy-100 bg-navy-50 p-2">
                        <span className="h-6 w-6 rounded border" style={{ backgroundColor: layer.color }} />
                        <span className="flex-1 text-sm font-medium text-navy-700">{layer.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setLayers(layers.map((l) => (l.id === layer.id ? { ...l, visible: !l.visible } : l)))
                          }
                          className="text-navy-400 hover:text-navy-600"
                        >
                          {layer.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card space-y-4 bg-navy-950 p-5 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-orange-300">Suunnittelun arvio</p>
                      <p className="mt-2 text-3xl font-bold">{estimate.toLocaleString('fi-FI')} €</p>
                    </div>
                    <Palette className="h-5 w-5 text-orange-300" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs"><label>Leveys (m)<input type="number" min="1" max="30" step="0.1" value={width} onChange={(e) => setWidth(Math.max(1, Number(e.target.value) || 1))} className="mt-1 w-full rounded-lg bg-white/10 px-2 py-2 text-white" /></label><label>Pituus (m)<input type="number" min="1" max="30" step="0.1" value={length} onChange={(e) => setLength(Math.max(1, Number(e.target.value) || 1))} className="mt-1 w-full rounded-lg bg-white/10 px-2 py-2 text-white" /></label><label>Korkeus (m)<input type="number" min="2" max="6" step="0.1" value={height} onChange={(e) => setHeight(Math.max(2, Number(e.target.value) || 2))} className="mt-1 w-full rounded-lg bg-white/10 px-2 py-2 text-white" /></label></div>
                  <div className="flex items-center justify-between text-sm"><span>Arvioitu pinta-ala</span><strong>{area} m²</strong></div>
                  <div className="flex items-center justify-between text-sm"><span>Arvioitu maalimäärä</span><strong>{liters} l</strong></div>
                  <div className="grid grid-cols-2 gap-3 text-xs"><label>Maalauskertoja<select value={coats} onChange={(e) => setCoats(Number(e.target.value))} className="mt-1 w-full rounded-lg bg-white/10 px-2 py-2 text-white"><option value="1">1 kerros</option><option value="2">2 kerrosta</option><option value="3">3 kerrosta</option></select></label><label>Viimeistely<select value={finish} onChange={(e) => setFinish(e.target.value)} className="mt-1 w-full rounded-lg bg-white/10 px-2 py-2 text-white"><option>Matta</option><option>Silkki</option><option>Satiini</option><option>Kiiltävä</option></select></label></div>
                  <p className="text-xs leading-5 text-navy-200">Suuntaa-antava arvio sisältää työn ja perustarvikkeet. Lopullinen hinta varmistetaan kohteen mukaan.</p>
                </div>

                <Link
                  to="/yhteystiedot"
                  className="btn-primary w-full justify-center"
                >
                  <Palette className="h-4 w-4" />Pyydä tarjous
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
