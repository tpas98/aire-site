'use client'
import { useEffect, useRef, useState } from 'react'
import FadeUp from './FadeUp'

const reviews = [
  { stars: 5, text: '"I tried quitting Zyn three times. Aire is the only thing that made it stick. I actually feel better, not worse."', author: 'Marcus T.', tag: 'Verified Buyer · Former Zyn User' },
  { stars: 5, text: '"As someone who cannot do caffeine, finding a pouch that actually helps me focus without wiring me up was a game changer."', author: 'Priya S.', tag: 'Verified Buyer · Wellness Enthusiast' },
  { stars: 5, text: '"I use it before big meetings. The calm is real. Not sedating, just steady. My whole team noticed a difference."', author: 'James R.', tag: 'Verified Buyer · Executive' },
  { stars: 5, text: '"Honestly was skeptical at first but after a week I stopped reaching for my vape. The mint flavor is clean and the focus is subtle but definitely there."', author: 'Devon A.', tag: 'Verified Buyer · College Student' },
  { stars: 5, text: '"My therapist actually recommended looking into adaptogens for stress. Aire makes it easy. I keep a can at my desk and one in my car."', author: 'Rachel M.', tag: 'Verified Buyer · Teacher' },
  { stars: 4, text: '"Love the concept and the ingredients. Only reason for four stars is I wish each can had a few more pouches. I go through them fast because they actually work."', author: 'Tyler K.', tag: 'Verified Buyer · Software Engineer' },
  { stars: 5, text: '"Replaced my afternoon coffee with Aire and I sleep so much better now. No crash, no jitters, just a smooth kind of alertness."', author: 'Nina L.', tag: 'Verified Buyer · Nurse' },
  { stars: 5, text: '"Bought these for a long road trip and they kept me locked in without the shaky feeling energy drinks give me. Ordering more before my next one."', author: 'Chris W.', tag: 'Verified Buyer · Sales Rep' },
  { stars: 5, text: '"I have tried every wellness supplement out there and most of them are all marketing. This one I can actually feel working within about twenty minutes."', author: 'Samira H.', tag: 'Verified Buyer · Yoga Instructor' },
  { stars: 5, text: '"Got my whole friend group on these. We use them before pickup basketball and everyone says they feel more dialed in. Way better than pre-workout."', author: 'Jordan P.', tag: 'Verified Buyer · Personal Trainer' },
  { stars: 5, text: '"As a new mom running on very little sleep, this has been a lifesaver. Gentle enough that I feel comfortable using it and effective enough that I notice when I skip a day."', author: 'Megan D.', tag: 'Verified Buyer · Stay-at-Home Mom' },
]

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let animationId: number
    const speed = 0.5 // pixels per frame

    const step = () => {
      if (!isPaused && container) {
        container.scrollLeft += speed
        // When we've scrolled through the first set, jump back seamlessly
        const halfScroll = container.scrollWidth / 2
        if (container.scrollLeft >= halfScroll) {
          container.scrollLeft -= halfScroll
        }
      }
      animationId = requestAnimationFrame(step)
    }

    animationId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationId)
  }, [isPaused])

  // Double the reviews for seamless infinite loop
  const loopedReviews = [...reviews, ...reviews]

  return (
    <section id="reviews" className="bg-white py-24">
      <FadeUp className="text-center mb-12 px-6 md:px-16">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block w-5 h-px bg-accent" />
          <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">What People Are Saying</span>
          <span className="block w-5 h-px bg-accent" />
        </div>
        <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-navy tracking-[-0.02em]">
          Real results.<br /><em className="italic text-accent">Real people.</em>
        </h2>
      </FadeUp>

      <FadeUp delay={0.15}>
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-5 overflow-x-hidden px-6 md:px-16"
          style={{ scrollBehavior: 'auto' }}
        >
          {loopedReviews.map(({ stars, text, author, tag }, i) => (
            <div
              key={i}
              className="card-hover bg-off-white rounded-2xl p-8 border border-sky-deep/15 flex flex-col flex-shrink-0"
              style={{ width: '340px', minHeight: '260px' }}
            >
              <div className="text-[#e8a820] text-sm mb-4">{'★'.repeat(stars)}</div>
              <p className="text-[0.9rem] text-navy-mid leading-[1.8] italic mb-5 flex-1">{text}</p>
              <div>
                <div className="text-[0.74rem] font-semibold text-navy tracking-[0.05em] uppercase">— {author}</div>
                <div className="text-[0.66rem] text-accent mt-0.5">✓ {tag}</div>
              </div>
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  )
}
