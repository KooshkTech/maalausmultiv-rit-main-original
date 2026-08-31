export type SmartSegmentationCapability = {
  webGpu: boolean;
  semanticReady: boolean;
  reason?: string;
};

export async function detectSmartSegmentationCapability(): Promise<SmartSegmentationCapability> {
  if (typeof navigator === 'undefined') return { webGpu: false, semanticReady: false, reason: 'browser-required' };

  const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown | null> } }).gpu;
  if (!gpu) return { webGpu: false, semanticReady: false, reason: 'webgpu-unavailable' };

  try {
    const adapter = await gpu.requestAdapter();
    if (!adapter) return { webGpu: false, semanticReady: false, reason: 'webgpu-adapter-unavailable' };
    return {
      webGpu: true,
      semanticReady: false,
      reason: 'semantic-provider-not-loaded',
    };
  } catch {
    return { webGpu: false, semanticReady: false, reason: 'webgpu-initialization-failed' };
  }
}
