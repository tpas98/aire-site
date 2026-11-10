'use client'
import { useRef } from 'react'
import { useReducedMotion, useScroll } from 'framer-motion'
import { useBuyUrl, useSaleActive } from '@/lib/useSale'
import { hero } from '../content'
import { Keyframes, timeline, useScrub } from '../scrollAnim'
import Dag, { Eyebrow, GradientText } from './Dag'

// Scroll-away parallax, on the compositor (see scrollAnim.tsx). The intro
// zoom is a plain CSS animation so it stays smooth while the page hydrates.
const CSS =
  '@keyframes hero-img{from{transform:translateY(0)}to{transform:translateY(120px)}}' +
  '@keyframes hero-text{0%{transform:translateY(0);opacity:1}65%{opacity:0}100%{transform:translateY(-60px);opacity:0}}' +
  '@keyframes hero-in{from{transform:scale(1.08);opacity:.6}to{transform:none;opacity:1}}' +
  '.hero-in{animation:hero-in 2.2s cubic-bezier(.16,1,.3,1) both}'

/**
 * Full-bleed cinematic hero: the real can (AI scene, label checked and the
 * garbled band text retouched out) hovering over still water at blue hour.
 * Art-directed: vertical image on phones (can in the lower-middle, headline in
 * the dark top half), wide image on desktop (can right, headline left).
 * Headline, sub and CTA are in the first paint; only the image drifts.
 */
export default function Hero() {
  const reduce = !!useReducedMotion()
  const sale = useSaleActive()
  const buyUrl = useBuyUrl()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  useScrub(ref, scrollYProgress)

  return (
    <section ref={ref} style={reduce ? undefined : timeline('--hero', 'exit-crossing')} className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      {!reduce && <Keyframes css={CSS} />}
      <div style={reduce ? undefined : { animationName: 'hero-img' }} className={`absolute inset-0 ${reduce ? '' : 'sa'}`}>
        <div className={`h-full w-full ${reduce ? '' : 'hero-in'}`}>
          <div className="h-full w-full [@media(max-height:720px)_and_(max-width:767px)]:translate-y-[9%] [@media(min-height:761px)_and_(max-height:820px)_and_(max-width:374px)]:translate-y-[4%] [@media(max-height:760px)_and_(max-width:374px)]:translate-y-[9%]">
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
        </div>
      </div>
      {/* Legibility scrims */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/10 to-ink/85 md:bg-gradient-to-r md:from-ink/90 md:via-ink/40 md:to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 hidden h-48 bg-gradient-to-t from-ink/85 to-transparent md:block" />

      <div
        style={reduce ? undefined : { animationName: 'hero-text' }}
        className={`${reduce ? '' : 'sa '}relative z-10 mx-auto flex min-h-[100svh] max-w-[1280px] flex-col justify-between px-6 pb-10 pt-[112px] md:justify-center md:px-16 md:pb-32`}
      >
        <div className="max-w-[620px]">
          <div className="[@media(max-height:720px)_and_(max-width:767px)]:hidden"><Eyebrow dark>{hero.eyebrow}</Eyebrow></div>
          <h1 className="font-serif text-[clamp(2.9rem,12vw,6.6rem)] leading-[0.98] tracking-[-0.03em] [@media(max-height:720px)_and_(max-width:767px)]:text-[2.6rem]">
            {hero.titleLine1}
            <br />
            <GradientText tone="cool" className="italic">{hero.titleLine2}</GradientText>
          </h1>
          <p className="mt-4 max-w-[440px] text-[0.98rem] font-light leading-[1.55] text-white/85 md:mt-6 md:text-[1.12rem]">
            <Dag>{hero.sub}</Dag>
          </p>
          <ul aria-label="What's not in it" className="mt-5 flex items-center text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-white/85 max-[374px]:text-[0.6rem] max-[374px]:tracking-[0.1em] md:mt-8 md:text-[0.7rem] md:tracking-[0.18em]">
            {hero.chips.map((c, i) => (
              <li key={c} className={`whitespace-nowrap ${i ? 'ml-3 border-l border-white/30 pl-3 md:ml-5 md:pl-5' : ''}`}>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:mt-8">
          <div className="flex flex-wrap items-center gap-5">
            <a
              href={buyUrl}
              aria-label={sale ? hero.ctaPrimarySaleAria : undefined}
              className="group/cta inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-white py-4 pl-8 pr-6 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-navy shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              {sale ? hero.ctaPrimarySale : hero.ctaPrimary}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-1">→</span>
            </a>
            <a href="#why" className="group hidden min-h-[44px] items-center md:flex gap-1.5 whitespace-nowrap px-1 text-[0.85rem] font-medium text-white/85 transition-colors hover:text-white">
              {hero.ctaSecondary}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
            </a>
          </div>
          <p className="mt-3.5 text-[0.72rem] tracking-[0.02em] text-white/65 md:hidden">{hero.factLine}</p>
        </div>

        {/* Desktop: plain product facts on a ruled strip along the bottom */}
        <dl className="absolute inset-x-16 bottom-9 hidden grid-cols-3 border-t border-white/15 pt-5 md:grid">
          {hero.facts.map((f, i) => (
            <div key={f.k} className={i ? 'border-l border-white/15 pl-8' : ''}>
              <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-sky-deep">{f.k}</dt>
              <dd className="mt-1.5 text-[0.98rem] font-light text-white/90">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
