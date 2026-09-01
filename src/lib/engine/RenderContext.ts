import type { DeviceCapabilities, RenderSize } from './types';

export function detectCapabilities(): DeviceCapabilities {
  const probe = document.createElement('canvas');
  const gl = probe.getContext('webgl2');
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  return {
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) as number : 2048,
    supportsOffscreenCanvas: typeof OffscreenCanvas !== 'undefined',
    supportsWebGL2: Boolean(gl),
    isLowEnd: memory <= 2 || cores <= 4,
  };
}

export function fitRenderSize(width: number, height: number, caps = detectCapabilities()): RenderSize {
  const maxSide = Math.min(caps.maxTextureSize, caps.isLowEnd ? 1536 : 2560);
  const scale = Math.min(1, maxSide / Math.max(width, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}
