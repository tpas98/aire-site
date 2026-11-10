'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useBuyUrl } from '@/lib/useSale'
import { aisleStory } from '../content'
import { Keyframes, keyframes, n, timeline, useScrub } from '../scrollAnim'
import Dag, { GRADIENT, MaskSwap } from './Dag'

/**
 * The pouch aisle, told with product. Each kind of pouch takes the stage as an
 * unbranded can on a spec card (energy, nicotine, sleep), then steps back into
 * a deck behind the next one. Aire arrives last: the deck fans out behind it
 * and the gauge settles at Level.
 */
const N = aisleStory.steps.length
const TOTAL = N + 1
// Scroll windows: each competitor gets ~0.2 of the scene, Aire the last ~0.3.
const WIN = (i: number): [number, number] => [0.04 + i * 0.2, 0.04 + i * 0.2 + 0.2]
const AIRE_AT = 0.66

const TONE: Record<string, string> = { warm: '#d9715c', grey: '#8794a6', deep: '#5f74a6' }
const CARD_SHADOW = '0 1px 1px rgba(26,46,74,0.05), 0 16px 36px -14px rgba(26,46,74,0.24), 0 44px 80px -36px rgba(26,46,74,0.3)'
const pad2 = (v: number) => String(v).padStart(2, '0')

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

/** Every size on the stage, from the stage box. */
function geom(box: { w: number; h: number }) {
  const small = box.w < 600
  const R = small ? 1 : 1.14 // image area, h / w
  const short = box.h < 290 // a short phone: less room under the headline
  const F = small ? (short ? 50 : 58) : 72 // spec footer height
  const dx = small ? 13 : 22 // deck offset per depth
  const dy = small ? 11 : 18
  const big = Math.max(120, Math.min(box.w - dx * 4 - 8, 390, (box.h - F - dy * 4 - 6) / R))
  const cardH = big * R + F
  // Aire's scene: the deck fans out along the top, Aire sits in front below.
  const fanW = Math.min(box.w * 0.29, small ? 104 : 150, box.h * 0.3)
  const fs = fanW / big
  const fanH = cardH * fs
  const A = small ? (short ? 1.6 : 1.3) : 1.08 // Aire image area, w / h
  const aireW = Math.max(150, Math.min(box.w * 0.94, 440, (box.h - 6 - big * R * fs * (short ? 0.6 : 0.9) - F) * A))
  return { small, R, F, dx, dy, big, cardH, fanW, fs, fanH, A, aireW }
}

/**
 * The scene's keyframes. A card enters from the right, holds centre, then
 * steps back one place in the deck each time another card arrives. When Aire
 * takes over, the deck fans out along the top. All transform / opacity, so it
 * runs on the compositor.
 */
function sceneCss(box: { w: number; h: number }, tag: string) {
  const g = geom(box)
  let css = ''
  aisleStory.steps.forEach((_, i) => {
    const [a] = WIN(i)
    const t = [a - 0.06, a + 0.02]
    const x = [box.w * 0.7 + g.dx, g.dx]
    const y = [g.dy, g.dy]
    const s = [0.94, 1]
    const r = [6, 0]
    const hold = (at: number) => {
      t.push(at)
      x.push(x[x.length - 1])
      y.push(y[y.length - 1])
      s.push(s[s.length - 1])
      r.push(r[r.length - 1])
    }
    for (let d = 1; i + d < N; d++) {
      const next = WIN(i + d)[0]
      hold(next - 0.03)
      t.push(next + 0.05)
      x.push(g.dx - d * g.dx)
      y.push(g.dy - d * g.dy)
      s.push(1 - d * 0.05)
      r.push(-2.5 * d)
    }
    hold(AIRE_AT - 0.04)
    const k = i - (N - 1) / 2
    t.push(AIRE_AT + 0.08)
    x.push(k * g.fanW * 1.04)
    y.push(-box.h / 2 + g.fanH / 2 + 6 + Math.abs(k) * (g.small ? 8 : 12))
    s.push(g.fs)
    r.push(k * 7)
    css += keyframes(
      `pa-card${i}-${tag}`,
      { x: [t, x], y: [t, y], s: [t, s], r: [t, r], o: [[a - 0.06, a, AIRE_AT, AIRE_AT + 0.08], [0, 1, 1, 0.9]] },
      (v) => `transform:translate(${n(v.x)}px,${n(v.y)}px) scale(${n(v.s)}) rotate(${n(v.r)}deg);opacity:${n(v.o)}`,
    )
    css += keyframes(`pa-mark${i}`, { o: [[a, a + 0.05, AIRE_AT, AIRE_AT + 0.06], [0, 1, 1, 0.45]] }, (v) => `opacity:${n(v.o)}`)
  })
  css += keyframes(
    'pa-aire',
    { s: [[AIRE_AT - 0.04, AIRE_AT + 0.08], [0.82, 1]], y: [[AIRE_AT - 0.04, AIRE_AT + 0.08], [90, 0]], o: [[AIRE_AT - 0.04, AIRE_AT + 0.04], [0, 1]] },
    (v) => `transform:translateY(${n(v.y)}px) scale(${n(v.s)});opacity:${n(v.o)}`,
  )
  css += keyframes('pa-glow', { o: [[AIRE_AT - 0.02, AIRE_AT + 0.1], [0, 1]] }, (v) => `opacity:${n(v.o)}`)
  css += keyframes('pa-cta', { o: [[AIRE_AT + 0.08, AIRE_AT + 0.14], [0, 1]] }, (v) => `opacity:${n(v.o)}`)
  return css
}

