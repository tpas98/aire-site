# Aire Carousel Image Overhaul — ChatGPT Prompt Pack

## 1. Audit: why the current carousel reads as AI

All 9 live images share the same formula, which is what makes them feel synthetic:

- **Same subject state:** 8 of 9 show a closed can sitting alone on a surface. Only one open can (beach).
- **Same angle:** ~3/4 hero angle, can dead-center or lower-third, every time.
- **Same lighting:** golden hour / warm haze in nearly every shot.
- **No human interaction:** zero hands, zero people using the product (one blurred woman in the café, not interacting).
- **Same distance:** all mid-range product shots. No macro, no wide environmental, no top-down.

The overhaul targets five diversity axes: **interaction (hands/use), lighting (cool/neutral/night/studio), angle (top-down/macro/eye-level), can state (open/pouch-in-hand), and setting (indoor/urban/seasonal).**

---

## 2. Non-negotiable workflow: reference images

Text prompts alone will NOT reproduce the label. In every ChatGPT session, **upload these 3 files first** and tell it to match them exactly:

1. `public/images/can-front-texture-2026.png` — lid artwork
2. `public/images/can-band-texture-2026.png` — side band artwork
3. `public/images/lifestyle-06-photoreal-2026.png` — best existing render (shows open can, pouches, band, and lid in one shot)

Then paste the Can Lock block + the scene prompt. Generate in a **fresh chat per image** (context drift degrades label fidelity after 2–3 generations).

---

## 3. CAN LOCK — paste this into every prompt

```
PRODUCT ACCURACY IS THE ONLY HARD REQUIREMENT. Reproduce the tin in the attached
reference images with ZERO deviation. Do not invent, omit, or restyle any element.

THE TIN: a short, wide, round pouch tin (hockey-puck proportions, ~70mm diameter,
~24mm tall), matte white body and lid with a soft satin sheen. No pull tab, no notch,
perfectly circular profile.

LID (top face): a pale sky-blue circle printed on the white lid, black text only,
arranged top to bottom:
- "Dietary Supplement" (small, bold)
- "NO NICOTINE ▪ NO CAFFEINE ▪ PURE BALANCE†" (smaller caps)
- "aire" — large lowercase black wordmark; a thin calligraphic breath-swoosh with a
  solid round dot at its left end sweeps above the letters and trails off the "e"
- "FIND YOUR BALANCE†" (caps, letterspaced)
- "15 Calm Mint Pouches" (bold)
- "Rhodiola Rosea" / "L-Theanine ▪ L-Tyrosine" / "Saffron" (three small lines)

SIDE BAND: white, printed in black: the "aire" wordmark with swoosh; two black
rounded-pill labels reading "Calm Mint" and "FIND YOUR BALANCE"; small text items
"No Nicotine", "No Caffeine", "Pure Balance", "AireComplex", "airepouches.com".

IF THE CAN IS OPEN: lid rests nearby (interior plain white); inside are small white
rectangular fabric pouches, slightly pillowed, neatly overlapping.

SPELLING must be exact on every visible string. If any label text would be too small
to render legibly, angle the can so that text is naturally out of focus or cropped —
never approximate or gibberish text. No extra icons, badges, barcodes, or invented copy.
```

**Output settings for every image:** landscape, 3:2 or 4:3 (carousel crops to 400×300). Photorealistic, shot on 50mm or 85mm full-frame look, natural film grain, true-to-life color (no HDR glow, no oversaturation).

---

## 4. The 10 scene prompts

Each replaces or supplements one carousel slot. Paste Can Lock first, then the scene.

### P1 — Hands: pulling a pouch (hero interaction shot)
> Macro lifestyle photo: a hand with natural skin texture lifts a single small white pouch from the open Aire tin held in the other hand. Tin fills the lower-left third, lid label angled toward camera and legible. Neutral overcast daylight, soft shadows, blurred neutral linen background. Shallow depth of field on the fingertips and pouch.

### P2 — Top-down desk flat lay
> Directly overhead (90° top-down) shot: closed Aire tin lid-up on a pale oak desk beside a closed laptop corner, a ceramic cup of green tea, wire-frame glasses, and a linen notebook. Crisp neutral daylight from the left, honest hard-edged shadows. Composition on rule of thirds, generous negative space. The lid label is flat to camera and perfectly legible.

### P3 — Gym bench, cool morning light
> Eye-level shot: Aire tin standing on a wooden gym bench next to a stainless water bottle and a folded gray towel, gym blurred behind with cool blue-toned morning window light. A chalk-dusted hand reaches into frame toward the tin. Side band faces camera; lid partially visible at an angle.

