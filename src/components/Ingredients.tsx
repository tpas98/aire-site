'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FadeUp from './FadeUp'
import Eyebrow from './ui/Eyebrow'
import { EASE, fadeUpWithDelay, useMotionOK } from '@/lib/motion'

const ingredients = [
  { num: '01', name: 'Rhodiola Rosea', desc: 'Supports resilience to mental fatigue and stress, promoting sustained clarity and balanced energy.† Adaptogenic herb used to help the body adapt to stress.' },
  { num: '02', name: 'L-Theanine', desc: 'Promotes a relaxed but alert mental state, helping smooth stress and support focused clarity without drowsiness.† Amino acid naturally found in green tea.' },
  { num: '03', name: 'Saffron', desc: 'Supports mood and emotional balance, contributing to a calm, clear headspace.† Botanical extract derived from the Crocus sativus flower.' },
  { num: '04', name: 'L-Tyrosine', desc: 'Amino acid precursor to dopamine and norepinephrine, supporting focus, motivation, and cognitive performance under stress.† Naturally produced by the body from phenylalanine.' },
]

/**
 * Splits a description into its benefit sentence (ending in the disclaimer
 * dagger) and its trailing "what it is" sentence, without altering any
 * words. Falls back to rendering the whole string if the marker isn't found.
 */
function splitDesc(desc: string): [string, string | null] {
  const markerIndex = desc.indexOf('† ')
  if (markerIndex === -1) return [desc, null]
  const cut = markerIndex + 1 // include the dagger in the first part
  return [desc.slice(0, cut), desc.slice(cut + 1)]
}

function IngredientCardContent({ num, name, desc }: { num: string; name: string; desc: string }) {
  const [lead, trail] = splitDesc(desc)
  return (
    <div className="card-dark group bg-white/[0.07] border border-white/[0.12] rounded-aire-xl p-6 text-center h-full flex flex-col">
      <div className="text-[0.62rem] text-sky-deep tracking-[0.15em] font-semibold mb-3">{num}</div>
      <div className="font-serif text-[1.05rem] text-white mb-3 leading-snug">{name}</div>
      <div className="text-[0.75rem] text-white/75 leading-relaxed flex-1">
        {lead}
        {trail ? ' ' + trail : null}
      </div>
    </div>
  )
}

function RailPanelContent({ num, name, desc }: { num: string; name: string; desc: string }) {
  const [lead, trail] = splitDesc(desc)
  return (
    <div className="relative bg-white/[0.07] border border-white/[0.12] rounded-aire-xl p-10 md:p-12 overflow-hidden">
      <div
        className="absolute -top-6 -right-2 font-serif text-sky-deep/[0.08] leading-none select-none pointer-events-none"
        style={{ fontSize: 'clamp(6rem, 9vw, 9rem)' }}
        aria-hidden="true"
      >
        {num}
      </div>
      <p className="relative text-white text-[1.4rem] md:text-[1.6rem] leading-[1.4] font-serif tracking-[-0.01em] mb-6 max-w-[26ch]">
        {lead.replace(/†\s*$/, '')}
        <span className="text-sky-deep">†</span>
      </p>
      {trail && (
        <>
          <span className="block w-10 h-px bg-white/15 mb-4" />
          <p className="relative text-white/55 text-[0.85rem] leading-relaxed max-w-[38ch]">{trail}</p>
        </>
      )}
    </div>
  )
}

function StickyRail({ activeIndex }: { activeIndex: number }) {
  const active = ingredients[activeIndex]
  return (
    <div className="sticky top-28 self-start">
      <Eyebrow tone="dark" className="mb-8">The Formula</Eyebrow>
      <div className="relative min-h-[9rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.num}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div
              className="font-serif text-sky-deep/25 leading-none select-none"
              style={{ fontSize: 'clamp(4rem, 6vw, 6rem)' }}
            >
              {active.num}
            </div>
            <div
              className="font-serif text-white leading-[1.05] -mt-4"
              style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)' }}
            >
              {active.name}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex flex-col gap-2 mt-8" aria-hidden="true">
        {ingredients.map((ing, i) => (
          <span
            key={ing.num}
            className={`block w-[2px] h-7 rounded-full transition-colors duration-300 ${
              i === activeIndex ? 'bg-sky-deep' : 'bg-white/15'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function RailPanel({ index, registerRef, num, name, desc }: {
  index: number
  registerRef: (index: number, el: HTMLDivElement | null) => void
  num: string
  name: string
  desc: string
}) {
  return (
    <div ref={(el) => registerRef(index, el)} className="min-h-[54vh] flex items-center">
      <RailPanelContent num={num} name={name} desc={desc} />
    </div>
  )
}

function DesktopSequence() {
  const [activeIndex, setActiveIndex] = useState(0)
  const panelsRef = useRef<Array<HTMLDivElement | null>>([])
  const ratiosRef = useRef<number[]>(ingredients.map(() => 0))

  const registerRef = (index: number, el: HTMLDivElement | null) => {
    panelsRef.current[index] = el
  }

  useEffect(() => {
    // Single observer arbitrates across all panels: whichever panel has the
    // greatest intersection ratio within the centered band wins, avoiding
    // races when two panels straddle the -45%/-45% band simultaneously.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = panelsRef.current.indexOf(entry.target as HTMLDivElement)
          if (idx !== -1) ratiosRef.current[idx] = entry.isIntersecting ? entry.intersectionRatio : 0
        }
        let bestIndex = 0
        let bestRatio = -1
        ratiosRef.current.forEach((ratio, i) => {
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestIndex = i
          }
        })
        if (bestRatio > 0) setActiveIndex(bestIndex)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    panelsRef.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="grid grid-cols-[5fr_7fr] gap-12 max-w-[1200px] mx-auto relative z-10">
      <StickyRail activeIndex={activeIndex} />
      <div className="flex flex-col gap-0">
        {ingredients.map((ing, i) => (
          <RailPanel
            key={ing.num}
            index={i}
            registerRef={registerRef}
            num={ing.num}
            name={ing.name}
            desc={ing.desc}
          />
        ))}
      </div>
    </div>
  )
}

function StackedCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[1000px] mx-auto relative z-10">
      {ingredients.map(({ num, name, desc }, i) => (
        <FadeUp key={num} delay={i * 0.08}>
          <IngredientCardContent num={num} name={name} desc={desc} />
        </FadeUp>
      ))}
    </div>
  )
}

export default function Ingredients() {
  const motionOK = useMotionOK()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const useSequence = motionOK && isDesktop

  return (
    <section id="ingredients" className="bg-navy py-24 px-6 md:px-16 relative">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '128px' }} />
      <FadeUp className="text-center max-w-[560px] mx-auto mb-12 relative z-10">
        <Eyebrow tone="dark" align="center" className="mb-5">The Formula</Eyebrow>
        <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-white tracking-[-0.02em] mb-5">
          The AireComplex<br /><em className="italic text-sky-deep">Four active ingredients. One perfect outcome.</em>
        </h2>
        <p className="text-[0.95rem] text-white/60 leading-[1.84] font-light">
          Meticulous ingredient selection and precision dosing for optimal outcomes.
        </p>
      </FadeUp>

      {useSequence ? <DesktopSequence /> : <StackedCards />}

      <p className="text-[0.62rem] text-white/25 leading-relaxed max-w-[540px] mx-auto text-center mt-10 relative z-10">
        † These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </section>
  )
}
