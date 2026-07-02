'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import BackgroundMorph from './BackgroundMorph'

/**
 * Gates the scroll-morphing backdrop.
 *
 * When motion is OK it renders <BackgroundMorph /> and adds `morph-on` to <html>.
 * The `morph-on` class is what strips the light sections' own backgrounds (via a
 * CSS rule in globals.css keyed on `html.morph-on [data-morph]`), so the morph
 * layer shows through them.
 *
 * When reduced motion is requested we render nothing and never add `morph-on` —
 * the sections keep their original solid `bg-*` classes as the static fallback.
 */
export default function MorphGate() {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const on = !reduce
    document.documentElement.classList.toggle('morph-on', on)
    return () => {
      document.documentElement.classList.remove('morph-on')
    }
  }, [mounted, reduce])

  if (!mounted || reduce) return null
  return <BackgroundMorph />
}
