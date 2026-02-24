'use client'
import FadeUp from './FadeUp'

const mentalBalance = [
  { title: 'Stress Relief', body: 'Quiets the noise when life gets loud' },
  { title: 'Deep Work', body: 'Lock into flow without burning out' },
  { title: 'Presence', body: 'Show up fully for the moments that matter' },
  { title: 'Daily Reset', body: 'Your pocket-sized moment of calm, on demand' },
]

const consumptionBalance = [
  { title: 'Smarter Substitute', body: 'A clean alternative to nicotine, caffeine & harsh stimulants' },
  { title: 'Craving Support', body: 'Soothes cravings without feeding dependency' },
  { title: 'Habit Compatible', body: 'Pairs seamlessly with your existing routine' },
  { title: 'Zero Compromise', body: 'No burn. No crash. No regrets.' },
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
          {/* Light Card */}
          <FadeUp delay={0.1}>
            <div className="card-hover bg-white rounded-3xl p-10 md:p-12 h-full border border-sky-deep/10">
              <p className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-accent mb-3">Mental Balance</p>
              <h3 className="font-serif text-[1.7rem] text-navy leading-[1.15] tracking-[-0.01em] mb-8">
                Calm your mind.<br />
                <em className="italic text-navy-mid">Sharpen your focus.</em>
              </h3>
              <ul className="flex flex-col">
                {mentalBalance.map(({ title, body }, i) => (
                  <li key={title} className={`flex items-start gap-4 py-5 ${i !== 0 ? 'border-t border-sky-deep/10' : ''}`}>
                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-accent text-[0.65rem]">✦</span>
                    </div>
                    <div>
                      <p className="text-[0.88rem] font-medium text-navy mb-0.5">{title}</p>
                      <p className="text-[0.88rem] text-navy-mid font-light leading-[1.65]">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
          {/* Dark Card */}
          <FadeUp delay={0.2}>
            <div className="card-hover bg-navy rounded-3xl p-10 md:p-12 h-full relative overflow-hidden">
              <div className="absolute top-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full bg-accent/8 blur-3xl pointer-events-none" />
              <p className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-sky-deep mb-3">Consumption Balance</p>
              <h3 className="font-serif text-[1.7rem] text-white leading-[1.15] tracking-[-0.01em] mb-8">
                Break the cycle.<br />
                <em className="italic text-white/50">Keep the ritual.</em>
              </h3>
              <ul className="flex flex-col">
                {consumptionBalance.map(({ title, body }, i) => (
                  <li key={title} className={`flex items-start gap-4 py-5 ${i !== 0 ? 'border-t border-white/[0.06]' : ''}`}>
                    <div className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white/50 text-[0.65rem]">✦</span>
                    </div>
                    <div>
                      <p className="text-[0.88rem] font-medium text-white mb-0.5">{title}</p>
                      <p className="text-[0.88rem] text-white/60 font-light leading-[1.65]">{body}</p>
                    </div>
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
