#!/usr/bin/env python3
"""
Aire — Pinned Triptych (3 connected Instagram posts)
Each panel is 1080x1350px. Together they form a seamless 3240x1350 panorama.

Panel 1 (left)   — Open ocean + mist, "Find Your"
Panel 2 (center) — Sea stacks + fog, "Flow." + Aire cans hero
Panel 3 (right)  — Cliffs + golden light, tagline + brand
"""

import asyncio, base64, os
from pathlib import Path
from playwright.async_api import async_playwright

ASSETS  = Path("/sessions/fervent-beautiful-cray/mnt/aire-site/public/images")
OUT     = Path("/sessions/fervent-beautiful-cray/mnt/aire-site/instagram-posts")
OUT.mkdir(exist_ok=True)

W, H = 1080, 1350

def b64(path):
    data = Path(path).read_bytes()
    ext  = Path(path).suffix.lstrip(".")
    mime = "image/jpeg" if ext in ("jpg","jpeg") else "image/png"
    return f"data:{mime};base64,{base64.b64encode(data).decode()}"

BG       = b64("/sessions/fervent-beautiful-cray/landscape-bg.jpg")
CANS     = b64(ASSETS / "three-cans.png")
CTA_CANS = b64(ASSETS / "cta-cans.png")
LOGO     = b64(ASSETS / "logo.png")

# Brand
NAVY  = "#1a2e4a"
NAVY2 = "#0f1e32"
ACCENT= "#5a9bbf"
SKY   = "#7ec2df"
CREAM = "#f3f8fc"

GF = '<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap" rel="stylesheet">'

# The panorama is displayed at 3240px wide (3 × 1080).
# Each panel offsets the background to reveal its third.
# bg height at 3240w: 434 * (3240/1024) ≈ 1372px — nearly fills 1350px perfectly.

BG_W = 3240   # full panorama render width
# Panel offsets
OFFSET = [0, -1080, -2160]

BASE_STYLE = f"""
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:{W}px; height:{H}px; overflow:hidden;
    font-family:'DM Sans', sans-serif;
    position:relative; background:#0a1520;
  }}
  /* Full-bleed panorama background */
  .bg {{
    position:absolute;
    top:0; left:{{offset}}px;
    width:{BG_W}px; height:100%;
    background: url("{BG}") no-repeat;
    background-size: {BG_W}px auto;
    background-position: 0 40%;
    filter: brightness(0.72) saturate(0.9);
  }}
  /* Bottom gradient for text legibility */
  .fog-bottom {{
    position:absolute; bottom:0; left:0; right:0;
    height:560px;
    background: linear-gradient(to top, rgba(10,18,28,0.95) 0%, rgba(10,18,28,0.7) 40%, transparent 100%);
    z-index:2;
  }}
  /* Top gradient — light vignette */
  .fog-top {{
    position:absolute; top:0; left:0; right:0;
    height:220px;
    background: linear-gradient(to bottom, rgba(10,18,28,0.35) 0%, transparent 100%);
    z-index:2;
  }}
  /* Side edge fade — key for seamless connection on OUTER edges only */
  .edge-fade-left {{
    position:absolute; top:0; left:0; bottom:0; width:80px;
    background: linear-gradient(to right, rgba(10,18,28,0.55), transparent);
    z-index:3;
  }}
  .edge-fade-right {{
    position:absolute; top:0; right:0; bottom:0; width:80px;
    background: linear-gradient(to left, rgba(10,18,28,0.55), transparent);
    z-index:3;
  }}
"""

# ── PANEL 1 — "Find Your" ─────────────────────────────────────────────────────
PANEL1 = f"""<!DOCTYPE html><html><head><meta charset="UTF-8">{GF}
<style>
{BASE_STYLE.replace('{offset}', str(OFFSET[0]))}
  .logo-wrap {{
    position:absolute; top:44px; left:56px; z-index:10;
  }}
  .logo-wrap img {{
    height:44px;
    filter:brightness(0) invert(1);
    opacity:0.85;
  }}
  .tag {{
    position:absolute; top:52px; right:56px; z-index:10;
    font-size:12px; letter-spacing:.28em; text-transform:uppercase;
    color:rgba(243,248,252,0.5); font-weight:500;
  }}
  .text-zone {{
    position:absolute; bottom:0; left:0; right:0;
    padding:0 64px 72px; z-index:10;
  }}
  .eyebrow {{
    font-size:12px; letter-spacing:.38em; text-transform:uppercase;
    color:{ACCENT}; font-weight:600; margin-bottom:18px; opacity:0.9;
  }}
  .headline {{
    font-family:'DM Serif Display', serif;
    font-size:88px; line-height:0.95; color:{CREAM};
    letter-spacing:-1px;
  }}
  .headline em {{
    font-style:italic; color:{SKY};
  }}
</style></head>
<body>
  <div class="bg"></div>
  <div class="fog-bottom"></div>
  <div class="fog-top"></div>
  <div class="edge-fade-left"></div>

  <div class="logo-wrap"><img src="{LOGO}" alt="Aire"></div>
  <div class="tag">Aire &nbsp;·&nbsp; Flow Pouches</div>

  <div class="text-zone">
    <div class="eyebrow">Introducing Aire</div>
    <div class="headline">Find<br>Your</div>
  </div>
</body></html>"""


