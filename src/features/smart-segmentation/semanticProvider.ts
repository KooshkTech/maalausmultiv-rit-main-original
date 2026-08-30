import type { SegmentationProvider, SegmentationRequest, SegmentationResult } from './types';
import { detectSmartSegmentationCapability } from './webgpu';

/**
 * Boundary for the production Segment Anything provider.
 * Keeping the dynamic import behind this class prevents the public website from
 * downloading ML code/models. The actual Transformers.js implementation is
 * intentionally enabled only after the dependency/model is pinned and tested.
 */
export class LazySemanticProvider implements SegmentationProvider {
  readonly id = 'semantic-webgpu';
  readonly label = 'Semanttinen pintatunnistus';

  async isAvailable() {
    const capability = await detectSmartSegmentationCapability();
    return capability.webGpu && capability.semanticReady;
  }

  async segment(_request: SegmentationRequest): Promise<SegmentationResult> {
    throw new Error('Semantic provider is not loaded yet; use the safe fallback provider.');
  }
}
