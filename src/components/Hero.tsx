'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent, type MotionStyle } from 'framer-motion'
import dynamic from 'next/dynamic'
import WordReveal from './ui/WordReveal'
import Magnetic from './ui/Magnetic'
import { fadeUpWithDelay } from '@/lib/motion'

const ThreeCanHero = dynamic(() => import('./ThreeCanHero'), { ssr: false })

const CHECKOUT_URL = 'https://drifts-7838.myshopify.com/cart/47952645161208:1'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

/** Decorative background blobs + gradient wash, shared by both hero variants. */
function HeroBackdrop() {
  return (
    <>
      <div className="absolute top-[-120px] right-[-80px] w-[620px] h-[620px] rounded-full bg-[#80aad0]/18 blur-3xl z-0" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl z-0" />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-[-6%] w-[58%] z-0 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.10) 0%, rgba(141,183,214,0.10) 18%, rgba(112,155,190,0.22) 42%, rgba(83,123,159,0.34) 68%, rgba(83,123,159,0) 100%)',
        }}
      />
    </>
  )
}

/** Per-word breakdown of the three headline lines, shared by both hero variants. */
const HEADLINE_WORDS = [
  { words: [{ text: 'Find' }, { text: 'Your' }] },
  { words: [{ text: 'Balance.', em: true }] },
  { words: [{ text: 'Instantly.' }] },
]

/** Copy column: eyebrow, headline, body, stars, CTAs. Shared markup, motion differs per variant. */
function HeroCopy({
  animated,
  headlineLineStyles,
}: {
  animated: boolean
  /** Optional scroll-linked per-line drift styles (x / letter-spacing), desktop pinned hero only. */
  headlineLineStyles?: MotionStyle[]
}) {
  const eyebrow = (
    <div className="flex items-center gap-3 mb-5">
      <span className="block w-8 h-px bg-accent" />
      <span className="text-[0.67rem] font-semibold tracking-[0.22em] uppercase text-accent">The lifestyle pouch, reimagined</span>
    </div>
  )

  const headline = animated ? (
    <WordReveal
      as="h1"
      className="font-serif leading-[1.04] text-navy tracking-[-0.03em] mb-5 text-display"
      delay={0.1}
      wordStagger={0.045}
      emClassName="italic text-navy-mid"
      lines={HEADLINE_WORDS}
      lineStyles={headlineLineStyles}
    />
  ) : (
    <h1
      className="font-serif leading-[1.04] text-navy tracking-[-0.03em] mb-5"
      style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)' }}
    >
      Find Your<br />
      <em className="italic text-navy-mid">Balance.</em><br />
      Instantly.
    </h1>
  )

  const body = (
    <p className="text-[0.95rem] md:text-[1rem] text-navy-mid leading-[1.7] font-light mb-7 max-w-[440px]">
      The first nicotine-free wellness pouch built for calmness, clarity, and mental presence, anytime of the day.<sup className="text-[0.6em]">†</sup> Four science-backed adaptogens. One pocket-sized moment of calm.
    </p>
  )

  const stars = (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center gap-0.5 text-[#e8a820]">
        {[...Array(4)].map((_, i) => <span key={i} className="text-sm">★</span>)}
        <span className="text-sm relative inline-block w-[1em] overflow-hidden">
          <span className="text-[#e8a820]/20">★</span>
          <span className="absolute top-0 left-0 overflow-hidden" style={{ width: '75%' }}>★</span>
        </span>
      </div>
      <span className="text-[0.78rem] text-navy-mid font-medium">Loved by 200+ customers</span>
    </div>
  )

  const ctas = (
    <div className="flex items-center gap-4 flex-wrap">
      {/* padding kept below half the gap-4 (16px) neighbor spacing so the
          expanded hit area never overlaps the adjacent "How it works" link */}
      <Magnetic padding={12}>
        <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block bg-navy text-white px-7 py-3.5 rounded-full text-[0.78rem] font-semibold tracking-[0.1em] uppercase shadow-[0_10px_36px_rgba(26,46,74,0.28)] whitespace-nowrap">
          Get Your 4-Pack
        </a>
      </Magnetic>
      <a href="#how-to-use" className="text-[0.8rem] font-medium text-navy-mid hover:text-accent transition-colors duration-200 flex items-center gap-1.5 group whitespace-nowrap">
        How it works
        <span className="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
      </a>
    </div>
  )

  if (!animated) {
    return (
      <div className="max-w-[560px] w-full">
        {eyebrow}
        {headline}
        {body}
        {stars}
        {ctas}
      </div>
    )
  }

  return (
    <div className="max-w-[560px] w-full">
      <motion.div variants={fadeUpWithDelay(0.25)} initial="hidden" animate="visible">
        {eyebrow}
      </motion.div>
      {headline}
      <motion.div variants={fadeUpWithDelay(0.35)} initial="hidden" animate="visible">
        {body}
      </motion.div>
      <motion.div variants={fadeUpWithDelay(0.45)} initial="hidden" animate="visible">
        {stars}
      </motion.div>
      <motion.div variants={fadeUpWithDelay(0.5)} initial="hidden" animate="visible">
        {ctas}
      </motion.div>
    </div>
  )
}

