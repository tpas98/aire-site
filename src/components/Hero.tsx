'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const floatAnim = {
  animate: {
    y: [0, -18, 0],
    rotate: [0, 1.2, -1.2, 0],
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
  },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-30">
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#ddf0f9]/95 via-[#c8e0f0]/75 to-[#b8d8ee]/40" />
      </div>
      <div className="absolute top-[-120px] right-[-100px] w-[600px] h-[600px] rounded-full bg-white/15 blur-3xl z-0" />
      <div className="absolute bottom-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl z-0" />
      <div className="relative z-10 grid grid-cols-2 items-center gap-8 px-20 pt-36 pb-24 min-h-screen max-w-[1400px] mx-auto">
        <div className="max-w-[560px]">
          <motion.div className="flex items-center gap-3 mb-6" variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="block w-8 h-px bg-accent" />
            <span className="text-[0.67rem] font-semibold tracking-[0.22em] uppercase text-accent">The calm pouch, reimagined</span>
          </motion.div>
          <motion.h1
            className="font-serif leading-[1.04] text-navy tracking-[-0.03em] mb-6"
            style={{ fontSize: 'clamp(3.6rem, 6vw, 6rem)' }}
            variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
          >
            Find Your<br />
            <em className="not-italic italic text-navy-mid">Balance.</em><br />
            Instantly.
          </motion.h1>
          <motion.p className="text-[1rem] text-navy-mid leading-[1.9] font-light mb-9 max-w-[440px]" variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
            The world's first lifestyle pouch built for calm focus — no nicotine, no caffeine, no compromise. Five science-backed ingredients. One pocket-sized moment of clarity.
          </motion.p>
          <motion.div className="flex items-center gap-5 flex-wrap" variants={fadeUp} initial="hidden" animate="visible" custom={0.3}>
            <a href="#shop" className="btn-primary inline-block bg-navy text-white px-9 py-4 rounded-full text-[0.8rem] font-semibold tracking-[0.1em] uppercase shadow-[0_10px_36px_rgba(26,46,74,0.28)]">
              Order Aire — $39.99
            </a>
            <a href="#ingredients" className="text-[0.8rem] font-medium text-navy-mid hover:text-accent transition-colors duration-200 flex items-center gap-1.5 group">
              See the science
              <span className="group-hover:translate-x-1.5 transition-transform duration-200">→</span>
            </a>
          </motion.div>
          <motion.div className="flex items-center gap-8 mt-12 pt-8 border-t border-navy/10" variants={fadeUp} initial="hidden" animate="visible" custom={0.4}>
            {[{ num: '0', label: 'Nicotine' }, { num: '0', label: 'Caffeine' }, { num: '5', label: 'Ingredients' }, { num: '100mg', label: 'L-Theanine' }].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-[1.8rem] text-navy leading-none">{num}</div>
                <div className="text-[0.62rem] text-muted tracking-[0.12em] uppercase mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
        <motion.div className="flex justify-center items-center" variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
          <motion.div {...floatAnim}>
            <Image src="/images/three-cans.png" alt="Aire Flow Pouches 3-Pack" width={560} height={560}
              className="w-full max-w-[520px] object-contain drop-shadow-[0_40px_80px_rgba(26,46,74,0.22)]"
              style={{ mixBlendMode: 'multiply' }} priority />
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white/30 to-transparent z-10" />
    </section>
  )
}
