'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Eyebrow } from './Dag'
import { reviews } from '../content'

export default function Reviews() {
  const reduce = useReducedMotion()
  return (
    <section className="bg-hero-gradient py-24 md:py-36">
      <div className="mx-auto max-w-[1180px] px-6">
        <Eyebrow>{reviews.eyebrow}</Eyebrow>
        <h2 className="font-serif text-[clamp(2.2rem,7vw,4.2rem)] leading-[1.05] tracking-[-0.02em] text-navy">{reviews.title}</h2>
        <div className="-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-8 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] scroll-px-6 [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4">
          {reviews.items.map((r, i) => (
            <motion.figure
              key={r.author}
              initial={reduce ? false : { opacity: 0, transform: 'translateY(24px)' }}
              whileInView={reduce ? undefined : { opacity: 1, transform: 'translateY(0px)' }}
              viewport={{ once: true, margin: '-5% 0px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex shrink-0 basis-[84%] snap-start flex-col justify-between rounded-3xl bg-white p-7 shadow-[0_20px_60px_rgba(26,46,74,0.10)] md:basis-auto"
            >
              <blockquote className="font-serif text-[1.15rem] italic leading-[1.45] text-navy">“{r.text}”</blockquote>
              <figcaption className="mt-7">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-navy">{r.author}</div>
                <div className="mt-1 text-sm text-navy-mid">{r.tag}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
        <p className="mt-2 text-xs text-navy-mid">{reviews.footnote}</p>
      </div>
    </section>
  )
}
