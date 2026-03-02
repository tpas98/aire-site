#!/usr/bin/env python3
"""Generate premium Aire Instagram posts v2 — all issues fixed."""

import asyncio
import base64
import os
from pathlib import Path
from playwright.async_api import async_playwright

ASSETS = Path("/sessions/fervent-beautiful-cray/mnt/aire-site/public/images")
OUT    = Path("/sessions/fervent-beautiful-cray/mnt/aire-site/instagram-posts")
OUT.mkdir(exist_ok=True)

def img_b64(name: str) -> str:
    data = (ASSETS / name).read_bytes()
    return f"data:image/png;base64,{base64.b64encode(data).decode()}"

THREE_CANS = img_b64("three-cans.png")
COAST      = img_b64("lifestyle-coast.png")
OPEN_CAN   = img_b64("open-can.png")
CTA_CANS   = img_b64("cta-cans.png")
LAKE       = img_b64("lifestyle-lake.png")
STUDIO     = img_b64("lifestyle-studio.png")
LOGO       = img_b64("logo.png")

NAVY   = "#1a2e4a"
NAVY2  = "#0f1e32"
ACCENT = "#5a9bbf"
SKY    = "#7ec2df"
CREAM  = "#f3f8fc"
WHITE  = "#ffffff"
MUTED  = "#6a8099"

GF = """
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet">
"""

# ══════════════════════════════════════════════════════════════════════════════
# POST 1 – Product Hero  (v2)
# FIX: Cans MUCH bigger, centered text, tighter layout, less dead space
# ══════════════════════════════════════════════════════════════════════════════
POST1 = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">{GF}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1350px; overflow:hidden;
    background:{CREAM};
    font-family:'DM Sans', sans-serif;
    display:flex; flex-direction:column;
  }}
  .topbar {{
    display:flex; align-items:center; justify-content:space-between;
    padding:44px 60px 0;
  }}
  .topbar img {{ height:52px; opacity:.9; }}
  .topbar .tag {{
    font-size:14px; letter-spacing:.2em; text-transform:uppercase;
    color:{MUTED}; font-weight:500;
  }}
  .image-zone {{
    flex:1; display:flex; align-items:center; justify-content:center;
    padding:16px 40px 16px;
  }}
  .image-zone img {{
    max-width:105%; max-height:105%;
    object-fit:contain;
    filter:drop-shadow(0 28px 64px rgba(26,46,74,.22));
    transform:scale(1.42);
  }}
  .divider {{ height:1px; background:rgba(26,46,74,.10); margin:0 60px; }}
  .text-zone {{
    padding:36px 60px 52px;
    text-align:center;
  }}
  .eyebrow {{
    font-size:12px; letter-spacing:.32em; text-transform:uppercase;
    color:{ACCENT}; font-weight:600; margin-bottom:14px;
  }}
  .headline {{
    font-family:'DM Serif Display', serif;
    font-size:72px; line-height:1.0; color:{NAVY};
    letter-spacing:-.5px;
  }}
  .sub {{
    font-size:16px; color:{MUTED}; font-weight:300;
    letter-spacing:.05em; margin-top:14px;
  }}
</style></head>
<body>
  <div class="topbar">
    <img src="{LOGO}" alt="Aire">
    <span class="tag">Flow Pouches &middot; Calm Mint</span>
  </div>
  <div class="image-zone">
    <img src="{THREE_CANS}" alt="Three Aire cans">
  </div>
  <div class="divider"></div>
  <div class="text-zone">
    <div class="eyebrow">Introducing Aire</div>
    <div class="headline">Find Your Flow.</div>
    <div class="sub">No nicotine. No caffeine. Pure clarity.</div>
  </div>
</body></html>"""


# ══════════════════════════════════════════════════════════════════════════════
# POST 2 – Coastal Lifestyle  (v2)
# FIX: Smaller panel (28% not 40%), tighter type, smoother gradient blend
# ══════════════════════════════════════════════════════════════════════════════
POST2 = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">{GF}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1350px; overflow:hidden;
    font-family:'DM Sans', sans-serif; position:relative;
  }}
  .photo {{
    position:absolute; inset:0;
    background:url('{COAST}') center/cover no-repeat;
  }}
  .fade {{
    position:absolute; left:0; right:0;
    bottom:378px; height:180px;
    background:linear-gradient(to bottom, transparent 0%, {NAVY2}dd 100%);
  }}
  .panel {{
    position:absolute; left:0; right:0; bottom:0;
    height:378px; background:{NAVY};
    padding:48px 64px 56px;
    display:flex; flex-direction:column; justify-content:space-between;
  }}
  .headline {{
    font-family:'DM Serif Display', serif;
    font-size:78px; line-height:.98; color:{WHITE};
    letter-spacing:-.5px;
  }}
  .headline em {{ font-style:italic; color:{SKY}; }}
  .bottom-row {{
    display:flex; align-items:flex-end; justify-content:space-between;
  }}
  .sub {{
    font-size:15px; letter-spacing:.2em; text-transform:uppercase;
    color:rgba(255,255,255,.55); font-weight:400;
  }}
  .brand {{
    font-family:'DM Serif Display', serif;
    font-size:20px; letter-spacing:.15em; color:rgba(255,255,255,.45);
    text-transform:uppercase;
  }}
</style></head>
<body>
  <div class="photo"></div>
  <div class="fade"></div>
  <div class="panel">
    <div class="headline">Clear mind.<br><em>Open air.</em></div>
    <div class="bottom-row">
      <div class="sub">Find clarity anywhere</div>
      <div class="brand">Aire</div>
    </div>
  </div>
</body></html>"""


