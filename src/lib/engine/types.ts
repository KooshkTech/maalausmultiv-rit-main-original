export type RGB = readonly [number, number, number];

export interface PaintParams {
  tint: RGB;
  coat: 1 | 2 | 3 | 4;
  opacity?: number;
}

export interface CleaningParams {
  intensity: number;
  quality?: 'preview' | 'final';
}

export interface DeviceCapabilities {
  dpr: number;
  maxTextureSize: number;
  supportsOffscreenCanvas: boolean;
  supportsWebGL2: boolean;
  isLowEnd: boolean;
}

export interface RenderSize {
  width: number;
  height: number;
}

export interface IRenderPipeline {
  setSize(size: RenderSize): void;
  renderBaseImage(image: CanvasImageSource): Promise<void> | void;
  applyPaintMask(mask: import('./MaskLayer').MaskLayer, params: PaintParams): Promise<void> | void;
  applyCleaningMask(mask: import('./MaskLayer').MaskLayer, params: CleaningParams): Promise<void> | void;
  exportFinalImage(type?: 'image/jpeg' | 'image/png', quality?: number): Promise<Blob>;
  getCanvas(): HTMLCanvasElement;
}
