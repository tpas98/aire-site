'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Dag, { Eyebrow } from './Dag'
import { aisle } from '../content'

export default function Aisle() {
  const reduce = useReducedMotion()
  const rowAnim = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, transform: 'translateY(16px)' },
          whileInView: { opacity: 1, transform: 'translateY(0px)' },
          viewport: { once: true, margin: '-8% 0px' },
          transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section className="bg-off-white py-24 md:py-36">
      <div className="mx-auto max-w-[860px] px-6">
        <Eyebrow>{aisle.eyebrow}</Eyebrow>
        <h2 className="mb-12 font-serif text-[clamp(2.2rem,7vw,4.2rem)] leading-[1.05] tracking-[-0.02em] text-navy md:mb-16">
          {aisle.title}
        </h2>

        <div className="relative">
          {/* continuous highlighted Aire column */}
          <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1/4 rounded-2xl bg-navy shadow-[0_24px_60px_rgba(26,46,74,0.25)]" />

          <div className="relative grid grid-cols-4 pb-3 pt-4">
            {aisle.cols.map((c, i) => {
              const isAire = i === aisle.cols.length - 1
              return (
                <div key={c} className={`px-1 text-center ${isAire ? 'text-white' : 'text-navy'}`}>
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] md:text-xs md:tracking-[0.18em]">{c}</div>
                  <div className={`text-[0.58rem] uppercase tracking-[0.1em] ${isAire ? 'text-sky-deep' : 'text-muted'}`}>
                    {isAire ? '\u00a0' : 'pouches'}
                  </div>
                </div>
              )
            })}
          </div>

          {aisle.rows.map((r, ri) => (
            <motion.div key={r.label} {...rowAnim(ri)} className="relative pb-4 pt-3">
              <div className="mb-2 border-t border-navy/10 pt-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-navy-mid">
                <span className="inline-block max-w-[75%]">{r.label}</span>
              </div>
              <div className="grid grid-cols-4">
                {r.vals.map((v, vi) => {
                  const isAire = vi === r.vals.length - 1
                  return (
                    <div
                      key={vi}
                      className={`px-1 text-center text-[0.8rem] leading-snug md:text-base ${
                        isAire ? 'font-medium text-white' : 'text-navy-mid'
                      }`}
                    >
                      <Dag>{v}</Dag>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-xs leading-relaxed text-navy-mid">{aisle.footnote}</p>
      </div>
    </section>
  )
}
