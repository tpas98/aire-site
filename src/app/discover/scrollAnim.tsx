'use client'
import { useEffect, type CSSProperties, type RefObject } from 'react'
import type { MotionValue } from 'framer-motion'

/**
 * Scroll-scrubbed animation that runs on the compositor.
 *
 * Why: framer-motion's useScroll + useTransform write transforms from JS on the
 * main thread. iOS scrolls on a separate thread, so those writes land a frame
 * or more behind the finger and stutter during momentum scrolling. CSS
 * scroll-driven animations (animation-timeline: view()) on transform / opacity
 * are threaded in Safari 26.4+ and Chrome 115+, so they move in lockstep with
 * the scroll.
 *
 * How: each scene writes its keyframes as CSS (built from the same
 * input/output stops useTransform took), names a view timeline on its section,
 * and tags animated elements with `.sa` + an animation-name. Browsers without
 * scroll timelines get the same keyframes, paused, scrubbed by a single `--p`
 * custom property written from useScroll (see globals.css).
 */

export type Track = readonly [readonly number[], readonly number[]]

/** framer-motion's useTransform mapping: piecewise linear, clamped. */
export function interp([input, output]: Track, x: number): number {
  if (x <= input[0]) return output[0]
  const last = input.length - 1
  if (x >= input[last]) return output[last]
  for (let i = 0; i < last; i++) {
    if (x <= input[i + 1]) {
      const span = input[i + 1] - input[i]
      const t = span === 0 ? 1 : (x - input[i]) / span
      return output[i] + (output[i + 1] - output[i]) * t
    }
  }
  return output[last]
}

const pct = (s: number) => `${+(s * 100).toFixed(3)}%`

/**
 * One @keyframes rule from several tracks. Stops are the union of every track's
 * inputs (clamped to 0..1) plus 0 and 1, so the result is exactly the same
 * piecewise-linear curve useTransform produced. `extra` adds sample points,
 * for curves that are not piecewise linear.
 */
export function keyframes<K extends string>(
  name: string,
  tracks: Record<K, Track>,
  fmt: (v: Record<K, number>) => string,
  extra: readonly number[] = [],
): string {
  const keys = Object.keys(tracks) as K[]
  const stops = new Set<number>([0, 1, ...extra])
  for (const k of keys) for (const x of tracks[k][0]) stops.add(Math.min(1, Math.max(0, x)))
  const body = Array.from(stops)
    .sort((a, b) => a - b)
    .map((s) => {
      const v = {} as Record<K, number>
      for (const k of keys) v[k] = interp(tracks[k], s)
      return `${pct(s)}{${fmt(v)}}`
    })
    .join('')
  return `@keyframes ${name}{${body}}`
}

/** Short number for CSS. */
export const n = (v: number) => +v.toFixed(3)

/**
 * Style for a scene root: names its view timeline and the range the scene
 * spans. `contain` = framer offset ['start start', 'end end'] (a pinned scene);
 * `exit-crossing` = ['start start', 'end start'] (a hero scrolling away).
 */
export function timeline(name: string, range: 'contain' | 'exit-crossing'): CSSProperties {
  return {
    viewTimelineName: name,
    // `auto` would inset the viewport by html's scroll-padding-top (84px, for
    // the fixed nav) and run every scene early.
    viewTimelineInset: '0px',
    ['--sa-tl' as string]: name,
    ['--sa-range' as string]: `${range} 0% ${range} 100%`,
  } as CSSProperties
}

const supported = () => typeof CSS !== 'undefined' && CSS.supports('animation-timeline', 'view()')

/** Fallback scrub: where scroll timelines are missing, drive `--p` from useScroll. */
export function useScrub(ref: RefObject<HTMLElement>, progress: MotionValue<number>, map: (v: number) => number = (v) => v) {
  useEffect(() => {
    const el = ref.current
    if (!el || supported()) return
    const set = (v: number) => el.style.setProperty('--p', String(Math.min(1, Math.max(0, map(v)))))
    set(progress.get())
    return progress.on('change', set)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, progress])
}

/** Inline <style> for a scene's keyframes. */
export function Keyframes({ css }: { css: string }) {
  // eslint-disable-next-line react/no-danger
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
