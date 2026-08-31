# VäriKamu V3 acceptance matrix

A green build is necessary but is not product acceptance. Test with real customer-style photos on desktop and mobile.

| Scenario | Required result |
|---|---|
| Wall with window | Wall selected; glass and frame remain protected unless separately selected |
| Two adjacent walls | Selected wall does not spill across corner |
| Wall and ceiling | Ceiling protected |
| Door with glass | Door/frame can be selected without glass |
| Window frame | Frame selectable without pane |
| Cabinet doors | Fronts selectable without handles/background |
| Wooden chair with fabric | Wood selectable without fabric |
| Exterior facade | Openings/roof/sky protected |
| Dark shadow on wall | Mask remains continuous across lighting change |
| Bright highlight | Highlight remains visually present after recolor |
| Portrait phone photo | Editing remains usable without horizontal overflow |
| Low-memory/no WebGPU | Editor falls back without crashing |
| Add area | User can extend an imperfect mask |
| Remove area | User can remove spill from a mask |
| Multiple colors | Independent surfaces retain independent colors |

Do not merge to `main` until the core wall/window, adjacent-wall, add/remove-area, multiple-color, mobile and fallback cases have been manually verified.