/** Spec footer shared by every card: what it is, where it puts you, one number. */
function Spec({ kind, state, stat, small, tight = false, dark = false }: { kind: string; state: string; stat: { k: string; v: string }; small: boolean; tight?: boolean; dark?: boolean }) {
  const dim = dark ? 'text-white/55' : 'text-muted'
  const ink = dark ? 'text-white' : 'text-navy'
  return (
    <div className={`flex items-end justify-between gap-3 ${small ? 'px-4 pb-3 pt-2.5' : 'px-5 pb-4 pt-3.5'}`}>
      <div className="min-w-0">
        <div className={`truncate text-[0.56rem] font-semibold uppercase tracking-[0.18em] ${dim}`}>{kind}</div>
        <div className={`mt-0.5 whitespace-nowrap font-serif leading-none tracking-[-0.01em] ${ink} ${tight ? 'text-[1.12rem]' : small ? 'text-[1.3rem]' : 'text-[1.6rem]'}`}>{state}</div>
      </div>
      <div className={`shrink-0 text-right ${tight ? 'hidden' : ''}`}>
        <div className={`text-[0.56rem] font-semibold uppercase tracking-[0.18em] ${dim}`}>{stat.k}</div>
        <div className={`mt-1 font-medium leading-none ${ink} ${small ? 'text-[0.86rem]' : 'text-[1rem]'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
          {stat.v}
        </div>
      </div>
    </div>
  )
}

function Card({ i, box, tag }: { i: number; box: { w: number; h: number }; tag: string }) {
  const s = aisleStory.steps[i]
  const g = geom(box)
  return (
    <div
      style={{ animationName: `pa-card${i}-${tag}`, width: g.big, marginLeft: -g.big / 2, marginTop: -g.cardH / 2 }}
      className="sa absolute left-1/2 top-1/2 origin-center"
    >
      <div className="overflow-hidden rounded-[22px] bg-white ring-1 ring-navy/[0.07] md:rounded-[28px]" style={{ boxShadow: CARD_SHADOW }}>
        <div className="relative" style={{ height: g.big * g.R }}>
          <Image src={s.img} alt={`${s.label}, unbranded`} fill sizes="390px" className="object-cover" />
          <span className="absolute left-3.5 top-3 text-[0.62rem] font-semibold tracking-[0.2em] text-white/90 md:left-5 md:top-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {pad2(i + 1)}
          </span>
          <span aria-hidden="true" className="absolute right-3.5 top-3.5 h-1.5 w-1.5 rounded-full md:right-5 md:top-5" style={{ background: TONE[s.tone], boxShadow: '0 0 0 3px rgba(255,255,255,0.55)' }} />
        </div>
        <div style={{ height: g.F }} className="flex flex-col justify-center border-t border-navy/[0.06]">
          <Spec kind={g.big < 210 ? s.short : s.label} state={s.chip} stat={s.stat} small={g.small} tight={g.big < 200} />
        </div>
      </div>
    </div>
  )
}

function Marker({ i }: { i: number }) {
  const s = aisleStory.steps[i]
  return (
    <span
      style={{ animationName: `pa-mark${i}`, left: `${s.pos * 100}%`, background: TONE[s.tone] }}
      className="sa absolute top-1/2 -ml-[4px] -mt-[4px] h-2 w-2 rounded-full ring-2 ring-white"
    />
  )
}

/** Wired to Out, on a ruled hairline scale. The needle is spring-driven. */
function Gauge({ needleX, className = '' }: { needleX: MotionValue<string>; className?: string }) {
  return (
    <div className={className}>
      <div className="relative h-7">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[7px] opacity-70"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(26,46,74,0.3) 0, rgba(26,46,74,0.3) 1px, transparent 1px, transparent calc(100% / 24))', backgroundSize: 'calc(100% - 1px) 100%' }}
        />
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full" style={{ backgroundImage: GRADIENT.spectrumH }} />
        <div className="absolute inset-x-0 top-1/2 h-0">
          {aisleStory.steps.map((_, i) => <Marker key={i} i={i} />)}
        </div>
        <motion.div style={{ x: needleX }} className="pointer-events-none absolute inset-0">
          <span className="absolute left-0 top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-navy bg-white shadow-[0_3px_10px_rgba(26,46,74,0.35)]" />
        </motion.div>
      </div>
      <div className="mt-1.5 flex justify-between text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-muted">
        <span>{aisleStory.gauge.left}</span>
        <span className="text-navy">{aisleStory.gauge.mid}</span>
        <span>{aisleStory.gauge.right}</span>
      </div>
    </div>
  )
}

export default function PouchAisle() {
  const buyUrl = useBuyUrl()
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
  const g = geom(box)

  const all = [...aisleStory.steps, aisleStory.aire]
  const cur = all[step]

  if (reduce) {
    return (
      <section id="why" className="bg-[linear-gradient(180deg,#f3f8fc_0%,#e3eff8_100%)] px-6 py-24">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-8 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-navy-mid">{aisleStory.eyebrow}</div>
          <div className="grid gap-5 md:grid-cols-4">
            {all.map((s, i) => (
              <div key={s.title} className="overflow-hidden rounded-3xl bg-white ring-1 ring-navy/[0.07]">
                <div className={`relative aspect-[4/5] ${i === N ? 'bg-[linear-gradient(165deg,#e6f3fb,#9fcbe6)]' : ''}`}>
                  <Image src={s.img} alt="" fill sizes="(max-width:768px) 100vw, 260px" className={i === N ? 'object-contain p-6' : 'object-cover'} />
                </div>
                <div className="p-5">
                  <div className="font-serif text-[1.4rem] leading-tight text-navy">{s.title}</div>
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
    <section id="why" ref={ref} style={timeline('--aisle', 'contain')} aria-label="How Aire compares to other pouches" className="relative h-[380vh] bg-[linear-gradient(180deg,#f3f8fc_0%,#e3eff8_100%)]">
      <Keyframes css={css} />
      <div className="sticky top-0 h-[100svh] overflow-hidden px-6 pb-[92px] pt-[104px] md:px-16 md:pb-12 md:pt-[112px]">
        {/* Cool glow for Aire's entrance */}
        <div aria-hidden="true" style={{ animationName: 'pa-glow' }} className="sa pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_58%,rgba(126,194,223,0.38),transparent_70%)] md:bg-[radial-gradient(42%_60%_at_72%_55%,rgba(126,194,223,0.42),transparent_70%)]" />

        <div className="relative mx-auto flex h-full w-full max-w-[1180px] flex-col md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-center md:gap-x-16">
          {/* Copy column */}
          <div className="relative">
            <div className="mb-3 flex items-center justify-between md:mb-5">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="block h-px w-8 bg-accent" />
                <span className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-navy-mid">{aisleStory.eyebrow}</span>
              </div>
              <span className="text-[0.66rem] font-semibold tracking-[0.18em] text-navy md:hidden" style={{ fontVariantNumeric: 'tabular-nums' }} aria-hidden="true">
                {pad2(step + 1)}
                <span className="text-navy/35"> / {pad2(TOTAL)}</span>
              </span>
            </div>

            <div className="relative min-h-[112px] md:min-h-[214px] [@media(max-height:700px)]:min-h-[92px]" aria-live="polite">
              <MaskSwap k={cur.title} bleed={16}>
                <h2 className="max-w-[13ch] font-serif text-[clamp(2rem,7.6vw,2.5rem)] leading-[1.02] tracking-[-0.02em] text-navy md:text-[clamp(2.6rem,4.4vw,4.1rem)] [@media(max-height:700px)_and_(max-width:767px)]:text-[1.75rem]">
                  {step === N ? (
                    <>
                      Aire <span className="bg-clip-text italic text-transparent [-webkit-background-clip:text]" style={{ backgroundImage: 'linear-gradient(92deg,#5a9bbf,#2c6f8f)' }}>levels you out.</span>
                    </>
                  ) : (
                    cur.title
                  )}
                </h2>
              </MaskSwap>
              <MaskSwap k={cur.sub} className="mt-2 md:mt-4">
                <p className="max-w-[440px] text-[0.95rem] leading-[1.5] text-navy-mid md:text-[1.06rem] md:leading-[1.55] [@media(max-height:700px)]:text-[0.85rem]"><Dag>{cur.sub}</Dag></p>
              </MaskSwap>
            </div>

            {/* Desktop: the four lanes as an index, plus the gauge */}
            <ol className="mt-8 hidden border-t border-navy/10 md:block" aria-hidden="true">
              {all.map((s, i) => {
                const on = i === step
                return (
                  <li key={s.short} className="flex items-baseline gap-5 border-b border-navy/10 py-[11px] transition-opacity duration-500" style={{ opacity: on ? 1 : 0.36 }}>
                    <span className="w-5 text-[0.64rem] font-semibold tracking-[0.16em] text-navy-mid" style={{ fontVariantNumeric: 'tabular-nums' }}>{pad2(i + 1)}</span>
                    <span className="flex-1 text-[0.98rem] font-medium text-navy">{s.label}</span>
                    <span className="font-serif text-[1.02rem] italic text-navy-mid">{s.chip}</span>
                  </li>
                )
              })}
            </ol>
            <Gauge needleX={needleX} className="mt-9 hidden md:block" />
            <div style={{ animationName: 'pa-cta' }} className="sa mt-8 hidden md:block">
              <a href={buyUrl} className="inline-block rounded-full bg-navy px-8 py-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_30px_rgba(26,46,74,0.3)] transition-transform hover:-translate-y-0.5">
                {aisleStory.aire.cta}
              </a>
            </div>
          </div>

          {/* Stage */}
          <div ref={stageRef} className="relative mt-3 w-full flex-1 md:mt-0 md:h-[min(72svh,680px)] md:flex-none">
            {aisleStory.steps.map((_, i) => (
              <Card key={i} i={i} box={box} tag={tag} />
            ))}
            <div style={{ animationName: 'pa-aire', width: g.aireW }} className="sa absolute inset-x-0 bottom-0 mx-auto">
              <div className="overflow-hidden rounded-[24px] bg-navy ring-1 ring-white/70 md:rounded-[30px]" style={{ boxShadow: '0 2px 2px rgba(26,46,74,0.08), 0 30px 70px -20px rgba(26,46,74,0.5)' }}>
                <div className="relative bg-[radial-gradient(90%_80%_at_50%_30%,#f4fafd_0%,#cfe6f4_45%,#8fc1e0_100%)]" style={{ height: g.aireW / g.A }}>
                  <span aria-hidden="true" className="absolute inset-x-[18%] bottom-[11%] h-[9%] rounded-[50%] bg-navy/40 blur-xl" />
                  <Image src={aisleStory.aire.img} alt="Aire Calm Mint can" fill sizes="440px" className="object-contain p-[8%]" />
                  <span className="absolute left-4 top-3.5 text-[0.62rem] font-semibold tracking-[0.2em] text-navy/70 md:left-5 md:top-4" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {pad2(TOTAL)}
                  </span>
                </div>
                <div style={{ height: g.F }} className="flex flex-col justify-center">
                  <Spec kind={g.aireW < 250 ? aisleStory.aire.short : aisleStory.aire.label} state={aisleStory.aire.chip} stat={aisleStory.aire.stat} small={g.small} dark />
                </div>
              </div>
            </div>
          </div>

          {/* Phone: gauge under the stage */}
          <Gauge needleX={needleX} className="relative mx-auto mt-4 w-full max-w-[640px] md:hidden" />
        </div>
      </div>
    </section>
  )
}
