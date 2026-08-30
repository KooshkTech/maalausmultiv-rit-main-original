# Customer flow

1. `Ota kuva` or `Lataa kuva`.
2. VäriKamu creates the first editable surface layer.
3. Customer roughly indicates the intended paintable surface.
4. `Täytä pinta` requests segmentation; while semantic inference is unavailable the safe local fallback is used and clearly identified as fallback.
5. Customer fixes boundaries with `+ Lisää alue` and `− Poista alue`.
6. Customer chooses a color for that surface.
7. `+ Pinta` creates another independent mask/color layer.
8. `Ennen`, `Jälkeen`, and `Vertaa` verify the result.
9. JPG/PNG export creates a shareable visual plan.

Future quote integration must submit the original photo, final preview, selected colors and surface metadata. It must not require a child in Kids Mode to provide contact information.
