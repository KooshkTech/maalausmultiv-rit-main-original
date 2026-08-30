import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  Camera,
  Download,
  Eye,
  EyeOff,
  Minus,
  Plus,
  Redo2,
  RotateCcw,
  Sparkles,
  Undo2,
  Upload,
} from 'lucide-react';
import { cloneMasks } from '@/features/smart-segmentation/history';
import {
  createSurfaceMask,
  editMaskCircle,
  maskCoverage,
  mergeMask,
} from '@/features/smart-segmentation/masks';
import { PromptFallbackProvider } from '@/features/smart-segmentation/provider';
import { renderSurfaceMasks } from '@/features/smart-segmentation/render';
import { SlimSamProvider } from '@/features/smart-segmentation/slimSamProvider';
import type {
  MaskEditMode,
  SegmentationPoint,
  SurfaceMask,
} from '@/features/smart-segmentation/types';
import { detectSmartSegmentationCapability } from '@/features/smart-segmentation/webgpu';

type ViewMode = 'after' | 'before' | 'compare';
type HistoryState = { masks: SurfaceMask[]; activeId: string | null };
type Size = { width: number; height: number };

const palette = [
  '#F2EFE6', '#D8C9B5', '#C9CBC8', '#A7B19B', '#9FB4C3', '#B86F52',
  '#496255', '#45494B', '#1D2022', '#D99518', '#6C5CE7', '#00B894',
];

const fallbackProvider = new PromptFallbackProvider();

function samplePromptPoints(points: SegmentationPoint[], maxPoints = 12): SegmentationPoint[] {
  if (points.length <= maxPoints) return points.map((point) => ({ ...point, label: 1 }));
  const sampled: SegmentationPoint[] = [];
  for (let i = 0; i < maxPoints; i += 1) {
    const index = Math.round((i / (maxPoints - 1)) * (points.length - 1));
    sampled.push({ ...points[index], label: 1 });
  }
  return sampled;
}

function binaryCoverage(data: Uint8Array): number {
  if (!data.length) return 0;
  let selected = 0;
  for (const value of data) if (value) selected += 1;
  return selected / data.length;
}

