'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Eyebrow from './ui/Eyebrow'
import SectionHeading from './ui/SectionHeading'
import { fadeUpWithDelay, useMotionOK } from '@/lib/motion'

const steps = [
  {
    number: '01',
    title: 'Place the Pouch',
    description: 'Tuck one or more Aire pouches comfortably between your lip and gum. No chewing needed.',
  },
  {
    number: '02',
    title: 'Feel It Work',
    description: 'Within 5–10 minutes, ingredients absorb through your gum tissue. A gentle tingle lets you know it\'s working.',
  },
  {
    number: '03',
    title: 'Find Your Balance',
    description: 'Enjoy the pouch for up to 60 minutes. Discard after use. Do not consume. Enjoy 4-6 pouches throughout the day for best results.',
  },
]

export default function HowToUse() {
  const sectionRef = useRef<HTMLElement>(null)
  const motionOK = useMotionOK()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  // Two connecting segments draw left -> right, staggered, over the section's
  // 0.1 -> 0.6 scroll span. The first segment leads; the second trails slightly
  // so the choreography reads as a single sweep across the three nodes.
  const segmentA = useTransform(scrollYProgress, [0.1, 0.45], [0, 1])
  const segmentB = useTransform(scrollYProgress, [0.25, 0.6], [0, 1])
  const drawOn = motionOK && isDesktop

  return (
    <section ref={sectionRef} id="how-to-use" data-morph data-morph-key="howtouse" className="bg-white py-20 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Eyebrow className="mb-4">Simple by Design</Eyebrow>
          <motion.div variants={fadeUpWithDelay(0)}>
            <SectionHeading className="text-[clamp(2rem,4vw,3.2rem)] tracking-[-0.02em] leading-[1.1] mb-14">
              Three steps to <em>find your balance.</em>
            </SectionHeading>
          </motion.div>
        </motion.div>

        <div className="relative">
          {/*
            Editorial step row for the pale-blue morph backdrop. No white background
            patches, no icons — just large serif numerals, a connective hairline, and
            titles. The hairline is three subtle 8px nodes (one per step, aligned under
            each numeral) joined by two segments routed through the breathing gaps
            between them, so nothing ever needs a background patch to occlude it.

            The nodes + segments live INSIDE the grid cells (steps 0 and 1 carry the
            segment reaching toward the next node), so they inherit the grid's exact
            column geometry — including the gap-12 gutter — with no manual thirds math.
            Segments are transform-only scaleX draws (origin-left): cheap, never
            distort, scroll-linked and staggered left -> right; static under reduced
            motion. On mobile the row stacks and each step keeps a short accent rule.
          */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {steps.map(({ number, title, description }, i) => {
              const isLast = i === steps.length - 1
              const segment = i === 0 ? segmentA : segmentB
              return (
                <motion.div
                  key={number}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={fadeUpWithDelay(i * 0.12)}
                  className="flex flex-col"
                >
                  <span className="font-serif text-[4.5rem] leading-none text-accent/25 tracking-[-0.04em]">{number}</span>

                  {/* Desktop connective node + segment row (below the numeral) */}
                  <div aria-hidden="true" className="hidden md:block relative h-2 my-5">
                    <span className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-2 rounded-full bg-accent/40" />
                    {!isLast && (
                      <motion.span
                        className="absolute top-1/2 -translate-y-1/2 h-px bg-accent/25 origin-left"
                        style={{
                          // Start ~4px past this node; reach ~4px short of the next
                          // node, which sits one gap (3rem) + one cell-width away.
                          left: '12px',
                          width: 'calc(100% + 3rem - 24px)',
                          scaleX: drawOn ? segment : 1,
                        }}
                      />
                    )}
                  </div>

                  {/* Mobile accent rule (stacked layout) */}
                  <div className="md:hidden w-10 h-px bg-accent/40 my-4" />

                  <h3 className="font-sans font-semibold text-[1.05rem] text-navy mb-4">{title}</h3>
                  <p className="text-[0.88rem] text-navy-mid leading-[1.75] font-light">{description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
