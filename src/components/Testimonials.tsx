import FadeUp from './FadeUp'

const reviews = [
  {
    stars: 5,
    text: '"I tried quitting Zyn three times. Aire is the only thing that made it stick — I actually feel better, not worse."',
    author: 'Add Customer Name',
    tag: 'Verified Buyer · Former Zyn User',
  },
  {
    stars: 5,
    text: '"As someone who can\'t do caffeine, finding a pouch that actually helps me focus without wiring me up was a game changer."',
    author: 'Add Customer Name',
    tag: 'Verified Buyer · Wellness Enthusiast',
  },
  {
    stars: 5,
    text: '"I use it before big meetings. The calm is real — not sedating, just steady. My whole team noticed a difference."',
    author: 'Add Customer Name',
    tag: 'Verified Buyer · Executive',
  },
]

export default function Testimonials() {
  return (
    <section id="reviews" className="bg-white py-32 px-16">
      <FadeUp className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block w-5 h-px bg-accent" />
          <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">What People Are Saying</span>
          <span className="block w-5 h-px bg-accent" />
        </div>
        <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-navy tracking-[-0.02em]">
          Real results.<br /><em className="italic text-accent">Real people.</em>
        </h2>
      </FadeUp>

      <div className="grid grid-cols-3 gap-5 max-w-[1080px] mx-auto">
        {reviews.map(({ stars, text, author, tag }, i) => (
          <FadeUp key={i} delay={i * 0.1}>
            <div className="bg-off-white rounded-2xl p-8 border border-sky-deep/15 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(26,46,74,0.07)] transition-all duration-250 h-full flex flex-col">
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
