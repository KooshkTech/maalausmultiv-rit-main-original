import type { SegmentationPoint } from './types';

export type SemanticWorkerRequest =
  | { type: 'load'; device: 'webgpu' | 'wasm' }
  | { type: 'encode'; image: ImageData }
  | { type: 'segment'; points: SegmentationPoint[]; width: number; height: number }
  | { type: 'dispose' };

export type SemanticWorkerResponse =
  | { type: 'progress'; progress: number; message: string }
  | { type: 'ready'; device: 'webgpu' | 'wasm' }
  | { type: 'encoded'; width: number; height: number }
  | { type: 'mask'; mask: Uint8Array; width: number; height: number; confidence?: number }
  | { type: 'error'; message: string };