# ══════════════════════════════════════════════════════════════════════════════
# POST 3 – Ingredient Spotlight  (v2)
# FIX: Bigger can, ingredient descriptions as sub-lines (not right-aligned),
#      tighter spacing, visible footer, better image zone proportions
# ══════════════════════════════════════════════════════════════════════════════
POST3 = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">{GF}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1350px; overflow:hidden;
    background:{WHITE};
    font-family:'DM Sans', sans-serif;
    display:flex; flex-direction:column;
  }}
  .image-zone {{
    height:640px; flex-shrink:0;
    background:{CREAM};
    display:flex; align-items:center; justify-content:center;
    position:relative; overflow:hidden;
  }}
  .image-zone::before {{
    content:''; position:absolute; inset:0;
    background:radial-gradient(ellipse at 50% 55%, #d4ecf6 0%, {CREAM} 75%);
  }}
  .image-zone img {{
    height:620px; object-fit:contain; position:relative; z-index:1;
    filter:drop-shadow(0 24px 56px rgba(26,46,74,.16));
    transform:scale(1.12) translateY(24px);
  }}

  .text-zone {{
    flex:1; padding:48px 72px 52px;
    display:flex; flex-direction:column; justify-content:space-between;
  }}
  .label {{
    font-size:11px; letter-spacing:.35em; text-transform:uppercase;
    color:{ACCENT}; font-weight:600;
  }}
  .title {{
    font-family:'DM Serif Display', serif;
    font-size:72px; line-height:.98; color:{NAVY};
    margin-top:10px;
  }}

  .ingredients {{ margin-top:28px; display:flex; flex-direction:column; gap:22px; }}
  .ingredient {{ display:flex; flex-direction:column; gap:3px; }}
  .ing-row {{ display:flex; align-items:center; gap:14px; }}
  .dot {{ width:6px; height:6px; border-radius:50%; background:{ACCENT}; flex-shrink:0; }}
  .ing-name {{ font-size:20px; color:{NAVY}; font-weight:500; letter-spacing:.02em; }}
  .ing-desc {{
    font-size:14px; color:{MUTED}; font-weight:300;
    letter-spacing:.03em; padding-left:20px;
  }}

  .footer {{
    display:flex; gap:24px;
    font-size:13px; letter-spacing:.16em; text-transform:uppercase;
    color:{MUTED}; font-weight:500;
  }}
</style></head>
<body>
  <div class="image-zone">
    <img src="{OPEN_CAN}" alt="Aire open can">
  </div>
  <div class="text-zone">
    <div>
      <div class="label">Naturally Clear</div>
      <div class="title">What's<br>Inside.</div>
      <div class="ingredients">
        <div class="ingredient">
          <div class="ing-row"><div class="dot"></div><div class="ing-name">Peppermint</div></div>
          <div class="ing-desc">Cool, fresh clarity</div>
        </div>
        <div class="ingredient">
          <div class="ing-row"><div class="dot"></div><div class="ing-name">Eucalyptus</div></div>
          <div class="ing-desc">Open airways, sharp focus</div>
        </div>
        <div class="ingredient">
          <div class="ing-row"><div class="dot"></div><div class="ing-name">Menthol</div></div>
          <div class="ing-desc">Instant breathable sensation</div>
        </div>
      </div>
    </div>
    <div class="footer">
      <span>Zero Nicotine</span>
      <span>&middot;</span>
      <span>Zero Caffeine</span>
      <span>&middot;</span>
      <span>All Natural</span>
    </div>
  </div>
</body></html>"""


# ══════════════════════════════════════════════════════════════════════════════
# POST 4 – Clean Label / Dark  (v2)
# FIX: Cans bigger + subtle glow, supporting text more visible, stronger presence
# ══════════════════════════════════════════════════════════════════════════════
POST4 = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">{GF}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1350px; overflow:hidden;
    background:linear-gradient(155deg, {NAVY} 0%, {NAVY2} 100%);
    font-family:'DM Sans', sans-serif;
    display:flex; flex-direction:column;
    padding:56px 64px 60px;
  }}
  .top-label {{
    font-size:12px; letter-spacing:.3em; text-transform:uppercase;
    color:rgba(255,255,255,.55); font-weight:500;
  }}
  .image-wrap {{
    flex:1; display:flex; align-items:center; justify-content:center;
    margin:24px -32px;
    position:relative;
  }}
  /* subtle radial glow behind product */
  .image-wrap::before {{
    content:''; position:absolute;
    width:600px; height:400px; border-radius:50%;
    background:radial-gradient(ellipse, rgba(90,155,191,.2) 0%, transparent 70%);
    top:50%; left:50%; transform:translate(-50%,-50%);
  }}
  .image-wrap img {{
    height:560px; object-fit:contain; position:relative; z-index:1;
    filter:drop-shadow(0 0 80px rgba(94,155,191,.22));
    transform:scale(1.36);
  }}
  .statement {{ display:flex; flex-direction:column; gap:0; }}
  .stat-line {{
    font-family:'DM Serif Display', serif;
    line-height:1.0; color:{WHITE};
  }}
  .stat-line.huge {{ font-size:96px; letter-spacing:-2px; }}
  .stat-line.large {{ font-size:72px; letter-spacing:-1px; color:rgba(255,255,255,.6); }}
  .divider {{ height:1px; background:rgba(255,255,255,.14); margin:28px 0; }}
  .footer-row {{
    display:flex; align-items:center; justify-content:space-between;
  }}
  .tagline {{
    font-size:16px; color:rgba(255,255,255,.65); font-weight:300;
    letter-spacing:.04em;
  }}
  .brand {{
    font-family:'DM Serif Display', serif;
    font-size:24px; color:rgba(255,255,255,.55); letter-spacing:.12em;
  }}
</style></head>
<body>
  <div class="top-label">Aire &middot; Flow Pouches</div>
  <div class="image-wrap">
    <img src="{CTA_CANS}" alt="Aire cans">
  </div>
  <div class="statement">
    <div class="stat-line huge">Zero</div>
    <div class="stat-line huge">nicotine.</div>
    <div class="stat-line large">Zero caffeine.</div>
  </div>
  <div class="divider"></div>
  <div class="footer-row">
    <div class="tagline">Just clean, breathable energy.</div>
    <div class="brand">AIRE</div>
  </div>
</body></html>"""


# ══════════════════════════════════════════════════════════════════════════════
# POST 5 – Lake Lifestyle  (v2)
# FIX: Larger headline, darker bottom gradient, drop tiny sub-text,
#      more cinematic feel
# ══════════════════════════════════════════════════════════════════════════════
POST5 = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">{GF}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1350px; overflow:hidden;
    font-family:'DM Sans', sans-serif; position:relative;
  }}
  .photo {{
    position:absolute; inset:0;
    background:url('{LAKE}') center/cover no-repeat;
  }}
  .vignette {{
    position:absolute; inset:0;
    background:radial-gradient(ellipse at 50% 45%, transparent 35%, rgba(15,30,50,.5) 100%);
  }}
  .top-fade {{
    position:absolute; top:0; left:0; right:0; height:180px;
    background:linear-gradient(to bottom, rgba(15,30,50,.55) 0%, transparent 100%);
  }}
  .bottom-fade {{
    position:absolute; bottom:0; left:0; right:0; height:480px;
    background:linear-gradient(to top, rgba(10,20,38,.92) 0%, rgba(10,20,38,.4) 60%, transparent 100%);
  }}
  .top-bar {{
    position:absolute; top:0; left:0; right:0;
    padding:44px 60px;
    display:flex; align-items:center; justify-content:space-between;
    z-index:10;
  }}
  .top-bar img {{ height:40px; filter:brightness(0) invert(1); opacity:.9; }}
  .top-bar .loc {{
    font-size:14px; letter-spacing:.22em; text-transform:uppercase;
    color:rgba(255,255,255,.6); font-weight:400;
  }}
  .text-block {{
    position:absolute; bottom:0; left:0; right:0;
    padding:0 64px 68px; z-index:10;
  }}
  .eyebrow {{
    font-size:13px; letter-spacing:.3em; text-transform:uppercase;
    color:rgba(255,255,255,.6); margin-bottom:18px; font-weight:500;
  }}
  .headline {{
    font-family:'DM Serif Display', serif;
    font-size:92px; line-height:.96; color:{WHITE};
    letter-spacing:-1px;
  }}
  .headline em {{ font-style:italic; color:{SKY}; }}
  .sub {{
    font-size:16px; color:rgba(255,255,255,.65);
    font-weight:300; letter-spacing:.06em;
    margin-top:24px;
  }}
