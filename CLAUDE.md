# Aire Site — Project Context

## About
Aire (airepouches.com) is a breath wellness oral pouch brand. The product is a dietary supplement pouch containing Rhodiola Rosea, L-Theanine, Vitamin B9, and Saffron. Tagline: "Find Your Balance." Positioning: no nicotine, no caffeine, pure balance. The flagship SKU is "Calm Mint Pouches" (15 per can, 4-pack for $45.99).

**Company:** Drifts LLC, New York, NY
**Owner:** Thomas Pasyanos (Aire)

## Tech Stack
- **Framework:** Next.js 14.2.5 (App Router) with TypeScript
- **Styling:** Tailwind CSS 3.4
- **3D Rendering:** Three.js 0.183.2 (WebGL spinning can animations)
- **Animation:** Framer Motion 11.3
- **Hosting:** Vercel
- **E-commerce:** Shopify (separate storefront, linked from site)
- **Domain:** airepouches.com

## Project Structure
```
src/
  app/
    page.tsx          — Homepage (assembles all sections)
    layout.tsx        — Root layout
    faq/page.tsx      — FAQ page (has pricing mention)
    privacy/          — Privacy policy
    shipping/         — Shipping policy
    terms/            — Terms of service
  components/
    Navbar.tsx        — Navigation bar
    Hero.tsx          — Hero section with 3-can WebGL animation
    ThreeCanHero.tsx  — Three.js 3-can hero (dynamically imported, ssr: false)
    SpinningCan.tsx   — Single spinning can for "Our Story" section
    About.tsx         — "Our Story" section with single spinning can
    Balance.tsx       — Balance/wellness section
    HowToUse.tsx      — How to use instructions
    Ingredients.tsx   — Ingredients breakdown
    ProductFeature.tsx— Product feature highlight
    LifestyleStrip.tsx— Lifestyle imagery strip
    Testimonials.tsx  — Customer testimonials
    Ticker.tsx        — Scrolling ticker/marquee
    CTAFooter.tsx     — CTA section + footer (has pricing, open-can image)
    EmailPopup.tsx    — Email capture popup
    FadeUp.tsx        — Scroll fade-in animation wrapper
public/
  images/
    can-front-texture.png  — Front face texture for 3D can
    can-back-texture.png   — Back face texture for 3D can
    can-band-texture.png   — Edge/band texture for 3D can
    open-can.png           — Open can showing pouches (used in CTA)
    logo.png               — Aire logo
    lifestyle-*.png        — Lifestyle photography
    cta-cans.png           — Old 3-can CTA image (replaced by open-can)
    three-cans.png         — Static 3-can image (legacy)
    three-cans-new.png     — Updated static 3-can image (legacy)
```

## 3D Can Rendering (Critical Technical Details)

Both `SpinningCan.tsx` and `ThreeCanHero.tsx` share these settings. Keep them in sync.

### Materials
- **Face (front/back):** MeshPhysicalMaterial — roughness: 0.32, metalness: 0.01, clearcoat: 0.45, clearcoatRoughness: 0.18, envMapIntensity: 0.2
- **Edge/body:** roughness: 0.25, metalness: 0.08, clearcoat: 0.5, clearcoatRoughness: 0.2, envMapIntensity: 0.45
- **Bevel:** roughness: 0.18, metalness: 0.12, clearcoat: 0.7, envMapIntensity: 1.0

### Tone Mapping & Lighting
- ACESFilmicToneMapping at exposure 0.92 (NOT LinearToneMapping — that washes out the teal)
- Ambient light: 0xf5f3f0 at intensity 0.45 (warm, NOT cool blue)
- Key light: white, 1.0 intensity, position (4, 4, 5)
- Fill light: 0xeaf2f8, 0.7 intensity, position (-4, 2, 4)
- Rim light: white, 0.65 intensity, position (0, 2, -5)
- Top light: 0xf8f8ff, 0.35 intensity, position (0, 6, 2)
- Bottom fill: 0xe0ecf4, 0.25 intensity, position (0, -3, 3)

### Environment Map
- Custom procedural HDRI via PMREMGenerator with shader-based gradient sphere
- Studio-style: warm horizon, cool top/bottom, 3 soft spotlight accents

### Can Geometry
- tinRadius: 1.4, tinDepth: 0.602, lidThickness: 0.02, bevelRadius: 0.03
- Tilt: rotation.x = -0.55, rotation.z = -0.03 (product-shot angle)
- NO notch/tab geometry (was removed — it protruded beyond circular profile during spin)

### Animation
- **Eased spin formula:** `progress - Math.sin(progress * Math.PI * 2) / (Math.PI * easingStrength)`
- easingStrength: 1.4, creates a smooth pause-at-front effect
- Float bob: `Math.sin(t * 0.5) * 0.06` on tiltGroup.position.y

### ThreeCanHero Motion Design
- **Top can (showcase):** Gentle oscillating rock, brand always visible. oscillateSpeed: 0.35, oscillateAmplitude: 0.45 (±26°). Uses `Math.sin(t * speed) * amp` for Y rotation.
- **Bottom-left can (turntable):** Full eased rotation, spinDirection: -1, cycleTime: 6.0
- **Bottom-right can (turntable):** Full eased rotation, spinDirection: 1, cycleTime: 5.0

### Responsive Scaling (ThreeCanHero)
- Narrow mobile (aspect < 0.75): 62% scale, camera z=12.5
- Tablet/wide mobile (aspect < 1.1): 78% scale, camera z=11
- Desktop: full scale, camera z=10

