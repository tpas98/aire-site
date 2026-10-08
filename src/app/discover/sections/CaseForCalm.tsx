'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { caseForCalm } from '../content'
import { Keyframes, keyframes, n, timeline, useScrub } from '../scrollAnim'
import Dag, { Eyebrow, GRADIENT } from './Dag'

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/* ------------------------------------------------------------------ */
/* Part 1 - the three numbers                                          */
/* ------------------------------------------------------------------ */

type StatData = (typeof caseForCalm.stats)[number]

/**
 * One number that visibly counts. Server / no-JS / reduced-motion all show the
 * final value (it is the initial markup); after hydration the count is reset to
 * its start and plays once, when 60% of the block is on screen.
 */
function Stat({ s, i, reduce }: { s: StatData; i: number; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const bar = useMotionValue(1)
  const [done, setDone] = useState(true)
  const down = s.to < s.from
  const warm = !down
  const gradient = warm ? 'linear-gradient(92deg,#d9715c,#e8a35a)' : 'linear-gradient(92deg,#5a9bbf,#2c6f8f)'

  // Arm the count after hydration: rewind to the start state.
  useEffect(() => {
    if (reduce) return
    if (numRef.current) {
      numRef.current.textContent = String(s.from)
      numRef.current.style.minWidth = '2.4ch'
      numRef.current.style.textAlign = down ? 'right' : 'left'
    }
    bar.set(0)
    setDone(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce])

  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, 1, {
      duration: 2.4,
      delay: i * 0.12,
      ease: EASE_OUT,
      onUpdate: (p) => {
        if (numRef.current) numRef.current.textContent = String(Math.round(s.from + (s.to - s.from) * p))
        bar.set(p)
      },
      onComplete: () => {
        if (numRef.current) {
          numRef.current.textContent = String(s.to)
          numRef.current.style.minWidth = down ? '0' : '2.4ch'
          numRef.current.style.textAlign = 'left'
        }
        bar.set(1)
        setDone(true)
      },
    })
    return () => c.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce])

  return (
    <div ref={ref} className="border-t border-navy/15 pt-6">
      <div className="mb-2 text-[0.7rem] font-semibold tracking-[0.2em] text-navy-mid">{s.n}</div>
      <div
        className="font-serif leading-none tracking-[-0.03em]"
        style={{
          fontSize: 'clamp(4.2rem, 20vw, 8rem)',
          fontVariantNumeric: 'tabular-nums',
          backgroundImage: gradient,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          paddingBottom: '0.06em',
        }}
        aria-label={`${s.to} ${s.countUnit}`}
      >
        <span aria-hidden="true" ref={numRef} className="inline-block" style={{ minWidth: down ? 0 : '2.4ch' }}>
          {s.to}
        </span>
        <span aria-hidden="true" className="ml-2 align-baseline text-[0.32em] tracking-normal">
          {s.countUnit}
        </span>
      </div>

      <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-navy/10" aria-hidden="true">
        <motion.div className="h-full origin-left rounded-full" style={{ scaleX: bar, backgroundImage: gradient }} />
      </div>

      {/* Sub line. Stat 03 swaps its line when the count lands on zero. */}
      <div className="mt-3 grid text-[0.95rem] font-medium text-navy-mid" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {s.subEnd ? (
          <>
            <span className="col-start-1 row-start-1 transition-opacity duration-500" style={{ opacity: done ? 0 : 1 }} aria-hidden={done}>
              {s.sub}
            </span>
            <span className="col-start-1 row-start-1 text-[#2c6f8f] transition-opacity duration-500" style={{ opacity: done ? 1 : 0 }} aria-hidden={!done}>
              {s.subEnd}
            </span>
          </>
        ) : (
          <span>{s.sub}</span>
        )}
      </div>

      <p className="mt-4 text-[1.08rem] font-semibold text-navy">
        {s.label}
        {s.src > 0 && (
          <a href="#sources" className="ml-1 align-super text-[0.65em] font-medium text-navy-mid underline-offset-2 hover:underline" aria-label={`Source ${s.src}`}>
            [{s.src}]
          </a>
        )}
      </p>
      <p className="mt-1.5 max-w-[360px] text-[0.95rem] font-light leading-[1.6] text-navy-mid">
        <Dag>{s.body}</Dag>
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Part 2 - "A day of pouches", pinned and scroll-scrubbed             */
/* ------------------------------------------------------------------ */

type Key = 'nic' | 'caf' | 'aire'
const W = 340
const H = 300
const PAD = 16
const COLORS: Record<Key, string> = { nic: '#e8907e', caf: '#e0b14f', aire: '#7ec2df' }
const KEYS: Key[] = ['nic', 'caf', 'aire']

const smooth = (x: number) => x * x * (3 - 2 * x)
const toY = (v: number) => PAD + v * (H - PAD * 2)

/** y(t), t in [0,1] -> 0 wired top, 0.5 level, 1 out. Illustrative, not data. */
const POUCH_H = [8, 10, 12, 14, 16, 18]
function nicV(t: number) {
  const h = 8 + t * 12
  let idx = 0
  for (let k = 0; k < POUCH_H.length; k++) if (h >= POUCH_H[k]) idx = k
  const dt = h - POUCH_H[idx]
  const from = idx === 0 ? 0.5 : 0.7
  const RISE = 0.3
  if (dt < RISE) return from + (0.15 - from) * smooth(dt / RISE)
  const k = (1 - Math.exp(-(dt - RISE) / 0.9)) / (1 - Math.exp(-(2 - RISE) / 0.9))
  return 0.15 + (0.7 - 0.15) * k
}
const CAF_KEYS: [number, number][] = [[8, 0.5], [9, 0.08], [10.5, 0.32], [13, 0.8], [14.5, 0.2], [17, 0.26], [20, 0.3]]
function cafV(t: number) {
  const h = 8 + t * 12
  for (let k = 0; k < CAF_KEYS.length - 1; k++) {
    const [h0, v0] = CAF_KEYS[k]
    const [h1, v1] = CAF_KEYS[k + 1]
    if (h <= h1) return v0 + (v1 - v0) * smooth((h - h0) / (h1 - h0))
  }
  return CAF_KEYS[CAF_KEYS.length - 1][1]
}
const aireV = (t: number) => 0.5 + 0.035 * Math.sin(t * Math.PI * 2 * 2.3 + 0.6) + 0.012 * Math.sin(t * Math.PI * 2 * 5.5)
const FN: Record<Key, (t: number) => number> = { nic: nicV, caf: cafV, aire: aireV }

const N = 160
const PATHS = Object.fromEntries(
  KEYS.map((k) => {
    let d = ''
    for (let i = 0; i <= N; i++) {
      const t = i / N
      d += `${i ? 'L' : 'M'}${(t * W).toFixed(2)},${toY(FN[k](t)).toFixed(2)}`
    }
    return [k, d]
  }),
) as Record<Key, string>

function clockText(p: number) {
  const mins = Math.round((8 * 60 + clamp01(p) * 720) / 10) * 10
  const h24 = Math.floor(mins / 60) % 24
  const m = mins % 60
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${h24 >= 12 ? 'PM' : 'AM'}`
}

/** Callouts: x = time, anchored above/below the series. Appear as the cursor passes. */
/** `drop` pushes a 'below' pill further down (px), clear of neighbours on a narrow chart. */
type Callout = { key: Key; hour: number; text: string; place: 'above' | 'below'; align: 'center' | 'right'; drop?: number }
const CALLOUTS: Callout[] = [
  { key: 'nic', hour: 10, text: 'pouch #2', place: 'above', align: 'center' },
  { key: 'nic', hour: 14, text: 'pouch #4', place: 'above', align: 'center' },
  { key: 'nic', hour: 18, text: 'pouch #6', place: 'above', align: 'center' },
  { key: 'caf', hour: 13, text: 'the 1 p.m. slide', place: 'below', align: 'center' },
  { key: 'caf', hour: 19.4, text: 'still in you at 8 p.m.', place: 'above', align: 'right' },
  { key: 'aire', hour: 16, text: 'Aire: level', place: 'below', align: 'center', drop: 40 },
]
const calloutT = (c: Callout) => (c.hour - 8) / 12

const TICKS = [0, 0.25, 0.5, 0.75, 1]

// The story completes at 88% of the pin, then holds on the final frame.
const END = 0.88
/** Reveal edge runs 10 units ahead of the cursor, as the SVG clip did. */
const LEAD = 10 / W
/** The reveal window overhangs the chart by 4% each side (stroke caps). */
const OVER = 0.04

/**
 * Every scrubbed value on the chart, as compositor keyframes (scrollAnim.tsx).
 * The old version rewrote SVG attributes per frame, which repainted the whole
 * chart on every scroll tick: the single most expensive thing on the page for
 * a phone. Now the series are revealed by a translated overflow window (with
 * a counter-translated inner layer so the lines stay put), and the cursor,
 * dots and callouts are transformed / faded HTML layers.
 */
const STORY_CSS = (() => {
  const t = (v: number) => ((v + LEAD - 1 - OVER) / (1 + 2 * OVER)) * 100
  let css = keyframes('cfc-reveal', { x: [[0, END], [t(0), t(1)]] }, (v) => `transform:translateX(${n(v.x)}%)`)
  css += keyframes('cfc-unreveal', { x: [[0, END], [-t(0), -t(1)]] }, (v) => `transform:translateX(${n(v.x)}%)`)
  css += keyframes('cfc-x', { x: [[0, END], [0, 100]] }, (v) => `transform:translateX(${n(v.x)}%)`)
  const samples = Array.from({ length: N + 1 }, (_, i) => i / N)
  for (const k of KEYS) {
    css += keyframes(
      `cfc-y-${k}`,
      { y: [samples.map((t) => t * END), samples.map((t) => (toY(FN[k](t)) / H) * 100)] },
      (v) => `transform:translateY(${n(v.y)}%)`,
    )
  }
  CALLOUTS.forEach((c, i) => {
    const t0 = calloutT(c)
    css += keyframes(`cfc-pill${i}`, { o: [[t0 * END, (t0 + 0.025) * END], [0, 1]] }, (v) => `opacity:${n(v.o)}`)
  })
  return css
})()

const DOT: Record<Key, [number, number]> = { nic: [12, 6], caf: [12, 6], aire: [16, 8] }

function Story({ reduce }: { reduce: boolean }) {
  const { chart } = caseForCalm
  const wrapRef = useRef<HTMLDivElement>(null)
  const clockRef = useRef<HTMLSpanElement>(null)
  const [hl, setHl] = useState<Key | null>(null)

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] })
  useScrub(wrapRef, scrollYProgress)

  // The clock is text, so it stays on the main thread (a late digit is invisible).
  const tick = (sp: number) => {
    if (clockRef.current) clockRef.current.textContent = clockText(clamp01(sp / END))
  }
  useIsoLayoutEffect(() => {
    if (!reduce) tick(scrollYProgress.get())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce])
  useMotionValueEvent(scrollYProgress, 'change', (sp) => {
    if (!reduce) tick(sp)
  })

  const dim = (k: Key) => (hl && hl !== k ? 0.2 : 1)
  const fade = { transition: 'opacity 0.3s ease' }

  return (
    <div
      ref={wrapRef}
      style={timeline('--story', 'contain')}
      data-sa-end={reduce ? '' : undefined}
      className="relative h-[260vh] bg-ink motion-reduce:h-auto"
    >
      <Keyframes css={STORY_CSS} />
      <div className="sticky top-0 flex h-[100svh] flex-col bg-ink px-5 pb-[96px] pt-[110px] text-white motion-reduce:static motion-reduce:h-auto motion-reduce:min-h-[100svh] motion-reduce:py-24 md:px-10 md:pb-10">
        <div className="mx-auto flex w-full max-w-[980px] min-h-0 flex-1 flex-col justify-center">
          {/* Header: title + illustration tag, live clock */}
          <div className="mb-3 flex items-end justify-between gap-4 md:mb-5">
            <div>
              <span className="mb-1.5 inline-block rounded-full border border-white/15 px-2 py-[2px] text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white/60">
                Illustration
              </span>
              <h3 className="font-serif text-[1.6rem] leading-none md:text-[2.4rem]">{chart.title}</h3>
            </div>
            <div className="text-right" aria-hidden="true">
              <div className="mb-1 text-[0.58rem] uppercase tracking-[0.18em] text-white/45">Time</div>
              <span
                ref={clockRef}
                className="block whitespace-nowrap text-[1.7rem] leading-none text-sky-light md:text-[3rem]"
                style={{ fontFamily: '"Courier New", Courier, monospace', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}
              >
                {clockText(1)}
              </span>
            </div>
          </div>

          {/* Chart: keeps its aspect and is capped so it never outgrows the pinned stage.
              --cap is everything else in the stage (padding, header, legend, caption):
              phones reserve more because the legend wraps to three rows there. */}
          <div
            className="mx-auto w-full [--cap:470px] md:[--cap:450px]"
            style={{ maxWidth: 'min(100%, calc((100svh - var(--cap)) * 1.133 + 44px))' }}
          >
            <div className="relative ml-11">
              {/* Axis labels, HTML so they never distort */}
              <div aria-hidden="true" className="pointer-events-none absolute right-full top-0 mr-2 h-full text-[0.58rem] font-semibold uppercase tracking-[0.14em]">
                <span className="absolute right-0 -translate-y-1/2 text-white/55" style={{ top: `${(toY(0.04) / H) * 100}%` }}>Wired</span>
                <span className="absolute right-0 -translate-y-1/2 text-sky-light" style={{ top: '50%' }}>Level</span>
                <span className="absolute right-0 -translate-y-1/2 text-white/55" style={{ top: `${(toY(0.96) / H) * 100}%` }}>Out</span>
              </div>

              <div className="relative">
                {/* Static frame: hour ticks, level band, dashed level line */}
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="block h-auto w-full overflow-visible"
                  role="img"
                  aria-label="Illustration: nicotine rises and falls about every two hours, caffeine spikes and slides, Aire stays in the level band."
                >
                  <defs>
                    <linearGradient id="cfc-band" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#7ec2df" stopOpacity="0" />
                      <stop offset="0.5" stopColor="#7ec2df" stopOpacity="0.2" />
                      <stop offset="1" stopColor="#7ec2df" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {TICKS.map((t) => (
                    <line key={t} x1={t * W} x2={t * W} y1={0} y2={H} stroke="#fff" strokeOpacity="0.06" />
                  ))}
                  <rect x={0} y={toY(0.4)} width={W} height={toY(0.6) - toY(0.4)} fill="url(#cfc-band)" />
                  <line x1={0} x2={W} y1={toY(0.5)} y2={toY(0.5)} stroke="#c8e6f5" strokeOpacity="0.3" strokeDasharray="3 4" />
                </svg>

                {/* Series, revealed up to the cursor: the window slides right, its
                    contents slide left by the same amount, so the lines hold still. */}
                <div
                  aria-hidden="true"
                  className="sa pointer-events-none absolute -bottom-8 -top-8 overflow-hidden"
                  style={{ animationName: 'cfc-reveal', left: `${-OVER * 100}%`, right: `${-OVER * 100}%` }}
                >
                  <div className="sa absolute inset-0" style={{ animationName: 'cfc-unreveal' }}>
                    <div className="absolute bottom-8 top-8" style={{ left: `${(OVER / (1 + 2 * OVER)) * 100}%`, width: `${(1 / (1 + 2 * OVER)) * 100}%` }}>
                      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-full w-full overflow-visible">
                        <path
                          d={PATHS.aire}
                          fill="none"
                          stroke={COLORS.aire}
                          strokeOpacity={0.22}
                          strokeWidth={12}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ opacity: dim('aire'), ...fade }}
                        />
                        {(['nic', 'caf', 'aire'] as Key[]).map((k) => (
                          <path
                            key={k}
                            d={PATHS[k]}
                            fill="none"
                            stroke={COLORS[k]}
                            strokeWidth={k === 'aire' ? 4 : 2.2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ opacity: dim(k), ...fade }}
                          />
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Time cursor */}
                <div aria-hidden="true" className="sa pointer-events-none absolute inset-0" style={{ animationName: 'cfc-x' }}>
                  <div className="absolute inset-y-0 left-0 w-px -translate-x-1/2 bg-white/40" />
                </div>

                {/* Dots riding each series: x and y on separate layers */}
                {KEYS.map((k) => (
                  <div key={k} aria-hidden="true" className="sa pointer-events-none absolute inset-0" style={{ animationName: 'cfc-x', opacity: dim(k), ...fade }}>
                    <div className="sa absolute inset-0" style={{ animationName: `cfc-y-${k}` }}>
                      <span
                        className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
                        style={{ width: DOT[k][0], height: DOT[k][0], background: `${COLORS[k]}4d` }}
                      >
                        <span className="block rounded-full border border-[#0a1424]" style={{ width: DOT[k][1], height: DOT[k][1], background: COLORS[k] }} />
                      </span>
                    </div>
                  </div>
                ))}

                {/* Callouts: HTML pills placed against the chart plus its hour-label
                    row (mt-2 + h-4), the spacing the approved layout was tuned on. */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -bottom-6 top-0">
                  {CALLOUTS.map((c, i) => {
                    const t = calloutT(c)
                    const y = (toY(FN[c.key](t)) / H) * 100
                    const above = c.place === 'above'
                    const tx = c.align === 'right' ? '-100%' : '-50%'
                    return (
                      <div
                        key={c.text}
                        className="absolute"
                        style={{
                          left: `${t * 100}%`,
                          top: `${y}%`,
                          transform: `translate(${tx}, ${above ? 'calc(-100% - 9px)' : `${9 + (c.drop ?? 0)}px`})`,
                          opacity: dim(c.key),
                          ...fade,
                        }}
                      >
                        <div
                          className="sa whitespace-nowrap rounded-full border border-white/15 bg-[#1a2638] px-2 py-[3px] text-[11px] leading-none text-white/90"
                          style={{ animationName: `cfc-pill${i}` }}
                        >
                          {c.text}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Hour labels */}
              <div aria-hidden="true" className="relative mt-2 h-4 text-[0.62rem] tracking-[0.1em] text-white/50">
                {chart.hours.map((h, i) => (
                  <span key={h} className="absolute -translate-x-1/2" style={{ left: `${TICKS[i] * 100}%` }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Legend chips: tap to isolate a series */}
          <ul className="mx-auto mt-3 flex w-full flex-wrap justify-center gap-1.5 md:mt-6 md:gap-2">
            {chart.lines.map((l) => {
              const k = l.key as Key
              const on = hl === k
              return (
                <li key={l.key}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setHl(on ? null : k)}
                    className={`flex min-h-[36px] items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12px] leading-none transition-colors md:min-h-[40px] md:py-2 md:text-[0.82rem] ${
                      on ? 'border-white/40 bg-white/15 text-white' : 'border-white/15 bg-white/[0.04] text-white/75 hover:bg-white/10'
                    }`}
                  >
                    <span aria-hidden="true" className="h-[3px] w-4 shrink-0 rounded-full" style={{ background: COLORS[k] }} />
                    <span>
                      <Dag>{l.label}</Dag>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <p className="mt-3 text-center text-[0.7rem] text-white/50 md:mt-4">{chart.caption}</p>
        </div>
      </div>
    </div>
  )
}

export default function CaseForCalm() {
  const reduce = !!useReducedMotion()
  return (
    <>
      <section aria-labelledby="case-title" className="relative overflow-hidden bg-[linear-gradient(180deg,#edf4f9_0%,#ffffff_60%)] px-6 py-24 md:px-16 md:py-36">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ backgroundImage: GRADIENT.spectrumH }} />
        <div className="mx-auto max-w-[1180px]">
          <Eyebrow>{caseForCalm.eyebrow}</Eyebrow>
          <h2 id="case-title" className="mb-12 max-w-[14ch] font-serif leading-[1.02] tracking-[-0.02em] text-navy md:mb-16" style={{ fontSize: 'clamp(2.4rem, 9vw, 5rem)' }}>
            {caseForCalm.title}
          </h2>
          <div className="grid gap-12 md:grid-cols-3 md:gap-10">
            {caseForCalm.stats.map((s, i) => (
              <Stat key={s.n} s={s} i={i} reduce={reduce} />
            ))}
          </div>
        </div>
      </section>
      <Story reduce={reduce} />
    </>
  )
}
