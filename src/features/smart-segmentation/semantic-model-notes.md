# Semantic model integration requirements

Target: browser-side promptable image segmentation compatible with rough positive/negative points.

Before enabling a model:
1. Pin an exact `@huggingface/transformers` version and lockfile.
2. Verify model license permits this commercial use.
3. Measure first-download bytes, warm-load time, encode time and point-decode time on desktop and representative Android/iPhone devices.
4. Run inference in a worker where practical so the editor remains responsive.
5. Prefer WebGPU when verified; provide a WASM/local fallback and never crash the editor when GPU initialization fails.
6. Lazy-load ML code/model only after the authenticated editor requests Smart Fill.
7. Keep image pixels in the browser for the browser provider; do not upload customer photos to a third party silently.
8. Convert rough stroke samples to positive prompts; correction strokes become positive/negative prompts and/or direct mask edits.
9. Refine semantic output with local edge information before committing the mask.
10. Reject unsafe masks that cover implausibly large portions of the image and require user confirmation/correction.

The provider must satisfy the existing `SegmentationProvider` interface so the editor UI is independent of the selected model/runtime.
