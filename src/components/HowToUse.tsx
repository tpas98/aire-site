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
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M8 12s1.5 2 4 2 4-2 4-2" />
        <path d="M9 8h.01M15 8h.01" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Feel It Work',
    description: 'Within 5–10 minutes, ingredients absorb through your gum tissue. A gentle tingle lets you know it\'s working.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Find Your Balance',
    description: 'Enjoy the pouch for up to 60 minutes. Discard after use. Do not consume. Enjoy 4-6 pouches throughout the day for best results.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 1 0 9 9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
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
  const linePathLength = useTransform(scrollYProgress, [0.1, 0.6], [0, 1])
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
          {/* Desktop horizontal hairline drawn left -> right, scroll-linked, threaded behind step numbers */}
          <svg
            aria-hidden="true"
            className="hidden md:block absolute top-[2.1rem] left-0 w-full h-px pointer-events-none"
            viewBox="0 0 1000 1"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="0"
              y1="0.5"
              x2="1000"
              y2="0.5"
              stroke="currentColor"
              className="text-accent/25"
              strokeWidth="1.5"
              style={drawOn ? { pathLength: linePathLength } : { pathLength: 1 }}
            />
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {steps.map(({ number, title, description, icon }, i) => (
              <motion.div
                key={number}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeUpWithDelay(i * 0.12)}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-3 relative">
                  <span className="font-serif text-[4.5rem] leading-none text-accent/25 tracking-[-0.04em] bg-white pr-2 relative z-10">{number}</span>
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent relative z-10">
                    {icon}
                  </div>
                </div>
                <div className="w-10 h-px bg-accent/40" />
                <h3 className="font-sans font-semibold text-[1.05rem] text-navy">{title}</h3>
                <p className="text-[0.88rem] text-navy-mid leading-[1.75] font-light">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