/** Cluster of blurred accent glows sitting behind the 3D can canvas. */
function CanGlows() {
  return (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute top-[7%] right-[18%] w-[220px] h-[220px] md:w-[280px] md:h-[280px] rounded-full bg-white/20 blur-[70px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[8%] right-[26%] w-[320px] h-[220px] md:w-[420px] md:h-[260px] rounded-full bg-[#6ea0ca]/24 blur-[90px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[6%] right-[-2%] w-[260px] h-[200px] md:w-[340px] md:h-[240px] rounded-full bg-[#496d98]/18 blur-[95px]" />
    </>
  )
}

/** Static/mobile variant: today's layout, no pinning, no scroll-drive. */
function StaticHero({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <HeroBackdrop />
      <div className="relative z-10 flex flex-col md:grid md:grid-cols-2 items-center gap-8 px-6 md:px-20 pt-14 md:pt-16 pb-20 md:pb-24 max-w-[1400px] mx-auto">
        <HeroCopy animated={!reducedMotion} />
        <motion.div
          className="relative flex justify-center items-center w-full h-[380px] md:h-[480px]"
          variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
        >
          <CanGlows />
          <ThreeCanHero
            aria-label="Aire nicotine-free wellness pouch tins rendered in 3D"
            className=""
            reducedMotion={reducedMotion}
          />
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white/30 to-transparent z-10" />
    </section>
  )
}

/** Desktop, motion-enabled variant: pinned 145vh section, scroll-choreographed scene + copy. */
function PinnedHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollProgressRef = useRef(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    scrollProgressRef.current = v
  })

  // Section is h-[145vh] with a h-[100svh] sticky child, so the pin only holds for
  // the first (145-100)/145 ≈ 0.310 of scrollYProgress (0..1 spans the FULL section,
  // not just the pinned window). Choreograph the handoff to fully resolve inside that
  // window — otherwise the fade never gets to play while pinned and the section
  // unpins mid-animation, jumping straight to full opacity/no-transform. Keeping the
  // section closer to the pin's actual needs (vs. an oversized 170vh) also avoids a
  // long stretch of blank scroll after the content has faded but before the section
  // has fully scrolled past.
  const PIN_END = 0.31
  const copyY = useTransform(scrollYProgress, [0.19 * PIN_END, 0.85 * PIN_END], [0, -60])
  const copyOpacity = useTransform(scrollYProgress, [0.19 * PIN_END, 0.85 * PIN_END], [1, 0])
  const canvasOpacity = useTransform(scrollYProgress, [0.27 * PIN_END, 0.95 * PIN_END], [1, 0])
  const canvasScale = useTransform(scrollYProgress, [0.27 * PIN_END, 0.95 * PIN_END], [1, 1.06])
  const affordanceOpacity = useTransform(scrollYProgress, [0, 0.15 * PIN_END], [1, 0])

  // Kinetic type moment: the three headline lines drift apart microscopically
  // while pinned — felt, not seen. Mapped over the same scrollYProgress driving
  // the rest of the hero choreography (no second useScroll).
  // NOTE: line 2 previously also animated letter-spacing (-0.03em -> -0.01em).
  // letter-spacing is a LAYOUT property — animating it re-flowed the headline on
  // every pinned scroll frame (a per-frame reflow). Removed for perf; the x drifts
  // below are GPU transforms (compositor-only) and carry the kinetic feel.
  const line1X = useTransform(scrollYProgress, [0.1, 0.6], [0, -14])
  const line2X = useTransform(scrollYProgress, [0.1, 0.6], [0, 10])
  const line3X = useTransform(scrollYProgress, [0.1, 0.6], [0, -6])
  const headlineLineStyles: MotionStyle[] = [
    { x: line1X },
    { x: line2X },
    { x: line3X },
  ]

  return (
    <section ref={sectionRef} className="relative h-[145vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-hero-gradient">
        <HeroBackdrop />
        <div className="relative z-10 grid grid-cols-2 items-center gap-8 px-20 h-full max-w-[1400px] mx-auto">
          <motion.div style={{ y: copyY, opacity: copyOpacity }}>
            <HeroCopy animated headlineLineStyles={headlineLineStyles} />
          </motion.div>
          <motion.div
            className="relative flex justify-center items-center w-full h-[480px]"
            style={{ opacity: canvasOpacity, scale: canvasScale }}
            variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
          >
            <CanGlows />
            <ThreeCanHero
              aria-label="Aire nicotine-free wellness pouch tins rendered in 3D"
              className=""
              scrollProgressRef={scrollProgressRef}
            />
          </motion.div>
        </div>
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2.5"
          style={{ opacity: affordanceOpacity }}
        >
          <span className="text-[0.625rem] font-semibold tracking-[0.2em] uppercase text-navy/30">Scroll</span>
          <span className="block w-px h-10 bg-navy/30" />
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white/30 to-transparent z-10" />
      </div>
    </section>
  )
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Pin/choreograph only once mounted, confirmed desktop, and motion is allowed.
  // Before mount (SSR + first client paint) fall back to the static variant so
  // there is no hydration mismatch and no flash of pinned layout on mobile.
  const usePinned = mounted && isDesktop && !shouldReduceMotion

  if (usePinned) {
    return <PinnedHero />
  }

  return <StaticHero reducedMotion={!!shouldReduceMotion} />
}
