'use client'
import { motion } from 'framer-motion'
import FadeUp from './FadeUp'
import Eyebrow from './ui/Eyebrow'
import SectionHeading from './ui/SectionHeading'
import { fadeUpWithDelay, useMotionOK } from '@/lib/motion'

const compRows = [
  { label: 'Supports calm productivity†', aire: true, nicotine: false, nootropic: true, caffeine: false },
  { label: 'Supports mood†', aire: true, nicotine: false, nootropic: false, caffeine: false },
  { label: 'Non-addictive', aire: true, nicotine: false, nootropic: true, caffeine: false },
  { label: 'Anytime use', aire: true, nicotine: true, nootropic: true, caffeine: false },
  { label: 'Sleep friendly', aire: true, nicotine: false, nootropic: true, caffeine: false },
]

function Mark({ value, isAire }: { value: boolean; isAire: boolean }) {
  if (value && isAire) {
    return (
      <span className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full bg-accent">
        <span aria-hidden="true" className="text-white text-[0.7rem] leading-none">✓</span>
        <span className="sr-only">Yes</span>
      </span>
    )
  }
  if (value) {
    return (
      <>
        <span aria-hidden="true" className="text-accent/70">✓</span>
        <span className="sr-only">Yes</span>
      </>
    )
  }
  return (
    <>
      <span aria-hidden="true" className="text-muted/45">✗</span>
      <span className="sr-only">No</span>
    </>
  )
}

export default function ProductFeature() {
  const motionOK = useMotionOK()

  return (
    <section data-morph data-morph-key="productfeature" className="bg-off-white py-24 px-6 md:px-20">
      <div className="max-w-[800px] mx-auto">
        <FadeUp>
          <Eyebrow className="mb-5">See the Difference</Eyebrow>
          <SectionHeading className="mb-5">
            Aire vs. the<br /><em>competition.</em>
          </SectionHeading>
          <p className="text-[0.96rem] text-navy-mid leading-[1.84] font-light mb-7">
            No other pouch works to continuously support quality of life and well-being through encouraging balance.
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="bg-white rounded-aire-xl shadow-card-hover p-8 md:p-12">
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <div className="min-w-[520px] relative">
                {/* Continuous Aire column highlight, sits behind header + rows */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 bg-accent/[0.07] border border-accent/20 rounded-aire-md pointer-events-none"
                  style={{ left: `${(1.6 / 5.6) * 100}%`, width: `${(1 / 5.6) * 100}%` }}
                />
                <div className="relative grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] py-3 text-[0.64rem] font-semibold tracking-[0.1em] uppercase text-muted items-center">
                  <div />
                  <div className="flex justify-center">
                    <span className="bg-navy text-white rounded-full px-4 py-1 normal-case tracking-normal font-semibold text-[0.72rem]">
                      Aire
                    </span>
                  </div>
                  <div className="text-center">Nicotine</div>
                  <div className="text-center">Nootropic</div>
                  <div className="text-center">Caffeine</div>
                </div>
                {compRows.map(({ label, aire, nicotine, nootropic, caffeine }, i) => (
                  <motion.div
                    key={label}
                    variants={motionOK ? fadeUpWithDelay(i * 0.06) : undefined}
                    initial={motionOK ? 'hidden' : undefined}
                    whileInView={motionOK ? 'visible' : undefined}
                    viewport={{ once: true, margin: '-40px' }}
                    className="relative grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] py-3 border-t border-sky-deep/15 text-[0.83rem] items-center hover:bg-off-white/60 transition-colors duration-200"
                  >
                    <div className="text-navy pl-4">{label}</div>
                    <div className="flex justify-center">
                      <Mark value={aire} isAire />
                    </div>
                    <div className="text-center">
                      <Mark value={nicotine} isAire={false} />
                    </div>
                    <div className="text-center">
                      <Mark value={nootropic} isAire={false} />
                    </div>
                    <div className="text-center">
                      <Mark value={caffeine} isAire={false} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-[0.62rem] text-muted/50 leading-relaxed mt-6">
            † These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
