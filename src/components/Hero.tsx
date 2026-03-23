'use client'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const ThreeCanHero = dynamic(() => import('./ThreeCanHero'), { ssr: false })

const CHECKOUT_URL = 'https://drifts-7838.myshopify.com/cart/47952645161208:1'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute top-[-120px] right-[-100px] w-[600px] h-[600px] rounded-full bg-white/15 blur-3xl z-0" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl z-0" />
      <div className="relative z-10 flex flex-col md:grid md:grid-cols-2 items-center gap-8 px-6 md:px-20 pt-14 md:pt-16 pb-20 md:pb-24 max-w-[1400px] mx-auto">
        <div className="max-w-[560px] w-full">
          <motion.div className="flex items-center gap-3 mb-5" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="block w-8 h-px bg-accent" />
            <span className="text-[0.67rem] font-semibold tracking-[0.22em] uppercase text-accent">The lifestyle pouch, reimagined</span>
          </motion.div>
          <motion.h1
            className="font-serif leading-[1.04] text-navy tracking-[-0.03em] mb-5"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)' }}
            variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
          >
            Find Your<br />
            <em className="italic text-navy-mid">Balance.</em><br />
            Instantly.
          </motion.h1>
          <motion.p className="text-[0.95rem] md:text-[1rem] text-navy-mid leading-[1.7] font-light mb-7 max-w-[440px]" variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
            The first nicotine-free wellness pouch built for calmness, clarity, and mental presence, anytime of the day.<sup className="text-[0.6em]">†</sup> Four science-backed adaptogens. One pocket-sized moment of calm.
          </motion.p>
          <motion.div className="flex items-center gap-3 mb-5" variants={fadeUp} initial="hidden" animate="visible" custom={0.25}>
            <div className="flex items-center gap-0.5 text-[#e8a820]">
              {[...Array(4)].map((_, i) => <span key={i} className="text-sm">★</span>)}
              <span className="text-sm relative inline-block w-[1em] overflow-hidden">
                <span className="text-[#e8a820]/20">★</span>
                <span className="absolute top-0 left-0 overflow-hidden" style={{ width: '75%' }}>★</span>
              </span>
            </div>
            <span className="text-[0.78rem] text-navy-mid font-medium">Loved by 200+ customers</span>
          </motion.div>
          <motion.div className="flex items-center gap-4 flex-wrap" variants={fadeUp} initial="hidden" animate="visible" custom={0.3}>
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block bg-navy text-white px-7 py-3.5 rounded-full text-[0.78rem] font-semibold tracking-[0.1em] uppercase shadow-[0_10px_36px_rgba(26,46,74,0.28)] whitespace-nowrap">
              Get Your 4-Pack
            </a>
            <a href="#how-to-use" className="text-[0.8rem] font-medium text-navy-mid hover:text-accent transition-colors duration-200 flex items-center gap-1.5 group whitespace-nowrap">
              How it works
              <span className="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
            </a>
          </motion.div>
        </div>
        <motion.div
          className="flex justify-center items-center w-full h-[380px] md:h-[480px]"
          variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
        >
          <ThreeCanHero aria-label="Aire nicotine-free wellness pouch tins rendered in 3D" />
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white/30 to-transparent z-10" />
    </section>
  )
}
