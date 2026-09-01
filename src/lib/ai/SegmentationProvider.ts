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

/**
 * Conservative deterministic fallback used only when semantic segmentation is
 * unavailable. It is intentionally biased toward doing too little rather than
 * crossing from a wall into glass, appliances, floors or furniture.
 */
export function localFloodFill(image: ImageData, point: SegmentPoint, tolerance = 32): MaskLayer {
  const { width, height, data } = image;
  const sx = Math.max(0, Math.min(width - 1, Math.round(point.x)));
  const sy = Math.max(0, Math.min(height - 1, Math.round(point.y)));
  const seedIndex = sy * width + sx;
  const seed = seedIndex * 4;
  const sr = data[seed], sg = data[seed + 1], sb = data[seed + 2];
  const seedLum = luminance(sr, sg, sb);
  const seedChrom = chroma(sr, sg, sb);

  // Smart-herkkyys still changes reach, but the fallback remains deliberately
  // narrower than before. A real SAM response may select a much larger wall.
  const tau = Math.max(14, Math.min(52, tolerance));
  const tau2 = Math.pow(tau * 0.88, 2);
  const localTau2 = Math.pow(Math.max(8, tau * 0.56), 2);
  const maxSeedLumDelta = Math.max(22, tau * 0.82);
  const edgeLumLimit = Math.max(11, 24 - tau * 0.12);
  const chromaLimit = Math.max(16, tau * 0.72);

  const mask = new MaskLayer(width, height);
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0, count = 0;

  // Local fallback must never be allowed to recolour most of the photograph.
  // Large surfaces can be built safely with additional user strokes; semantic
  // SAM is the path for one-shot full-wall selection.
  const maxPixels = Math.max(900, Math.floor(width * height * 0.26));
  const maxDx = Math.max(40, Math.floor(width * 0.50));
  const maxDy = Math.max(40, Math.floor(height * 0.48));

  let minX = sx, maxX = sx, minY = sy, maxY = sy;
  let touchedBottomBand = false;
  let touchedLeftBorder = false, touchedRightBorder = false, touchedTopBorder = false;

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
    const chr = chroma(r, g, b);

    if (seedDistance2 > tau2) continue;
    if (Math.abs(lum - seedLum) > maxSeedLumDelta) continue;
    if (Math.abs(chr - seedChrom) > chromaLimit) continue;

    mask.alpha[idx] = 255;
    count += 1;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    if (y >= height * 0.94 && sy < height * 0.82) touchedBottomBand = true;
    if (x <= 1) touchedLeftBorder = true;
    if (x >= width - 2) touchedRightBorder = true;
    if (y <= 1) touchedTopBorder = true;

    if (x > 0) visit(idx, idx - 1);
    if (x + 1 < width) visit(idx, idx + 1);
    if (y > 0) visit(idx, idx - width);
    if (y + 1 < height) visit(idx, idx + width);
  }

  const coverage = count / (width * height);
  const bboxCoverage = ((maxX - minX + 1) * (maxY - minY + 1)) / (width * height);
  const borderTouches = Number(touchedLeftBorder) + Number(touchedRightBorder) + Number(touchedTopBorder) + Number(touchedBottomBand);

  // Unsafe fallback masks are discarded completely. The editor always retains
  // the user's manual brush/roller stroke, so rejecting Smart never loses work.
  if (
    count >= maxPixels ||
    coverage > 0.27 ||
    bboxCoverage > 0.44 ||
    borderTouches >= 3 ||
    touchedBottomBand
  ) return new MaskLayer(width, height);

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

    // Strong gradients are typical at trim, window frames, furniture edges,
    // appliances and floor boundaries. The fallback may approach such an edge
    // but never cross it.
    if (gradientMagnitude(next) > Math.max(30, 50 - tau * 0.30)) return;

    // When the seed is clearly above the floor zone, do not let the fallback
    // creep into the bottom-most strip of the image even if colours are similar.
    const ny = (next / width) | 0;
    if (sy < height * 0.78 && ny > height * 0.94) return;

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

function chroma(r: number, g: number, b: number) {
  return Math.max(r, g, b) - Math.min(r, g, b);
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
