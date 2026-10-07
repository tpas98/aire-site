'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useInView } from 'framer-motion'
import Dag, { Eyebrow } from './Dag'
import { howItWorks } from '../content'

function Step({ n, title, body, reduce }: { n: string; title: string; body: string; reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const lit = useInView(ref, { margin: '0px 0px -50% 0px' })
  const on = reduce || lit
  return (
    <div ref={ref} className="relative pl-16 md:pl-0 md:pt-16">
      <div
        className={`absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-500 md:left-0 ${
          on ? 'border-navy bg-navy text-white' : 'border-navy/20 bg-white text-navy-mid'
        }`}
      >
        {n}
      </div>
      <h3 className="mb-3 font-serif text-[1.6rem] leading-[1.15] text-navy">{title}</h3>
      <p className="font-light leading-[1.7] text-navy-mid">
        <Dag>{body}</Dag>
      </p>
    </div>
  )
}

export default function HowItWorks() {
  const reduce = !!useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const p = reduce ? 1 : progress

  return (
    <section id="how" className="bg-white py-24 md:py-36">
      <div className="mx-auto max-w-[1080px] px-6">
        <Eyebrow>{howItWorks.eyebrow}</Eyebrow>
        <h2 className="mb-14 font-serif text-[clamp(2.2rem,7vw,4.2rem)] leading-[1.05] tracking-[-0.02em] text-navy md:mb-20">
          {howItWorks.title}
        </h2>

        <div ref={ref} className="relative">
          {/* mobile vertical line */}
          <div aria-hidden="true" className="absolute bottom-0 left-[21px] top-0 w-px bg-navy/10 md:hidden">
            <motion.div className="h-full w-full origin-top bg-accent" style={{ scaleY: p }} />
          </div>
          {/* md horizontal line */}
          <div aria-hidden="true" className="absolute left-0 right-0 top-[21px] hidden h-px bg-navy/10 md:block">
            <motion.div className="h-full w-full origin-left bg-accent" style={{ scaleX: p }} />
          </div>

          <div className="relative flex flex-col gap-14 md:grid md:grid-cols-3 md:gap-12">
            {howItWorks.steps.map((s) => (
              <Step key={s.n} {...s} reduce={reduce} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
