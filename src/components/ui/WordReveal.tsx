'use client'
import React, { useRef } from 'react'
import { motion, useInView, useReducedMotion, type MotionStyle } from 'framer-motion'
import { EASE } from '@/lib/motion'

export interface WordItem {
  text: string
  em?: boolean
}

interface WordLine {
  /** Words to render on this line, each individually masked + staggered. */
  words: WordItem[]
  /** Optional per-line key override (defaults to index). */
  key?: string
}

interface WordRevealProps {
  lines: WordLine[]
  as?: React.ElementType
  /** Delay in seconds before the first word starts animating. */
  delay?: number
  /** Seconds between each word's animation start (within + across lines, in reading order). */
  wordStagger?: number
  className?: string
  /** Class applied to <em> word spans (brand italic accent color etc). */
  emClassName?: string
  /**
   * Optional per-line motion styles (e.g. scroll-linked x drift / letter-spacing),
   * applied to a wrapper OUTSIDE each line's overflow-hidden mask so drifted
   * content is never clipped. Index-aligned with `lines`.
   */
  lineStyles?: (MotionStyle | undefined)[]
}

/**
 * Per-word masked reveal: like Reveal, but splits each line into its own
 * inline-block words, each independently masked (overflow-hidden) and
 * animated y '110%' -> 0 + opacity, staggered in reading order across the
 * whole block. Line breaks are preserved via one <span className="block">
 * per line (matching Reveal's line-wrap behavior), so visual wrapping is
 * unchanged from the plain-line version.
 *
 * Triggered once when scrolled into view (-80px margin). Respects
 * prefers-reduced-motion by rendering fully static, unmasked text.
 */
export default function WordReveal({
  lines,
  as: Wrapper = 'div',
  delay = 0,
  wordStagger = 0.045,
  className = '',
  emClassName = '',
  lineStyles,
}: WordRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return (
      <Wrapper ref={ref} className={className}>
        {lines.map((line, li) => (
          <span key={line.key ?? li} className="block">
            {line.words.map((w, wi) => (
              <React.Fragment key={wi}>
                {w.em ? <em className={emClassName}>{w.text}</em> : w.text}
                {wi < line.words.length - 1 ? ' ' : ''}
              </React.Fragment>
            ))}
          </span>
        ))}
      </Wrapper>
    )
  }

  // Flatten to compute a single reading-order index per word for stagger timing.
  let wordIndex = 0

  return (
    <Wrapper ref={ref} className={className}>
      {lines.map((line, li) => (
        // Outer wrapper carries scroll-linked drift (x / letter-spacing) so it is
        // NOT clipped by the inner overflow-hidden reveal mask below.
        <motion.span key={line.key ?? li} className="block" style={lineStyles?.[li]}>
          <span className="block overflow-hidden pb-[0.15em]">
            <span className="inline">
              {line.words.map((w, wi) => {
                const idx = wordIndex++
                const Tag = w.em ? 'em' : 'span'
                return (
                  <React.Fragment key={wi}>
                    <span className="inline-block overflow-hidden align-top pb-[0.15em] -mb-[0.15em]">
                      <motion.span
                        className="inline-block"
                        initial={{ y: '110%', opacity: 0 }}
                        animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
                        transition={{
                          duration: 0.7,
                          ease: EASE,
                          delay: delay + idx * wordStagger,
                        }}
                      >
                        <Tag className={w.em ? emClassName : undefined}>{w.text}</Tag>
                      </motion.span>
                    </span>
                    {wi < line.words.length - 1 ? ' ' : ''}
                  </React.Fragment>
                )
              })}
            </span>
          </span>
        </motion.span>
      ))}
    </Wrapper>
  )
}
