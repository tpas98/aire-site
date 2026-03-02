#!/usr/bin/env python3
"""Generate 4 Post 1 variants for Aire — all different backgrounds/feels."""

import asyncio
import base64
from pathlib import Path
from playwright.async_api import async_playwright

ASSETS = Path("/sessions/fervent-beautiful-cray/mnt/aire-site/public/images")
OUT    = Path("/sessions/fervent-beautiful-cray/mnt/aire-site/instagram-posts")
OUT.mkdir(exist_ok=True)

def img_b64(name):
    data = (ASSETS / name).read_bytes()
    return f"data:image/png;base64,{base64.b64encode(data).decode()}"

THREE_CANS = img_b64("three-cans.png")
COAST      = img_b64("lifestyle-coast.png")
LAKE       = img_b64("lifestyle-lake.png")
LOGO       = img_b64("logo.png")
LOGO_WHITE = img_b64("logo.png")  # will invert with CSS

NAVY   = "#1a2e4a"
NAVY2  = "#0f1e32"
ACCENT = "#5a9bbf"
SKY    = "#7ec2df"
CREAM  = "#f3f8fc"
MUTED  = "#6a8099"

GF = """
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet">
"""

# ── VARIANT A: Dark Navy ───────────────────────────────────────────────────────
VARIANT_A = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">{GF}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1350px; overflow:hidden;
    background: radial-gradient(ellipse at 50% 35%, #1e3a56 0%, {NAVY2} 55%, #080f18 100%);
    font-family:'DM Sans', sans-serif;
    display:flex; flex-direction:column;
    position:relative;
  }}
  /* Glow behind cans */
  .glow {{
    position:absolute;
    top:140px; left:50%; transform:translateX(-50%);
    width:760px; height:560px;
    background:radial-gradient(ellipse, rgba(90,155,191,0.22) 0%, rgba(90,155,191,0.07) 40%, transparent 70%);
    border-radius:50%;
    pointer-events:none;
  }}
  .topbar {{
    display:flex; align-items:center; justify-content:space-between;
    padding:44px 60px 0;
    position:relative; z-index:2;
  }}
  .topbar img {{
    height:48px;
    filter: brightness(0) invert(1);
    opacity:.85;
  }}
  .topbar .tag {{
    font-size:13px; letter-spacing:.22em; text-transform:uppercase;
    color:rgba(126,194,223,0.7); font-weight:500;
  }}
  .image-zone {{
    flex:1; display:flex; align-items:center; justify-content:center;
    padding:0 40px;
    position:relative; z-index:2;
  }}
  .image-zone img {{
    max-width:105%; max-height:105%;
    object-fit:contain;
    filter:drop-shadow(0 32px 72px rgba(0,0,0,0.6));
    transform:scale(1.42);
  }}
  .text-zone {{
    padding:0 72px 68px;
    position:relative; z-index:2;
  }}
  .eyebrow {{
    font-size:12px; letter-spacing:.34em; text-transform:uppercase;
    color:{ACCENT}; font-weight:600; margin-bottom:16px;
  }}
  .headline {{
    font-family:'DM Serif Display', serif;
    font-size:76px; line-height:1.0; color:{CREAM};
    letter-spacing:-.5px;
  }}
  .sub {{
    font-size:17px; color:rgba(243,248,252,0.55); font-weight:300;
    letter-spacing:.05em; margin-top:18px;
  }}
</style></head>
<body>
  <div class="glow"></div>
  <div class="topbar">
    <img src="{LOGO}" alt="Aire">
    <span class="tag">Flow Pouches &middot; Calm Mint</span>
  </div>
  <div class="image-zone">
    <img src="{THREE_CANS}" alt="Aire cans">
  </div>
  <div class="text-zone">
    <div class="eyebrow">Introducing Aire</div>
    <div class="headline">Find Your Flow.</div>
    <div class="sub">No nicotine. No caffeine. Pure clarity.</div>
  </div>
