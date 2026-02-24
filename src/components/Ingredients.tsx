import FadeUp from './FadeUp'

const ingredients = [
  { num: '01', name: 'L-Theanine', desc: 'Promotes calm alertness and reduces stress response — no sedation, no drowsiness.', badge: '100mg' },
  { num: '02', name: 'Rhodiola Rosea', desc: 'Adaptogenic root that combats mental fatigue and builds long-term stress resilience.', badge: 'Adaptogen' },
  { num: '03', name: 'Methylfolate', desc: 'The bioavailable form of folate — supports neurotransmitter production at the source.', badge: 'Active B9' },
  { num: '04', name: 'Vitamin B6', desc: 'Essential co-factor for serotonin and dopamine synthesis. Mood, energy, clarity.', badge: 'P-5-P Form' },
  { num: '05', name: 'Affron® Saffron', desc: 'Patented, clinically-studied saffron extract for mood balance and emotional resilience.', badge: 'Patented' },
]

export default function Ingredients() {
  return (
    <section id="ingredients" className="bg-navy py-24 px-6 md:px-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '128px' }} />
      <FadeUp className="text-center max-w-[560px] mx-auto mb-12 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block w-5 h-px bg-sky-deep" />
          <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-sky-deep">The Formula</span>
          <span className="block w-5 h-px bg-sky-deep" />
        </div>
        <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-white tracking-[-0.02em] mb-5">
          Five ingredients.<br /><em className="italic text-sky-deep">One perfect outcome.</em>
        </h2>
        <p className="text-[0.95rem] text-white/60 leading-[1.84] font-light">
          Every ingredient chosen for a reason. Every dose calibrated to actually work.
        </p>
      </FadeUp>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 max-w-[1200px] mx-auto relative z-10">
        {ingredients.map(({ num, name, desc, badge }, i) => (
          <FadeUp key={num} delay={i * 0.08}>
            <div className="card-dark group bg-white/[0.07] border border-white/[0.12] rounded-[18px] p-6 text-center h-full flex flex-col">
              <div className="text-[0.62rem] text-sky-deep tracking-[0.15em] font-semibold mb-3">{num}</div>
              <div className="font-serif text-[1.05rem] text-white mb-3 leading-snug">{name}</div>
              <div className="text-[0.75rem] text-white/75 leading-relaxed flex-1">{desc}</div>
              <div className="inline-block mt-4 px-3 py-1 rounded-full bg-sky-deep/15 text-[0.6rem] tracking-[0.1em] uppercase text-sky-deep self-center">{badge}</div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
