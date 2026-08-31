# VäriKamu V3 smart segmentation

This module separates the editor from any single AI provider.

Pipeline:

1. Customer gives rough positive/negative prompts with brush/roller.
2. A `SegmentationProvider` produces a binary surface mask.
3. The customer corrects the mask with `+ Lisää alue` / `− Poista alue`.
4. Masks are stored as independent `SurfaceMask` layers with their own color and opacity.
5. `renderSurfaceMasks` recolors only selected pixels while retaining source luminance.
6. If semantic inference is unavailable, the editor must fall back instead of becoming unusable.

The next provider is intended to use browser-side Segment Anything through Transformers.js/WebGPU with a WASM or local fallback. Model code must be lazy-loaded only after the customer opens the editor and requests Smart Fill.

Do not describe the fallback provider as semantic AI.
