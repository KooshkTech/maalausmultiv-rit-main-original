# Implementation status

## Implemented on this branch
- Independent surface masks with color, opacity and visibility.
- Add-area and remove-area mask correction.
- Multiple surfaces with separate colors.
- Mask undo/redo snapshots.
- Before / After / Compare editor modes.
- Luminance-aware paint rendering.
- JPG and PNG export.
- WebGPU capability detection.
- Provider abstraction and safe local fallback.
- Lazy semantic-provider boundary.
- Mobile-first editor viewport.

## Not yet claimed as complete
- True semantic Segment Anything inference.
- Reliable frame-vs-glass / wood-vs-fabric understanding.
- Real-photo acceptance matrix results.
- Quote submission of original/final/mask metadata.

## Merge gate
Do not merge or deploy until CI is green and the mandatory manual acceptance cases in `acceptance-tests.md` are verified. Semantic AI must never be advertised as active while the editor is using the fallback provider.
