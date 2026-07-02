'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'

/**
 * Continuous morphing backdrop that eliminates the hard seams between the light
 * homepage sections (white <-> off-white <-> pale-blue gradient).
 *
 * How it works:
 * - A single `fixed inset-0 -z-10` layer whose backgroundColor is a Framer motion
 *   value interpolated from the real document scroll position.
 * - The light sections carry `data-morph` and their own background is stripped
 *   (via the `[data-morph]` rule in globals-scoped inline logic; here we simply
 *   read their measured offsets) so this layer shows through them.
 * - Navy sections (Ingredients, CTA/Footer) keep solid backgrounds and paint over
 *   this layer; the stop map eases toward a deeper harmonizing hue at their edges
 *   so the transition isn't white-against-navy.
 * - The hero keeps its own designed gradient; the morph is pinned to white for the
 *   hero's scroll range and only starts easing once the hero has released.
 *
 * Gating: only renders (and only strips section backgrounds) when motion is OK.
 * The gate is applied by the parent — see MorphGate.
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

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** Interpolate the stop map at scroll progress `p` (0..1) into an rgb() string. */
function colorAt(stops: Stop[], p: number): string {
  if (stops.length === 0) return HUES.white
  if (p <= stops[0].at) return stops[0].color
  if (p >= stops[stops.length - 1].at) return stops[stops.length - 1].color
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]
    const b = stops[i + 1]
    if (p >= a.at && p <= b.at) {
      const span = b.at - a.at || 1
      const t = (p - a.at) / span
      const ca = hexToRgb(a.color)
      const cb = hexToRgb(b.color)
      return `rgb(${Math.round(lerp(ca[0], cb[0], t))}, ${Math.round(
        lerp(ca[1], cb[1], t),
      )}, ${Math.round(lerp(ca[2], cb[2], t))})`
    }
  }
  return stops[stops.length - 1].color
}

export default function BackgroundMorph() {
  const bg = useMotionValue<string>(HUES.white)
  const stopsRef = useRef<Stop[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let raf = 0

    const remeasure = () => {
      stopsRef.current = buildStops()
      update()
      setReady(true)
    }

    const update = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      const p = scrollable > 0 ? window.scrollY / scrollable : 0
      bg.set(colorAt(stopsRef.current, p))
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        update()
      })
    }

    // Initial measure, then re-measure after a frame and once everything (fonts,
    // images, 3D canvas layout) has settled, so offsets reflect final heights.
    remeasure()
    const rafSettle = requestAnimationFrame(remeasure)
    window.addEventListener('load', remeasure)
    window.addEventListener('resize', remeasure)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(rafSettle)
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('load', remeasure)
      window.removeEventListener('resize', remeasure)
      window.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ backgroundColor: ready ? bg : HUES.white }}
    />
  )
}
