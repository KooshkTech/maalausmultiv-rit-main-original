import { MaskLayer } from '@/lib/engine/MaskLayer';

export interface SegmentPoint { x: number; y: number }
export interface SegmentRequest {
  imageId: string;
  image: ImageData;
  point: SegmentPoint;
  tolerance?: number;
  signal?: AbortSignal;
}

export interface SegmentResult {
  mask: MaskLayer;
  source: 'remote-sam' | 'local-fallback';
  latencyMs: number;
}

interface RemoteResponse { width: number; height: number; rle: number[] }

const cache = new Map<string, { mask: MaskLayer; source: SegmentResult['source'] }>();
const keyOf = (r: SegmentRequest) => `${r.imageId}:${Math.round(r.point.x)}:${Math.round(r.point.y)}:${r.tolerance ?? 32}`;

export class SegmentationProvider {
  constructor(private readonly endpoint = '/api/segment-sam', private readonly timeoutMs = 4500) {}

  async segment(request: SegmentRequest): Promise<SegmentResult> {
    const key = keyOf(request);
    const cached = cache.get(key);
    if (cached) return { mask: cached.mask.clone(), source: cached.source, latencyMs: 0 };
    const started = performance.now();

    try {
      const mask = await this.remoteSam(request);
      cache.set(key, { mask: mask.clone(), source: 'remote-sam' });
      return { mask, source: 'remote-sam', latencyMs: performance.now() - started };
    } catch {
      const mask = localFloodFill(request.image, request.point, request.tolerance ?? 32);
      cache.set(key, { mask: mask.clone(), source: 'local-fallback' });
      return { mask, source: 'local-fallback', latencyMs: performance.now() - started };
    }
  }

  private async remoteSam(request: SegmentRequest): Promise<MaskLayer> {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), this.timeoutMs);
    const abort = () => controller.abort();
    request.signal?.addEventListener('abort', abort, { once: true });
    try {
      const blob = await imageDataToBlob(request.image, 0.82, 1024);
      const body = new FormData();
      body.append('image', blob, 'candidate.jpg');
      body.append('x', String(request.point.x));
      body.append('y', String(request.point.y));
      const response = await fetch(this.endpoint, { method: 'POST', body, signal: controller.signal, credentials: 'same-origin' });
      if (!response.ok) throw new Error(`SAM request failed: ${response.status}`);
      const json = await response.json() as RemoteResponse;
      if (!json.width || !json.height || !Array.isArray(json.rle)) throw new Error('Invalid SAM response.');
      return MaskLayer.fromRle(json.width, json.height, json.rle);
    } finally {
      window.clearTimeout(timer);
      request.signal?.removeEventListener('abort', abort);
    }
  }
}

export function mergeManualAndSmart(manual: MaskLayer, smart: MaskLayer): MaskLayer {
  return manual.union(smart);
}

export function localFloodFill(image: ImageData, point: SegmentPoint, tolerance = 32): MaskLayer {
  const { width, height, data } = image;
  const sx = Math.max(0, Math.min(width - 1, Math.round(point.x)));
  const sy = Math.max(0, Math.min(height - 1, Math.round(point.y)));
  const seedIndex = sy * width + sx;
  const seed = seedIndex * 4;
  const sr = data[seed], sg = data[seed + 1], sb = data[seed + 2];
  const seedLum = luminance(sr, sg, sb);
  const tau = Math.max(12, Math.min(64, tolerance));
  const tau2 = tau * tau;
  const localTau2 = Math.pow(Math.max(10, tau * 0.72), 2);
  const edgeLumLimit = Math.max(16, 34 - tau * 0.18);
  const mask = new MaskLayer(width, height);
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0, count = 0;
  const maxPixels = Math.max(1200, Math.floor(width * height * 0.38));
  const maxDx = Math.max(48, Math.floor(width * 0.62));
  const maxDy = Math.max(48, Math.floor(height * 0.62));

  queue[tail++] = seedIndex;
  visited[seedIndex] = 1;

  while (head < tail && count < maxPixels) {
    const idx = queue[head++];
    const x = idx % width, y = (idx / width) | 0;
    if (Math.abs(x - sx) > maxDx || Math.abs(y - sy) > maxDy) continue;

    const p = idx * 4;
    const r = data[p], g = data[p + 1], b = data[p + 2];
    const dr = r - sr, dg = g - sg, db = b - sb;
    const seedDistance2 = dr * dr + dg * dg + db * db;
    const lum = luminance(r, g, b);
    if (seedDistance2 > tau2 || Math.abs(lum - seedLum) > Math.max(32, tau * 1.15)) continue;

    mask.alpha[idx] = 255;
    count += 1;

    if (x > 0) visit(idx, idx - 1);
    if (x + 1 < width) visit(idx, idx + 1);
    if (y > 0) visit(idx, idx - width);
    if (y + 1 < height) visit(idx, idx + width);
  }

  // A runaway region is worse than no Smart fill. Return an empty Smart mask;
  // the caller always keeps the user's manual stroke.
  if (count >= maxPixels) return new MaskLayer(width, height);
  return mask;

  function visit(from: number, next: number) {
    if (visited[next]) return;
    visited[next] = 1;
    const a = from * 4, b = next * 4;
    const dr = data[b] - data[a], dg = data[b + 1] - data[a + 1], db = data[b + 2] - data[a + 2];
    const localDistance2 = dr * dr + dg * dg + db * db;
    const lumA = luminance(data[a], data[a + 1], data[a + 2]);
    const lumB = luminance(data[b], data[b + 1], data[b + 2]);
    if (localDistance2 > localTau2 || Math.abs(lumA - lumB) > edgeLumLimit) return;

    // Simple structure guard: strong local gradient often means window/frame,
    // appliance, floor edge or trim boundary. Do not cross it in fallback mode.
    if (gradientMagnitude(next) > Math.max(42, 68 - tau * 0.45)) return;
    queue[tail++] = next;
  }

  function gradientMagnitude(index: number) {
    const x = index % width, y = (index / width) | 0;
    const left = Math.max(0, x - 1), right = Math.min(width - 1, x + 1);
    const up = Math.max(0, y - 1), down = Math.min(height - 1, y + 1);
    const li = (y * width + left) * 4, ri = (y * width + right) * 4;
    const ui = (up * width + x) * 4, di = (down * width + x) * 4;
    const gx = Math.abs(luminance(data[ri], data[ri + 1], data[ri + 2]) - luminance(data[li], data[li + 1], data[li + 2]));
    const gy = Math.abs(luminance(data[di], data[di + 1], data[di + 2]) - luminance(data[ui], data[ui + 1], data[ui + 2]));
    return gx + gy;
  }
}

function luminance(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

async function imageDataToBlob(image: ImageData, quality: number, maxSide: number): Promise<Blob> {
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const source = document.createElement('canvas');
  source.width = image.width; source.height = image.height;
  source.getContext('2d')!.putImageData(image, 0, 0);
  const target = document.createElement('canvas');
  target.width = Math.max(1, Math.round(image.width * scale));
  target.height = Math.max(1, Math.round(image.height * scale));
  target.getContext('2d')!.drawImage(source, 0, 0, target.width, target.height);
  return new Promise((resolve, reject) => target.toBlob((b) => b ? resolve(b) : reject(new Error('Image encode failed.')), 'image/jpeg', quality));
}
