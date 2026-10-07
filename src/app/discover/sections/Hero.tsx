'use client'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { buyUrl } from '@/lib/checkout'
import { hero } from '../content'
import Dag, { Eyebrow, GradientText } from './Dag'

/**
 * Full-bleed cinematic hero: the real can (AI scene, label checked and the
 * garbled band text retouched out) hovering over still water at blue hour.
 * Art-directed: vertical image on phones (can in the lower-middle, headline in
 * the dark top half), wide image on desktop (can right, headline left).
 * Headline, sub and CTA are in the first paint; only the image drifts.
 */
export default function Hero() {
  const reduce = !!useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const fade = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <motion.div style={reduce ? undefined : { y: imgY }} className="absolute inset-0">
        <motion.div
          initial={reduce ? false : { scale: 1.08, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full"
        >
          <div className="h-full w-full [@media(max-height:720px)_and_(max-width:767px)]:translate-y-[9%]">
          <picture>
            <source media="(min-width: 768px)" srcSet="/images/discover/hero-wide.webp" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/discover/hero-vertical.webp"
              alt="The Aire Calm Mint can hovering over still water"
              fetchPriority="high"
              className="h-full w-full object-cover object-[50%_70%] md:object-[70%_50%]"
            />
          </picture>
          </div>
        </motion.div>
      </motion.div>
      {/* Legibility scrims */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/10 to-ink/85 md:bg-gradient-to-r md:from-ink/90 md:via-ink/40 md:to-transparent" />

      <motion.div
        style={reduce ? undefined : { y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-between px-6 pb-10 pt-[112px] md:justify-center md:px-16 md:pb-20"
      >
        <div className="max-w-[620px]">
          <Eyebrow dark>{hero.eyebrow}</Eyebrow>
          <h1 className="font-serif text-[clamp(2.9rem,12vw,6.6rem)] leading-[0.98] tracking-[-0.03em] [@media(max-height:720px)_and_(max-width:767px)]:text-[2.6rem]">
            {hero.titleLine1}
            <br />
            <GradientText tone="cool" className="italic">{hero.titleLine2}</GradientText>
          </h1>
          <p className="mt-4 max-w-[440px] text-[0.98rem] font-light leading-[1.55] text-white/85 md:mt-6 md:text-[1.12rem]">
            <Dag>{hero.sub}</Dag>
          </p>
            <ul aria-label="What's not in it" className="mt-5 flex flex-wrap gap-2 md:mt-7">
              {hero.chips.map((c) => (
                <li key={c} className="rounded-full border border-white/20 bg-ink/60 px-3.5 py-1.5 text-[0.72rem] font-semibold tracking-[0.04em] text-white">
                  {c}
                </li>
              ))}
            </ul>
        </div>

        <div className="md:mt-8">
          <div className="flex flex-wrap items-center gap-5">
            <a
              href={buyUrl()}
              className="inline-block whitespace-nowrap rounded-full bg-white px-9 py-4 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-navy shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              {hero.ctaPrimary}
            </a>
            <a href="#why" className="group flex min-h-[44px] items-center gap-1.5 whitespace-nowrap px-1 text-[0.85rem] font-medium text-white/85 transition-colors hover:text-white">
              {hero.ctaSecondary}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
