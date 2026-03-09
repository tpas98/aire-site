'use client'
import FadeUp from './FadeUp'

const compRows = [
  { label: 'Supports calm productivity†', aire: true, nicotine: false, nootropic: true, caffeine: false },
  { label: 'Supports mood†', aire: true, nicotine: false, nootropic: false, caffeine: false },
  { label: 'Non-addictive', aire: true, nicotine: false, nootropic: true, caffeine: false },
  { label: 'Anytime use', aire: true, nicotine: true, nootropic: true, caffeine: false },
  { label: 'Sleep friendly', aire: true, nicotine: false, nootropic: true, caffeine: false },
  { label: 'Me-time protocol', aire: true, nicotine: false, nootropic: false, caffeine: false },
]

export default function ProductFeature() {
  return (
    <section className="bg-off-white py-24 px-6 md:px-20">
      <div className="max-w-[800px] mx-auto">
        <FadeUp>
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-5 h-px bg-accent" />
            <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">See the Difference</span>
          </div>
          <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-navy tracking-[-0.02em] mb-5">
            Aire vs. the<br /><em className="italic text-accent">competition.</em>
          </h2>
          <p className="text-[0.96rem] text-navy-mid leading-[1.84] font-light mb-7">
            No other pouch works to continuously support quality of life and well-being through encouraging balance.
          </p>
          <div className="border-t border-sky-deep/15">
            <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] py-3 text-[0.64rem] font-semibold tracking-[0.1em] uppercase text-muted">
              <div />
              <div className="text-center text-accent">Aire</div>
              <div className="text-center">Nicotine</div>
              <div className="text-center">Nootropic</div>
              <div className="text-center">Caffeine</div>
            </div>
            {compRows.map(({ label, aire, nicotine, nootropic, caffeine }) => (
              <div key={label} className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] py-3 border-t border-sky-deep/15 text-[0.83rem] items-center">
                <div className="text-navy">{label}</div>
                <div className={`text-center ${aire ? 'text-green-500' : 'text-red-400'}`}>{aire ? '✓' : '✗'}</div>
                <div className={`text-center ${nicotine ? 'text-green-500' : 'text-red-400'}`}>{nicotine ? '✓' : '✗'}</div>
                <div className={`text-center ${nootropic ? 'text-green-500' : 'text-red-400'}`}>{nootropic ? '✓' : '✗'}</div>
                <div className={`text-center ${caffeine ? 'text-green-500' : 'text-red-400'}`}>{caffeine ? '✓' : '✗'}</div>
              </div>
            ))}
          </div>
          <p className="text-[0.62rem] text-muted/50 leading-relaxed mt-6">
            † These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </FadeUp>
      </div>
    </section>
  )
}