export function UniversalPaintStudioV3Page() {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sourceRef = useRef<ImageData | null>(null);
  const drawingRef = useRef(false);
  const strokePointsRef = useRef<SegmentationPoint[]>([]);
  const lastStrokeRef = useRef<SegmentationPoint[]>([]);
  const semanticProviderRef = useRef(new SlimSamProvider());

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const [masks, setMasks] = useState<SurfaceMask[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mode, setMode] = useState<MaskEditMode>('add');
  const [color, setColor] = useState('#D99518');
  const [brushSize, setBrushSize] = useState(34);
  const [viewMode, setViewMode] = useState<ViewMode>('after');
  const [compareAt, setCompareAt] = useState(50);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [status, setStatus] = useState('Lataa kuva ja valitse maalattava pinta.');
  const [semanticStatus, setSemanticStatus] = useState('Tarkistetaan laitetta…');
  const [autoFill, setAutoFill] = useState(true);
  const [isFilling, setIsFilling] = useState(false);

  const active = masks.find((mask) => mask.id === activeId) ?? null;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const source = sourceRef.current;
    if (!canvas || !source) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    if (viewMode === 'before') return;

    const rendered = renderSurfaceMasks(source, masks);
    if (viewMode === 'after') {
      context.putImageData(rendered, 0, 0);
      return;
    }

    const temp = document.createElement('canvas');
    temp.width = source.width;
    temp.height = source.height;
    temp.getContext('2d')?.putImageData(rendered, 0, 0);
    context.save();
    context.beginPath();
    context.rect(0, 0, source.width * (compareAt / 100), source.height);
    context.clip();
    context.drawImage(temp, 0, 0);
    context.restore();
  }, [compareAt, masks, viewMode]);

  useEffect(() => {
    void detectSmartSegmentationCapability().then((capability) => {
      setSemanticStatus(
        capability.webGpu
          ? 'AI-pintatunnistus · WebGPU-kiihdytys käytettävissä'
          : 'AI-pintatunnistus · WASM-varatila käytettävissä',
      );
    });
  }, []);

  useEffect(() => {
    render();
  }, [render]);

  const commit = useCallback((next: SurfaceMask[], nextActive: string | null = activeId) => {
    const snapshot = { masks: cloneMasks(next), activeId: nextActive };
    const nextHistory = [...history.slice(0, historyIndex + 1), snapshot].slice(-30);
    setMasks(next);
    setActiveId(nextActive);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
  }, [activeId, history, historyIndex]);

  const restore = (index: number) => {
    const snapshot = history[index];
    if (!snapshot) return;
    setMasks(cloneMasks(snapshot.masks));
    setActiveId(snapshot.activeId);
    setHistoryIndex(index);
  };

  const undo = () => {
    if (historyIndex > 0) restore(historyIndex - 1);
  };

  const redo = () => {
    if (historyIndex < history.length - 1) restore(historyIndex + 1);
  };

  const loadFile = (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setStatus('Käytä JPG-, PNG- tai WebP-kuvaa.');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setStatus('Kuva on liian suuri. Enimmäiskoko on 12 Mt.');
      return;
    }

    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    setImageUrl(URL.createObjectURL(file));
    setMasks([]);
    setActiveId(null);
    setHistory([]);
    setHistoryIndex(-1);
    lastStrokeRef.current = [];
    setStatus('Kuva valmis. Maalaa lyhyt vihje haluamasi pinnan päälle.');
  };

  const onImageLoad = () => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;

    const scale = Math.min(1, 1400 / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    setSize({ width, height });
    canvas.width = width;
    canvas.height = height;

    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = width;
    sourceCanvas.height = height;
    const sourceContext = sourceCanvas.getContext('2d');
    sourceContext?.drawImage(image, 0, 0, width, height);
    sourceRef.current = sourceContext?.getImageData(0, 0, width, height) ?? null;

    const first = createSurfaceMask(width, height, color, 'Pinta 1');
    setMasks([first]);
    setActiveId(first.id);
    setHistory([{ masks: cloneMasks([first]), activeId: first.id }]);
    setHistoryIndex(0);
    requestAnimationFrame(render);
  };

  const pointFromEvent = (event: ReactPointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage || !size.width || !size.height) return null;
    const rect = stage.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(size.width - 1, ((event.clientX - rect.left) / rect.width) * size.width)),
      y: Math.max(0, Math.min(size.height - 1, ((event.clientY - rect.top) / rect.height) * size.height)),
    };
  };

  const editAt = (x: number, y: number) => {
    if (!active) return;
    setMasks((current) => current.map((mask) => (
      mask.id === active.id ? editMaskCircle(mask, x, y, brushSize, mode) : mask
    )));
  };

  const applySmartFill = useCallback(async (
    rawPoints = lastStrokeRef.current,
    editMode: MaskEditMode = mode,
  ) => {
    const source = sourceRef.current;
    const target = masks.find((mask) => mask.id === activeId);
    if (!target || !source || isFilling) return;

    const promptPoints = samplePromptPoints(rawPoints);
    if (!promptPoints.length) {
      setStatus('Maalaa ensin lyhyt vihje pinnan päälle.');
      return;
    }

    setIsFilling(true);
    setStatus('AI tunnistaa pinnan rajoja… Ensimmäinen kerta voi ladata mallin.');

    try {
      let result;
      try {
        result = await semanticProviderRef.current.segment({
          image: source,
          points: promptPoints,
          width: size.width,
          height: size.height,
        });
        setSemanticStatus(
          typeof result.confidence === 'number'
            ? `AI-pintatunnistus valmis · varmuus ${Math.round(result.confidence * 100)} %`
            : 'AI-pintatunnistus valmis',
        );
      } catch {
        setSemanticStatus('AI-malli ei käynnistynyt · paikallinen varatila käytössä');
        result = await fallbackProvider.segment({
          image: source,
          points: promptPoints,
          width: size.width,
          height: size.height,
        });
      }

      const coverage = binaryCoverage(result.mask);
      if (coverage > 0.78) {
        setStatus('Täyttö pysäytettiin turvallisuuden vuoksi: valinta oli liian suuri. Lisää lyhyempi vihje pinnan keskelle.');
        return;
      }

      const next = masks.map((mask) => (
        mask.id === target.id ? mergeMask(mask, result.mask, editMode) : mask
      ));
      commit(next, target.id);
      setStatus(
        editMode === 'add'
          ? 'Pinta tunnistettu ja lisätty. Tarvittaessa korjaa + Lisää alue / − Poista alue.'
          : 'Tunnistettu alue poistettiin maskista. Voit jatkaa korjausta samalla työkalulla.',
      );
    } finally {
      setIsFilling(false);
    }
  }, [activeId, commit, isFilling, masks, mode, size.height, size.width]);

  const pointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!active || viewMode === 'before' || isFilling) return;
    const point = pointFromEvent(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    strokePointsRef.current = [{ ...point, label: 1 }];
    editAt(point.x, point.y);
  };

  const pointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current) return;
    const point = pointFromEvent(event);
    if (!point) return;
    strokePointsRef.current.push({ ...point, label: 1 });
    editAt(point.x, point.y);
  };

  const pointerUp = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const stroke = [...strokePointsRef.current];
    lastStrokeRef.current = stroke;
    strokePointsRef.current = [];
    commit(masks);
    if (autoFill && stroke.length) void applySmartFill(stroke, mode);
  };

  const addSurface = () => {
    if (!size.width) return;
    const mask = createSurfaceMask(size.width, size.height, color, `Pinta ${masks.length + 1}`);
    commit([...masks, mask], mask.id);
    lastStrokeRef.current = [];
    setStatus('Uusi pinta lisätty. Jokaisella pinnalla voi olla oma väri.');
  };

  const removeSurface = () => {
    if (!active) return;
    const next = masks.filter((mask) => mask.id !== active.id);
    commit(next, next[0]?.id ?? null);
  };

  const setActiveColor = (nextColor: string) => {
    setColor(nextColor);
    if (!active) return;
    commit(masks.map((mask) => (
      mask.id === active.id ? { ...mask, color: nextColor } : mask
    )));
  };

  const toggleVisible = (id: string) => {
    commit(masks.map((mask) => (
      mask.id === id ? { ...mask, visible: !mask.visible } : mask
    )));
  };

  const reset = () => {
    if (!size.width) return;
    const mask = createSurfaceMask(size.width, size.height, color, 'Pinta 1');
    commit([mask], mask.id);
    lastStrokeRef.current = [];
    setStatus('Suunnitelma tyhjennettiin.');
  };

  const download = (type: 'png' | 'jpg') => {
    const image = imageRef.current;
    const source = sourceRef.current;
    if (!image || !source) return;

    const output = document.createElement('canvas');
    output.width = source.width;
    output.height = source.height;
    const context = output.getContext('2d');
    if (!context) return;
    context.drawImage(image, 0, 0, output.width, output.height);

    const rendered = renderSurfaceMasks(source, masks);
    const overlay = document.createElement('canvas');
    overlay.width = output.width;
    overlay.height = output.height;
    overlay.getContext('2d')?.putImageData(rendered, 0, 0);
    context.drawImage(overlay, 0, 0);

    context.fillStyle = 'rgba(255,255,255,.86)';
    context.fillRect(12, output.height - 36, Math.min(350, output.width - 24), 24);
    context.fillStyle = '#172033';
    context.font = '12px sans-serif';
    context.fillText('VäriKamu · maalausmultivari.fi', 20, output.height - 20);

    const link = document.createElement('a');
    link.download = `varikamu-${Date.now()}.${type}`;
    link.href = type === 'jpg'
      ? output.toDataURL('image/jpeg', 0.92)
      : output.toDataURL('image/png');
    link.click();
  };

  return (
    <section className="min-h-screen bg-navy-50 px-2 py-3 sm:px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-orange-600">VäriKamu V3</p>
          <h1 className="font-display text-xl font-extrabold text-navy-950 sm:text-2xl">
            Maalaa vähän — VäriKamu tunnistaa ja täyttää pinnan
          </h1>
          <p className="mt-1 text-sm text-navy-600">
            📷 Kuva → 🖌️ karkea vihje → ✨ AI-täyttö → ➕/➖ korjaus → 🎨 väri → 📨 suunnitelma
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="card min-w-0 p-2 sm:p-4">
            {!imageUrl ? (
              <div className="grid min-h-[55vh] place-items-center rounded-2xl border-2 border-dashed border-navy-200 bg-white p-6 text-center">
                <div>
                  <Camera className="mx-auto size-12 text-orange-500" />
                  <h2 className="mt-3 text-lg font-bold">Ota kuva tai lataa kuva</h2>
                  <p className="mt-2 max-w-md text-sm text-navy-600">
                    Kuva käsitellään selaimessa. Maalaa vain lyhyt vihje haluamasi pinnan päälle.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <button className="btn-primary" onClick={() => cameraRef.current?.click()}>
                      <Camera className="size-4" /> Ota kuva
                    </button>
                    <button className="btn-outline" onClick={() => fileRef.current?.click()}>
                      <Upload className="size-4" /> Lataa kuva
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div
                  ref={stageRef}
                  className="relative mx-auto max-h-[64dvh] touch-none overflow-hidden rounded-xl bg-navy-950"
                  style={{ aspectRatio: size.width && size.height ? `${size.width}/${size.height}` : '4/3' }}
                  onPointerDown={pointerDown}
                  onPointerMove={pointerMove}
                  onPointerUp={pointerUp}
                  onPointerCancel={pointerUp}
                >
                  <img
                    ref={imageRef}
                    src={imageUrl}
                    onLoad={onImageLoad}
                    className="absolute inset-0 h-full w-full object-contain"
                    alt="Asiakkaan maalaussuunnitelman kuva"
                  />
                  <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-contain" />
                  <div className="pointer-events-none absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs font-bold">
                    {isFilling ? '✨ Tunnistetaan pintaa…' : mode === 'add' ? '+ Lisää alue' : '− Poista alue'}
                  </div>
                </div>

                {viewMode === 'compare' && (
                  <input
                    className="mt-3 w-full"
                    type="range"
                    min="0"
                    max="100"
                    value={compareAt}
                    onChange={(event) => setCompareAt(Number(event.target.value))}
                    aria-label="Ennen ja jälkeen -vertailu"
                  />
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button className={viewMode === 'before' ? 'btn-primary' : 'btn-outline'} onClick={() => setViewMode('before')}>Ennen</button>
                  <button className={viewMode === 'after' ? 'btn-primary' : 'btn-outline'} onClick={() => setViewMode('after')}>Jälkeen</button>
                  <button className={viewMode === 'compare' ? 'btn-primary' : 'btn-outline'} onClick={() => setViewMode('compare')}>Vertaa</button>
                  <button className="btn-outline" disabled={historyIndex <= 0} onClick={undo} aria-label="Kumoa"><Undo2 className="size-4" /></button>
                  <button className="btn-outline" disabled={historyIndex >= history.length - 1} onClick={redo} aria-label="Tee uudelleen"><Redo2 className="size-4" /></button>
                </div>
              </>
            )}

            <input ref={fileRef} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => loadFile(event.target.files?.[0])} />
            <input ref={cameraRef} hidden type="file" accept="image/*" capture="environment" onChange={(event) => loadFile(event.target.files?.[0])} />
          </div>

          <aside className="space-y-3">
            <div className="card p-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold text-navy-950">Pinnat</h2>
                <button className="btn-outline px-3 py-2" onClick={addSurface}><Plus className="size-4" /> Uusi pinta</button>
              </div>
              <div className="mt-3 space-y-2">
                {masks.map((mask) => (
                  <div key={mask.id} className={`flex items-center gap-2 rounded-xl border p-2 ${mask.id === activeId ? 'border-orange-400 bg-orange-50' : 'border-navy-100 bg-white'}`}>
                    <button className="min-w-0 flex-1 text-left" onClick={() => { setActiveId(mask.id); setColor(mask.color); }}>
                      <span className="block truncate text-sm font-bold">{mask.name}</span>
                      <span className="text-xs text-navy-500">{Math.round(maskCoverage(mask) * 100)} % kuvasta</span>
                    </button>
                    <span className="size-6 rounded-full border" style={{ backgroundColor: mask.color }} />
                    <button onClick={() => toggleVisible(mask.id)} aria-label="Näytä tai piilota pinta">
                      {mask.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </button>
                  </div>
                ))}
              </div>
              {active && <button className="mt-3 text-sm font-semibold text-red-600" onClick={removeSurface}>Poista valittu pinta</button>}
            </div>

            <div className="card p-4">
              <h2 className="font-bold">Älykäs pintavalinta</h2>
              <p className="mt-1 text-xs text-navy-500">Vedä lyhyt viiva pinnan päällä. VäriKamu yrittää löytää koko pinnan rajat.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button className={mode === 'add' ? 'btn-primary' : 'btn-outline'} onClick={() => setMode('add')}><Plus className="size-4" /> Lisää alue</button>
                <button className={mode === 'remove' ? 'btn-primary' : 'btn-outline'} onClick={() => setMode('remove')}><Minus className="size-4" /> Poista alue</button>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={autoFill} onChange={(event) => setAutoFill(event.target.checked)} />
                Täytä pinta automaattisesti
              </label>
              <label className="mt-3 block text-sm font-semibold">
                Työkalun koko {brushSize}px
                <input className="mt-1 w-full" type="range" min="8" max="100" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} />
              </label>
              <button className="btn-primary mt-3 w-full" disabled={isFilling || !active} onClick={() => void applySmartFill()}>
                <Sparkles className="size-4" /> {isFilling ? 'Tunnistetaan…' : 'Tunnista ja täytä pinta'}
              </button>
              <p className="mt-2 text-xs text-navy-500">{semanticStatus}</p>
            </div>

            <div className="card p-4">
              <h2 className="font-bold">Väri</h2>
              <div className="mt-3 grid grid-cols-6 gap-2">
                {palette.map((swatch) => (
                  <button
                    key={swatch}
                    className={`aspect-square rounded-full border-2 ${color === swatch ? 'border-orange-500' : 'border-white'}`}
                    style={{ backgroundColor: swatch }}
                    onClick={() => setActiveColor(swatch)}
                    aria-label={`Väri ${swatch}`}
                  />
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <input type="color" value={color} onChange={(event) => setActiveColor(event.target.value)} className="h-10 w-14" />
                <input value={color} onChange={(event) => /^#[0-9a-fA-F]{6}$/.test(event.target.value) && setActiveColor(event.target.value)} className="min-w-0 flex-1 rounded-lg border px-3 font-mono text-sm" aria-label="HEX-väri" />
              </div>
            </div>

            <div className="card p-4">
              <p className="mb-3 text-sm text-navy-700">{status}</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-outline" onClick={() => download('jpg')}><Download className="size-4" /> JPG</button>
                <button className="btn-outline" onClick={() => download('png')}><Download className="size-4" /> PNG</button>
              </div>
              <button className="btn-outline mt-2 w-full" onClick={reset}><RotateCcw className="size-4" /> Tyhjennä suunnitelma</button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
