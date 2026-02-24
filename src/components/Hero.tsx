'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const floatAnim = {
  animate: {
    y: [0, -14, 0],
    rotate: [0, 1, -1, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-hero-gradient">
      {/* Video background — muted, looping, subtle */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="/video/hero.webm" type="video/webm" />
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        {/* Gradient overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ddf0f9]/90 via-[#c8e0f0]/70 to-[#b8d8ee]/50" />
      </div>

      {/* Decorative orb */}
      <div className="absolute top-[-100px] right-[-80px] w-[500px] h-[500px] rounded-full bg-white/20 blur-3xl z-0" />

      <div className="relative z-10 grid grid-cols-2 items-center gap-8 px-20 pt-32 pb-20 min-h-screen max-w-[1400px] mx-auto">
        {/* Text */}
        <div className="max-w-[520px]">
          <motion.div
            className="flex items-center gap-3 mb-5"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <span className="block w-6 h-px bg-accent" />
            <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">
              The calm pouch, reimagined
            </span>
          </motion.div>

          <motion.h1
            className="font-serif text-[clamp(3rem,5vw,5rem)] leading-[1.06] text-navy tracking-[-0.02em] mb-5"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
          >
            Find Your<br />
            <em className="text-navy-mid not-italic italic">Balance.</em><br />
            Instantly.
          </motion.h1>

          <motion.p
            className="text-[0.97rem] text-navy-mid leading-[1.82] font-light mb-8 max-w-[420px]"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
          >
            The world's first lifestyle pouch built for calm focus — no nicotine,
            no caffeine, no compromise. Five science-backed ingredients.
            One pocket-sized moment of clarity.
          </motion.p>

          <motion.div
            className="flex items-center gap-5 flex-wrap"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
          >
            <a
              href="#shop"
              className="inline-block bg-navy text-white px-8 py-4 rounded-full text-[0.8rem] font-semibold tracking-[0.08em] uppercase shadow-[0_8px_30px_rgba(26,46,74,0.25)] hover:bg-accent hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(90,155,191,0.4)] transition-all duration-250"
            >
              Order Aire — $39.99
            </a>
            <a
              href="#ingredients"
              className="text-[0.8rem] font-medium text-navy-mid hover:text-accent transition-colors flex items-center gap-1.5 group"
            >
              See the science
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="flex items-center gap-6 mt-10 pt-8 border-t border-navy/10"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
          >
            {[
              { num: '0', label: 'Nicotine' },
              { num: '0', label: 'Caffeine' },
              { num: '5', label: 'Ingredients' },
              { num: '100mg', label: 'L-Theanine' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-2xl text-navy leading-none">{num}</div>
                <div className="text-[0.62rem] text-muted tracking-[0.1em] uppercase mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating product image */}
        <motion.div
          className="flex justify-center items-center"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          <motion.div {...floatAnim}>
            <Image
              src="/images/three-cans.png"
              alt="Aire Flow Pouches 3-Pack"
              width={520}
              height={520}
              className="w-full max-w-[480px] object-contain drop-shadow-[0_30px_60px_rgba(26,46,74,0.2)]"
              style={{ mixBlendMode: 'multiply' }}
              priority
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/30 to-transparent z-10" />
    </section>
  )
}
