import type { SurfaceMask } from './types';

export type MaskSnapshot = SurfaceMask[];

export function cloneMasks(masks: SurfaceMask[]): MaskSnapshot {
  return masks.map((mask) => ({ ...mask, data: new Uint8Array(mask.data) }));
}

export function pushMaskHistory(history: MaskSnapshot[], masks: SurfaceMask[], limit = 30): MaskSnapshot[] {
  return [...history, cloneMasks(masks)].slice(-limit);
}
