'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/**
 * Inertia-smoothed window scrolling via Lenis.
 *
 * Gating: only initializes when motion is allowed (no `prefers-reduced-motion`)
 * AND the device is not touch-primary (`pointer: coarse`) — mobile keeps native
 * scroll, where Lenis touch smoothing feels wrong. When not initialized this
 * renders `children` unchanged and does nothing else.
 *
 * Compatibility: Lenis animates the REAL window scroll position, so every existing
 * scroll-linked behavior keeps working untouched — Framer `useScroll` (hero pin
 * choreography + parallax + navbar condense) reads native scroll, and
 * `StickyMobileCTA` reads `window.scrollY` / listens to the `scroll` event.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    if (reduceMotion || coarsePointer) return

    const lenis = new Lenis({
      // Feel: gentle inertia. lerp 0.1 is Lenis' recommended default balance
      // between smoothing and responsiveness.
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    })

    window.__lenis = lenis
    // Disable CSS `scroll-behavior: smooth` so anchor jumps ease via Lenis only,
    // never double-eased by the browser.
    document.documentElement.classList.add('lenis-active')

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Intercept in-page hash-anchor clicks and route them through Lenis so they
    // ease to the target with the navbar offset applied.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return
      }
      const anchor = (e.target as HTMLElement | null)?.closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('#') || href === '#') return

      const target = document.querySelector(href)
      if (!target) return

      e.preventDefault()
      // No explicit offset: Lenis honors the html `scroll-padding-top: 84px`, so the
      // target lands with the same navbar clearance as a native anchor jump. Passing
      // an extra offset here would double-count and overshoot.
      lenis.scrollTo(target as HTMLElement)
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(rafId)
      lenis.destroy()
      document.documentElement.classList.remove('lenis-active')
      delete window.__lenis
    }
  }, [])

  return <>{children}</>
}
