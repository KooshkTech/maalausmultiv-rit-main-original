import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import {
  Camera,
  CheckCircle2,
  Download,
  FileText,
  MousePointer2,
  PaintBucket,
  Plus,
  RotateCcw,
  Send,
  Trash2,
  Upload,
} from 'lucide-react';
import { createPainterSummaryPdf, downloadBlob } from '@/lib/virtualPainterPdf';
import { submitPainterOrder } from '@/lib/virtualPainterApi';

type Point = { x: number; y: number };
type PaintColor = { name: string; ral: string; hex: string };
type PaintedSurface = {
  id: string;
  name: string;
  points: Point[];
  color: PaintColor;
  opacity: number;
  areaM2: number;
  coats: number;
};
type DragAnchor = { surfaceId: string; pointIndex: number } | null;
type ViewMode = 'before' | 'after' | 'compare';
type Customer = { name: string; email: string; phone: string; address: string; city: string };

const COLORS: PaintColor[] = [
  { name: 'Traffic White', ral: 'RAL 9016', hex: '#F4F4F4' },
  { name: 'Pure White', ral: 'RAL 9010', hex: '#F1ECE1' },
  { name: 'Light Grey', ral: 'RAL 7035', hex: '#CBD0CC' },
  { name: 'Grey Beige', ral: 'RAL 1019', hex: '#A79B8A' },
  { name: 'Reed Green', ral: 'RAL 6013', hex: '#7E8270' },
  { name: 'Pigeon Blue', ral: 'RAL 5014', hex: '#637D96' },
  { name: 'Oxide Red', ral: 'RAL 3009', hex: '#643730' },
  { name: 'Terracotta', ral: 'RAL 8023', hex: '#A45729' },
  { name: 'Graphite Grey', ral: 'RAL 7024', hex: '#45494E' },
  { name: 'Anthracite Grey', ral: 'RAL 7016', hex: '#383E42' },
  { name: 'Jet Black', ral: 'RAL 9005', hex: '#0E0E10' },
  { name: 'Pastel Yellow', ral: 'RAL 1034', hex: '#E7B75C' },
];

