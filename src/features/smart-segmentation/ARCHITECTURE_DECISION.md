# Architecture decision: browser-first segmentation

VäriKamu V3 uses a provider interface so UI, masks and paint rendering do not depend on a specific ML runtime. Browser-side promptable segmentation is preferred because it can keep customer images on-device and avoid per-image API cost. WebGPU is an acceleration path, not a hard requirement; unsupported devices must retain a usable local fallback.

The semantic provider is deliberately disabled until its dependency, model, license, performance and acceptance tests are pinned and verified. This avoids shipping a large untested model or presenting fallback behavior as AI.
