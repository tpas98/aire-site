'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { inside } from '../content'
import Dag, { Eyebrow, MaskSwap } from './Dag'

/**
 * What's inside. Opens on the three floating cans (the site's real render),
 * which lift away as each ingredient takes the full screen in turn: an
 * AI-generated macro of the botanical on the brand sky gradient, slow zoom,
 * name and benefit over it. A 4-segment bar tracks where you are.
 */
const INTRO = 0.16
const seg = (i: number): [number, number] => {
  const len = (1 - INTRO) / inside.items.length
  return [INTRO + i * len, INTRO + (i + 1) * len]
}

function Backdrop({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const [a, b] = seg(i)
  const last = i === inside.items.length - 1
  const opacity = useTransform(progress, last ? [a - 0.05, a + 0.02] : [a - 0.05, a + 0.02, b - 0.02, b + 0.05], last ? [0, 1] : [0, 1, 1, 0])
  const scale = useTransform(progress, [a - 0.05, b + 0.05], [1.12, 1])
  const visibility = useTransform(opacity, (o) => (o < 0.01 ? 'hidden' : 'visible'))
  return (
    <motion.div style={{ opacity, visibility }} className="absolute inset-0">
      <motion.div style={{ scale }} className="h-full w-full">
        <Image src={inside.images[i]} alt={`${inside.items[i].name}, ${inside.items[i].from.toLowerCase()}`} fill sizes="100vw" className="object-cover object-center" />
      </motion.div>
    </motion.div>
  )
}

function Seg({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const [a, b] = seg(i)
  const scaleX = useTransform(progress, [a, b], [0, 1])
  return (
    <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-navy/15">
      <motion.div className="h-full origin-left bg-navy" style={{ scaleX }} />
    </div>
  )
}

export default function Inside() {
  const reduce = !!useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(-1)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    let i = -1
    for (let k = 0; k < inside.items.length; k++) if (p >= seg(k)[0]) i = k
    setActive((c) => (c === i ? c : i))
  })
  // Intro: cans big and centred, then they lift off.
  const cansY = useTransform(scrollYProgress, [0, INTRO - 0.04, INTRO + 0.02], [30, 0, -220])
  const cansO = useTransform(scrollYProgress, [INTRO - 0.04, INTRO], [1, 0])
  const cansScale = useTransform(scrollYProgress, [0, INTRO - 0.04], [0.92, 1])
  const titleO = useTransform(scrollYProgress, [INTRO - 0.05, INTRO - 0.01], [1, 0])
  const copyO = useTransform(scrollYProgress, [INTRO, INTRO + 0.03], [0, 1])

  if (reduce) {
    return (
      <section id="ingredients" className="bg-hero-gradient px-6 py-24 md:px-16">
        <div className="mx-auto max-w-[1100px]">
          <Eyebrow>{inside.eyebrow}</Eyebrow>
          <h2 className="mb-10 font-serif text-[clamp(2.2rem,7vw,4rem)] leading-[1.04] text-navy">{inside.title}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {inside.items.map((it, i) => (
              <div key={it.name} className="overflow-hidden rounded-3xl bg-white/70">
                <Image src={inside.images[i]} alt="" width={1122} height={1402} className="aspect-[4/3] w-full object-cover" />
                <div className="p-6">
                  <div className="font-serif text-[1.8rem] text-navy">{it.name}</div>
                  <div className="text-[0.85rem] text-navy-mid">{it.from}</div>
                  <p className="mt-3 text-navy"><Dag>{it.known}</Dag></p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[0.85rem] font-semibold text-navy-mid">{inside.note}</p>
        </div>
      </section>
    )
  }

  const it = active >= 0 ? inside.items[active] : null
  return (
    <section id="ingredients" ref={ref} aria-labelledby="inside-title" className="relative h-[400vh] bg-hero-gradient">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {inside.items.map((_, i) => <Backdrop key={i} i={i} progress={scrollYProgress} />)}
        {/* Legibility at the bottom where the copy sits */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-[#cfe4f2]/70 to-transparent" />

        {/* Intro: headline, then the three cans in the space below it (never overlapping). */}
        <div className="absolute inset-0 flex flex-col items-center px-6 pb-[110px] pt-[112px] md:pb-16 md:pt-[120px]">
          <motion.div style={{ opacity: titleO }} className="shrink-0 text-center">
            <Eyebrow center>{inside.eyebrow}</Eyebrow>
            <h2 id="inside-title" className="mx-auto max-w-[16ch] font-serif leading-[1.02] tracking-[-0.02em] text-navy" style={{ fontSize: 'clamp(2.1rem, 7.5vw, 4.2rem)' }}>
              {inside.title}
            </h2>
          </motion.div>
          <div className="relative mt-4 flex min-h-0 w-full flex-1 items-center justify-center">
            <motion.div style={{ y: cansY, opacity: cansO, scale: cansScale }} className="flex h-full w-full items-center justify-center">
              <Image
                src="/images/discover/three-cans-fixed.webp"
                alt="Three Aire Calm Mint cans"
                width={1370}
                height={972}
                sizes="(min-width: 768px) 760px, 96vw"
                className="h-full max-h-full w-full max-w-[760px] object-contain md:[filter:drop-shadow(0_30px_40px_rgba(26,46,74,0.25))]"
              />
            </motion.div>
          </div>
        </div>

        {/* Ingredient copy */}
        <motion.div style={{ opacity: copyO }} className="absolute inset-x-0 bottom-0 px-4 pb-[96px] md:px-16 md:pb-14">
          <div className="mx-auto max-w-[1100px] rounded-[26px] border border-white/60 bg-white/90 p-5 shadow-[0_20px_60px_rgba(26,46,74,0.15)] md:bg-white/65 md:backdrop-blur-xl md:max-w-[560px] md:ml-0 md:p-7">
            <div className="mb-4 flex max-w-[420px] gap-1.5" aria-hidden="true">
              {inside.items.map((x, i) => <Seg key={x.name} i={i} progress={scrollYProgress} />)}
            </div>
            <div className="relative min-h-[132px] md:min-h-[170px]" aria-live="polite">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-navy-mid">
                <MaskSwap k={`l-${active}`}>
                  <span className="block">{it ? `${String(active + 1).padStart(2, '0')} / 04 \u00b7 ${it.from}` : inside.note}</span>
                </MaskSwap>
              </div>
              <MaskSwap k={`n-${active}`} className="mt-1 pb-1">
                <div className="font-serif leading-[1.02] tracking-[-0.02em] text-navy" style={{ fontSize: 'clamp(2.6rem, 12vw, 5.2rem)' }}>
                  {it ? it.name : '\u00a0'}
                </div>
              </MaskSwap>
              <MaskSwap k={`k-${active}`} className="mt-2">
                <p className="max-w-[440px] text-[1.02rem] leading-[1.5] text-navy md:text-[1.15rem]">
                  {it ? <Dag>{it.known}</Dag> : '\u00a0'}
                </p>
              </MaskSwap>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
