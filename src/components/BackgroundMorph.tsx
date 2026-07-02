'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Continuous morphing backdrop that eliminates the hard seams between the light
 * homepage sections (white <-> off-white <-> pale-blue gradient).
 *
 * HISTORY / PERF (WP10):
 * This used to be a `fixed inset-0` layer whose backgroundColor was a Framer
 * motion value re-interpolated from window.scrollY on every scroll frame. A
 * fixed, full-viewport layer changing backgroundColor forces a style recalc +
 * full-viewport repaint EVERY scroll frame — pure main-thread/compositor cost
 * for a purely cosmetic gradient.
 *
 * It is now a zero-JS-per-frame equivalent: a single `absolute` div spanning the
 * full document height, painted ONCE with a CSS `linear-gradient` whose stops are
 * computed from the SAME measured section offsets and the SAME hue map + hold/lead
 * structure as before. Because it scrolls natively with the page (it is a normal
 * in-flow-height absolute element behind content, not a scroll listener), the GPU
 * composites it for free — no per-frame JS, no per-frame style recalc, no repaint.
 *
 * The gradient is rebuilt only on resize/load (when section offsets can change),
 * exactly as the old stop map was.
 *
 * How the color model maps to a gradient:
 * - The old model painted the WHOLE viewport one flat color
 *     C(scrollY) = colorAt(stops, scrollY / scrollable)
 *   i.e. a temporally-varying, spatially-uniform fill.
 * - A vertical linear-gradient is spatially-varying. To reproduce the same hue at
 *   the same scroll position, each stop the old model showed at scroll-fraction
 *   `at` (visible when scrollY = at * scrollable) is placed in the gradient at the
 *   document-y that sits at the VIEWPORT CENTER at that scroll:
 *     docY   = at * scrollable + innerHeight / 2
 *     gradPos = docY / scrollHeight            (0..1 down the document)
 *   The per-segment interpolation stays linear (same as colorAt), so the
 *   hold-then-ease stop structure produces the same harmonizing seams.
 *
 * Section-background stripping (html.morph-on [data-morph]) is unchanged and is
 * what lets this layer show through the light sections. Navy sections keep solid
 * backgrounds and paint over it. Gating (motion-OK / reduced-motion) is unchanged
 * and applied by the parent — see MorphGate.
 */

// Brand light-palette hues used as morph stops. All within the existing tokens:
//   white  = #ffffff        (LifestyleStrip / About / HowToUse)
//   soft   = #f3f8fc        (--aire-off-white: Testimonials / ProductFeature / FAQ)
//   pale   = #eaf5fb        (top of --aire-grad-section, Balance)
//   edge   = #d3e6f4        (a touch deeper — used only as a harmonizing lead-in
//                            approaching the navy sections, still in-family)
const HUES = {
  white: '#ffffff',
  soft: '#f3f8fc',
  pale: '#eaf5fb',
  edge: '#d3e6f4',
} as const

type Stop = { at: number; color: string }

/**
 * Per-section color intent, in DOM order. Each entry maps a section (matched by a
 * `data-morph-key`) to the hue the backdrop should hold across that section's span,
 * plus an optional `lead` hue to ease TOWARD near the section's end (used to deepen
 * the tone right before a navy section so the seam harmonizes).
 */
const SECTION_TINTS: { key: string; hold: string; lead?: string }[] = [
  { key: 'lifestyle', hold: HUES.white },
  { key: 'testimonials', hold: HUES.soft },
  { key: 'about', hold: HUES.white, lead: HUES.edge }, // -> navy Ingredients
  // Ingredients (navy) covers the morph here.
  { key: 'productfeature', hold: HUES.soft },
  { key: 'balance', hold: HUES.pale },
  { key: 'howtouse', hold: HUES.white },
  { key: 'faq', hold: HUES.soft, lead: HUES.edge }, // -> navy CTA
  // CTA + Footer (navy) cover the morph here.
]

/**
 * Build the same scroll-fraction stop map the old JS morph used (unchanged logic),
 * so the color-at-scroll behavior is identical before conversion to a gradient.
 * `at` is a fraction of the scrollable range (scrollHeight - innerHeight).
 */
