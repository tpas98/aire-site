'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { buyUrl } from '@/lib/checkout'
import { aisleStory } from '../content'
import { Keyframes, keyframes, n, timeline, useScrub } from '../scrollAnim'
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

/** Geometry for one competitor card at the current stage size. */
function cardGeom(i: number, box: { w: number; h: number }) {
  const R = 716 / 557 // card image aspect (h / w)
  const thumb = Math.min(box.w / N - 10, box.w < 600 ? 62 : 112, box.h * 0.2)
  const thumbH = thumb * R
  // The big card fills the space under the thumbnail row.
  const avail = box.h - thumbH - 14
  const big = Math.max(110, Math.min(box.w * 0.84, 420, avail / R))
  return { big, bigH: big * R, thumb, thumbH }
}

/**
 * The scene's keyframes. Each competitor card enters from the right, holds
 * centre, then shrinks into its thumbnail slot; it dims once Aire takes over.
 * Same stops the useTransform version used, now played by the compositor.
 */
function sceneCss(box: { w: number; h: number }, tag: string) {
  let css = ''
  aisleStory.steps.forEach((_, i) => {
    const [a, b] = WIN(i)
    const { big, thumb, thumbH } = cardGeom(i, box)
    const centerY = (thumbH + 14) / 2
    const slotX = (i - (N - 1) / 2) * (thumb + 10)
    const slotY = -(box.h / 2) + thumbH / 2
    const t = [a - 0.06, a + 0.02, b - 0.03, b + 0.05]
    css += keyframes(
      `pa-card${i}-${tag}`,
      {
        x: [t, [box.w, 0, 0, slotX]],
        y: [t, [centerY, centerY, centerY, slotY]],
        s: [t, [0.92, 1, 1, thumb / big]],
        r: [t, [8, 0, 0, 0]],
        o: [[a - 0.06, a, AIRE_AT, AIRE_AT + 0.06], [0, 1, 1, 0.45]],
      },
      (v) => `transform:translate(${n(v.x)}px,${n(v.y)}px) scale(${n(v.s)}) rotate(${n(v.r)}deg);opacity:${n(v.o)}`,
    )
    css += keyframes(`pa-detail${i}`, { o: [[b - 0.03, b + 0.01], [1, 0]] }, (v) => `opacity:${n(v.o)}`)
    css += keyframes(`pa-mark${i}`, { o: [[a, a + 0.05, AIRE_AT, AIRE_AT + 0.06], [0, 1, 1, 0.4]] }, (v) => `opacity:${n(v.o)}`)
  })
  css += keyframes(
    'pa-aire',
    { s: [[AIRE_AT - 0.04, AIRE_AT + 0.08], [0.7, 1]], y: [[AIRE_AT - 0.04, AIRE_AT + 0.08], [120, 0]], o: [[AIRE_AT - 0.04, AIRE_AT + 0.04], [0, 1]] },
    (v) => `transform:translateY(${n(v.y)}px) scale(${n(v.s)});opacity:${n(v.o)}`,
  )
  css += keyframes('pa-glow', { o: [[AIRE_AT - 0.02, AIRE_AT + 0.1], [0, 1]] }, (v) => `opacity:${n(v.o)}`)
  css += keyframes('pa-cta', { o: [[AIRE_AT + 0.08, AIRE_AT + 0.14], [0, 1]] }, (v) => `opacity:${n(v.o)}`)
  return css
}

function Card({ i, box, tag }: { i: number; box: { w: number; h: number }; tag: string }) {
  const s = aisleStory.steps[i]
  const { big, bigH } = cardGeom(i, box)
  return (
    <div
      style={{ animationName: `pa-card${i}-${tag}`, width: big, marginLeft: -big / 2, marginTop: -bigH / 2 }}
      className="sa absolute left-1/2 top-1/2 origin-center"
    >
      <div className="relative overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(26,46,74,0.18)]">
        <Image src={s.img} alt={`${s.label}, unbranded`} width={557} height={716} sizes="420px" className="aspect-[557/716] h-auto w-full object-cover" />
        <span style={{ animationName: `pa-detail${i}` }} className={`sa absolute left-3 top-3 rounded-full border px-3 py-1 text-[0.72rem] font-semibold ${CHIP[s.tone]} shadow-sm`}>
          {s.chip}
        </span>
        <div style={{ animationName: `pa-detail${i}` }} className="sa absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/90 to-transparent p-4 pt-12 md:p-5 md:pt-14">
          <div className="text-[1rem] font-semibold leading-tight text-navy md:text-[1.05rem]">{s.label}</div>
        </div>
      </div>
    </div>
  )
}