### P4 — Commuter, can in hand
> Candid photo inside a commuter train: a hand in a wool coat sleeve holds the closed Aire tin lid-toward-camera, window motion blur and soft gray daylight behind. Documentary style, muted tones, slight film grain. Only the hand and tin in sharp focus.

### P5 — Jacket pocket carry
> Close crop: the Aire tin sliding into the chest pocket of a faded denim jacket, side band visible above the pocket seam, thumb and forefinger gripping the tin edge. Soft north-facing window light, neutral white balance, fabric texture in sharp detail.

### P6 — Winter cabin windowsill (seasonal/cool)
> The closed Aire tin on a deep wooden windowsill, out-of-focus snowfall and pine trees through the glass behind it, cool blue-gray daylight with a faint warm interior reflection on the tin's satin surface. A knit beanie rests folded beside it. Lid angled 30° toward camera.

### P7 — Evening wind-down nightstand
> Warm low-light photo: Aire tin on a walnut nightstand beside a half-read paperback and a small dim brass lamp (the only light source). Long soft shadows, cozy amber tones, dark blue dusk in the window behind. Lid label catching the lamp light, legible.

### P8 — Studio editorial (premium anchor)
> Minimal studio product photo: the Aire tin on a low matte plaster pedestal against a seamless warm-gray background, one large soft key light from upper left, a single clean reflection and a soft graduated shadow. Lid angled to camera, side band pills visible. The style of a premium skincare campaign — restrained, exact, gallery-like.

### P9 — Passing the can (social)
> Overhead-diagonal shot of a picnic blanket: one person's hand passes the open Aire tin to a friend's open hand, white pouches visible inside, lid resting on the blanket label-up. Dappled tree shade, midday neutral light, cropped at the wrists — no faces. Natural candid energy.

### P10 — Rainy café window (mood contrast)
> The closed Aire tin on a dark café windowsill, rain-streaked glass with blurred city lights and umbrellas beyond, cool desaturated blue-gray palette, thin natural reflection of the tin in the wet-look sill. Quiet, cinematic, editorial. Lid angled toward camera, text legible.

---

## 5. QC checklist — run on EVERY generation before it ships

Reject the image if any item fails. No touch-ups of wrong label text — regenerate.

**Label text (zoom to 200%):**
- [ ] "aire" lowercase, correct letterforms, swoosh + dot present and shaped like the reference
- [ ] "Dietary Supplement" / "NO NICOTINE ▪ NO CAFFEINE ▪ PURE BALANCE†" exact (with dagger)
- [ ] "FIND YOUR BALANCE" exact, with dagger †
- [ ] "15 Calm Mint Pouches" exact (not 20, not "Mint Calm")
- [ ] "Rhodiola Rosea", "L-Theanine ▪ L-Tyrosine", "Saffron" spelled exactly
- [ ] Side band: "Calm Mint" + "FIND YOUR BALANCE" pills, no invented pills
- [ ] Zero gibberish/pseudo-text anywhere on the can

**Structure & color:**
- [ ] Puck proportions correct (wide + short, not tall like a nicotine can competitor)
- [ ] Lid blue is pale sky blue (reference), not teal, not saturated
- [ ] No pull tab, notch, barcode, or extra badges
- [ ] Open-can shots: pouches are white rectangles, believable count, plain white interior

**Photo realism:**
- [ ] Hands: 5 fingers, correct joints, natural nails
- [ ] Shadows/reflections consistent with the stated light source
- [ ] No HDR glow, plastic skin, or oversaturated golden haze
- [ ] Works cropped to 4:3 landscape (400×300 carousel cell)

**Naming convention for approved files:** `lifestyle-{nn}-photoreal-2026.png`, 800×600 min, drop into `public/images/` and update `LifestyleStrip.tsx`.

---

## 6. Rollout plan

1. Generate P1, P2, P8 first (interaction, top-down, studio) — these break the sameness fastest.
2. QC each against Section 5. Expect 2–4 regenerations per concept; text fidelity is the usual failure.
3. Replace the weakest current slots first: lifestyle-04, -09, -10 (most interchangeable golden-hour surface shots).
4. Keep lifestyle-06 (open can beach) and -08 (café with person) — they're the most differentiated of the current set.
5. Target mix for the final 9-slot carousel: 3 interaction/hands, 2 studio/editorial, 2 cool-light scenes, 2 warm scenes.
