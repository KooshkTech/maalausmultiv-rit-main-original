import type { MaskEditMode, SurfaceMask } from './types';

export function createSurfaceMask(width: number, height: number, color: string, name = 'Pinta'): SurfaceMask {
  return {
    id: crypto.randomUUID(),
    name,
    color,
    opacity: 0.72,
    visible: true,
    width,
    height,
    data: new Uint8Array(width * height),
  };
}

export function editMaskCircle(mask: SurfaceMask, x: number, y: number, radius: number, mode: MaskEditMode): SurfaceMask {
  const data = new Uint8Array(mask.data);
  const minX = Math.max(0, Math.floor(x - radius));
  const maxX = Math.min(mask.width - 1, Math.ceil(x + radius));
  const minY = Math.max(0, Math.floor(y - radius));
  const maxY = Math.min(mask.height - 1, Math.ceil(y + radius));
  const r2 = radius * radius;

  for (let py = minY; py <= maxY; py += 1) {
    for (let px = minX; px <= maxX; px += 1) {
      const dx = px - x;
      const dy = py - y;
      if (dx * dx + dy * dy <= r2) data[py * mask.width + px] = mode === 'add' ? 255 : 0;
    }
  }

  return { ...mask, data };
}

export function mergeMask(base: SurfaceMask, incoming: Uint8Array, mode: MaskEditMode = 'add'): SurfaceMask {
  if (incoming.length !== base.data.length) throw new Error('Mask dimensions do not match.');
  const data = new Uint8Array(base.data);
  for (let i = 0; i < data.length; i += 1) {
    if (!incoming[i]) continue;
    data[i] = mode === 'add' ? 255 : 0;
  }
  return { ...base, data };
}

export function maskCoverage(mask: SurfaceMask): number {
  if (!mask.data.length) return 0;
  let selected = 0;
  for (const value of mask.data) if (value) selected += 1;
  return selected / mask.data.length;
}
