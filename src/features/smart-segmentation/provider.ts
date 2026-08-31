import type { SegmentationProvider, SegmentationRequest, SegmentationResult } from './types';

/**
 * Safe fallback used when semantic/WebGPU segmentation is unavailable.
 * It intentionally selects only small regions around positive prompts; the
 * existing editor Smart Fill can remain the richer legacy fallback until the
 * semantic provider is wired in.
 */
export class PromptFallbackProvider implements SegmentationProvider {
  readonly id = 'prompt-fallback';
  readonly label = 'Paikallinen varatila';

  async isAvailable() {
    return true;
  }

  async segment(request: SegmentationRequest): Promise<SegmentationResult> {
    const mask = new Uint8Array(request.width * request.height);
    const radius = Math.max(8, Math.round(Math.min(request.width, request.height) * 0.025));

    for (const point of request.points) {
      if (point.label !== 1) continue;
      const minX = Math.max(0, Math.floor(point.x - radius));
      const maxX = Math.min(request.width - 1, Math.ceil(point.x + radius));
      const minY = Math.max(0, Math.floor(point.y - radius));
      const maxY = Math.min(request.height - 1, Math.ceil(point.y + radius));
      for (let y = minY; y <= maxY; y += 1) {
        for (let x = minX; x <= maxX; x += 1) {
          const dx = x - point.x;
          const dy = y - point.y;
          if (dx * dx + dy * dy <= radius * radius) mask[y * request.width + x] = 255;
        }
      }
    }

    return { mask, width: request.width, height: request.height, provider: this.id };
  }
}

export async function chooseSegmentationProvider(providers: SegmentationProvider[]) {
  for (const provider of providers) {
    try {
      if (await provider.isAvailable()) return provider;
    } catch {
      // Try the next provider. A failed AI backend must never break the editor.
    }
  }
  return new PromptFallbackProvider();
}
