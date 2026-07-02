'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  motion,
  useMotionValue,
  useScroll,
  useVelocity,
  useSpring,
  useAnimationFrame,
} from 'framer-motion'
import Eyebrow from './ui/Eyebrow'
import SectionHeading from './ui/SectionHeading'
import { useMotionOK } from '@/lib/motion'

const images = [
  { src: '/images/lifestyle-wild-01-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a coastal lookout at golden hour' },
  { src: '/images/lifestyle-wild-02-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a quiet lake dock with morning mist' },
  { src: '/images/lifestyle-wild-03-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a creative studio desk' },
  { src: '/images/lifestyle-wild-04-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a hiking overlook with a daypack' },
  { src: '/images/lifestyle-wild-05-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a rooftop garden work table' },
  { src: '/images/lifestyle-wild-06-airecomplex-2026.png', alt: 'Open Aire Calm Mint tin on a beach towel near the water' },
  { src: '/images/lifestyle-wild-07-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a bright morning kitchen counter' },
  { src: '/images/lifestyle-wild-08-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a cafe table with a relaxed customer nearby' },
  { src: '/images/lifestyle-wild-09-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a park bench after a run' },
  { src: '/images/lifestyle-wild-10-airecomplex-2026.png', alt: 'Aire Calm Mint tin in a scenic road trip moment' },
]

const rowA = images.slice(0, 5)
const rowB = images.slice(5, 10)

// Editorial width/height rhythm, cycled per image.
const widths = [300, 420, 340, 460, 320]
const heights = [300, 340]

// Time (seconds) for a row to drift a full half-loop (one copy of its list).
// Slow and premium; the two rows are intentionally desynced.
const ROW_A_DURATION_S = 70
const ROW_B_DURATION_S = 85

function DriftTile({
  src,
  alt,
  width,
  height,
}: {
  src: string
  alt: string
  width: number
  height: number
}) {
  return (
    <div
      className="flex-shrink-0 overflow-hidden rounded-aire-lg"
      style={{ width, height }}
    >
      <Image
        src={src}
        alt={alt}
        width={700}
        height={400}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

/**
 * Autonomous, continuously-drifting row. Mirrors Ticker.tsx's VelocityTicker
 * motion system: the list is duplicated once and x is driven manually via
 * useAnimationFrame, accumulating distance = baseSpeed * multiplier * dt and
 * wrapping modulo the single-copy (half) width for a seamless infinite loop.
 *
 * `direction` sets drift sign (rows move in opposition). The scroll-velocity
 * multiplier (springed, 1x at rest up to ~1.8x while scrolling fast) is shared
 * behavior with the ingredient ticker for one coherent motion system.
 *
 * Transform-only, one rAF driver per row. Pauses on hover.
 */
function DriftRow({
  row,
  direction,
  durationS,
}: {
  row: typeof images
  direction: 1 | -1
  durationS: number
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const halfWidthRef = useRef(0)
  const x = useMotionValue(0)
  const distanceRef = useRef(0)
  const pausedRef = useRef(false)

  const { scrollY } = useScroll()
  const rawVelocity = useVelocity(scrollY)
  const speedMultiplier = useSpring(1, { stiffness: 90, damping: 20, mass: 0.5 })

  const doubled = [...row, ...row]

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        halfWidthRef.current = trackRef.current.scrollWidth / 2
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const unsubscribe = rawVelocity.on('change', (v) => {
      const magnitude = Math.min(Math.abs(v), 3000)
      // Map |velocity| 0->3000 to multiplier 1->1.8.
      const target = 1 + (magnitude / 3000) * 0.8
      speedMultiplier.set(target)
    })
    return unsubscribe
  }, [rawVelocity, speedMultiplier])

  useAnimationFrame((_, delta) => {
    const half = halfWidthRef.current
    if (!half || pausedRef.current) return
    const dt = delta / 1000
    const baseSpeed = half / durationS
    const speed = baseSpeed * speedMultiplier.get()
    // Accumulate in [0, half); apply drift direction to the sign of x.
    distanceRef.current = (distanceRef.current + speed * dt) % half
    x.set(direction === 1 ? -distanceRef.current : distanceRef.current - half)
  })

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <motion.div ref={trackRef} className="flex gap-6 w-max" style={{ x }}>
        {doubled.map(({ src, alt }, i) => (
          <DriftTile
            key={`${src}-${i}`}
            src={src}
            alt={alt}
            width={widths[(i % row.length) % widths.length]}
            height={heights[(i % row.length) % heights.length]}
          />
        ))}
      </motion.div>
    </div>
  )
}

function MobileRow() {
  return (
    <div
      className="flex gap-4 overflow-x-auto px-6 pb-2"
      style={{
        scrollSnapType: 'x mandatory',
        maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
      }}
    >
      {images.map(({ src, alt }) => (
        <div
          key={src}
          className="flex-shrink-0 overflow-hidden rounded-aire-lg"
          style={{ width: '78vw', height: '58vw', maxHeight: 300, scrollSnapAlign: 'center' }}
        >
          <Image
            src={src}
            alt={alt}
            width={700}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

export default function LifestyleStrip() {
  const sectionRef = useRef<HTMLElement>(null)
  const motionOK = useMotionOK()
  const [isDesktop, setIsDesktop] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Autonomous drift only when motion is OK and we're on desktop and mounted
  // (rAF must not run under prefers-reduced-motion — see Testimonials).
  const useDrift = mounted && isDesktop && motionOK

  return (
    <section ref={sectionRef} data-morph data-morph-key="lifestyle" className="bg-white pt-16 pb-8 overflow-hidden">
      <div className="text-center mb-10 px-6">
        <Eyebrow align="center" className="mb-5 justify-center">All-Day Balance</Eyebrow>
        <SectionHeading className="mb-3">
          Bringing you back to the <em>moment when it matters most.</em>
        </SectionHeading>
      </div>

      {useDrift ? (
        <div
          className="hidden md:flex md:flex-col gap-6"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)',
          }}
        >
          {/* Opposing continuous drift, slow and premium, seamless infinite loop */}
          <DriftRow row={rowA} direction={1} durationS={ROW_A_DURATION_S} />
          <DriftRow row={rowB} direction={-1} durationS={ROW_B_DURATION_S} />
        </div>
      ) : null}

      {/* Mobile (<md): swipeable snap row. Also the reduced-motion fallback at any
          viewport — no autonomous drift, no transforms. */}
      <div className={useDrift ? 'md:hidden' : ''}>
        <MobileRow />
      </div>
    </section>
  )
}
