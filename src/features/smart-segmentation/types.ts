export type MaskEditMode = 'add' | 'remove';

export type SegmentationPoint = {
  x: number;
  y: number;
  label: 0 | 1;
};

export type SurfaceMask = {
  id: string;
  name: string;
  color: string;
  opacity: number;
  visible: boolean;
  width: number;
  height: number;
  data: Uint8Array;
};

export type SegmentationRequest = {
  image: ImageData;
  points: SegmentationPoint[];
  width: number;
  height: number;
};

export type SegmentationResult = {
  mask: Uint8Array;
  width: number;
  height: number;
  confidence?: number;
  provider: string;
};

export interface SegmentationProvider {
  readonly id: string;
  readonly label: string;
  isAvailable(): Promise<boolean>;
  segment(request: SegmentationRequest): Promise<SegmentationResult>;
}
