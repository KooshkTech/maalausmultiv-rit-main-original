import { MaskLayer } from './MaskLayer';
import type { CleaningParams, IRenderPipeline, PaintParams, RenderSize } from './types';

const COAT_ALPHA: Record<1 | 2 | 3, number> = { 1: 0.45, 2: 0.75, 3: 0.95 };
const clamp = (v: number) => Math.max(0, Math.min(255, v));

export class CanvasPipeline implements IRenderPipeline {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private baseImageData: ImageData | null = null;

  constructor(canvas?: HTMLCanvasElement) {
    this.canvas = canvas ?? document.createElement('canvas');
    const ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('2D canvas is unavailable.');
    this.ctx = ctx;
  }

  setSize(size: RenderSize): void {
    this.canvas.width = size.width;
    this.canvas.height = size.height;
  }

  renderBaseImage(image: CanvasImageSource): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    this.baseImageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  applyPaintMask(mask: MaskLayer, params: PaintParams): void {
    const source = this.requireBase();
    this.assertMask(mask);
    const output = new ImageData(new Uint8ClampedArray(source.data), source.width, source.height);
    const data = output.data;
    const [tr, tg, tb] = params.tint;
    const coatAlpha = COAT_ALPHA[params.coat] * (params.opacity ?? 1);

    for (let y = 0; y < source.height; y += 1) {
      const row = y * source.width;
      for (let x = 0; x < source.width; x += 1) {
        const idx = row + x;
        const maskAlpha = mask.alpha[idx] / 255;
        if (maskAlpha <= 0) continue;
        const p = idx * 4;
        const r = source.data[p], g = source.data[p + 1], b = source.data[p + 2];
        const ln = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const shade = 0.35 + 0.65 * ln;
        const alpha = Math.max(0, Math.min(1, coatAlpha * maskAlpha));
        data[p] = clamp(tr * shade * alpha + r * (1 - alpha));
        data[p + 1] = clamp(tg * shade * alpha + g * (1 - alpha));
        data[p + 2] = clamp(tb * shade * alpha + b * (1 - alpha));
      }
    }

    this.ctx.putImageData(output, 0, 0);
  }

  applyCleaningMask(mask: MaskLayer, params: CleaningParams): void {
    const source = this.requireBase();
    this.assertMask(mask);
    const output = new ImageData(new Uint8ClampedArray(source.data), source.width, source.height);
    const data = output.data;
    const intensity = Math.max(0, Math.min(1, params.intensity));
    const qualityScale = params.quality === 'final' ? 1 : 0.82;

    for (let y = 0; y < source.height; y += 1) {
      const row = y * source.width;
      for (let x = 0; x < source.width; x += 1) {
        const idx = row + x;
        const maskAlpha = mask.alpha[idx] / 255;
        if (maskAlpha <= 0) continue;
        const p = idx * 4;
        const local = intensity * maskAlpha * qualityScale;
        for (let c = 0; c < 3; c += 1) {
          const orig = source.data[p + c];
          const cleaned = clamp(orig + (128 - orig) * (0.25 * local) + 15 * local);
          data[p + c] = clamp(orig * (1 - maskAlpha) + cleaned * maskAlpha);
        }
      }
    }

    this.ctx.putImageData(output, 0, 0);
  }

  exportFinalImage(type: 'image/jpeg' | 'image/png' = 'image/jpeg', quality = 0.92): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Image export failed.')), type, quality);
    });
  }

  getCanvas(): HTMLCanvasElement { return this.canvas; }

  private requireBase(): ImageData {
    if (!this.baseImageData) throw new Error('renderBaseImage must be called before applying an effect.');
    return this.baseImageData;
  }

  private assertMask(mask: MaskLayer): void {
    if (mask.width !== this.canvas.width || mask.height !== this.canvas.height) throw new Error('Mask dimensions must match the render surface.');
  }
}
