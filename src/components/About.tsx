'use client'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import FadeUp from './FadeUp'

const SpinningCan = dynamic(() => import('./SpinningCan'), { ssr: false })

export default function About() {
  return (
    <section id="science" className="bg-off-white pt-16 pb-24 px-6 md:px-20">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        <FadeUp>
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-5 h-px bg-accent" />
            <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">Our Story</span>
          </div>
          <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-navy tracking-[-0.02em] mb-6">
            Built for the gap<br /><em className="italic text-accent">nobody filled.</em>
          </h2>
          <p className="text-[0.96rem] text-navy-mid leading-[1.84] font-light mb-5">
            Every pouch on the market was either nicotine-loaded and addictive, caffeine-heavy and anxiety inducing, or nootropic-based and isolated on focus. None were able to support our ideal lifestyle all day long, without undesirable side effects.
          </p>
          <p className="text-[0.96rem] text-navy-mid leading-[1.84] font-light mb-8">
            So we built Aire from scratch. A lifestyle pouch for people who want to stay grounded for peak enjoyment from every pursuit. No dependency. No crash. Just balance, whenever you need it.
          </p>
          <a href="#shop" className="btn-primary inline-block bg-navy text-white px-8 py-4 rounded-full text-[0.8rem] font-semibold tracking-[0.08em] uppercase shadow-[0_8px_30px_rgba(26,46,74,0.2)]">
            Try Aire Today
          </a>
        </FadeUp>
        <FadeUp delay={0.15}>
          <div className="relative flex justify-center items-center w-full h-[320px] md:h-[420px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[16%] top-[6%] bottom-[8%] rounded-[44%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.94)_0%,rgba(233,243,250,0.92)_30%,rgba(126,194,223,0.14)_54%,rgba(26,46,74,0.09)_70%,rgba(26,46,74,0)_84%)] blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[24%] bottom-[12%] h-[22%] rounded-full bg-[radial-gradient(circle,rgba(26,46,74,0.18)_0%,rgba(26,46,74,0.08)_42%,rgba(26,46,74,0)_76%)] blur-3xl"
            />
            <SpinningCan className="[filter:drop-shadow(0_18px_26px_rgba(26,46,74,0.12))_drop-shadow(0_34px_70px_rgba(26,46,74,0.12))]" />
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
