'use client'
import FadeUp from './FadeUp'

const mentalBalance = [
  'Supports stress management',
  'Distraction-free productivity',
  'More present, meaningful days',
  'Decompressing "me-time"',
  'Relief from overstimulation',
]

const consumptionBalance = [
  'Sub for nicotine, caffeine, nootropics',
  'Avoid unnecessary overconsumption',
  'Complements other pouches',
  'Calmness to soothe cravings',
  'No jitters or artificial burning',
]

export default function Balance() {
  return (
    <section className="bg-section-gradient py-24 px-6 md:px-16 overflow-hidden">
      <div className="max-w-[1100px] mx-auto">
        <FadeUp>
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-5 h-px bg-accent" />
            <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">What Aire Delivers</span>
          </div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] text-navy tracking-[-0.02em] leading-[1.1] mb-14 max-w-[600px]">
            Helping you find the <em className="italic text-navy-mid">balance you need.</em>
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FadeUp delay={0.1}>
            <div className="card-hover bg-white rounded-3xl p-8 md:p-10 h-full border border-sky-deep/10">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent text-[1rem]">✦</span>
                </div>
                <h3 className="font-serif text-[1.35rem] text-navy tracking-[-0.01em]">Mental Balance</h3>
              </div>
              <ul className="space-y-4">
                {mentalBalance.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[3px] w-4 h-4 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent block" />
                    </span>
                    <span className="text-[0.9rem] text-navy-mid font-light leading-[1.6]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
          <FadeUp delay={0.2}>
            <div className="card-hover bg-navy rounded-3xl p-8 md:p-10 h-full relative overflow-hidden">
              <div className="absolute top-[-40px] right-[-40px] w-[180px] h-[180px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-sky-deep text-[1rem]">✦</span>
                </div>
                <h3 className="font-serif text-[1.35rem] text-white tracking-[-0.01em]">Consumption Balance</h3>
              </div>
              <ul className="space-y-4">
                {consumptionBalance.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-[3px] w-4 h-4 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-deep block" />
                    </span>
                    <span className="text-[0.9rem] text-white/70 font-light leading-[1.6]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
