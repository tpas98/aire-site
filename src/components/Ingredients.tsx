'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FadeUp from './FadeUp'
import Eyebrow from './ui/Eyebrow'
import { EASE, useMotionOK } from '@/lib/motion'

/**
 * Per-ingredient data.
 *  - `desc` is the byte-identical copy from the live site (benefit sentence
 *    ending in the "†" dagger, followed by a "what it is" sentence). Not a word
 *    of claim-bearing copy is altered anywhere in this file.
 *  - `form` / `source` are structural labels DERIVED from the existing "what it
 *    is" sentence only — no new health claims, no fabricated numbers. The site's
 *    supplement facts use a proprietary "AireComplex Blend" with "Daily Value
 *    not established" and NO per-ingredient mg breakdown, so no milligram values
 *    are shown here (there are none to source). `serving` is the real serving
 *    size from the FAQ supplement-facts table ("Serving Size: 1 Pouch").
 *  - `glow` positions/colors a soft radial wash behind each spread so the
 *    section breathes differently as you move through it. Colors are the brand
 *    range (teal / sky-deep / sky-light / accent) at low opacity.
 */
const ingredients = [
  {
    num: '01',
    name: 'Rhodiola Rosea',
    desc: 'Supports resilience to mental fatigue and stress, promoting sustained clarity and balanced energy.† Adaptogenic herb used to help the body adapt to stress.',
    form: 'Adaptogenic herb',
    source: 'Root extract',
    serving: '1 pouch',
    glow: { color: '132, 175, 181', pos: '16% 26%', opacity: 0.26 }, // teal
  },
  {
    num: '02',
    name: 'L-Theanine',
    desc: 'Promotes a relaxed but alert mental state, helping smooth stress and support focused clarity without drowsiness.† Amino acid naturally found in green tea.',
    form: 'Amino acid',
    source: 'Green tea',
    serving: '1 pouch',
    glow: { color: '126, 194, 223', pos: '88% 22%', opacity: 0.24 }, // sky-deep
  },
  {
    num: '03',
    name: 'Saffron',
    desc: 'Supports mood and emotional balance, contributing to a calm, clear headspace.† Botanical extract derived from the Crocus sativus flower.',
    form: 'Botanical extract',
    source: 'Crocus sativus',
    serving: '1 pouch',
    glow: { color: '200, 230, 245', pos: '22% 80%', opacity: 0.2 }, // sky-light
  },
  {
    num: '04',
    name: 'L-Tyrosine',
    desc: 'Amino acid precursor to dopamine and norepinephrine, supporting focus, motivation, and cognitive performance under stress.† Naturally produced by the body from phenylalanine.',
    form: 'Amino acid',
    source: 'Phenylalanine',
    serving: '1 pouch',
    glow: { color: '90, 155, 191', pos: '84% 78%', opacity: 0.28 }, // accent
  },
]

type Ingredient = (typeof ingredients)[number]

/**
 * Splits a description into its benefit sentence (ending in the disclaimer
 * dagger) and its trailing "what it is" sentence, without altering any
 * words. Falls back to rendering the whole string if the marker isn't found.
 */
function splitDesc(desc: string): [string, string | null] {
  const markerIndex = desc.indexOf('† ')
  if (markerIndex === -1) return [desc, null]
  const cut = markerIndex + 1 // include the dagger in the first part
  return [desc.slice(0, cut), desc.slice(cut + 1)]
}

/** Soft radial wash filling the whole spread, giving each panel its own light + hue. */
function SpreadGlow({ glow }: { glow: Ingredient['glow'] }) {
  return (
    <div
      aria-hidden="true"
      className="absolute -inset-x-8 -inset-y-16 pointer-events-none blur-3xl"
      style={{
        background: `radial-gradient(52% 52% at ${glow.pos}, rgba(${glow.color}, ${glow.opacity}), transparent 75%)`,
      }}
    />
  )
}