function buildStops(): Stop[] {
  const doc = document.documentElement
  const scrollable = doc.scrollHeight - window.innerHeight
  if (scrollable <= 0) return []

  const stops: Stop[] = []
  const push = (yPx: number, color: string) => {
    const at = Math.min(1, Math.max(0, yPx / scrollable))
    stops.push({ at, color })
  }

  for (const tint of SECTION_TINTS) {
    const el = document.querySelector<HTMLElement>(`[data-morph-key="${tint.key}"]`)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    const top = rect.top + window.scrollY
    const bottom = top + rect.height

    // Hold the section's hue across most of its span. Place a stop a little past
    // the top (so the color is fully arrived by the time the section fills the
    // viewport) and, if there's a lead hue, ease toward it near the bottom.
    push(top - window.innerHeight * 0.5, tint.hold)
    if (tint.lead) {
      // Ease from the section's own hue toward the deeper harmonizing edge across
      // the last ~70% of the viewport before the navy seam, arriving at `edge`
      // right as the navy section's top reaches the fold — so the light side that
      // meets navy is a soft blue, never stark white.
      push(bottom - window.innerHeight * 0.7, tint.hold)
      push(bottom - window.innerHeight * 0.08, tint.lead)
    } else {
      push(bottom - window.innerHeight * 0.4, tint.hold)
    }
  }

  // Sort + dedupe monotonic positions (measurement rounding can collide).
  stops.sort((a, b) => a.at - b.at)
  const cleaned: Stop[] = []
  for (const s of stops) {
    const last = cleaned[cleaned.length - 1]
    if (last && s.at - last.at < 0.0005) {
      cleaned[cleaned.length - 1] = s // keep the later color at ~same position
    } else {
      cleaned.push(s)
    }
  }
  return cleaned
}

/**
 * Convert the scroll-fraction stop map into a `linear-gradient(to bottom, ...)`
 * string plus the total document height the gradient element should span.
 *
 * Each stop's scroll-fraction `at` becomes a document-position percentage by
 * mapping it to the document-y that sits at the viewport CENTER at that scroll
 * (see file header). Clamped to [0,1] and made monotonically non-decreasing so
 * the CSS gradient stays well-formed.
 */
function buildGradient(stops: Stop[]): { css: string; heightPx: number } | null {
  const doc = document.documentElement
  const scrollHeight = doc.scrollHeight
  const scrollable = scrollHeight - window.innerHeight
  if (stops.length === 0 || scrollHeight <= 0) return null

  const half = window.innerHeight / 2
  const parts: string[] = []
  let lastPct = -1
  for (const s of stops) {
    const docY = s.at * scrollable + half
    let pct = (docY / scrollHeight) * 100
    pct = Math.min(100, Math.max(0, pct))
    if (pct < lastPct) pct = lastPct // enforce monotonic order for CSS
    lastPct = pct
    parts.push(`${s.color} ${pct.toFixed(3)}%`)
  }

  // Anchor the very top and very bottom so the gradient covers the full document
  // even before the first / after the last computed stop (the old colorAt clamped
  // to the first/last stop color outside the range — replicate that by extending
  // the first color up to 0% and the last color down to 100%).
  if (parts.length) {
    parts.unshift(`${stops[0].color} 0%`)
    parts.push(`${stops[stops.length - 1].color} 100%`)
  }

  return {
    css: `linear-gradient(to bottom, ${parts.join(', ')})`,
    heightPx: scrollHeight,
  }
}

export default function BackgroundMorph() {
  const ref = useRef<HTMLDivElement>(null)
  const [gradient, setGradient] = useState<{ css: string; heightPx: number } | null>(null)

  useEffect(() => {
    const remeasure = () => {
      const stops = buildStops()
      setGradient(buildGradient(stops))
    }

    // Initial measure, then re-measure after a frame and once everything (fonts,
    // images, 3D canvas layout) has settled, so offsets reflect final heights —
    // same cadence as the old JS morph's remeasure hooks.
    remeasure()
    const rafSettle = requestAnimationFrame(remeasure)
    window.addEventListener('load', remeasure)
    window.addEventListener('resize', remeasure)

    return () => {
      cancelAnimationFrame(rafSettle)
      window.removeEventListener('load', remeasure)
      window.removeEventListener('resize', remeasure)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute top-0 left-0 w-full -z-10 pointer-events-none"
      style={{
        height: gradient ? `${gradient.heightPx}px` : '100%',
        backgroundColor: HUES.white,
        backgroundImage: gradient?.css,
      }}
    />
  )
}
