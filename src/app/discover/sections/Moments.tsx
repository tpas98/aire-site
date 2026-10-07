'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Dag, { Eyebrow, GRADIENT } from './Dag'
import { moments } from '../content'

export default function Moments() {
  const reduce = useReducedMotion()
  return (
    <section className="bg-ink py-24 text-white md:py-36">
      <div className="mx-auto max-w-[1180px] px-6">
        <Eyebrow dark>{moments.eyebrow}</Eyebrow>
        <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] scroll-px-6 [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
          {moments.items.map((m, i) => (
            <motion.div
              key={m.title}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative shrink-0 basis-[80%] snap-start overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-7 md:basis-auto"
            >
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ background: GRADIENT.cool }} />
              <div className="mb-10 text-[0.75rem] font-semibold tracking-[0.2em] text-sky-deep">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="mb-3 font-serif text-[1.5rem] leading-[1.15] text-white">{m.title}</h3>
              <p className="leading-[1.6] text-white/70">
                <Dag>{m.body}</Dag>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
