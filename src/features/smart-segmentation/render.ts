import type { SurfaceMask } from './types';

const clamp = (value: number, min = 0, max = 255) => Math.max(min, Math.min(max, value));

function hexToRgb(hex: string) {
  const value = Number.parseInt(hex.replace('#', ''), 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

export function renderSurfaceMasks(source: ImageData, masks: SurfaceMask[]): ImageData {
  const output = new ImageData(new Uint8ClampedArray(source.data), source.width, source.height);

  for (const mask of masks) {
    if (!mask.visible || mask.width !== source.width || mask.height !== source.height) continue;
    const target = hexToRgb(mask.color);

    for (let i = 0; i < mask.data.length; i += 1) {
      if (!mask.data[i]) continue;
      const p = i * 4;
      const sourceLuma = (source.data[p] * 0.299 + source.data[p + 1] * 0.587 + source.data[p + 2] * 0.114) / 255;
      const shade = 0.55 + sourceLuma * 0.65;
      const alpha = mask.opacity * (mask.data[i] / 255);
      const r = clamp(target.r * shade);
      const g = clamp(target.g * shade);
      const b = clamp(target.b * shade);
      output.data[p] = Math.round(source.data[p] * (1 - alpha) + r * alpha);
      output.data[p + 1] = Math.round(source.data[p + 1] * (1 - alpha) + g * alpha);
      output.data[p + 2] = Math.round(source.data[p + 2] * (1 - alpha) + b * alpha);
    }
  }

  return output;
}
