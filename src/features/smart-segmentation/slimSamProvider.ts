import type { SegmentationProvider, SegmentationRequest, SegmentationResult } from './types';

const MODEL_ID = 'Xenova/slimsam-77-uniform';

type Runtime = typeof import('@huggingface/transformers');

/**
 * Browser-only promptable segmentation provider.
 * The heavy runtime/model is lazy-loaded only after the editor asks for semantic segmentation.
 * Uploaded customer photos stay in the browser; only model assets are fetched from the model hub.
 */
export class SlimSamProvider implements SegmentationProvider {
  readonly id = 'slimsam-browser';
  readonly label = 'AI-pintatunnistus';

  private runtime: Runtime | null = null;
  private model: any = null;
  private processor: any = null;
  private sourceKey = '';
  private processed: any = null;
  private embeddings: any = null;

  async isAvailable() {
    return typeof window !== 'undefined' && typeof WebAssembly !== 'undefined';
  }

  private async ensureRuntime() {
    if (this.runtime) return;
    this.runtime = await import('@huggingface/transformers');
  }

  private async ensureModel() {
    await this.ensureRuntime();
    if (this.model && this.processor) return;
    const { SamModel, AutoProcessor } = this.runtime!;
    const webgpu = typeof navigator !== 'undefined' && 'gpu' in navigator;
    try {
      this.model = await SamModel.from_pretrained(MODEL_ID, {
        device: webgpu ? 'webgpu' : 'wasm',
        dtype: webgpu ? 'fp16' : 'q8',
      } as any);
    } catch (error) {
      if (!webgpu) throw error;
      // WebGPU varies by browser/GPU. Retry on WASM rather than breaking the editor.
      this.model = await SamModel.from_pretrained(MODEL_ID, {
        device: 'wasm',
        dtype: 'q8',
      } as any);
    }
    this.processor = await AutoProcessor.from_pretrained(MODEL_ID);
  }

  private async ensureEmbedding(request: SegmentationRequest) {
    await this.ensureModel();
    const image = (request as any).image;
    if (!image) throw new Error('SlimSAM requires the source image in the segmentation request.');
    const key = (request as any).imageKey ?? `${request.width}x${request.height}`;
    if (key === this.sourceKey && this.embeddings && this.processed) return;

    const { RawImage } = this.runtime!;
    const raw = image instanceof ImageData
      ? new RawImage(new Uint8ClampedArray(image.data), image.width, image.height, 4)
      : image;
    this.processed = await this.processor(raw);
    this.embeddings = await this.model.get_image_embeddings(this.processed);
    this.sourceKey = key;
  }

  async segment(request: SegmentationRequest): Promise<SegmentationResult> {
    if (!request.points.length) {
      return { mask: new Uint8Array(request.width * request.height), width: request.width, height: request.height, provider: this.id };
    }

    await this.ensureEmbedding(request);
    const { Tensor } = this.runtime!;
    const reshaped = this.processed.reshaped_input_sizes[0];
    const points = request.points.flatMap((point) => [
      (point.x / request.width) * reshaped[1],
      (point.y / request.height) * reshaped[0],
    ]);
    const labels = request.points.map((point) => BigInt(point.label));
    const count = request.points.length;
    const input_points = new Tensor('float32', points, [1, 1, count, 2]);
    const input_labels = new Tensor('int64', labels, [1, 1, count]);
    const { pred_masks, iou_scores } = await this.model({ ...this.embeddings, input_points, input_labels });
    const masks = await this.processor.post_process_masks(
      pred_masks,
      this.processed.original_sizes,
      this.processed.reshaped_input_sizes,
    );

    const scores = Array.from(iou_scores.data as ArrayLike<number>);
    let best = 0;
    for (let i = 1; i < scores.length; i += 1) if (scores[i] > scores[best]) best = i;
    const rawMask = masks[0][0];
    const numMasks = scores.length;
    const mask = new Uint8Array(request.width * request.height);
    const sourceWidth = rawMask.dims?.at(-1) ?? request.width;
    const sourceHeight = rawMask.dims?.at(-2) ?? request.height;

    // Nearest-neighbour binary resize keeps boundaries crisp; V3 refinement can polish the mask later.
    for (let y = 0; y < request.height; y += 1) {
      const sy = Math.min(sourceHeight - 1, Math.floor((y / request.height) * sourceHeight));
      for (let x = 0; x < request.width; x += 1) {
        const sx = Math.min(sourceWidth - 1, Math.floor((x / request.width) * sourceWidth));
        const sourceIndex = (sy * sourceWidth + sx) * numMasks + best;
        if (Number(rawMask.data[sourceIndex]) > 0) mask[y * request.width + x] = 255;
      }
    }

    return { mask, width: request.width, height: request.height, provider: this.id };
  }
}