## Brand Colors
- **Primary teal:** #84afb5 — RGB(132, 175, 181)
- **Deep navy (text/buttons):** #1a2e4a
- **Website background:** Light blue-gray ~#edf4f9

## Design Preferences
- Premium, clean, minimalist aesthetic
- No price in hero CTA button (just "Order Aire" — tested better for premium positioning)
- Pricing lives in CTA footer section and FAQ, not hero
- Mobile responsiveness is high priority
- Prefer subtle animations (Framer Motion fade-ups) over flashy transitions
- 3D spinning can is the signature brand element

## Pricing
- Current price: **$45.99** for 4-pack
- Price appears in: CTAFooter.tsx, faq/page.tsx
- Shopify handles actual checkout at $45.99

## Shopify Integration
- Shopify storefront is separate from the Next.js site
- "Order Aire" buttons link to Shopify checkout
- Product media: spinning can GIF (aire-can-shopify.gif) uploaded for autoplay
- Shopify accepts: images, videos (.mov/.mp4), GIFs (autoplay), 3D models

## Git & Deployment
- Repository hosted on GitHub
- Deploys to Vercel automatically on push to main
- VM (Cowork) cannot push to GitHub — user must push locally
- Always commit changes in the VM, then tell the user to run these exact commands:
  ```
  cd ~/aire-site && git pull && git push origin main
  ```
- ALWAYS provide the full copy-pasteable commands above after committing — the user does not know git commands from memory
- If the user's repo is in a different directory, adjust the `cd` path accordingly

## Common Gotchas
- Three.js components MUST use `dynamic(() => import(...), { ssr: false })` in Next.js
- Texture colorSpace must be set to `THREE.SRGBColorSpace` or colors look wrong
- LinearToneMapping makes the teal look too blue/washed — always use ACESFilmic
- macOS screen recordings have Unicode narrow no-break space (U+202F) before AM/PM in filenames — use glob patterns, not quoted strings
- SpinningCan.tsx and ThreeCanHero.tsx materials/lighting must stay in sync

## Design & Creative Work — Iterative Self-Critique Process

When producing any visual or creative deliverable (email templates, landing pages, UI components, marketing assets), follow this mandatory build-review-iterate loop. Do not ship V1. Treat every first draft as a starting point, not a finished product.

### The Process

1. **Build V1** — Get the structure and content in place. Don't worry about perfection.
2. **Self-Review with Extreme Scrutiny** — Before showing the user, critically evaluate every detail:
   - **Spacing & Rhythm:** Is there dead space? Are sections too cramped or too loose? Does vertical rhythm feel intentional?
   - **Visual Hierarchy:** Does the eye flow naturally? Are headings, body text, and CTAs clearly differentiated?
   - **Brand Fidelity:** Go back to the actual source components (Hero.tsx, Ingredients.tsx, CTAFooter.tsx, etc.) and compare. Don't guess at colors, card styles, or typography — read the real code.
   - **Structural Integrity:** Are equal-height elements actually equal? Are cards balanced? Do spacers and gutters feel consistent?
   - **Technical Correctness:** For emails — do MSO conditionals cover Outlook? Are VML buttons present? Will `rgba()` values break in older clients? For web — is it responsive at all breakpoints?
   - **Copy Quality:** Is the tone premium and concise? Does it match the brand voice? Remove anything that feels generic or filler.
   - **Detail Sweep:** Check eyebrow lines, dividers, border-radius values, font sizes, letter-spacing, opacity values. These micro-details separate good from exceptional.
3. **Identify Specific Flaws** — Write out exactly what's wrong and why. Not "spacing is off" but "ingredient cards have 40% dead space below text because min-height:148px forces unused vertical room."
4. **Rebuild with Fixes** — Address every identified flaw. This is V2.
5. **Repeat** — Do at least one more review cycle (V2 → V3 minimum). Premium work typically requires 3-4 iterations.

### Key Principles

- **Reference the source of truth.** Always read the actual website components before designing anything brand-adjacent. Don't rely on memory or assumptions about colors, card styles, or layouts.
- **Ask "would Jony Ive ship this?"** If the answer is no, keep iterating. Look for the details that separate a $50/hr deliverable from a $500/hr one.
- **Structural problems need structural solutions.** If a card has dead space, the fix isn't padding adjustment — it's rethinking how height is determined (e.g., switching from `min-height` on inner divs to `<td>` cells that naturally match height in the same `<tr>`).
- **Name the compromise.** If something can't be perfect due to technical constraints (e.g., email client limitations), document why and what the tradeoff is.

### Email-Specific Lessons Learned

- **Cards:** Style directly on `<td>` elements in the same `<tr>` for natural height matching. Never use `min-height` on inner `<div>` wrappers — they create dead space.
- **Eyebrow hairlines:** Use `border-bottom:1px solid` with `font-size:0;line-height:0;height:0;overflow:hidden`. Background-color + height approach breaks when `&nbsp;` expands the cell.
- **Ingredient cards:** Must match the website's dark glass-morphism aesthetic (`bg-white/[0.07]`, `border border-white/[0.12]` on navy). White cards on pale backgrounds look wrong.
- **Trust items:** Clean text with small geometric markers (◆), not emoji. Emoji looks amateur in a premium brand context.
- **Images:** Always verify image paths resolve. Use hosted URLs for production email; relative paths only work locally.
- **Outlook:** `rgba()` doesn't work — use `.card-mso` class overrides with solid hex fallbacks.
