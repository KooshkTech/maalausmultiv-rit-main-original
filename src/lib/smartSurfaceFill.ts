export type SmartPoint = { x: number; y: number };
export type SmartFillOptions = { tolerance?: number; edgeLock?: number; maxAreaRatio?: number };
export type SmartFillResult = { mask: Uint8Array; width: number; height: number; pixels: number; stopped: boolean };

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/** Browser-only, dependency-free surface selection. It never uploads the image or loads a model. */
export function selectSurface(source: CanvasImageSource, seeds: SmartPoint[], options: SmartFillOptions = {}): SmartFillResult | null {
  if (!seeds.length) return null;
  const canvas = document.createElement('canvas');
  const image = source as HTMLImageElement;
  const width = Math.max(1, Math.min(1400, image instanceof HTMLImageElement ? image.naturalWidth : 1400));
  const height = image instanceof HTMLImageElement ? Math.max(1, Math.round(width * image.naturalHeight / image.naturalWidth)) : 1;
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext('2d'); if (!context) return null;
  context.drawImage(source, 0, 0, width, height);
  return selectSurfaceFromCanvas(canvas, seeds, options);
}

export function selectSurfaceFromCanvas(canvas: HTMLCanvasElement, seeds: SmartPoint[], options: SmartFillOptions = {}): SmartFillResult | null {
  const context = canvas.getContext('2d'); if (!context || !seeds.length) return null;
  const { width, height } = canvas, data = context.getImageData(0, 0, width, height).data, total = width * height;
  const tolerance = options.tolerance ?? 58, edgeLock = options.edgeLock ?? 68;
  const maxArea = Math.floor(total * (options.maxAreaRatio ?? 0.72));
  const refs = seeds.slice(0, 32).map((seed) => { const x = clamp(Math.floor(seed.x), 0, width - 1), y = clamp(Math.floor(seed.y), 0, height - 1), p = (y * width + x) * 4; return { index: y * width + x, r: data[p], g: data[p + 1], b: data[p + 2] }; });
  const luminance = (index: number) => { const p = index * 4; return data[p] * .299 + data[p + 1] * .587 + data[p + 2] * .114; };
  const distance = (a: number, b: number) => { const pa = a * 4, pb = b * 4; return Math.hypot(data[pa] - data[pb], data[pa + 1] - data[pb + 1], data[pa + 2] - data[pb + 2]); };
  const referenceDistance = (index: number) => { const p = index * 4; return Math.min(...refs.map((ref) => Math.hypot(data[p] - ref.r, data[p + 1] - ref.g, data[p + 2] - ref.b))); };
  const edgeThreshold = clamp(78 - edgeLock * .68, 18, 55), direct = tolerance * 1.65, gradual = 20 + tolerance * .34, far = tolerance * 3.1;
  const seen = new Uint8Array(total), mask = new Uint8Array(total), queue = new Int32Array(total); let head = 0, tail = 0, pixels = 0;
  refs.forEach((ref) => { if (!seen[ref.index]) { seen[ref.index] = 1; queue[tail++] = ref.index; } });
  while (head < tail && pixels < maxArea) { const index = queue[head++]; mask[index] = 1; pixels++; const x = index % width, y = Math.floor(index / width); const visit = (next: number) => { if (seen[next]) return; seen[next] = 1; if (Math.max(Math.abs(luminance(index) - luminance(next)), distance(index, next) * .55) > edgeThreshold) return; const ref = referenceDistance(next); if (ref <= direct || (distance(index, next) <= gradual && ref <= far)) queue[tail++] = next; }; if (x) visit(index - 1); if (x < width - 1) visit(index + 1); if (y) visit(index - width); if (y < height - 1) visit(index + width); }
  return { mask, width, height, pixels, stopped: pixels >= maxArea };
}

export function renderPaintMask(context: CanvasRenderingContext2D, source: ImageData, result: SmartFillResult, color: string, opacity = .7) {
  const rgb = Number.parseInt(color.slice(1), 16), r = rgb >> 16 & 255, g = rgb >> 8 & 255, b = rgb & 255, output = context.createImageData(result.width, result.height);
  for (let i = 0; i < result.mask.length; i++) if (result.mask[i]) { const p = i * 4, light = (source.data[p] * .299 + source.data[p + 1] * .587 + source.data[p + 2] * .114) / 255, shade = .72 + light * .34; output.data[p] = clamp(r * shade, 0, 255); output.data[p + 1] = clamp(g * shade, 0, 255); output.data[p + 2] = clamp(b * shade, 0, 255); output.data[p + 3] = 255 * opacity; }
  context.putImageData(output, 0, 0);
}

export function renderCleanMask(context: CanvasRenderingContext2D, source: ImageData, result: SmartFillResult, strength = 72) {
  const output = context.createImageData(result.width, result.height), mix = strength / 100;
  for (let i = 0; i < result.mask.length; i++) if (result.mask[i]) { const p = i * 4, light = (source.data[p] + source.data[p + 1] + source.data[p + 2]) / 3; output.data[p] = source.data[p] + (255 - source.data[p]) * .18 * mix + (light - source.data[p]) * .08 * mix; output.data[p + 1] = source.data[p + 1] + (255 - source.data[p + 1]) * .18 * mix + (light - source.data[p + 1]) * .08 * mix; output.data[p + 2] = source.data[p + 2] + (255 - source.data[p + 2]) * .18 * mix + (light - source.data[p + 2]) * .08 * mix; output.data[p + 3] = 220; }
  context.putImageData(output, 0, 0);
}

export function maskToPolygon(mask: Uint8Array, width: number, height: number): SmartPoint[] {
  const points: SmartPoint[] = []; for (let y = 0; y < height; y += Math.max(1, Math.floor(height / 40))) for (let x = 0; x < width; x += Math.max(1, Math.floor(width / 40))) if (mask[y * width + x]) points.push({ x: x / width * 100, y: y / height * 100 }); return points;
}
