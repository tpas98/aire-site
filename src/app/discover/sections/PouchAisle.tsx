'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { buyUrl } from '@/lib/checkout'
import { aisleStory } from '../content'
import Dag, { Eyebrow, GRADIENT, MaskSwap } from './Dag'

/**
 * The pouch aisle, told with product. Each kind of pouch takes the stage as an
 * unbranded can (energy, nicotine, sleep), then steps back into a row of
 * thumbnails. Aire arrives last, big, open, on the cool glow, and the gauge
 * underneath settles at Level. Replaces the v2 spin scene and text-only spectrum.
 */
const N = aisleStory.steps.length
// Scroll windows: each competitor gets ~0.2 of the scene, Aire the last ~0.3.
const WIN = (i: number): [number, number] => [0.04 + i * 0.2, 0.04 + i * 0.2 + 0.2]
const AIRE_AT = 0.66

const CHIP: Record<string, string> = {
  warm: 'bg-[#fdeee9] text-[#b5503c] border-salmon/30',
  grey: 'bg-[#f1f4f7] text-navy-mid border-navy/15',
  deep: 'bg-[#eaedf6] text-[#3f5287] border-[#5f74a6]/30',
}

function useBox(ref: React.RefObject<HTMLElement>) {
  const [box, setBox] = useState({ w: 360, h: 420 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return box
}

/** One competitor card: enters from the right, holds centre, then shrinks into its thumbnail slot. */
function Card({ i, progress, box }: { i: number; progress: MotionValue<number>; box: { w: number; h: number } }) {
  const s = aisleStory.steps[i]
  const [a, b] = WIN(i)
  const R = 716 / 557 // card image aspect (h / w)
  const thumb = Math.min(box.w / N - 10, box.w < 600 ? 62 : 112, box.h * 0.2)
  const thumbH = thumb * R
  // The big card fills the space under the thumbnail row.
  const avail = box.h - thumbH - 14
  const big = Math.max(110, Math.min(box.w * 0.84, 420, avail / R))
  const bigH = big * R
  const centerY = (thumbH + 14) / 2
  const k = thumb / big
  const slotX = (i - (N - 1) / 2) * (thumb + 10)
  const slotY = -(box.h / 2) + thumbH / 2
  const t = [a - 0.06, a + 0.02, b - 0.03, b + 0.05]
  const x = useTransform(progress, t, [box.w, 0, 0, slotX])
  const y = useTransform(progress, t, [centerY, centerY, centerY, slotY])
  const scale = useTransform(progress, t, [0.92, 1, 1, k])
  const rotate = useTransform(progress, t, [8, 0, 0, 0])
  // Dim once Aire takes over.
  const opacity = useTransform(progress, [a - 0.06, a, AIRE_AT, AIRE_AT + 0.06], [0, 1, 1, 0.45])
  const detail = useTransform(progress, [b - 0.03, b + 0.01], [1, 0])

  return (
    <motion.div
      style={{ x, y, scale, rotate, opacity, width: big, marginLeft: -big / 2, marginTop: -bigH / 2 }}
      className="absolute left-1/2 top-1/2 origin-center"
    >
      <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(26,46,74,0.18)]">
        <Image src={s.img} alt={`${s.label}, unbranded`} width={557} height={716} sizes="420px" className="aspect-[557/716] h-auto w-full object-cover" />
        <motion.span style={{ opacity: detail }} className={`absolute left-3 top-3 rounded-full border px-3 py-1 text-[0.72rem] font-semibold ${CHIP[s.tone]} shadow-sm`}>
          {s.chip}
        </motion.span>
        <motion.div style={{ opacity: detail }} className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent p-4 pt-12 md:p-5 md:pt-14">
          <div className="text-[1rem] font-semibold leading-tight text-navy md:text-[1.05rem]">{s.label}</div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function Marker({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const s = aisleStory.steps[i]
  const [a] = WIN(i)
  const o = useTransform(progress, [a, a + 0.05, AIRE_AT, AIRE_AT + 0.06], [0, 1, 1, 0.4])
  const color = s.tone === 'warm' ? '#e8907e' : s.tone === 'grey' ? '#9aa6b5' : '#5f74a6'
  return (
    <motion.span
      style={{ opacity: o, left: `${s.pos * 100}%`, background: color }}
      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
    />
  )
}

export default function PouchAisle() {
  const reduce = !!useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const box = useBox(stageRef)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [step, setStep] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const st = p >= AIRE_AT ? N : Math.max(0, Math.min(N - 1, Math.floor((p - 0.04) / 0.2)))
    setStep((c) => (c === st ? c : st))
  })

  const aireScale = useTransform(scrollYProgress, [AIRE_AT - 0.04, AIRE_AT + 0.08], [0.7, 1])
  const aireY = useTransform(scrollYProgress, [AIRE_AT - 0.04, AIRE_AT + 0.08], [120, 0])
  const aireO = useTransform(scrollYProgress, [AIRE_AT - 0.04, AIRE_AT + 0.04], [0, 1])
  const glow = useTransform(scrollYProgress, [AIRE_AT - 0.02, AIRE_AT + 0.1], [0, 1])
  const needleTarget = useTransform(scrollYProgress, [0.04, 0.2, 0.3, 0.44, 0.5, 0.62, AIRE_AT, AIRE_AT + 0.1], [10, 10, 24, 24, 90, 90, 90, 50])
  // Real spring: the needle swings past Level and settles, whatever the scroll speed.
  const needle = useSpring(needleTarget, { stiffness: 140, damping: 13, mass: 0.8 })
  const needleLeft = useTransform(needle, (v) => `${v}%`)
  const ctaO = useTransform(scrollYProgress, [AIRE_AT + 0.08, AIRE_AT + 0.14], [0, 1])

  const cur = step < N ? aisleStory.steps[step] : aisleStory.aire
  const thumbH = Math.min(box.w / N - 10, box.w < 600 ? 62 : 112, box.h * 0.2) * (716 / 557)
  const aireW = Math.max(150, Math.min(box.w * 0.9, 440, (box.h - thumbH - 14) * (box.w < 768 ? 1.25 : 1)))

  if (reduce) {
    return (
      <section id="why" className="bg-hero-gradient px-6 py-24">
        <div className="mx-auto max-w-[1100px]">
          <Eyebrow>{aisleStory.eyebrow}</Eyebrow>
          <div className="grid gap-5 md:grid-cols-4">
            {[...aisleStory.steps, aisleStory.aire].map((s) => (
              <div key={s.title} className="overflow-hidden rounded-3xl bg-white">
                <Image src={s.img} alt="" width={557} height={716} className="aspect-[4/5] w-full object-cover" />
                <div className="p-5">
                  <div className="font-serif text-[1.4rem] text-navy">{s.title}</div>
                  <p className="mt-1 text-navy-mid"><Dag>{s.sub}</Dag></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="why" ref={ref} aria-label="How Aire compares to other pouches" className="relative h-[380vh] bg-[linear-gradient(180deg,#e9f4fb_0%,#cfe5f3_100%)]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-6 pb-[92px] pt-[108px] md:px-16 md:pb-10">
        {/* Cool glow for Aire's entrance */}
        <motion.div aria-hidden="true" style={{ opacity: glow }} className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_55%,rgba(126,194,223,0.32),transparent_70%)]" />

        <div className="relative mx-auto w-full max-w-[1100px]">
          <Eyebrow>{aisleStory.eyebrow}</Eyebrow>
          <div className="relative min-h-[118px] md:min-h-[150px] [@media(max-height:700px)]:min-h-[96px]" aria-live="polite">
            <MaskSwap k={cur.title}>
              <h2 className="font-serif text-[clamp(2rem,7.6vw,4rem)] leading-[1.02] tracking-[-0.02em] text-navy [@media(max-height:700px)_and_(max-width:767px)]:text-[1.8rem]">
                {step === N ? (
                  <>
                    Aire <span className="bg-clip-text italic text-transparent [-webkit-background-clip:text]" style={{ backgroundImage: 'linear-gradient(92deg,#5a9bbf,#2c6f8f)' }}>levels you out.</span>
                  </>
                ) : (
                  cur.title
                )}
              </h2>
            </MaskSwap>
            <MaskSwap k={cur.sub} className="mt-2">
              <p className="max-w-[520px] text-[0.95rem] leading-[1.5] text-navy-mid md:text-[1.05rem] [@media(max-height:700px)]:text-[0.85rem]"><Dag>{cur.sub}</Dag></p>
            </MaskSwap>
          </div>
        </div>

        {/* Stage */}
        <div ref={stageRef} className="relative mx-auto mt-3 w-full max-w-[900px] flex-1">
          {aisleStory.steps.map((_, i) => (
            <Card key={i} i={i} progress={scrollYProgress} box={box} />
          ))}
          <motion.div
            style={{ opacity: aireO, scale: aireScale, y: aireY, width: aireW }}
            className="absolute inset-x-0 bottom-0 mx-auto"
          >
            <div className="relative overflow-hidden rounded-[30px] shadow-[0_30px_80px_rgba(26,46,74,0.28)] ring-1 ring-white/60">
              <Image src={aisleStory.aire.img} alt="Aire Calm Mint can, open, with pouches" width={1254} height={1254} sizes="440px" className="aspect-[5/4] h-auto w-full object-cover object-[50%_8%] md:aspect-square" />
              <div className="absolute left-4 top-4 rounded-full bg-navy px-3 py-1 text-[0.72rem] font-semibold tracking-[0.04em] text-white">{aisleStory.aire.chip}</div>
            </div>
          </motion.div>
        </div>

        {/* Gauge + CTA */}
        <div className="relative mx-auto mt-4 w-full max-w-[640px]">
          <div className="relative h-3">
            <div className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full" style={{ backgroundImage: GRADIENT.spectrumH }} />
            {aisleStory.steps.map((_, i) => <Marker key={i} i={i} progress={scrollYProgress} />)}
            <motion.span style={{ left: needleLeft }} className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-navy shadow-[0_4px_14px_rgba(26,46,74,0.35)]" />
          </div>
          <div className="mt-2 flex justify-between text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-navy-mid">
            <span>{aisleStory.gauge.left}</span>
            <span className="text-navy">{aisleStory.gauge.mid}</span>
            <span>{aisleStory.gauge.right}</span>
          </div>
          <motion.div style={{ opacity: ctaO }} className="mt-4 hidden justify-center md:flex">
            <a href={buyUrl()} className="rounded-full bg-navy px-8 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_12px_30px_rgba(26,46,74,0.3)]">
              {aisleStory.aire.cta}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