/**
 * Hairline-separated meta band (Serving / Form / Source). Values in eyebrow
 * style with white/85 readouts. Stretches across the spread to anchor the
 * composition — a supplement-monograph data strip, not a floating chip.
 */
function MetaBlock({ ingredient }: { ingredient: Ingredient }) {
  const rows: Array<[string, string]> = [
    ['Serving', ingredient.serving],
    ['Form', ingredient.form],
    ['Source', ingredient.source],
  ]
  return (
    <dl className="grid grid-cols-3 border-y border-white/[0.12] divide-x divide-white/[0.1]">
      {rows.map(([label, value]) => (
        <div key={label} className="py-4 pr-5 pl-5 first:pl-0">
          <dt className="text-[0.67rem] uppercase tracking-[0.2em] text-sky-deep/70 mb-2">{label}</dt>
          <dd className="text-white/85 text-[0.95rem] font-light leading-snug">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * Full-width editorial spread: hero benefit line, meta band, then the
 * "what it is" caption. No numeral here — the rail owns it.
 */
function IngredientSpread({ ingredient }: { ingredient: Ingredient }) {
  const [lead, trail] = splitDesc(ingredient.desc)
  return (
    <div className="relative w-full">
      <SpreadGlow glow={ingredient.glow} />
      <div className="relative">
        <p
          className="font-serif text-white/90 tracking-[-0.01em] mb-9 max-w-[24ch]"
          style={{ fontSize: 'clamp(1.6rem, 2.4vw, 2.3rem)', lineHeight: 1.35 }}
        >
          {lead.replace(/†\s*$/, '')}
          <span className="text-sky-deep">†</span>
        </p>
        <MetaBlock ingredient={ingredient} />
        {trail && (
          <p className="text-white/55 text-[0.9rem] leading-relaxed mt-7 max-w-[46ch]">{trail}</p>
        )}
      </div>
    </div>
  )
}

/** Sticky left rail: crossfading numeral + name + category tag, progress track. */
function StickyRail({ activeIndex }: { activeIndex: number }) {
  const active = ingredients[activeIndex]
  return (
    <div className="sticky top-28 self-start">
      <Eyebrow tone="dark" className="mb-8">The Formula</Eyebrow>
      <div className="relative min-h-[13rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.num}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div
              className="font-serif text-sky-deep/25 leading-none select-none"
              style={{ fontSize: 'clamp(4rem, 6vw, 6rem)' }}
            >
              {active.num}
            </div>
            <div
              className="font-serif text-white leading-[1.05] -mt-4 mb-4"
              style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)' }}
            >
              {active.name}
            </div>
            <div className="text-[0.67rem] uppercase tracking-[0.2em] text-sky-deep/70">
              {active.form}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress track: numbered ticks with a taller active segment. */}
      <div className="flex items-end gap-3 mt-10" aria-hidden="true">
        {ingredients.map((ing, i) => (
          <div key={ing.num} className="flex flex-col items-center gap-2">
            <span
              className={`block w-px rounded-full transition-all duration-300 ${
                i === activeIndex ? 'h-8 bg-sky-deep' : 'h-5 bg-white/15'
              }`}
            />
            <span
              className={`text-[0.6rem] tabular-nums tracking-wide transition-colors duration-300 ${
                i === activeIndex ? 'text-sky-deep' : 'text-white/25'
              }`}
            >
              {ing.num}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RailPanel({ index, registerRef, ingredient }: {
  index: number
  registerRef: (index: number, el: HTMLDivElement | null) => void
  ingredient: Ingredient
}) {
  return (
    <div ref={(el) => registerRef(index, el)} className="min-h-[50vh] flex items-center">
      <IngredientSpread ingredient={ingredient} />
    </div>
  )
}

function DesktopSequence() {
  const [activeIndex, setActiveIndex] = useState(0)
  const panelsRef = useRef<Array<HTMLDivElement | null>>([])
  const ratiosRef = useRef<number[]>(ingredients.map(() => 0))

  const registerRef = (index: number, el: HTMLDivElement | null) => {
    panelsRef.current[index] = el
  }

  useEffect(() => {
    // Single observer arbitrates across all panels: whichever panel has the
    // greatest intersection ratio within the centered band wins, avoiding
    // races when two panels straddle the -45%/-45% band simultaneously.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = panelsRef.current.indexOf(entry.target as HTMLDivElement)
          if (idx !== -1) ratiosRef.current[idx] = entry.isIntersecting ? entry.intersectionRatio : 0
        }
        let bestIndex = 0
        let bestRatio = -1
        ratiosRef.current.forEach((ratio, i) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestIndex = i
          }
        })
        if (bestRatio > 0) setActiveIndex(bestIndex)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    panelsRef.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="grid grid-cols-[5fr_7fr] gap-14 max-w-[1200px] mx-auto relative z-10">
      <StickyRail activeIndex={activeIndex} />
      <div className="flex flex-col gap-0">
        {ingredients.map((ing, i) => (
          <RailPanel key={ing.num} index={i} registerRef={registerRef} ingredient={ing} />
        ))}
      </div>
    </div>
  )
}

/** Mobile / reduced-motion: stacked full-width editorial spreads. */
function StackedSpread({ ingredient }: { ingredient: Ingredient }) {
  const [lead, trail] = splitDesc(ingredient.desc)
  return (
    <div className="relative">
      <SpreadGlow glow={ingredient.glow} />
      <div className="relative">
        <div className="flex items-baseline gap-3 mb-3">
          <span className="font-serif text-sky-deep/30 leading-none text-[2.4rem] select-none">
            {ingredient.num}
          </span>
          <span className="font-serif text-white text-[1.6rem] leading-none">{ingredient.name}</span>
        </div>
        <div className="text-[0.67rem] uppercase tracking-[0.2em] text-sky-deep/70 mb-7">
          {ingredient.form}
        </div>
        <p
          className="font-serif text-white/90 tracking-[-0.01em] mb-7"
          style={{ fontSize: 'clamp(1.4rem, 6vw, 1.9rem)', lineHeight: 1.35 }}
        >
          {lead.replace(/†\s*$/, '')}
          <span className="text-sky-deep">†</span>
        </p>
        <MetaBlock ingredient={ingredient} />
        {trail && (
          <p className="text-white/55 text-[0.9rem] leading-relaxed mt-6">{trail}</p>
        )}
      </div>
    </div>
  )
}

function StackedSpreads() {
  return (
    <div className="flex flex-col gap-16 max-w-[560px] mx-auto relative z-10">
      {ingredients.map((ing, i) => (
        <FadeUp key={ing.num} delay={i * 0.06}>
          <StackedSpread ingredient={ing} />
        </FadeUp>
      ))}
    </div>
  )
}

export default function Ingredients() {
  const motionOK = useMotionOK()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const useSequence = motionOK && isDesktop

  return (
    <section id="ingredients" className="bg-navy py-24 px-6 md:px-16 relative overflow-x-clip">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '128px' }} />
      <FadeUp className="text-center max-w-[560px] mx-auto mb-12 relative z-10">
        <Eyebrow tone="dark" align="center" className="mb-5">The Formula</Eyebrow>
        <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-white tracking-[-0.02em] mb-5">
          The AireComplex<br /><em className="italic text-sky-deep">Four active ingredients. One perfect outcome.</em>
        </h2>
        <p className="text-[0.95rem] text-white/60 leading-[1.84] font-light">
          Meticulous ingredient selection and precision dosing for optimal outcomes.
        </p>
      </FadeUp>

      {useSequence ? <DesktopSequence /> : <StackedSpreads />}

      <p className="text-[0.62rem] text-white/25 leading-relaxed max-w-[540px] mx-auto text-center mt-10 relative z-10">
        † These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </section>
  )
}