</style></head>
<body>
  <div class="photo"></div>
  <div class="vignette"></div>
  <div class="top-fade"></div>
  <div class="bottom-fade"></div>
  <div class="top-bar">
    <img src="{LOGO}" alt="Aire">
    <span class="loc">Find clarity anywhere</span>
  </div>
  <div class="text-block">
    <div class="eyebrow">Aire &middot; Flow Pouches</div>
    <div class="headline">In your<br><em>element.</em></div>
    <div class="sub">Breathe clear. Think sharper. Go further.</div>
  </div>
</body></html>"""


# ══════════════════════════════════════════════════════════════════════════════
# POST 6 – Launch Teaser  (v2)
# FIX: Rebalanced type (no comically large "new"), lighter overlay so studio
#      details show, better vertical rhythm
# ══════════════════════════════════════════════════════════════════════════════
POST6 = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8">{GF}
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1350px; overflow:hidden;
    font-family:'DM Sans', sans-serif; position:relative;
  }}
  .photo {{
    position:absolute; inset:0;
    background:url('{STUDIO}') center/cover no-repeat;
  }}
  .overlay {{
    position:absolute; inset:0;
    background:linear-gradient(
      160deg,
      rgba(15,30,50,.62) 0%,
      rgba(15,30,50,.38) 40%,
      rgba(15,30,50,.68) 100%
    );
  }}
  .content {{
    position:absolute; inset:0;
    display:flex; flex-direction:column;
    justify-content:space-between;
    padding:52px 64px 60px;
    z-index:10;
  }}
  .top-row {{
    display:flex; align-items:center; justify-content:space-between;
  }}
  .top-row img {{ height:36px; filter:brightness(0) invert(1); opacity:.85; }}
  .pill {{
    font-size:13px; letter-spacing:.25em; text-transform:uppercase;
    color:rgba(255,255,255,.9); font-weight:600;
    border:1px solid rgba(255,255,255,.45);
    padding:9px 22px; border-radius:100px;
  }}
  .center-block {{
    flex:1; display:flex; flex-direction:column;
    justify-content:center; gap:4px;
  }}
  .line1 {{
    font-family:'DM Serif Display', serif;
    font-size:72px; line-height:1.0; color:{WHITE};
    font-style:italic; opacity:.92;
  }}
  .line2 {{
    font-family:'DM Serif Display', serif;
    font-size:92px; line-height:.88; color:{WHITE};
    letter-spacing:-2px;
  }}
  .line3 {{
    font-family:'DM Serif Display', serif;
    font-size:62px; line-height:1.05; color:{SKY};
    font-style:italic; margin-top:4px;
  }}
  .bottom-block {{
    border-top:1px solid rgba(255,255,255,.18);
    padding-top:24px;
    display:flex; align-items:center; justify-content:space-between;
  }}
  .hint {{
    font-size:14px; color:rgba(255,255,255,.6);
    font-weight:300; letter-spacing:.06em;
  }}
  .brand {{
    font-family:'DM Serif Display', serif;
    font-size:18px; letter-spacing:.18em;
    color:rgba(255,255,255,.5); text-transform:uppercase;
  }}
</style></head>
<body>
  <div class="photo"></div>
  <div class="overlay"></div>
  <div class="content">
    <div class="top-row">
      <img src="{LOGO}" alt="Aire">
      <div class="pill">Coming Soon</div>
    </div>
    <div class="center-block">
      <div class="line1">Something</div>
      <div class="line2">new</div>
      <div class="line3">is in the air.</div>
    </div>
    <div class="bottom-block">
      <div class="hint">Stay tuned &middot; airepouches.com</div>
      <div class="brand">Aire</div>
    </div>
  </div>
</body></html>"""


# ── Render ────────────────────────────────────────────────────────────────────
POSTS = [
    ("post-01-product-hero.png",         POST1),
    ("post-02-coastal-lifestyle.png",    POST2),
    ("post-03-ingredient-spotlight.png", POST3),
    ("post-04-clean-label.png",          POST4),
    ("post-05-lake-lifestyle.png",       POST5),
    ("post-06-launch-teaser.png",        POST6),
]

async def render():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for fn, html in POSTS:
            page = await browser.new_page(viewport={"width": 1080, "height": 1350})
            await page.set_content(html, wait_until="networkidle")
            await page.screenshot(path=str(OUT / fn), full_page=False)
            print(f"✓  {fn}")
            await page.close()
        await browser.close()
    print(f"\nAll 6 v2 posts saved to: {OUT}")

if __name__ == "__main__":
    asyncio.run(render())
