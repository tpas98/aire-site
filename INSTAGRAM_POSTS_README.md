# Aire Instagram Posts — Quick Reference

## What's in this folder

| Folder / File | Contents |
|---|---|
| `instagram-posts/` | All 9 final post images |
| `instagram-posts/pinned triptych/` | 3 triptych panels (Panel 1, 2, 3) |
| `initial instagram posts/` | Backup of original 6 posts |
| `public/images/` | Brand assets (logo, cans, cta-cans) |
| `landscape-bg.jpg` | AI-generated cliffside panorama used in triptych |

---

## Scripts — how to regenerate posts

### 6 core feed posts (Posts 1–6)
```
python3 generate_posts_v2.py
```
Outputs to `instagram-posts/`

### Post 1 variants (A = dark navy, B = sky gradient)
```
python3 generate_post1_variants.py
```
Outputs to `instagram-posts/`

### Pinned triptych (3-panel panoramic)
```
python3 generate_triptych.py
```
Outputs to `instagram-posts/pinned triptych/`

---

## Making changes

**To update copy / headlines:** Open the relevant script and find the HTML string for the post you want (e.g. `PANEL1`, `POST6`). Edit the text directly in the HTML, then re-run the script.

**To change brand colors:** All scripts share the same color tokens near the top:
- `NAVY = "#1a2e4a"` — dark navy background
- `ACCENT = "#5a9bbf"` — accent blue
- `SKY = "#7ec2df"` — sky blue (italic text highlights)
- `CREAM = "#f3f8fc"` — near-white text

**To swap product images:** Replace files in `public/images/` — the scripts reference them by name (`three-cans.png`, `cta-cans.png`, `logo.png`).

**To update the triptych background:** Replace `landscape-bg.jpg` in this folder.

**URL:** All posts use `airepouches.com`. If this ever changes, search-and-replace across all three scripts.

---

## Running scripts in a new Claude session

1. Open Cowork and select this folder (`aire-site`) as your workspace
2. Tell Claude: *"Re-run the Instagram post scripts — the README explains everything"*
3. Claude will have access to all scripts, assets, and this README

---

## Post inventory

| # | Filename | Theme |
|---|---|---|
| 01a | `post-01a-hero-dark.png` | Hero — dark navy variant |
| 01b | `post-01b-hero-sky.png` | Hero — sky gradient variant |
| 02 | `post-02-ingredients.png` | Clean ingredients |
| 03 | `post-03-no-vape.png` | Anti-vape positioning |
| 04 | `post-04-clean-label.png` | Zero nicotine / zero caffeine |
| 05 | `post-05-ritual.png` | Daily ritual / mindset |
| 06 | `post-06-cta.png` | CTA / shop now |
| T1 | `triptych-panel-1-find-your.png` | Pinned — "Find Your" |
| T2 | `triptych-panel-2-flow.png` | Pinned — "Flow." + cans |
| T3 | `triptych-panel-3-clarity.png` | Pinned — "Pure clarity." |
