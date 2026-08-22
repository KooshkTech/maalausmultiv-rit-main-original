# IMAGE REFRESH V1

## Project
Maalaus Multiväri — maalausmultivari.fi

## Version
v9 — Image Refresh

## What changed
The existing local image system was refreshed without changing the site's routing or image manifest structure.

Updated image assets:
- 19 service images
- 13 hero/page-hero images
- 12 project images
- 7 blog images
- 10 city images
- 16 before/after images were normalized/re-encoded
- team imagery was normalized
- unused duplicate `public/OY copy.png` was removed

## Image strategy
- Images are kept local under `public/images/`.
- No remote image CDN was introduced.
- Existing filenames and paths are preserved, so components do not need unnecessary changes.
- Service images are matched to the relevant service category.
- Page heroes are matched to the page purpose.
- City images use specific city imagery where available and neutral regional imagery where an exact city photograph was not available.
- City alt text was made neutral where the image is illustrative rather than a city landmark.
- Exact duplicate image files were removed from the refreshed set.

## Important project-proof rule
The project and before/after sections contain business/project claims. This refresh does not independently verify that every displayed project photograph is a real Maalaus Multiväri customer project.

Before using an image as proof of a completed customer job, replace it with a verified company photo or clearly label it as an illustrative/example image.

## No dependency changes
This image-only refresh does not add npm packages and does not intentionally change application logic.

## Required local verification
Run:

```bash
npm run typecheck
npm run build
npm run dev
```

Then visually verify:
- Homepage
- Service Finder
- Service pages
- Cleaning pages
- Project gallery
- Before/After
- Blog
- City pages
- Mobile navigation
- Image loading and cropping
