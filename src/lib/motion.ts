import { useReducedMotion, type Variants } from 'framer-motion'

/** Shared easing curve for all scroll/entrance animations. */
export const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Fade-up variants matching the original FadeUp.tsx behavior:
 * opacity 0 + y 36 -> opacity 1 + y 0, 0.8s, EASE.
 * Use with `initial="hidden" animate={isInView ? 'visible' : 'hidden'}`.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
}

/** Same as `fadeUp`, but with an explicit per-instance delay baked into the transition. */
export function fadeUpWithDelay(delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: 36 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE, delay },
    },
  }
}

/**
 * Returns stagger-container variants where children (using `fadeUp` or similar)
 * animate in sequence, `stagger` seconds apart.
 */
export function staggerContainer(stagger = 0.08): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
      },
    },
  }
}

/** True when the user has NOT requested reduced motion (i.e. it's OK to animate). */
export function useMotionOK() {
  return !useReducedMotion()
}
