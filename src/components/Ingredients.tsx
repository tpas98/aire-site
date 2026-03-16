import FadeUp from './FadeUp'

const ingredients = [
  { num: '01', name: 'Rhodiola Rosea', desc: 'Supports resilience to mental fatigue and stress, promoting sustained clarity and balanced energy.† Adaptogenic herb used to help the body adapt to stress.' },
  { num: '02', name: 'L-Theanine', desc: 'Promotes a relaxed but alert mental state, helping smooth stress and support focused clarity without drowsiness.† Amino acid naturally found in green tea.' },
  { num: '03', name: 'Affron® Saffron', desc: 'Supports mood and emotional balance, contributing to a calm, clear headspace.† Botanical extract derived from the Crocus sativus flower.' },
  { num: '04', name: 'Vitamin B9', desc: 'Supports healthy neurotransmitter production involved in mood balance and cognitive function.† Bioactive form compound used directly by the body.' },
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
          The AireComplex<br /><em className="italic text-sky-deep">Four active ingredients. One perfect outcome.</em>
        </h2>
        <p className="text-[0.95rem] text-white/60 leading-[1.84] font-light">
          Meticulous ingredient selection and precision dosing for optimal outcomes.
        </p>
      </FadeUp>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-[1000px] mx-auto relative z-10">
        {ingredients.map(({ num, name, desc }, i) => (
          <FadeUp key={num} delay={i * 0.08}>
            <div className="card-dark group bg-white/[0.07] border border-white/[0.12] rounded-[18px] p-6 text-center h-full flex flex-col">
              <div className="text-[0.62rem] text-sky-deep tracking-[0.15em] font-semibold mb-3">{num}</div>
              <div className="font-serif text-[1.05rem] text-white mb-3 leading-snug">{name}</div>
              <div className="text-[0.75rem] text-white/75 leading-relaxed flex-1">{desc}</div>
            </div>
          </FadeUp>
        ))}
      </div>
      <p className="text-[0.62rem] text-white/25 leading-relaxed max-w-[540px] mx-auto text-center mt-10 relative z-10">
        † These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </section>
  )
}
