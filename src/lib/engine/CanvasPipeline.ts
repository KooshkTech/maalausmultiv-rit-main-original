import { MaskLayer } from './MaskLayer';
import type { CleaningParams, IRenderPipeline, PaintParams, RenderSize } from './types';

// Coats describe paint build-up. The coverage slider remains the final authority:
// 0% = original image and 100% + 3 coats = visually complete chosen pigment.
const COAT_BUILD: Record<1 | 2 | 3, number> = { 1: 0.72, 2: 0.90, 3: 1 };
const clamp = (v: number) => Math.max(0, Math.min(255, v));
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

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
    const coverage = clamp01(params.opacity ?? 1);
    const coatBuild = COAT_BUILD[params.coat];

    for (let y = 0; y < source.height; y += 1) {
      const row = y * source.width;
      for (let x = 0; x < source.width; x += 1) {
        const idx = row + x;
        const maskAlpha = mask.alpha[idx] / 255;
        if (maskAlpha <= 0 || coverage <= 0) continue;

        const p = idx * 4;
        const r = source.data[p];
        const g = source.data[p + 1];
        const b = source.data[p + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const ln = lum / 255;

        // Strong-pigment rendering: the chosen colour owns the hue/chroma while
        // only a restrained amount of the original luminance is retained as
        // photographic wall texture. This avoids the old pale/blue washed-out look.
        // Dark texture remains visible, while highlights no longer bleach the pigment.
        const textureShade = Math.max(0.80, Math.min(1.02, 0.80 + 0.22 * ln));
        const targetR = clamp(tr * textureShade);
        const targetG = clamp(tg * textureShade);
        const targetB = clamp(tb * textureShade);

        // 100% + 3x Valmis means complete selected colour. Lower coverage/coats
        // blend progressively with the original image for preview purposes.
        let alpha = clamp01(maskAlpha * coverage * coatBuild);
        if (coverage >= 0.95 && params.coat === 3 && maskAlpha >= 0.95) alpha = Math.max(alpha, 0.98);

        data[p] = clamp(targetR * alpha + r * (1 - alpha));
        data[p + 1] = clamp(targetG * alpha + g * (1 - alpha));
        data[p + 2] = clamp(targetB * alpha + b * (1 - alpha));
      }
    }

    this.ctx.putImageData(output, 0, 0);
  }

  applyCleaningMask(mask: MaskLayer, params: CleaningParams): void {
    const source = this.requireBase();
    this.assertMask(mask);
    const output = new ImageData(new Uint8ClampedArray(source.data), source.width, source.height);
    const data = output.data;
    const intensity = clamp01(params.intensity);
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
    if (mask.width !== this.canvas.width || mask.height !== this.canvas.height) {
      throw new Error('Mask dimensions must match the render surface.');
    }
  }
}