const DEFAULT_CUSTOMER: Customer = { name: '', email: '', phone: '', address: '', city: '' };
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `surface-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function pointsToCanvas(points: Point[], width: number, height: number) {
  return points.map((point) => ({ x: point.x * width, y: point.y * height }));
}

function canvasBlob(canvas: HTMLCanvasElement, type = 'image/jpeg', quality = 0.88) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Kuvan luonti epäonnistui.'))), type, quality);
  });
}

function totalArea(surfaces: PaintedSurface[]) {
  return surfaces.reduce((sum, surface) => sum + Math.max(0, surface.areaM2 || 0), 0);
}

export function UniversalPaintStudioV3Page() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [surfaces, setSurfaces] = useState<PaintedSurface[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draftPoints, setDraftPoints] = useState<Point[]>([]);
  const [drawingPolygon, setDrawingPolygon] = useState(false);
  const [dragAnchor, setDragAnchor] = useState<DragAnchor>(null);
  const [selectedColor, setSelectedColor] = useState<PaintColor>(COLORS[3]);
  const [viewMode, setViewMode] = useState<ViewMode>('after');
  const [compareAt, setCompareAt] = useState(50);
  const [coverageRate, setCoverageRate] = useState(8);
  const [customer, setCustomer] = useState<Customer>(DEFAULT_CUSTOMER);
  const [category, setCategory] = useState<'interior' | 'exterior'>('interior');
  const [status, setStatus] = useState('Aloita lataamalla huoneen tai rakennuksen kuva.');
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedSurface = surfaces.find((surface) => surface.id === selectedId) ?? null;
  const areaM2 = useMemo(() => totalArea(surfaces), [surfaces]);
  const paintLitres = useMemo(() => {
    if (!coverageRate) return 0;
    return surfaces.reduce((sum, surface) => sum + ((surface.areaM2 || 0) * Math.max(1, surface.coats || 1)) / coverageRate, 0);
  }, [coverageRate, surfaces]);

  const renderPreview = useCallback(() => {
    const image = imageRef.current;
    const canvas = previewCanvasRef.current;
    if (!image || !canvas || !size.width || !size.height) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = size.width;
    canvas.height = size.height;
    context.clearRect(0, 0, size.width, size.height);
    context.drawImage(image, 0, 0, size.width, size.height);

    for (const surface of surfaces) {
      if (surface.points.length < 3) continue;
      const pts = pointsToCanvas(surface.points, size.width, size.height);
      context.save();
      context.beginPath();
      context.moveTo(pts[0].x, pts[0].y);
      pts.slice(1).forEach((point) => context.lineTo(point.x, point.y));
      context.closePath();
      context.clip();

      context.globalCompositeOperation = 'multiply';
      context.globalAlpha = surface.opacity;
      context.fillStyle = surface.color.hex;
      context.fillRect(0, 0, size.width, size.height);

      context.globalCompositeOperation = 'source-over';
      context.globalAlpha = 0.08;
      context.fillStyle = surface.color.hex;
      context.fillRect(0, 0, size.width, size.height);
      context.restore();
    }
  }, [size.height, size.width, surfaces]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  useEffect(() => () => {
    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  const eventPoint = (event: ReactPointerEvent<SVGSVGElement>): Point | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
    };
  };

  const loadImage = (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setStatus('Käytä JPG-, PNG- tai WebP-kuvaa.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setStatus('Kuva on liian suuri. Enimmäiskoko on 12 Mt.');
      return;
    }
    if (imageUrl?.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    setSourceFile(file);
    setImageUrl(URL.createObjectURL(file));
    setSurfaces([]);
    setSelectedId(null);
    setDraftPoints([]);
    setDrawingPolygon(false);
    setSubmitted(false);
    setStatus('Kuva ladattu. Valitse “Piirrä seinä” ja klikkaa pinnan kulmapisteet.');
  };

  const onImageLoad = () => {
    const image = imageRef.current;
    if (!image) return;
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    setSize({
      width: Math.max(1, Math.round(image.naturalWidth * scale)),
      height: Math.max(1, Math.round(image.naturalHeight * scale)),
    });
  };

  const beginPolygon = () => {
    setDrawingPolygon(true);
    setDraftPoints([]);
    setSelectedId(null);
    setStatus('Klikkaa seinän kulmat järjestyksessä. Sulje muoto napsauttamalla ensimmäistä pistettä tai paina “Sulje pinta”.');
  };

  const closePolygon = () => {
    if (draftPoints.length < 3) {
      setStatus('Pinta tarvitsee vähintään kolme kulmapistettä.');
      return;
    }
    const surface: PaintedSurface = {
      id: uid(),
      name: `Pinta ${surfaces.length + 1}`,
      points: draftPoints,
      color: selectedColor,
      opacity: 0.76,
      areaM2: 0,
      coats: 2,
    };
    setSurfaces((current) => [...current, surface]);
    setSelectedId(surface.id);
    setDrawingPolygon(false);
    setDraftPoints([]);
    setStatus('Pinta luotu. Vedä ankkuripisteitä tarkentaaksesi rajoja ja valitse väri.');
  };

  const handleSvgPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drawingPolygon) return;
    const point = eventPoint(event);
    if (!point) return;

    const rect = svgRef.current?.getBoundingClientRect();
    const first = draftPoints[0];
    if (first && draftPoints.length >= 3 && rect) {
      const dx = (point.x - first.x) * rect.width;
      const dy = (point.y - first.y) * rect.height;
      if (Math.hypot(dx, dy) < 22) {
        closePolygon();
        return;
      }
    }
    setDraftPoints((current) => [...current, point]);
  };

  const handleSvgPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragAnchor) return;
    const point = eventPoint(event);
    if (!point) return;
    setSurfaces((current) => current.map((surface) => {
      if (surface.id !== dragAnchor.surfaceId) return surface;
      const points = surface.points.map((item, index) => (index === dragAnchor.pointIndex ? point : item));
      return { ...surface, points };
    }));
  };

  const setColor = (color: PaintColor) => {
    setSelectedColor(color);
    if (!selectedId) return;
    setSurfaces((current) => current.map((surface) => (surface.id === selectedId ? { ...surface, color } : surface)));
    setStatus(`${color.name} · ${color.ral} lisättiin valittuun pintaan.`);
  };

  const updateSurface = (patch: Partial<PaintedSurface>) => {
    if (!selectedId) return;
    setSurfaces((current) => current.map((surface) => (surface.id === selectedId ? { ...surface, ...patch } : surface)));
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setSurfaces((current) => current.filter((surface) => surface.id !== selectedId));
    setSelectedId(null);
    setStatus('Valittu pinta poistettiin.');
  };

  const resetDesign = () => {
    setSurfaces([]);
    setDraftPoints([]);
    setSelectedId(null);
    setDrawingPolygon(false);
    setStatus('Kaikki maalatut pinnat tyhjennettiin.');
  };

  const beforeCanvas = () => {
    const image = imageRef.current;
    if (!image || !size.width || !size.height) throw new Error('Lataa kuva ensin.');
    const canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    canvas.getContext('2d')?.drawImage(image, 0, 0, size.width, size.height);
    return canvas;
  };

  const buildPdf = async () => {
    const before = beforeCanvas();
    const after = previewCanvasRef.current;
    if (!after) throw new Error('Esikatselu ei ole valmis.');
    const colorLines = surfaces.map((surface) => `${surface.name}: ${surface.color.name} · ${surface.color.ral} · ${surface.color.hex}`);
    const coverageLines = [
      `Entered paintable area: ${areaM2.toFixed(1)} m2`,
      `Assumed coverage: ${coverageRate.toFixed(1)} m2/litre/coat`,
      `Estimated paint: ${paintLitres.toFixed(1)} litres`,
      'Final material quantity must be verified on site.',
    ];
    return createPainterSummaryPdf({
      title: 'Maalaus Multivari · Virtual House Painter Order Summary',
      customerLines: [
        `Customer: ${customer.name || '-'}`,
        `Email: ${customer.email || '-'}`,
        `Phone: ${customer.phone || '-'}`,
        `Address: ${customer.address || '-'}, ${customer.city || '-'}`,
      ],
      colorLines,
      coverageLines,
      beforeDataUrl: before.toDataURL('image/jpeg', 0.84),
      afterDataUrl: after.toDataURL('image/jpeg', 0.84),
    });
  };

  const downloadPdf = async () => {
    if (!imageUrl || !surfaces.length) {
      setStatus('Lataa kuva ja luo vähintään yksi maalattava pinta ennen PDF-yhteenvetoa.');
      return;
    }
    setBusy(true);
    try {
      const pdf = await buildPdf();
      downloadBlob(pdf, `varikamu-order-${Date.now()}.pdf`);
      setStatus('PDF-yhteenveto luotiin ja ladattiin.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'PDF:n luonti epäonnistui.');
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!sourceFile || !surfaces.length) {
      setStatus('Lataa kuva ja luo vähintään yksi pinta.');
      return;
    }
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim() || !customer.city.trim()) {
      setStatus('Täytä nimi, sähköposti, puhelin ja kaupunki ennen lähettämistä.');
      return;
    }
    const after = previewCanvasRef.current;
    if (!after) return;

    setBusy(true);
    setStatus('Luodaan PDF ja lähetetään suunnitelma urakoitsijalle…');
    try {
      const before = beforeCanvas();
      const [beforeBlob, afterBlob, pdfBlob] = await Promise.all([
        canvasBlob(before),
        canvasBlob(after),
        buildPdf(),
      ]);
      const summaryText = surfaces.map((surface) => (
        `${surface.name}: ${surface.color.name} (${surface.color.ral}, ${surface.color.hex}), ${surface.areaM2 || 0} m², ${surface.coats} kerrosta`
      )).join('\n');

      const result = await submitPainterOrder({
        customer,
        category,
        polygons: surfaces.map((surface) => ({
          id: surface.id,
          name: surface.name,
          points: surface.points,
          color: surface.color,
          opacity: surface.opacity,
          areaM2: surface.areaM2,
          coats: surface.coats,
        })),
        totalAreaM2: areaM2,
        totalPaintLitres: paintLitres,
        summaryText: `VäriKamu Virtual House Painter\n${summaryText}\nArvioitu maalimäärä: ${paintLitres.toFixed(1)} l`,
        originalFile: sourceFile,
        beforeBlob,
        afterBlob,
        pdfBlob,
      });
      setSubmitted(true);
      setStatus(result.emailDelivered
        ? 'Suunnitelma, PDF ja kuvat lähetettiin onnistuneesti.'
        : 'Suunnitelma tallennettiin hallintajärjestelmään. Sähköpostivahvistus ei onnistunut.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Tilauksen lähetys epäonnistui.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-3 py-4 sm:px-5 lg:px-7">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-4 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-600">VäriKamu · Virtual House Painter</p>
              <h1 className="mt-1 font-display text-2xl font-black text-navy-950 sm:text-3xl">Suunnittele maalaus täsmällisesti omalla kuvallasi</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">1. Lataa kuva · 2. Rajaa pinta kulmapisteillä · 3. Valitse RAL-väri · 4. Tarkista realistinen valo ja tekstuuri · 5. Luo PDF ja lähetä urakoitsijalle.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn-outline" onClick={() => cameraInputRef.current?.click()}><Camera className="size-4" /> Ota kuva</button>
              <button className="btn-primary" onClick={() => fileInputRef.current?.click()}><Upload className="size-4" /> Lataa kuva</button>
              <input ref={cameraInputRef} hidden type="file" accept="image/*" capture="environment" onChange={(event) => loadImage(event.target.files?.[0])} />
              <input ref={fileInputRef} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => loadImage(event.target.files?.[0])} />
            </div>
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="space-y-4">
            <div className="card overflow-hidden p-2 sm:p-4">
              {!imageUrl ? (
                <button onClick={() => fileInputRef.current?.click()} className="grid min-h-[58vh] w-full place-items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-orange-400 hover:bg-orange-50/40">
                  <span><PaintBucket className="mx-auto size-14 text-orange-500" /><strong className="mt-4 block text-xl text-navy-950">Lataa kuva aloittaaksesi</strong><span className="mt-2 block text-sm text-slate-500">Korkealaatuinen JPG, PNG tai WebP · enintään 12 Mt</span></span>
                </button>
              ) : (
                <>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <button className={drawingPolygon ? 'btn-primary' : 'btn-outline'} onClick={beginPolygon}><MousePointer2 className="size-4" /> Piirrä seinä / pinta</button>
                    {drawingPolygon && <button className="btn-primary" disabled={draftPoints.length < 3} onClick={closePolygon}>Sulje pinta</button>}
                    <button className="btn-outline" onClick={resetDesign}><RotateCcw className="size-4" /> Tyhjennä</button>
                    <div className="ml-auto flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-bold">
                      {(['before', 'after', 'compare'] as ViewMode[]).map((mode) => <button key={mode} onClick={() => setViewMode(mode)} className={`rounded-lg px-3 py-2 ${viewMode === mode ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'}`}>{mode === 'before' ? 'Ennen' : mode === 'after' ? 'Jälkeen' : 'Vertaa'}</button>)}
                    </div>
                  </div>

                  <div className="relative mx-auto max-h-[68dvh] overflow-hidden rounded-2xl bg-slate-950" style={{ aspectRatio: size.width && size.height ? `${size.width}/${size.height}` : '4/3' }}>
                    <img ref={imageRef} src={imageUrl} onLoad={onImageLoad} alt="Maalauskohde" className="absolute inset-0 h-full w-full object-contain" />
                    <canvas ref={previewCanvasRef} className="absolute inset-0 h-full w-full object-contain transition-[clip-path] duration-300" style={{ opacity: viewMode === 'before' ? 0 : 1, clipPath: viewMode === 'compare' ? `inset(0 ${100 - compareAt}% 0 0)` : 'inset(0)' }} />
                    <svg
                      ref={svgRef}
                      viewBox="0 0 1000 1000"
                      preserveAspectRatio="none"
                      className="absolute inset-0 h-full w-full touch-none"
                      onPointerDown={handleSvgPointerDown}
                      onPointerMove={handleSvgPointerMove}
                      onPointerUp={() => setDragAnchor(null)}
                      onPointerCancel={() => setDragAnchor(null)}
                    >
                      {surfaces.map((surface) => {
                        const points = surface.points.map((point) => `${point.x * 1000},${point.y * 1000}`).join(' ');
                        const active = surface.id === selectedId;
                        return (
                          <g key={surface.id}>
                            <polygon
                              points={points}
                              fill={surface.color.hex}
                              fillOpacity={viewMode === 'before' ? 0 : 0.12}
                              stroke={active ? '#F97316' : '#FFFFFF'}
                              strokeWidth={active ? 6 : 3}
                              vectorEffect="non-scaling-stroke"
                              className="cursor-pointer"
                              onPointerDown={(event) => { event.stopPropagation(); setSelectedId(surface.id); setDrawingPolygon(false); }}
                            />
                            {active && surface.points.map((point, index) => (
                              <circle
                                key={`${surface.id}-${index}`}
                                cx={point.x * 1000}
                                cy={point.y * 1000}
                                r={13}
                                fill="#FFFFFF"
                                stroke="#F97316"
                                strokeWidth={5}
                                vectorEffect="non-scaling-stroke"
                                className="cursor-move"
                                onPointerDown={(event) => { event.stopPropagation(); setDragAnchor({ surfaceId: surface.id, pointIndex: index }); event.currentTarget.setPointerCapture(event.pointerId); }}
                              />
                            ))}
                          </g>
                        );
                      })}
                      {drawingPolygon && draftPoints.length > 0 && (
                        <g>
                          <polyline points={draftPoints.map((point) => `${point.x * 1000},${point.y * 1000}`).join(' ')} fill="none" stroke="#F97316" strokeWidth={5} vectorEffect="non-scaling-stroke" />
                          {draftPoints.map((point, index) => <circle key={index} cx={point.x * 1000} cy={point.y * 1000} r={index === 0 ? 16 : 11} fill={index === 0 ? '#F97316' : '#FFFFFF'} stroke="#F97316" strokeWidth={4} vectorEffect="non-scaling-stroke" />)}
                        </g>
                      )}
                    </svg>
                  </div>
                  {viewMode === 'compare' && <label className="mt-3 block text-sm font-semibold text-slate-600">Ennen / jälkeen {compareAt}%<input className="mt-1 w-full" type="range" min="0" max="100" value={compareAt} onChange={(event) => setCompareAt(Number(event.target.value))} /></label>}
                </>
              )}
            </div>

            <div className={`rounded-2xl border px-4 py-3 text-sm ${submitted ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-700'}`}>
              <div className="flex items-start gap-2">{submitted && <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}<span>{status}</span></div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between"><h2 className="font-bold text-navy-950">1 · Maalattavat pinnat</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">{surfaces.length}</span></div>
              <div className="mt-3 space-y-2">
                {surfaces.map((surface) => <button key={surface.id} onClick={() => { setSelectedId(surface.id); setDrawingPolygon(false); }} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${surface.id === selectedId ? 'border-orange-400 bg-orange-50' : 'border-slate-200 bg-white'}`}><span className="size-7 rounded-lg border shadow-inner" style={{ backgroundColor: surface.color.hex }} /><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{surface.name}</strong><span className="text-xs text-slate-500">{surface.color.ral} · {surface.areaM2 || 0} m²</span></span></button>)}
              </div>
              <button className="btn-outline mt-3 w-full" onClick={beginPolygon}><Plus className="size-4" /> Lisää pinta</button>
              {selectedSurface && <div className="mt-4 space-y-3 border-t border-slate-100 pt-4"><input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={selectedSurface.name} onChange={(event) => updateSurface({ name: event.target.value })} /><div className="grid grid-cols-2 gap-2"><label className="text-xs font-bold text-slate-600">Pinta-ala m²<input type="number" min="0" step="0.1" className="mt-1 w-full rounded-lg border px-2 py-2" value={selectedSurface.areaM2 || ''} onChange={(event) => updateSurface({ areaM2: Number(event.target.value) || 0 })} /></label><label className="text-xs font-bold text-slate-600">Maalikerrokset<input type="number" min="1" max="5" className="mt-1 w-full rounded-lg border px-2 py-2" value={selectedSurface.coats} onChange={(event) => updateSurface({ coats: Math.max(1, Number(event.target.value) || 1) })} /></label></div><label className="block text-xs font-bold text-slate-600">Värin voimakkuus {Math.round(selectedSurface.opacity * 100)}%<input className="mt-1 w-full" type="range" min="0.35" max="0.95" step="0.01" value={selectedSurface.opacity} onChange={(event) => updateSurface({ opacity: Number(event.target.value) })} /></label><button className="flex items-center gap-2 text-sm font-bold text-red-600" onClick={deleteSelected}><Trash2 className="size-4" /> Poista valittu pinta</button></div>}
            </div>

            <div className="card p-4">
              <h2 className="font-bold text-navy-950">2 · Digitaalinen väripaletti</h2>
              <p className="mt-1 text-xs text-slate-500">Väri sekoitetaan kuvan alkuperäiseen tekstuuriin multiply-tilassa, jotta varjot ja luonnollinen valo säilyvät.</p>
              <div className="mt-3 grid grid-cols-3 gap-2">{COLORS.map((color) => <button key={color.ral} title={`${color.name} ${color.ral} ${color.hex}`} onClick={() => setColor(color)} className={`rounded-xl border p-2 text-left transition hover:-translate-y-0.5 hover:shadow ${selectedColor.ral === color.ral ? 'border-orange-500 ring-2 ring-orange-100' : 'border-slate-200'}`}><span className="block h-10 rounded-lg border" style={{ backgroundColor: color.hex }} /><strong className="mt-1 block truncate text-[11px]">{color.ral}</strong><span className="block truncate text-[10px] text-slate-500">{color.hex}</span></button>)}</div>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs"><strong>{selectedColor.name}</strong><br />{selectedColor.ral} · {selectedColor.hex}</div>
            </div>

            <div className="card p-4">
              <h2 className="font-bold text-navy-950">3 · Peittoarvio</h2>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm"><div className="rounded-xl bg-slate-50 p-3"><span className="text-xs text-slate-500">Pinta-ala</span><strong className="block text-lg">{areaM2.toFixed(1)} m²</strong></div><div className="rounded-xl bg-slate-50 p-3"><span className="text-xs text-slate-500">Arvioitu maali</span><strong className="block text-lg">{paintLitres.toFixed(1)} l</strong></div></div>
              <label className="mt-3 block text-xs font-bold text-slate-600">Peittokyky-oletus m²/l/kerros<input type="number" min="1" max="20" step="0.5" className="mt-1 w-full rounded-lg border px-3 py-2" value={coverageRate} onChange={(event) => setCoverageRate(Math.max(1, Number(event.target.value) || 8))} /></label>
              <p className="mt-2 text-[11px] text-slate-500">Arvio perustuu syöttämääsi pinta-alaan, kerrosmäärään ja peittokykyyn. Lopullinen materiaalimäärä tarkistetaan kohteessa.</p>
            </div>

            <div className="card p-4">
              <h2 className="font-bold text-navy-950">4 · Asiakas ja tilaus</h2>
              <div className="mt-3 grid gap-2">{(['name', 'email', 'phone', 'address', 'city'] as (keyof Customer)[]).map((field) => <input key={field} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder={field === 'name' ? 'Nimi *' : field === 'email' ? 'Sähköposti *' : field === 'phone' ? 'Puhelin *' : field === 'address' ? 'Osoite' : 'Kaupunki *'} type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} value={customer[field]} onChange={(event) => setCustomer((current) => ({ ...current, [field]: event.target.value }))} />)}
                <select className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" value={category} onChange={(event) => setCategory(event.target.value as 'interior' | 'exterior')}><option value="interior">Sisämaalaus</option><option value="exterior">Ulkomaalaus</option></select>
              </div>
              <button className="btn-outline mt-3 w-full" disabled={busy} onClick={() => void downloadPdf()}><FileText className="size-4" /> Luo ja lataa PDF</button>
              <button className="btn-primary mt-2 w-full" disabled={busy} onClick={() => void submit()}><Send className="size-4" /> {busy ? 'Käsitellään…' : 'Lähetä urakoitsijalle'}</button>
              <p className="mt-2 text-[11px] text-slate-500">Lähetys tallentaa suunnitelman, ennen/jälkeen-kuvat, värikoodit ja PDF-yhteenvedon asiakas- ja tarjousjärjestelmään.</p>
            </div>

            <button className="btn-outline w-full" disabled={!imageUrl} onClick={() => { const canvas = previewCanvasRef.current; if (!canvas) return; const link = document.createElement('a'); link.download = `varikamu-preview-${Date.now()}.jpg`; link.href = canvas.toDataURL('image/jpeg', 0.92); link.click(); }}><Download className="size-4" /> Lataa maalattu kuva</button>
          </aside>
        </div>
      </div>
    </section>
  );
}
