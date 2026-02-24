import Image from 'next/image'
import FadeUp from './FadeUp'

export default function About() {
  return (
    <section id="science" className="bg-off-white py-24 px-6 md:px-20">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        <FadeUp>
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-5 h-px bg-accent" />
            <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">Our Story</span>
          </div>
          <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-navy tracking-[-0.02em] mb-6">
            Built for the gap<br /><em className="italic text-accent">nobody filled.</em>
          </h2>
          <p className="text-[0.96rem] text-navy-mid leading-[1.84] font-light mb-5">
            Every pouch on the market was either nicotine-loaded and addictive, or caffeine-heavy and anxious-making. None of them gave you calm, clear energy without a cost to your health.
          </p>
          <p className="text-[0.96rem] text-navy-mid leading-[1.84] font-light mb-8">
            So we built Aire from scratch. A lifestyle pouch for people who want to perform without compromise. No dependency. No crash. Just balance, whenever you need it.
          </p>
          <a href="#shop" className="btn-primary inline-block bg-navy text-white px-8 py-4 rounded-full text-[0.8rem] font-semibold tracking-[0.08em] uppercase shadow-[0_8px_30px_rgba(26,46,74,0.2)]">
            Try Aire Today
          </a>
        </FadeUp>
        <FadeUp delay={0.15}>
          <div className="flex justify-center items-center">
            <Image src="/images/open-can.png" alt="Aire open tin with pouches" width={600} height={520}
              className="w-full max-w-[380px] md:max-w-[480px] object-contain" />
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
