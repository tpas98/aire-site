'use client'
import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useVelocity,
  useSpring,
  useAnimationFrame,
} from 'framer-motion'
import { useMotionOK } from '@/lib/motion'

const items = [
  'L-Theanine', 'Rhodiola Rosea', 'L-Tyrosine',
  'Saffron', 'Zero Nicotine',
  'Zero Caffeine', 'Calm Mint',
]

const doubled = [...items, ...items]

// Base marquee speed in px/s. The CSS keyframe version scrolls one full copy
// (50% of the doubled track) every 36s — match that pace exactly so the
// hand-off between CSS (mobile/reduced-motion) and JS (desktop) is seamless
// if viewport crosses the breakpoint.
const BASE_DURATION_S = 36

/**
 * Desktop + motion-OK variant: drives the track's x transform manually via
 * useAnimationFrame, accumulating distance = baseSpeed * multiplier * dt and
 * wrapping modulo the single-copy width. The multiplier reacts to scroll
 * velocity (1x at rest, up to 2.2x while scrolling fast) and is smoothed with
 * a spring so it settles back to 1x within ~1.5s of scrolling stopping.
 *
 * Driving x directly (rather than adjusting CSS animation-duration mid-flight)
 * avoids any jump/restart of the loop — the accumulated distance is
 * continuous regardless of how the multiplier changes.
 */
function VelocityTicker() {
  const trackRef = useRef<HTMLDivElement>(null)
  const halfWidthRef = useRef(0)
  const x = useMotionValue(0)
  const distanceRef = useRef(0)

  const { scrollY } = useScroll()
  const rawVelocity = useVelocity(scrollY)
  // Smooth the reactive multiplier so speed-ups/settles feel eased, not jumpy.
  const speedMultiplier = useSpring(1, { stiffness: 90, damping: 20, mass: 0.5 })

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
      // Map |velocity| 0->3000 to multiplier 1->2.2
      const target = 1 + (magnitude / 3000) * 1.2
      speedMultiplier.set(target)
    })
    return unsubscribe
  }, [rawVelocity, speedMultiplier])

  const baseSpeedPxPerSec = () => {
    const half = halfWidthRef.current || 1
    return half / BASE_DURATION_S
  }

  useAnimationFrame((_, delta) => {
    const dt = delta / 1000
    const half = halfWidthRef.current
    if (!half) return
    const speed = baseSpeedPxPerSec() * speedMultiplier.get()
    distanceRef.current = (distanceRef.current + speed * dt) % half
    x.set(-distanceRef.current)
  })

  return (
    <div className="mt-[64px] bg-navy text-white/70 py-2.5 overflow-hidden whitespace-nowrap" aria-hidden="true">
      <motion.div ref={trackRef} className="inline-flex" style={{ x }}>
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-7 text-[0.67rem] tracking-[0.15em] uppercase">{item}</span>
            <span className="text-sky-deep/40 text-xs">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/** Mobile / reduced-motion variant: unchanged CSS marquee. */
function StaticTicker() {
  return (
    <div className="mt-[64px] bg-navy text-white/70 py-2.5 overflow-hidden whitespace-nowrap group" aria-hidden="true">
      <div className="inline-flex animate-ticker group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-7 text-[0.67rem] tracking-[0.15em] uppercase">{item}</span>
            <span className="text-sky-deep/40 text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Ticker() {
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

  const useVelocityVariant = mounted && isDesktop && motionOK

  if (useVelocityVariant) {
    return <VelocityTicker />
  }

  return <StaticTicker />
}
