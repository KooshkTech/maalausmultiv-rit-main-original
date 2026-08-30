import type { SegmentationProvider, SegmentationRequest, SegmentationResult } from './types';

const MODEL_ID = 'Xenova/slimsam-77-uniform';

type Runtime = typeof import('@huggingface/transformers');
type SamLoadOptions = Parameters<Runtime['SamModel']['from_pretrained']>[1];

type TensorLike = {
  data: ArrayLike<number | bigint | boolean>;
  dims?: number[];
};

type ProcessedSamInput = {
  original_sizes: number[][];
  reshaped_input_sizes: number[][];
  [key: string]: unknown;
};

type SamEmbeddings = Record<string, unknown>;

type SamModelOutput = {
  pred_masks: unknown;
  iou_scores: TensorLike;
};

type SamModelLike = {
  get_image_embeddings: (processed: ProcessedSamInput) => Promise<SamEmbeddings>;
  (inputs: Record<string, unknown>): Promise<SamModelOutput>;
};

type SamProcessorLike = {
  (image: unknown): Promise<ProcessedSamInput>;
  post_process_masks: (
    predMasks: unknown,
    originalSizes: number[][],
    reshapedInputSizes: number[][],
  ) => Promise<TensorLike[][]>;
};

/**
 * Browser-only promptable segmentation provider.
 * The heavy runtime/model is lazy-loaded only after the editor asks for semantic segmentation.
 * Uploaded customer photos stay in the browser; only model assets are fetched from the model hub.
 */
export class SlimSamProvider implements SegmentationProvider {
  readonly id = 'slimsam-browser';
  readonly label = 'AI-pintatunnistus';

  private runtime: Runtime | null = null;
  private model: SamModelLike | null = null;
  private processor: SamProcessorLike | null = null;
  private sourceKey = '';
  private processed: ProcessedSamInput | null = null;
  private embeddings: SamEmbeddings | null = null;

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
      const options = {
        device: webgpu ? 'webgpu' : 'wasm',
        dtype: webgpu ? 'fp16' : 'q8',
      } as SamLoadOptions;
      this.model = (await SamModel.from_pretrained(MODEL_ID, options)) as unknown as SamModelLike;
    } catch (error) {
      if (!webgpu) throw error;
      const fallbackOptions = { device: 'wasm', dtype: 'q8' } as SamLoadOptions;
      this.model = (await SamModel.from_pretrained(MODEL_ID, fallbackOptions)) as unknown as SamModelLike;
    }

    this.processor = (await AutoProcessor.from_pretrained(MODEL_ID)) as unknown as SamProcessorLike;
  }

  private async ensureEmbedding(request: SegmentationRequest) {
    await this.ensureModel();
    const image = request.image;
    if (!image) throw new Error('SlimSAM requires the source image in the segmentation request.');

    const key = `${request.width}x${request.height}:${image.data.length}`;
    if (key === this.sourceKey && this.embeddings && this.processed) return;

    const { RawImage } = this.runtime!;
    const raw = new RawImage(new Uint8ClampedArray(image.data), image.width, image.height, 4);
    this.processed = await this.processor!(raw);
    this.embeddings = await this.model!.get_image_embeddings(this.processed);
    this.sourceKey = key;
  }

  async segment(request: SegmentationRequest): Promise<SegmentationResult> {
    if (!request.points.length) {
      return {
        mask: new Uint8Array(request.width * request.height),
        width: request.width,
        height: request.height,
        provider: this.id,
      };
    }

    await this.ensureEmbedding(request);
    const { Tensor } = this.runtime!;
    const processed = this.processed!;
    const model = this.model!;
    const embeddings = this.embeddings!;
    const reshaped = processed.reshaped_input_sizes[0];
    const points = request.points.flatMap((point) => [
      (point.x / request.width) * reshaped[1],
      (point.y / request.height) * reshaped[0],
    ]);
    const labels = request.points.map((point) => BigInt(point.label));
    const count = request.points.length;
    const inputPoints = new Tensor('float32', points, [1, 1, count, 2]);
    const inputLabels = new Tensor('int64', labels, [1, 1, count]);

    const { pred_masks: predMasks, iou_scores: iouScores } = await model({
      ...embeddings,
      input_points: inputPoints,
      input_labels: inputLabels,
    });

    const masks = await this.processor!.post_process_masks(
      predMasks,
      processed.original_sizes,
      processed.reshaped_input_sizes,
    );

    const scores = Array.from(iouScores.data, (value) => Number(value));
    let best = 0;
    for (let i = 1; i < scores.length; i += 1) {
      if (scores[i] > scores[best]) best = i;
    }

    const rawMask = masks[0][0];
    const numMasks = Math.max(1, scores.length);
    const mask = new Uint8Array(request.width * request.height);
    const sourceWidth = rawMask.dims?.at(-1) ?? request.width;
    const sourceHeight = rawMask.dims?.at(-2) ?? request.height;

    for (let y = 0; y < request.height; y += 1) {
      const sy = Math.min(sourceHeight - 1, Math.floor((y / request.height) * sourceHeight));
      for (let x = 0; x < request.width; x += 1) {
        const sx = Math.min(sourceWidth - 1, Math.floor((x / request.width) * sourceWidth));
        const sourceIndex = (sy * sourceWidth + sx) * numMasks + best;
        if (Number(rawMask.data[sourceIndex]) > 0) {
          mask[y * request.width + x] = 255;
        }
      }
    }

    return {
      mask,
      width: request.width,
      height: request.height,
      confidence: scores[best],
      provider: this.id,
    };
  }
}