</body></html>"""


# ── VARIANT B: Sky Gradient ────────────────────────────────────────────────────
VARIANT_B = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">{GF}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1350px; overflow:hidden;
    background: linear-gradient(170deg, {SKY} 0%, #b8dff0 20%, #ddeef7 45%, {CREAM} 75%, #ffffff 100%);
    font-family:'DM Sans', sans-serif;
    display:flex; flex-direction:column;
    position:relative;
  }}
  /* Soft light bloom at top center */
  .bloom {{
    position:absolute;
    top:-80px; left:50%; transform:translateX(-50%);
    width:800px; height:600px;
    background:radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 65%);
    pointer-events:none;
  }}
  .topbar {{
    display:flex; align-items:center; justify-content:space-between;
    padding:44px 60px 0;
    position:relative; z-index:2;
  }}
  .topbar img {{ height:48px; opacity:.9; }}
  .topbar .tag {{
    font-size:13px; letter-spacing:.22em; text-transform:uppercase;
    color:rgba(26,46,74,0.45); font-weight:500;
  }}
  .image-zone {{
    flex:1; display:flex; align-items:center; justify-content:center;
    padding:0 40px;
    position:relative; z-index:2;
  }}
  .image-zone img {{
    max-width:105%; max-height:105%;
    object-fit:contain;
    filter:drop-shadow(0 28px 56px rgba(26,46,74,0.18));
    transform:scale(1.42);
  }}
  .divider {{ height:1px; background:rgba(26,46,74,.10); margin:0 60px; position:relative; z-index:2; }}
  .text-zone {{
    padding:36px 60px 56px;
    text-align:center;
    position:relative; z-index:2;
  }}
  .eyebrow {{
    font-size:12px; letter-spacing:.34em; text-transform:uppercase;
    color:{NAVY}; opacity:.5; font-weight:600; margin-bottom:14px;
  }}
  .headline {{
    font-family:'DM Serif Display', serif;
    font-size:76px; line-height:1.0; color:{NAVY};
    letter-spacing:-.5px;
  }}
  .sub {{
    font-size:16px; color:{MUTED}; font-weight:300;
    letter-spacing:.05em; margin-top:14px;
  }}
</style></head>
<body>
  <div class="bloom"></div>
  <div class="topbar">
    <img src="{LOGO}" alt="Aire">
    <span class="tag">Flow Pouches &middot; Calm Mint</span>
  </div>
  <div class="image-zone">
    <img src="{THREE_CANS}" alt="Aire cans">
  </div>
  <div class="divider"></div>
  <div class="text-zone">
    <div class="eyebrow">Introducing Aire</div>
    <div class="headline">Find Your Flow.</div>
    <div class="sub">No nicotine. No caffeine. Pure clarity.</div>
  </div>
</body></html>"""


# ── VARIANT C: Lifestyle Split ─────────────────────────────────────────────────
VARIANT_C = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">{GF}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1350px; overflow:hidden;
    font-family:'DM Sans', sans-serif;
    display:flex; flex-direction:column;
    background:{NAVY2};
    position:relative;
  }}
  /* Top half: lifestyle photo */
  .photo-zone {{
    position:relative;
    height:700px; flex-shrink:0;
    overflow:hidden;
  }}
  .photo-zone img.bg {{
    width:100%; height:100%; object-fit:cover;
    object-position:center 30%;
    filter:brightness(0.88);
  }}
  /* Gradient fade into navy panel below */
  .photo-zone::after {{
    content:'';
    position:absolute; bottom:0; left:0; right:0; height:220px;
    background:linear-gradient(to bottom, transparent, {NAVY2});
  }}
  /* Product cans overlapping the split */
  .can-overlay {{
    position:absolute;
    bottom:-130px; left:50%; transform:translateX(-50%);
    width:620px; height:420px;
    z-index:10;
  }}
  .can-overlay img {{
    width:100%; height:100%; object-fit:contain;
    filter:drop-shadow(0 24px 60px rgba(0,0,0,0.7));
    transform:scale(1.1);
  }}
  /* Logo top-left */
  .logo-wrap {{
    position:absolute; top:40px; left:56px; z-index:5;
  }}
  .logo-wrap img {{
    height:44px;
    filter:brightness(0) invert(1);
    opacity:0.9;
  }}
  /* Bottom text panel */
  .text-panel {{
    flex:1;
    padding:150px 72px 60px;
    display:flex; flex-direction:column; justify-content:flex-end;
    position:relative; z-index:2;
  }}
  .eyebrow {{
    font-size:12px; letter-spacing:.34em; text-transform:uppercase;
    color:{ACCENT}; font-weight:600; margin-bottom:14px;
  }}
  .headline {{
    font-family:'DM Serif Display', serif;
    font-size:78px; line-height:1.0; color:{CREAM};
    letter-spacing:-.5px;
  }}
  .sub {{
    font-size:17px; color:rgba(243,248,252,0.55); font-weight:300;
    letter-spacing:.04em; margin-top:18px;
  }}
</style></head>
<body>
  <div class="photo-zone">
    <img class="bg" src="{COAST}" alt="Coast">
    <div class="logo-wrap"><img src="{LOGO}" alt="Aire"></div>
    <div class="can-overlay">
      <img src="{THREE_CANS}" alt="Aire cans">
    </div>
  </div>
  <div class="text-panel">
    <div class="eyebrow">Introducing Aire</div>
    <div class="headline">Find Your Flow.</div>
    <div class="sub">No nicotine. No caffeine. Pure clarity.</div>
  </div>
