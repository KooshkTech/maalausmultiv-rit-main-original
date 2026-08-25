import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, RotateCcw, Undo2 } from 'lucide-react';
import { commonColors, plannerSurfaces } from '@/data/paintPlanner';
import type { SurfaceSelection } from '@/lib/paintPlannerEngine';

type Props = {
  file: File | null;
  selections: SurfaceSelection[];
  onChange: (next: SurfaceSelection[]) => void;
};

export function PhotoColorEditor({ file, selections, onChange }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState(selections[0]?.surfaceKey ?? '');
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([]);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!file) {
      setImageUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!selections.some((selection) => selection.surfaceKey === activeKey)) {
      setActiveKey(selections[0]?.surfaceKey ?? '');
      setPoints([]);
    }
  }, [selections, activeKey]);

  const active = selections.find((selection) => selection.surfaceKey === activeKey);
  const activeLabel = useMemo(() => plannerSurfaces.find((surface) => surface.key === activeKey)?.label ?? '', [activeKey]);

  const clickImage = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!activeKey) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setPoints((current) => [...current, { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }]);
  };

  const savePolygon = () => {
    if (!activeKey || points.length < 3) return;
    onChange(selections.map((selection) => selection.surfaceKey === activeKey ? { ...selection, polygon: points } : selection));
    setPoints([]);
  };

  const setColor = (surfaceKey: string, colorHex: string) => {
    onChange(selections.map((selection) => selection.surfaceKey === surfaceKey ? { ...selection, colorHex } : selection));
  };

  const clearActivePolygon = () => {
    onChange(selections.map((selection) => selection.surfaceKey === activeKey ? { ...selection, polygon: undefined } : selection));
    setPoints([]);
  };

  const downloadDesign = async () => {
    const image = imageRef.current;
    if (!image) return;
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    selections.forEach((selection) => {
      if (!selection.polygon || selection.polygon.length < 3) return;
      context.save();
      context.globalAlpha = 0.58;
      context.globalCompositeOperation = 'multiply';
      context.fillStyle = selection.colorHex;
      context.beginPath();
      selection.polygon.forEach((point, index) => {
        const x = (point.x / 100) * canvas.width;
        const y = (point.y / 100) * canvas.height;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.fill();
      context.restore();
    });
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png', 0.95));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `maalaus-design-${Date.now()}.png`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!imageUrl) {
    return <div className="rounded-2xl border border-dashed border-navy-200 bg-navy-50/50 p-8 text-center text-sm text-navy-500">Lataa kuva nähdäksesi värisuunnittelijan.</div>;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-navy-100 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-navy-900">Merkitse maalattava alue</p>
            <p className="text-xs text-navy-500">Valitse pinta ja napauta vähintään kolme pistettä kuvan ympäriltä. Tämä on suunnitteluvisualisointi, ei värintarkka valokuvasimulaatio.</p>
          </div>
          <button type="button" onClick={downloadDesign} className="btn-outline !px-4 !py-2"><Download className="h-4 w-4" />Lataa kuva</button>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {selections.map((selection) => {
            const label = plannerSurfaces.find((surface) => surface.key === selection.surfaceKey)?.label ?? selection.surfaceKey;
            return <button key={selection.surfaceKey} type="button" onClick={() => { setActiveKey(selection.surfaceKey); setPoints([]); }} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${activeKey === selection.surfaceKey ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-navy-200 bg-white text-navy-700'}`}>{label}</button>;
          })}
        </div>

        <div className="relative overflow-hidden rounded-xl bg-navy-900" onClick={clickImage} role="button" tabIndex={0} aria-label="Lisää alueen piste napauttamalla kuvaa">
          <img ref={imageRef} src={imageUrl} alt="Asiakkaan lataama maalattava kohde" className="block w-full object-contain" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            {selections.map((selection) => selection.polygon && selection.polygon.length >= 3 ? (
              <polygon key={selection.surfaceKey} points={selection.polygon.map((p) => `${p.x},${p.y}`).join(' ')} fill={selection.colorHex} fillOpacity="0.58" style={{ mixBlendMode: 'multiply' }} stroke="white" strokeWidth="0.35" />
            ) : null)}
            {points.length > 0 && <polyline points={points.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="white" strokeWidth="0.45" strokeDasharray="1.2 0.8" />}
            {points.map((point, index) => <circle key={`${point.x}-${point.y}-${index}`} cx={point.x} cy={point.y} r="0.8" fill="white" stroke="#fb5e11" strokeWidth="0.35" />)}
          </svg>
        </div>

        {active && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-bold text-navy-700">{activeLabel}:</span>
            {commonColors.slice(0, 8).map((color) => <button key={color.hex} type="button" onClick={() => setColor(active.surfaceKey, color.hex)} className={`h-9 w-9 rounded-full border-2 shadow-sm ${active.colorHex === color.hex ? 'border-orange-500' : 'border-white'}`} style={{ backgroundColor: color.hex }} aria-label={`${color.name} ${color.hex}`} title={color.name} />)}
            <input type="color" value={active.colorHex} onChange={(e) => setColor(active.surfaceKey, e.target.value)} className="h-9 w-11 cursor-pointer rounded-lg border border-navy-200 bg-white p-1" aria-label="Valitse oma väri" />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={points.length < 3} onClick={savePolygon} className="btn-primary !px-4 !py-2 disabled:cursor-not-allowed disabled:opacity-40">Tallenna alue</button>
          <button type="button" disabled={points.length === 0} onClick={() => setPoints((current) => current.slice(0, -1))} className="btn-outline !px-4 !py-2 disabled:opacity-40"><Undo2 className="h-4 w-4" />Peru piste</button>
          <button type="button" onClick={clearActivePolygon} className="btn-outline !px-4 !py-2"><RotateCcw className="h-4 w-4" />Tyhjennä pinta</button>
        </div>
      </div>
    </div>
  );
}
