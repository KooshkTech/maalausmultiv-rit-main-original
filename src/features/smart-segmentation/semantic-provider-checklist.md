# Semantic provider readiness checklist

- [ ] Exact Transformers.js version pinned.
- [ ] Exact promptable segmentation model pinned.
- [ ] Model license reviewed for commercial use.
- [ ] Worker-based loading/inference tested.
- [ ] Download progress visible to customer.
- [ ] WebGPU path tested.
- [ ] WASM/local fallback tested.
- [ ] Wall/window test passes.
- [ ] Adjacent-wall test passes.
- [ ] Door/glass test passes.
- [ ] Window-frame/glass test passes.
- [ ] Wood/fabric test evaluated and limitation documented if unreliable.
- [ ] First-load bytes measured.
- [ ] Encode/decode latency measured on mobile and desktop.
- [ ] No customer image is uploaded by browser provider.
- [ ] Mask safety guard applied before commit.
- [ ] UI never labels fallback as semantic AI.
