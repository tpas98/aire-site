'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useReducedMotion } from 'framer-motion'

interface MagneticProps {
  children: React.ReactNode
  className?: string
  /** Max translation toward the cursor, in px. */
  strength?: number
  /** Radius (px) beyond the element's own box that still attracts the cursor. */
  padding?: number
}

/**
 * Wraps a CTA so it subtly translates toward the cursor on desktop with a
 * fine (mouse) pointer, springing back on leave. Inert (renders children
 * unchanged, no listeners) for touch pointers and reduced-motion users.
 *
 * The hit area is the wrapper itself (padding expands the tracked region
 * beyond the visible button via negative margin, so the pull starts slightly
 * before the cursor reaches the button edge) — only the inner child visually
 * translates.
 */
export default function Magnetic({
  children,
  className = '',
  strength = 10,
  padding = 24,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)

  const x = useSpring(0, { stiffness: 300, damping: 20, mass: 1 })
  const y = useSpring(0, { stiffness: 300, damping: 20, mass: 1 })

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    setEnabled(mq.matches && !shouldReduceMotion)
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches && !shouldReduceMotion)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [shouldReduceMotion])

  if (!enabled) {
    return <div className={className}>{children}</div>
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = e.clientX - centerX
    const dy = e.clientY - centerY
    const halfW = rect.width / 2 + padding
    const halfH = rect.height / 2 + padding
    // Normalize pull by distance from center relative to the attraction box,
    // clamped to [-1, 1] per axis, then scale by strength.
    const ratioX = Math.max(-1, Math.min(1, dx / halfW))
    const ratioY = Math.max(-1, Math.min(1, dy / halfH))
    x.set(ratioX * strength)
    y.set(ratioY * strength)
  }

  const handlePointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ padding, margin: -padding, display: 'inline-block' }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div style={{ x, y, display: 'inline-block' }}>{children}</motion.div>
    </div>
  )
}
