# V15 Production Image Audit

Source baseline: `dist.zip` downloaded from cPanel (79 deployed image files under `images/`).

## Summary

- KEEP: 42
- CONVERT: 3
- REPLACE: 34
- Total audited: 79

Technical findings:
- 77 deployed files are true WebP.
- `team/team-group.webp` and `team/team-portrait.webp` are JPEG data stored with `.webp` filenames.
- `hero/finnish-painter-exterior.jpg` and `hero/finnish-cleaning-team.jpg` are legacy JPEG assets.
- The newer V15 image package is a full refresh: all same-named production files differ from the cPanel copies; the two legacy JPG names are not carried forward unchanged.

## Priority replacements

- `hero/contact-page.webp` — Weak/mismatched contact-page photo with visible third-party-looking signage; replace with clean MVV-safe image.
- `hero/about-page.webp` — Generic unbranded team portrait; replace with an MVV-branded or authentic Maalaus Multiväri team/work image.
- `hero/hero-painters-team.webp` — Generic construction/painting scene; replace with stronger MVV-branded team imagery.
- `services/elderly-care-cleaning.webp` — Dark lifestyle scene does not clearly communicate professional cleaning.
- `services/move-cleaning.webp` — Boxes/covered furniture do not clearly show cleaning work.
- `services/office-cleaning.webp` — Legacy hallway/cart scene is visually weak and may contain unrelated signage.
- `services/roof-cleaning.webp` — Hard hats on a roof do not show roof cleaning.
- `services/school-cleaning.webp` — Empty classroom does not show a cleaning service.
- `services/yard-restoration.webp` — Decorative deck photo does not show restoration work.
- `projects/move-cleaning.webp` — Does not show a completed cleaning result or active cleaning.
- `projects/office-cleaning.webp` — Legacy hallway/cart scene is weak as a project/reference image.
- `projects/roof-cleaning.webp` — Hard hats on roof do not evidence the service result.
- `cities/kauniainen.webp` — Duplicate painting/building image rather than a clear Kauniainen location image.
- `cities/kirkkonummi.webp` — Duplicates Espoo marina imagery; not distinct enough for Kirkkonummi.
- `cities/nurmijarvi.webp` — Duplicates Kauniainen/painting-building imagery; not distinct enough for Nurmijärvi.
- `cities/vantaa.webp` — Duplicates Kerava brick-building imagery; not distinct enough for Vantaa.

Before/after rule: all 16 cPanel before/after assets are marked REPLACE because the deployed pairs are not convincing matched same-scene before/after comparisons. V15 should use coherent pairs only.

## Full audit

| Image | Action | Reason |
|---|---|---|
| `before-after/apartment-after.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/apartment-before.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/construction-cleaning-after.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/construction-cleaning-before.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/exterior-after.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/exterior-before.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/facade-after.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/facade-before.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/interior-after.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/interior-before.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/move-cleaning-after.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/move-cleaning-before.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/office-after.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/office-before.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/office-cleaning-after.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `before-after/office-cleaning-before.webp` | **REPLACE** | Production before/after set does not form convincing matched same-scene pairs; replace with coherent V15 before/after pairs. |
| `blog/choose-color.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `blog/facade-care.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `blog/interior-painting-cost.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `blog/paint-types.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `blog/painting-timing.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `blog/roof-painting-guide.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `blog/wallpaper-removal.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `cities/espoo.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `cities/helsinki.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `cities/hyvinkaa.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `cities/jarvenpaa.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `cities/kauniainen.webp` | **REPLACE** | Duplicate painting/building image rather than a clear Kauniainen location image. |
| `cities/kerava.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `cities/kirkkonummi.webp` | **REPLACE** | Duplicates Espoo marina imagery; not distinct enough for Kirkkonummi. |
| `cities/nurmijarvi.webp` | **REPLACE** | Duplicates Kauniainen/painting-building imagery; not distinct enough for Nurmijärvi. |
| `cities/sipoo.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `cities/vantaa.webp` | **REPLACE** | Duplicates Kerava brick-building imagery; not distinct enough for Vantaa. |
| `hero/about-page.webp` | **REPLACE** | Generic unbranded team portrait; replace with an MVV-branded or authentic Maalaus Multiväri team/work image. |
| `hero/blog-page.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `hero/calculator-page.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `hero/cleaning-page.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `hero/contact-page.webp` | **REPLACE** | Weak/mismatched contact-page photo with visible third-party-looking signage; replace with clean MVV-safe image. |
| `hero/finnish-cleaning-team.jpg` | **REPLACE** | Legacy JPEG and duplicate/weak cleaning scene; use the newer V15 cleaning/team asset instead. |
| `hero/finnish-painter-exterior.jpg` | **CONVERT** | Useful painter photo but legacy JPEG; convert to optimized WebP if retained. |
| `hero/hero-house-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `hero/hero-nordic-house.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `hero/hero-painters-team.webp` | **REPLACE** | Generic construction/painting scene; replace with stronger MVV-branded team imagery. |
| `hero/projects-page.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `hero/reviews-page.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `hero/services-page.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `projects/apartment-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `projects/construction-cleaning.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `projects/exterior-house-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `projects/facade-painting-apartment.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `projects/fence-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `projects/interior-painting-home.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `projects/move-cleaning.webp` | **REPLACE** | Does not show a completed cleaning result or active cleaning. |
| `projects/office-cleaning.webp` | **REPLACE** | Legacy hallway/cart scene is weak as a project/reference image. |
| `projects/office-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `projects/roof-cleaning.webp` | **REPLACE** | Hard hats on roof do not evidence the service result. |
| `projects/roof-coating.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `projects/window-cleaning.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/apartment-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/construction-cleaning.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/daycare-cleaning.webp` | **REPLACE** | Generic vacuuming scene; V15 package has a more service-specific alternative. |
| `services/elderly-care-cleaning.webp` | **REPLACE** | Dark lifestyle scene does not clearly communicate professional cleaning. |
| `services/exterior-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/facade-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/facade-washing.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/fence-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/home-cleaning.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/interior-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/maintenance-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/move-cleaning.webp` | **REPLACE** | Boxes/covered furniture do not clearly show cleaning work. |
| `services/office-cleaning.webp` | **REPLACE** | Legacy hallway/cart scene is visually weak and may contain unrelated signage. |
| `services/office-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/roof-cleaning.webp` | **REPLACE** | Hard hats on a roof do not show roof cleaning. |
| `services/roof-painting.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/school-cleaning.webp` | **REPLACE** | Empty classroom does not show a cleaning service. |
| `services/window-cleaning.webp` | **KEEP** | Relevant, usable production asset; no technical format issue found. |
| `services/yard-restoration.webp` | **REPLACE** | Decorative deck photo does not show restoration work. |
| `team/team-group.webp` | **CONVERT** | File extension is .webp but production file is JPEG internally; re-encode as true WebP. Consider MVV branding at the same time. |
| `team/team-portrait.webp` | **CONVERT** | File extension is .webp but production file is JPEG internally; re-encode as true WebP. Consider MVV branding at the same time. |