# ── PANEL 2 — "Flow." + Cans hero ────────────────────────────────────────────
PANEL2 = f"""<!DOCTYPE html><html><head><meta charset="UTF-8">{GF}
<style>
{BASE_STYLE.replace('{offset}', str(OFFSET[1]))}
  /* Slightly brighter center for the hero */
  .bg {{ filter: brightness(0.78) saturate(0.9); }}
  /* Product cans — hero placement */
  .cans-zone {{
    position:absolute;
    bottom:240px; left:50%; transform:translateX(-50%);
    width:800px; height:480px;
    z-index:8;
    display:flex; align-items:center; justify-content:center;
  }}
  .cans-zone img {{
    width:100%; height:100%; object-fit:contain;
    transform:scale(1.15);
    filter:drop-shadow(0 20px 60px rgba(0,0,0,0.7))
           drop-shadow(0 0 40px rgba(90,155,191,0.2));
  }}
  /* Glow behind cans */
  .can-glow {{
    position:absolute;
    bottom:280px; left:50%; transform:translateX(-50%);
    width:600px; height:350px;
    background:radial-gradient(ellipse, rgba(90,155,191,0.18) 0%, transparent 65%);
    z-index:7; pointer-events:none;
  }}
  .text-zone {{
    position:absolute; bottom:0; left:0; right:0;
    padding:0 64px 60px; z-index:10;
    text-align:center;
  }}
  .headline {{
    font-family:'DM Serif Display', serif;
    font-size:110px; line-height:0.95; color:{CREAM};
    letter-spacing:-2px;
    font-style:italic;
  }}
  .sub {{
    font-size:15px; color:rgba(243,248,252,0.55);
    letter-spacing:.28em; text-transform:uppercase;
    font-weight:500; margin-top:18px;
  }}
</style></head>
<body>
  <div class="bg"></div>
  <div class="fog-bottom"></div>
  <div class="fog-top"></div>

  <div class="can-glow"></div>
  <div class="cans-zone">
    <img src="{CTA_CANS}" alt="Aire cans">
  </div>

  <div class="text-zone">
    <div class="headline">Flow.</div>
    <div class="sub">No nicotine &nbsp;·&nbsp; No caffeine</div>
  </div>
</body></html>"""


# ── PANEL 3 — Tagline + brand ─────────────────────────────────────────────────
PANEL3 = f"""<!DOCTYPE html><html><head><meta charset="UTF-8">{GF}
<style>
{BASE_STYLE.replace('{offset}', str(OFFSET[2]))}
  .text-zone {{
    position:absolute; bottom:0; left:0; right:0;
    padding:0 64px 72px; z-index:10;
    display:flex; flex-direction:column; align-items:flex-end; text-align:right;
  }}
  .headline {{
    font-family:'DM Serif Display', serif;
    font-size:68px; line-height:1.05; color:{CREAM};
    letter-spacing:-.5px;
  }}
  .headline em {{
    font-style:italic; color:{SKY};
  }}
  .tagline {{
    font-size:16px; color:rgba(243,248,252,0.55);
    font-weight:300; letter-spacing:.06em;
    margin-top:20px; line-height:1.7;
  }}
  .brand-mark {{
    margin-top:28px;
    font-family:'DM Serif Display', serif;
    font-size:22px; letter-spacing:.18em; text-transform:uppercase;
    color:rgba(243,248,252,0.4);
  }}
  .url {{
    font-size:12px; letter-spacing:.2em; text-transform:uppercase;
    color:{ACCENT}; font-weight:500; margin-top:8px; opacity:0.75;
  }}
</style></head>
<body>
  <div class="bg"></div>
  <div class="fog-bottom"></div>
  <div class="fog-top"></div>
  <div class="edge-fade-right"></div>

  <div class="text-zone">
    <div class="headline">Pure<br><em>clarity.</em></div>
    <div class="tagline">Zero nicotine.<br>Zero caffeine.<br>Just clean, breathable energy.</div>
    <div class="brand-mark">Aire</div>
    <div class="url">airepouches.com</div>
  </div>
</body></html>"""


PANELS = [
    ("triptych-panel-1-find-your.png",  PANEL1),
    ("triptych-panel-2-flow.png",       PANEL2),
    ("triptych-panel-3-clarity.png",    PANEL3),
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for fname, html in PANELS:
            page = await browser.new_page(viewport={"width": W, "height": H})
            await page.set_content(html, wait_until="networkidle")
            await page.wait_for_timeout(1000)
            out = str(OUT / fname)
            await page.screenshot(path=out)
            await page.close()
            print(f"✓ {fname}")
        await browser.close()
    print("\nTriptych complete.")

asyncio.run(main())