function Marker({ i }: { i: number }) {
  const s = aisleStory.steps[i]
  const color = s.tone === 'warm' ? '#e8907e' : s.tone === 'grey' ? '#9aa6b5' : '#5f74a6'
  return (
    <span
      style={{ animationName: `pa-mark${i}`, left: `${s.pos * 100}%`, background: color }}
      className="sa absolute top-1/2 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full border-2 border-white shadow"
    />
  )
}

export default function PouchAisle() {
  const reduce = !!useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const box = useBox(stageRef)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useScrub(ref, scrollYProgress)
  const [step, setStep] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const st = p >= AIRE_AT ? N : Math.max(0, Math.min(N - 1, Math.floor((p - 0.04) / 0.2)))
    setStep((c) => (c === st ? c : st))
  })

  const needleTarget = useTransform(scrollYProgress, [0.04, 0.2, 0.3, 0.44, 0.5, 0.62, AIRE_AT, AIRE_AT + 0.1], [10, 10, 24, 24, 90, 90, 90, 50])
  // Real spring: the needle swings past Level and settles, whatever the scroll speed.
  const needle = useSpring(needleTarget, { stiffness: 140, damping: 13, mass: 0.8 })
  // translateX of a track-wide box, not `left`: no layout per frame.
  const needleX = useTransform(needle, (v) => `${v}%`)
  // Keyframe names carry the stage size so a resize swaps in fresh rules.
  const tag = `${Math.round(box.w)}x${Math.round(box.h)}`
  const css = useMemo(() => sceneCss(box, tag), [box, tag])

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
    <section id="why" ref={ref} style={timeline('--aisle', 'contain')} aria-label="How Aire compares to other pouches" className="relative h-[380vh] bg-[linear-gradient(180deg,#e9f4fb_0%,#cfe5f3_100%)]">
      <Keyframes css={css} />
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-6 pb-[92px] pt-[108px] md:px-16 md:pb-10">
        {/* Cool glow for Aire's entrance */}
        <div aria-hidden="true" style={{ animationName: 'pa-glow' }} className="sa pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_55%,rgba(126,194,223,0.32),transparent_70%)]" />

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
            <Card key={i} i={i} box={box} tag={tag} />
          ))}
          <div style={{ animationName: 'pa-aire', width: aireW }} className="sa absolute inset-x-0 bottom-0 mx-auto">
            <div className="relative overflow-hidden rounded-[30px] shadow-[0_30px_80px_rgba(26,46,74,0.28)] ring-1 ring-white/60">
              <Image src={aisleStory.aire.img} alt="Aire Calm Mint can, open, with pouches" width={1254} height={1254} sizes="440px" className="aspect-[5/4] h-auto w-full object-cover object-[50%_8%] md:aspect-square" />
              <div className="absolute left-4 top-4 rounded-full bg-navy px-3 py-1 text-[0.72rem] font-semibold tracking-[0.04em] text-white">{aisleStory.aire.chip}</div>
            </div>
          </div>
        </div>

        {/* Gauge + CTA */}
        <div className="relative mx-auto mt-4 w-full max-w-[640px]">
          <div className="relative h-3">
            <div className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 rounded-full" style={{ backgroundImage: GRADIENT.spectrumH }} />
            {aisleStory.steps.map((_, i) => <Marker key={i} i={i} />)}
            <motion.div style={{ x: needleX }} className="pointer-events-none absolute inset-0">
              <span className="absolute left-0 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-navy shadow-[0_4px_14px_rgba(26,46,74,0.35)]" />
            </motion.div>
          </div>
          <div className="mt-2 flex justify-between text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-navy-mid">
            <span>{aisleStory.gauge.left}</span>
            <span className="text-navy">{aisleStory.gauge.mid}</span>
            <span>{aisleStory.gauge.right}</span>
          </div>
          <div style={{ animationName: 'pa-cta' }} className="sa mt-4 hidden justify-center md:flex">
            <a href={buyUrl()} className="rounded-full bg-navy px-8 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_12px_30px_rgba(26,46,74,0.3)]">
              {aisleStory.aire.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
