export type SemanticModelConfig = {
  modelId: string;
  device: 'webgpu' | 'wasm';
  dtype: 'fp32' | 'fp16' | 'q8' | 'q4';
};

// Intentionally null until a model/version/license/performance combination passes review.
export const ACTIVE_SEMANTIC_MODEL: SemanticModelConfig | null = null;
