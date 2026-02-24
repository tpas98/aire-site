import FadeUp from './FadeUp'

const reviews = [
  { stars: 5, text: '"I tried quitting Zyn three times. Aire is the only thing that made it stick — I actually feel better, not worse."', author: 'Marcus T.', tag: 'Verified Buyer · Former Zyn User' },
  { stars: 5, text: '"As someone who cannot do caffeine, finding a pouch that actually helps me focus without wiring me up was a game changer."', author: 'Priya S.', tag: 'Verified Buyer · Wellness Enthusiast' },
  { stars: 5, text: '"I use it before big meetings. The calm is real — not sedating, just steady. My whole team noticed a difference."', author: 'James R.', tag: 'Verified Buyer · Executive' },
]

export default function Testimonials() {
  return (
    <section id="reviews" className="bg-white py-24 px-6 md:px-16">
      <FadeUp className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block w-5 h-px bg-accent" />
          <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">What People Are Saying</span>
          <span className="block w-5 h-px bg-accent" />
        </div>
        <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-navy tracking-[-0.02em]">
          Real results.<br /><em className="italic text-accent">Real people.</em>
        </h2>
      </FadeUp>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1080px] mx-auto">
        {reviews.map(({ stars, text, author, tag }, i) => (
          <FadeUp key={i} delay={i * 0.1}>
            <div className="card-hover bg-off-white rounded-2xl p-8 border border-sky-deep/15 flex flex-col">
              <div className="text-[#e8a820] text-sm mb-4">{'★'.repeat(stars)}</div>
              <p className="text-[0.9rem] text-navy-mid leading-[1.8] italic mb-5 flex-1">{text}</p>
              <div>
                <div className="text-[0.74rem] font-semibold text-navy tracking-[0.05em] uppercase">— {author}</div>
                <div className="text-[0.66rem] text-accent mt-0.5">✓ {tag}</div>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
