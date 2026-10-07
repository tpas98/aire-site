'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import Dag from './Dag'
import { offer, DISCLAIMER, sources } from '../content'
import { buyUrl } from '@/lib/checkout'

export default function Offer() {
  const reduce = useReducedMotion()
  return (
    <section
      id="shop"
      className="relative overflow-hidden bg-ink px-6 py-24 text-white md:py-36"
      style={{ backgroundImage: 'radial-gradient(60% 50% at 50% 40%, rgba(126,194,223,0.22), transparent)' }}
    >
      <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
        <Image
          src="/images/logo.png"
          alt="Aire"
          width={140}
          height={48}
          className="mb-8 h-auto w-[140px]"
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
        />
        <motion.div
          animate={reduce ? undefined : { transform: ['translateY(0px)', 'translateY(-10px)', 'translateY(0px)'] }}
          transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src="/images/discover/can-34-900.webp"
            alt="A can of Aire Calm Mint pouches"
            width={900}
            height={611}
            className="h-auto w-[260px] drop-shadow-[0_30px_50px_rgba(0,0,0,0.5)] md:w-[380px]"
          />
        </motion.div>
        <div className="mt-6 text-[0.7rem] tracking-[0.3em] text-white/70">{offer.stamp}</div>
        <h2 className="mt-5 font-serif text-[clamp(2.4rem,8vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-white">{offer.title}</h2>
        <p className="mt-5 max-w-[420px] leading-[1.6] text-white/75">{offer.sub}</p>
        <a
          href={buyUrl()}
          aria-label={offer.ctaAria}
          className="mt-9 inline-block rounded-full bg-white px-9 py-4 font-semibold tracking-[0.06em] text-navy shadow-[0_12px_40px_rgba(126,194,223,0.35)] transition-transform duration-200 hover:scale-[1.03]"
        >
          {offer.cta}
        </a>
        <p className="mt-8 font-serif italic text-white/60">{offer.closer}</p>

        <div id="sources" className="mt-16 w-full text-left">
          <div className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/50">Sources</div>
          <ol className="list-decimal space-y-1 pl-4 text-[0.68rem] leading-relaxed text-white/50">
            {sources.map((s) => (
              <li key={s.n}>
                {s.href ? (
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-white/80">
                    {s.text}
                  </a>
                ) : (
                  s.text
                )}
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[0.65rem] leading-relaxed text-white/45">
            <Dag>{DISCLAIMER}</Dag>
          </p>
        </div>
      </div>
    </section>
  )
}
