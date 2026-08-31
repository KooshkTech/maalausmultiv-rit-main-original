export type LocalEditorMetric = {
  name: 'model-load' | 'image-encode' | 'mask-decode' | 'mask-render';
  durationMs: number;
  device?: 'webgpu' | 'wasm' | 'local';
};

// Metrics are returned to the caller only. This module performs no network transmission.
export function createLocalMetric(metric: LocalEditorMetric): LocalEditorMetric {
  return metric;
}
