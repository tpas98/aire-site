'use client'
import React, { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { EASE } from '@/lib/motion'

interface RevealProps {
  /** Each element in the array is rendered as its own masked line. */
  lines?: React.ReactNode[]
  /** Convenience: pass children to be treated as a single line. */
  children?: React.ReactNode
  /** Wrapper element for semantics (default 'div'). */
  as?: React.ElementType
  /** Delay in seconds before the first line starts animating. */
  delay?: number
  /** Seconds between each line's animation start. */
  stagger?: number
  className?: string
}

/**
 * Masked line-reveal primitive: each line is clipped by an overflow-hidden
 * wrapper while an inner span slides up from y:110% -> y:0% and fades in.
 * Triggered once when scrolled into view. Respects prefers-reduced-motion by
 * rendering statically (no transform, fully visible).
 */
export default function Reveal({
  lines,
  children,
  as: Wrapper = 'div',
  delay = 0,
  stagger = 0.08,
  className = '',
}: RevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()

  const items = lines && lines.length > 0 ? lines : [children]

  if (shouldReduceMotion) {
    return (
      <Wrapper ref={ref} className={className}>
        {items.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </Wrapper>
    )
  }

  return (
    <Wrapper ref={ref} className={className}>
      {items.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.15em]">
          <motion.span
            className="block"
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.9,
              ease: EASE,
              delay: delay + i * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Wrapper>
  )
}
