'use client'
import Image from 'next/image'
import FadeUp from './FadeUp'
import { motion } from 'framer-motion'

const pills = [
  { icon: '🌬️', text: 'Calm without sedation' },
  { icon: '⚡', text: 'Focus without jitters' },
  { icon: '🚫', text: 'Nothing addictive. Ever.' },
  { icon: '♾️', text: 'Use it daily. Stop anytime.' },
]

const compRows = [
  { label: 'Zero Nicotine', aire: true, zyn: false, ultra: true },
  { label: 'Zero Caffeine', aire: true, zyn: false, ultra: false },
  { label: 'Mood Support', aire: true, zyn: false, ultra: false },
  { label: 'No Dependency Risk', aire: true, zyn: false, ultra: true },
  { label: 'Adaptogens', aire: true, zyn: false, ultra: false },
  { label: 'Calm Focus (not wired)', aire: true, zyn: false, ultra: false },
]

export default function ProductFeature() {
  return (
    <>
      <section className="bg-section-gradient py-24 px-6 md:px-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <FadeUp className="order-2 md:order-1 flex justify-center">
            <motion.div
              animate={{ y: [0, -16, 0], rotate: [0, 1, -1, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image src="/images/lifestyle-open-tin.png" alt="Aire open tin lifestyle"
                width={500} height={500}
                className="w-full max-w-[320px] md:max-w-[420px] object-contain" />
            </motion.div>
          </FadeUp>
          <FadeUp delay={0.15} className="order-1 md:order-2">
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-5 h-px bg-accent" />
              <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">What Makes Aire Different</span>
            </div>
            <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-navy tracking-[-0.02em] mb-5">
              The only pouch<br /><em className="italic text-accent">built for calm.</em>
            </h2>
            <p className="text-[0.96rem] text-navy-mid leading-[1.84] font-light mb-7">
              Other pouches hook you on nicotine or wire you up with caffeine. Aire was built for a different kind of person — one who wants to perform without compromising their health.
            </p>
            <div className="flex flex-col gap-3">
              {pills.map(({ icon, text }) => (
                <div key={text} className="pill-hover flex items-center gap-3 bg-white/75 backdrop-blur-sm rounded-full px-5 py-3.5 border border-white/90 text-[0.87rem] font-medium text-navy">
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="bg-off-white py-24 px-6 md:px-20">
        <div className="max-w-[1040px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <FadeUp>
            <div className="flex items-center gap-3 mb-5">
              <span className="block w-5 h-px bg-accent" />
              <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">See the Difference</span>
            </div>
            <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-navy tracking-[-0.02em] mb-5">
              Aire vs. the<br /><em className="italic text-accent">competition.</em>
            </h2>
            <p className="text-[0.96rem] text-navy-mid leading-[1.84] font-light mb-7">
              No other pouch combines zero nicotine, zero caffeine, mood support, and adaptogens. Aire exists because nothing else did.
            </p>
            <div className="border-t border-sky-deep/15">
              <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] py-2 text-[0.64rem] font-semibold tracking-[0.1em] uppercase text-muted">
                <div /><div className="text-center text-accent">Aire</div><div className="text-center">Zyn</div><div className="text-center">Ultra</div>
              </div>
              {compRows.map(({ label, aire, zyn, ultra }) => (
                <div key={label} className="grid grid-cols-[1.6fr_1fr_1fr_1fr] py-3 border-t border-sky-deep/15 text-[0.83rem] items-center">
                  <div className="text-navy">{label}</div>
                  <div className="text-center text-green-500">{aire ? '✓' : '✗'}</div>
                  <div className={`text-center ${zyn ? 'text-green-500' : 'text-red-400'}`}>{zyn ? '✓' : '✗'}</div>
                  <div className={`text-center ${ultra ? 'text-green-500' : 'text-red-400'}`}>{ultra ? '✓' : '✗'}</div>
                </div>
              ))}
            </div>
          </FadeUp>
          <FadeUp delay={0.15} className="flex justify-center">
            <motion.div
              animate={{ y: [0, -16, 0], rotate: [0, 1, -1, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image src="/images/three-cans.png" alt="Aire cans" width={420} height={420}
                className="w-full max-w-[340px] md:max-w-[420px] object-contain drop-shadow-[0_20px_40px_rgba(26,46,74,0.12)]" />
            </motion.div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
