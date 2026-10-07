'use client'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Eyebrow } from './Dag'

/**
 * The 13-second product film (rendered from code: ingredients into the pouch,
 * pouch into the real can, brand card). Muted, inline, looping; it only loads
 * when it is about to scroll into view and pauses when it leaves, so it costs
 * nothing for people who bounce from the hero. Reduced motion: poster + controls.
 */
export default function ProductFilm() {
  const reduce = !!useReducedMotion()
  const ref = useRef<HTMLVideoElement>(null)
  const [src, setSrc] = useState<string | undefined>(undefined)

  useEffect(() => {
    const v = ref.current
    if (!v || reduce) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSrc((s) => s ?? '/images/discover/film-4x5.mp4')
          v.play().catch(() => {})
        } else {
          v.pause()
        }
      },
      { rootMargin: '200px 0px', threshold: 0.25 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [reduce])

  return (
    <section aria-labelledby="film-title" className="bg-ink px-6 py-20 text-white md:px-16 md:py-28">
      <div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-[1fr_1.1fr]">
        <div>
          <Eyebrow dark>In 13 seconds</Eyebrow>
          <h2 id="film-title" className="font-serif text-[clamp(2.1rem,7.5vw,3.8rem)] leading-[1.02] tracking-[-0.02em]">
            What&rsquo;s in a <em className="italic text-sky-deep">calm</em> pouch.
          </h2>
          <p className="mt-4 max-w-[420px] text-[1rem] font-light leading-[1.6] text-white/75">
            Four ingredients, one pouch, fifteen to a can. No nicotine. No caffeine.
          </p>
        </div>
        <div className="mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10">
          <video
            ref={ref}
            src={reduce ? '/images/discover/film-4x5.mp4' : src}
            poster="/images/discover/film-4x5-poster.webp"
            muted
            loop
            playsInline
            preload="none"
            controls={reduce}
            aria-label="Product film: four ingredients go into an Aire pouch, the pouch goes into the can"
            className="aspect-[4/5] h-auto w-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
