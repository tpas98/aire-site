'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'
import Eyebrow from './ui/Eyebrow'
import Reveal from './ui/Reveal'
import { fadeUpWithDelay, staggerContainer, useMotionOK } from '@/lib/motion'

const SpinningCan = dynamic(() => import('./SpinningCan'), { ssr: false })

export default function About() {
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
  const canY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const parallaxOn = motionOK && isDesktop

  return (
    <section ref={sectionRef} id="science" className="bg-off-white pt-16 pb-24 px-6 md:px-20">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Eyebrow className="mb-5">Our Story</Eyebrow>
          <Reveal
            as="h2"
            className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-navy tracking-[-0.02em] mb-6"
            lines={[
              'Built for the gap',
              <em className="italic text-accent" key="em">nobody filled.</em>,
            ]}
          />
          <motion.p
            variants={fadeUpWithDelay(0)}
            className="text-[0.96rem] text-navy-mid leading-[1.84] font-light mb-5"
          >
            Every pouch on the market was either nicotine-loaded and addictive, caffeine-heavy and anxiety inducing, or nootropic-based and isolated on focus. None were able to support our ideal lifestyle all day long, without undesirable side effects.
          </motion.p>
          <motion.p
            variants={fadeUpWithDelay(0.08)}
            className="text-[0.96rem] text-navy-mid leading-[1.84] font-light mb-8"
          >
            So we built Aire from scratch. A lifestyle pouch for people who want to stay grounded for peak enjoyment from every pursuit. No dependency. No crash. Just balance, whenever you need it.
          </motion.p>
          <motion.a
            variants={fadeUpWithDelay(0.16)}
            href="#shop"
            className="btn-primary inline-block bg-navy text-white px-8 py-4 rounded-full text-[0.8rem] font-semibold tracking-[0.08em] uppercase shadow-[0_8px_30px_rgba(26,46,74,0.2)]"
          >
            Try Aire Today
          </motion.a>
        </motion.div>
        <motion.div
          variants={fadeUpWithDelay(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div
            style={parallaxOn ? { y: canY } : undefined}
            className="relative flex justify-center items-center w-full h-[320px] md:h-[420px]"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse 32% 30% at 62% 46%, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.22) 26%, rgba(255,255,255,0) 68%),
                  radial-gradient(ellipse 34% 24% at 62% 74%, rgba(26,46,74,0.12) 0%, rgba(26,46,74,0.05) 24%, rgba(26,46,74,0) 66%),
                  radial-gradient(ellipse 40% 30% at 62% 56%, rgba(126,194,223,0.12) 0%, rgba(126,194,223,0.04) 30%, rgba(126,194,223,0) 66%)
                `,
              }}
            />
            <SpinningCan className="[filter:drop-shadow(0_22px_30px_rgba(26,46,74,0.12))_drop-shadow(0_44px_92px_rgba(26,46,74,0.14))]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
