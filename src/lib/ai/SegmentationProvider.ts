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

const cache = new Map<string, MaskLayer>();
const keyOf = (r: SegmentRequest) => `${r.imageId}:${Math.round(r.point.x)}:${Math.round(r.point.y)}:${r.tolerance ?? 32}`;

export class SegmentationProvider {
  constructor(private readonly endpoint = '/api/segment-sam', private readonly timeoutMs = 4500) {}

  async segment(request: SegmentRequest): Promise<SegmentResult> {
    const key = keyOf(request);
    const cached = cache.get(key);
    if (cached) return { mask: cached.clone(), source: 'remote-sam', latencyMs: 0 };
    const started = performance.now();

    try {
      const mask = await this.remoteSam(request);
      cache.set(key, mask.clone());
      return { mask, source: 'remote-sam', latencyMs: performance.now() - started };
    } catch {
      const mask = localFloodFill(request.image, request.point, request.tolerance ?? 32);
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
  const seed = (sy * width + sx) * 4;
  const sr = data[seed], sg = data[seed + 1], sb = data[seed + 2];
  const tau2 = tolerance * tolerance;
  const mask = new MaskLayer(width, height);
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0;
  queue[tail++] = sy * width + sx;
  visited[sy * width + sx] = 1;

  while (head < tail) {
    const idx = queue[head++];
    const p = idx * 4;
    const dr = data[p] - sr, dg = data[p + 1] - sg, db = data[p + 2] - sb;
    if (dr * dr + dg * dg + db * db > tau2) continue;
    mask.alpha[idx] = 255;
    const x = idx % width, y = (idx / width) | 0;
    if (x > 0) push(idx - 1);
    if (x + 1 < width) push(idx + 1);
    if (y > 0) push(idx - width);
    if (y + 1 < height) push(idx + width);
  }
  return mask;

  function push(next: number) {
    if (visited[next]) return;
    visited[next] = 1;
    queue[tail++] = next;
  }
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
