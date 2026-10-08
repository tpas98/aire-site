'use client'
import { Fragment } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * Shared primitives for /discover.
 *
 * Colour story used across the page:
 *   warm (salmon -> gold)          = stimulation: nicotine, caffeine, "wired"
 *   deep (slate -> indigo-navy)    = sedation: sleep pouches, "out"
 *   cool (sky-light -> sky -> teal) = calm: Aire, "level"
 */
export const GRADIENT = {
  warm: 'linear-gradient(92deg, #e8907e 0%, #f2b48a 45%, #f5d78e 100%)',
  deep: 'linear-gradient(92deg, #a9b8d8 0%, #7f93c0 55%, #5f74a6 100%)',
  cool: 'linear-gradient(92deg, #c8e6f5 0%, #7ec2df 55%, #84afb5 100%)',
  /** Wired at the top, level in the middle, out at the bottom. */
  spectrumV: 'linear-gradient(180deg, #f5d78e 0%, #e8907e 22%, #c8e6f5 46%, #7ec2df 54%, #5f74a6 82%, #2c3e66 100%)',
  spectrumH: 'linear-gradient(90deg, #f5d78e 0%, #e8907e 22%, #c8e6f5 46%, #7ec2df 54%, #5f74a6 82%, #2c3e66 100%)',
} as const

export type Tone = 'warm' | 'deep' | 'cool'

/** Gradient-filled text. Falls back to solid colour where background-clip:text is unsupported. */
export function GradientText({ tone, children, className = '' }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`bg-clip-text text-transparent [-webkit-background-clip:text] ${className}`}
      style={{ backgroundImage: GRADIENT[tone] }}
    >
      {children}
    </span>
  )
}

/** Renders text, setting each dagger (U+2020) as a small superscript. */
export default function Dag({ children }: { children: string }) {
  const parts = children.split('†')
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {i < parts.length - 1 && <sup aria-hidden="true" className="text-[0.6em] align-super">†</sup>}
        </Fragment>
      ))}
    </>
  )
}

/** Section eyebrow. `dark` for use on ink / navy backgrounds. */
export function Eyebrow({ children, dark = false, center = false, light }: { children: React.ReactNode; dark?: boolean; center?: boolean; light?: boolean }) {
  const onDark = dark || light
  return (
    <div className={`mb-4 flex items-center gap-3 ${center ? 'justify-center' : ''}`}>
      <span aria-hidden="true" className={`block h-px w-8 ${onDark ? 'bg-sky-deep/70' : 'bg-accent'}`} />
      <span className={`text-[0.68rem] font-semibold uppercase tracking-[0.22em] ${onDark ? 'text-sky-deep' : 'text-navy-mid'}`}>{children}</span>
    </div>
  )
}

/**
 * Text swap that rises out of a mask line (the okihome / Apple pattern) instead
 * of blurring in. The old block exits upward out of the same mask. `k` changes
 * trigger the swap. Spring with a hint of overshoot, no opacity tricks.
 *
 * `bleed` (px) widens the mask below (and a little above) without moving the
 * layout: a mask cut at the line box crops descenders (the "g" in a tight
 * serif headline lost its tail). Swapped text travels the extra distance too,
 * so nothing peeks out of the widened mask.
 */
export function MaskSwap({ k, children, className = '', bleed = 10 }: { k: string; children: React.ReactNode; className?: string; bleed?: number }) {
  const top = Math.min(bleed, 6)
  const off = (sign: 1 | -1) => `translateY(calc(${sign * 105}% ${sign > 0 ? '+' : '-'} ${bleed + top}px))`
  return (
    <div className={className}>
      <div className="relative overflow-hidden" style={{ paddingTop: top, paddingBottom: bleed, marginTop: -top, marginBottom: -bleed }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={k}
            initial={{ transform: off(1) }}
            animate={{ transform: 'translateY(0%)' }}
            exit={{ transform: off(-1), transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            transition={{ type: 'spring', stiffness: 230, damping: 26, mass: 0.85 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
