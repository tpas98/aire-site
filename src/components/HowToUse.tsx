'use client'
import FadeUp from './FadeUp'

const steps = [
  {
    number: '01',
    title: 'Place the Pouch',
    description: 'Tuck one or more Aire pouches comfortably between your lip and gum. No chewing needed.',
  },
  {
    number: '02',
    title: 'Feel It Work',
    description: 'Within 5–10 minutes, ingredients absorb through your gum tissue. A gentle tingle lets you know it\'s working.',
  },
  {
    number: '03',
    title: 'Find Your Balance',
    description: 'Enjoy the pouch for up to 60 minutes. Discard after use. Do not consume. Enjoy 4-6 pouches throughout the day for best results.',
  },
]

export default function HowToUse() {
  return (
    <section id="how-to-use" className="bg-off-white py-20 px-6 md:px-16">
      <div className="max-w-[1100px] mx-auto">
        <FadeUp>
          <div className="flex items-center gap-3 mb-4">
            <span className="block w-5 h-px bg-accent" />
            <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">Simple by Design</span>
          </div>
          <h2 className="font-serif text-[clamp(2rem,4vw,3.2rem)] text-navy tracking-[-0.02em] leading-[1.1] mb-14">
            Three steps to <em className="italic text-navy-mid">find your balance.</em>
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map(({ number, title, description }, i) => (
            <FadeUp key={number} delay={i * 0.1}>
              <div className="flex flex-col gap-4">
                <span className="font-serif text-[3.5rem] leading-none text-accent/30 tracking-[-0.04em]">{number}</span>
                <div className="w-10 h-px bg-accent/40" />
                <h3 className="font-sans font-semibold text-[1.05rem] text-navy">{title}</h3>
                <p className="text-[0.88rem] text-navy-mid leading-[1.75] font-light">{description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