</body></html>"""


# ── VARIANT D: Textured Dark ───────────────────────────────────────────────────
VARIANT_D = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">{GF}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1350px; overflow:hidden;
    background: #0a1520;
    font-family:'DM Sans', sans-serif;
    display:flex; flex-direction:column;
    position:relative;
  }}
  /* SVG noise texture overlay */
  .texture {{
    position:absolute; top:0; left:0; right:0; bottom:0;
    opacity:0.045;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size:256px 256px;
    pointer-events:none; z-index:1;
  }}
  /* Vertical gradient on top of texture */
  .bg-gradient {{
    position:absolute; top:0; left:0; right:0; bottom:0;
    background: linear-gradient(175deg, #132035 0%, #0a1520 40%, #060d16 100%);
    pointer-events:none; z-index:0;
  }}
  /* Cool overhead light effect */
  .overhead-light {{
    position:absolute;
    top:-100px; left:50%; transform:translateX(-50%);
    width:700px; height:600px;
    background:radial-gradient(ellipse at 50% 0%, rgba(180,220,240,0.12) 0%, rgba(90,155,191,0.05) 40%, transparent 70%);
    pointer-events:none; z-index:1;
  }}
  /* Subtle bottom vignette */
  .vignette {{
    position:absolute; top:0; left:0; right:0; bottom:0;
    background:radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.35) 100%);
    pointer-events:none; z-index:1;
  }}
  .topbar {{
    display:flex; align-items:center; justify-content:space-between;
    padding:44px 60px 0;
    position:relative; z-index:3;
  }}
  .topbar img {{
    height:48px;
    filter: brightness(0) invert(1);
    opacity:.8;
  }}
  .topbar .tag {{
    font-size:13px; letter-spacing:.22em; text-transform:uppercase;
    color:rgba(126,194,223,0.5); font-weight:500;
  }}
  .image-zone {{
    flex:1; display:flex; align-items:center; justify-content:center;
    padding:0 40px;
    position:relative; z-index:3;
  }}
  .image-zone img {{
    max-width:105%; max-height:105%;
    object-fit:contain;
    /* Cool top-lit look */
    filter:drop-shadow(0 -8px 30px rgba(180,220,240,0.12))
           drop-shadow(0 35px 75px rgba(0,0,0,0.65));
    transform:scale(1.42);
  }}
  /* Thin accent rule */
  .rule {{
    height:1px; margin:0 72px;
    background:linear-gradient(to right, transparent, rgba(90,155,191,0.25) 20%, rgba(90,155,191,0.25) 80%, transparent);
    position:relative; z-index:3;
  }}
  .text-zone {{
    padding:36px 72px 60px;
    position:relative; z-index:3;
  }}
  .eyebrow {{
    font-size:11px; letter-spacing:.42em; text-transform:uppercase;
    color:{ACCENT}; font-weight:600; margin-bottom:16px; opacity:.8;
  }}
  .headline {{
    font-family:'DM Serif Display', serif;
    font-size:76px; line-height:1.0; color:{CREAM};
    letter-spacing:-.5px;
  }}
  .sub {{
    font-size:17px; color:rgba(243,248,252,0.45); font-weight:300;
    letter-spacing:.05em; margin-top:16px;
  }}
</style></head>
<body>
  <div class="bg-gradient"></div>
  <div class="texture"></div>
  <div class="overhead-light"></div>
  <div class="vignette"></div>
  <div class="topbar">
    <img src="{LOGO}" alt="Aire">
    <span class="tag">Flow Pouches &middot; Calm Mint</span>
  </div>
  <div class="image-zone">
    <img src="{THREE_CANS}" alt="Aire cans">
  </div>
  <div class="rule"></div>
  <div class="text-zone">
    <div class="eyebrow">Introducing Aire</div>
    <div class="headline">Find Your Flow.</div>
    <div class="sub">No nicotine. No caffeine. Pure clarity.</div>
  </div>
</body></html>"""


VARIANTS = [
    ("post-01-variant-A-dark-navy.png",    VARIANT_A),
    ("post-01-variant-B-sky-gradient.png", VARIANT_B),
    ("post-01-variant-C-lifestyle-split.png", VARIANT_C),
    ("post-01-variant-D-textured-dark.png",   VARIANT_D),
]


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for filename, html in VARIANTS:
            page = await browser.new_page(viewport={"width":1080,"height":1350})
            await page.set_content(html, wait_until="networkidle")
            await page.wait_for_timeout(800)
            out_path = str(OUT / filename)
            await page.screenshot(path=out_path)
            await page.close()
            print(f"✓ {filename}")
        await browser.close()
    print("\nAll 4 variants done.")

asyncio.run(main())
