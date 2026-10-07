'use client'
import { motion, useReducedMotion } from 'framer-motion'
import StackedAlphaVideo from '@/components/StackedAlphaVideo'
import { buyUrl } from '@/lib/checkout'
import { hero } from '../content'
import Dag, { Eyebrow } from './Dag'

export default function DiscoverHero() {
  const reduce = useReducedMotion()
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
        }

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-hero-gradient">
      <div aria-hidden="true" className="absolute top-[-120px] right-[-80px] w-[420px] h-[420px] rounded-full bg-[#80aad0]/20 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-[-80px] left-[-80px] w-[320px] h-[320px] rounded-full bg-accent/10 blur-3xl" />
      {/* Mobile order: headline, can, explanation + CTA, so the CTA lands in the first screen.
          md+: text left (headline over body), can right spanning both rows. */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-6 pt-[112px] pb-14 md:grid md:grid-cols-2 md:grid-rows-[1fr_auto_1fr] md:gap-x-8 md:px-20 md:pb-24">
        <div className="w-full max-w-[560px] md:row-start-1 md:self-end">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <h1
            className="font-serif leading-[1.02] text-navy tracking-[-0.03em] mb-1 md:mb-5"
            style={{ fontSize: 'clamp(2.45rem, 8vw, 5.6rem)' }}
          >
            {hero.titleLine1}
            <br />
            <em className="italic text-navy-mid">{hero.titleLine2}</em>
          </h1>
        </div>
        <div className="relative -mx-6 h-[190px] md:mx-0 md:col-start-2 md:row-span-3 md:row-start-1 md:h-[480px] md:self-center">
          <StackedAlphaVideo
            sources={[
              { src: '/images/three-cans-hero-av1.mp4', type: 'video/mp4; codecs=av01.0.04M.08' },
              { src: '/images/three-cans-hero-h264.mp4', type: 'video/mp4; codecs=avc1.64001f' },
            ]}
            poster="/images/three-cans-hero-2026.webp"
            width={1370}
            height={972}
            alt="Three Aire nicotine-free pouch cans floating, Calm Mint"
          />
        </div>
        <div className="w-full max-w-[560px] md:row-start-2">
          <p className="text-[0.95rem] md:text-[1rem] text-navy-mid leading-[1.65] font-light mb-5 md:mb-6 max-w-[440px]">
            <Dag>{hero.sub}</Dag>
          </p>
          <motion.ul className="mb-7 hidden flex-wrap gap-2 md:flex" aria-label="Highlights" {...enter(0.15)}>
            {hero.chips.map((c) => (
              <li key={c} className="rounded-full bg-white/60 px-3.5 py-1.5 text-[0.72rem] font-semibold tracking-[0.04em] text-navy">
                {c}
              </li>
            ))}
          </motion.ul>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href={buyUrl()}
              className="btn-primary inline-block whitespace-nowrap rounded-full bg-navy px-8 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_10px_36px_rgba(26,46,74,0.28)]"
            >
              {hero.ctaPrimary}
            </a>
            <a href="#what" className="group flex items-center gap-1.5 whitespace-nowrap text-[0.8rem] font-medium text-navy-mid transition-colors duration-200 hover:text-accent">
              {hero.ctaSecondary}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1.5">↓</span>
            </a>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute bottom-4 left-1/2 z-10 hidden md:flex -translate-x-1/2 flex-col items-center gap-1 text-navy-mid/70">
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.25em]">Scroll</span>
        <motion.svg
          width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          animate={reduce ? undefined : { y: [0, 5, 0] }}
          transition={reduce ? undefined : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M7 2v10M3 8l4 4 4-4" />
        </motion.svg>
      </div>
    </section>
  )
}
