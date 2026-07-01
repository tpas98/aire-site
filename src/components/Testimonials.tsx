'use client'
import FadeUp from './FadeUp'
import Reveal from './ui/Reveal'
import Eyebrow from './ui/Eyebrow'
import SectionHeading from './ui/SectionHeading'
import { useMotionOK } from '@/lib/motion'

const reviews = [
  { stars: 4.5, text: '"I used to go through a full can of nicotine pouches on a night out. Mixing these in has cut my nicotine use down a lot. The calm vibe actually pairs better with going out, and I feel noticeably better the next morning."', author: 'Colin', tag: 'MBA Student' },
  { stars: 5, text: '"Staying calm and collected is how I operate at my best. I keep a can in my desk and use one before big meetings instead of reaching for caffeine. It takes the edge off without killing my energy. I feel more controlled and less reactive."', author: 'Vivek', tag: 'Entrepreneur' },
  { stars: 4.5, text: '"What I like most is that I can use these morning or night and not worry about messing up my sleep. I\'ll use one during work and maybe another after dinner. No jitters, no crash. Just steady."', author: 'Alex', tag: 'Private Equity Professional' },
  { stars: 5, text: '"My mind usually spirals during long workouts. I tried these before a long run and was surprised how steady I felt mentally. I still have energy. I\'m just not arguing with myself the whole time. Love them pre- and post-workout."', author: 'Cameron', tag: 'Content Creator / Athlete' },
  { stars: 5, text: '"I started using these after realizing how much nicotine was hurting my sleep. I take one a couple hours before bed while winding down. Falling asleep feels easier and I don\'t feel wired at night."', author: 'Lucas', tag: 'Management Consultant' },
  { stars: 5, text: '"These have become part of my daily routine. When my mind is racing or I feel overwhelmed, I\'ll pop one in and within about 10 minutes I feel more centered. Not sleepy, just clearer and more present."', author: 'Mitch', tag: 'Engineering Student' },
  { stars: 5, text: '"I work long hours and can get pretty irritable when I\'m deep in problem-solving. These help me stay level. Calm, steady focus without feeling dulled out."', author: 'Anthony', tag: 'Computer Scientist' },
  { stars: 5, text: '"I was chaining nicotine pouches more than I wanted to admit. Swapping these in when the urge hits has helped a lot. Cravings feel more manageable, and I don\'t get that edgy buzz."', author: 'Tim', tag: 'Various Jobs / Skating and Surfing' },
  { stars: 4.5, text: '"Perfect for school, home, or working on passion projects. When I\'m creating, I tend to overthink everything. These help me drop into the work instead of analyzing it. It\'s not dramatic, just smoother and easier to stay in flow."', author: 'Thomas', tag: 'Marketing Professional' },
  { stars: 5, text: '"These completely replaced nicotine for me. Whether I\'m at school, gaming, or driving, I feel grounded and focused. It\'s the right level of calm. I never feel tired or sedated."', author: 'Jake', tag: 'Corporate Law' },
]

const featured = reviews.find((r) => r.author === 'Vivek')!
const wallReviews = reviews.filter((r) => r.author !== 'Vivek')
const wallRowA = wallReviews.slice(0, 5)
const wallRowB = wallReviews.slice(5, 9)

function StarRating({ stars, size = 'text-sm' }: { stars: number; size?: string }) {
  const fullStars = Math.floor(stars)
  const hasHalf = stars % 1 !== 0
  return (
    <div className={`flex items-center gap-0.5 text-gold ${size}`}>
      {'★'.repeat(fullStars)}
      {hasHalf && (
        <span className="relative inline-block w-[1em] overflow-hidden">
          <span className="text-gold/20">★</span>
          <span className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>★</span>
        </span>
      )}
    </div>
  )
}

function ReviewCard({ stars, text, author, tag }: { stars: number; text: string; author: string; tag: string }) {
  return (
    <div className="card-hover bg-off-white rounded-aire-lg p-7 border border-sky-deep/15 flex flex-col flex-shrink-0 w-[340px] min-h-[260px]">
      <StarRating stars={stars} />
      <div className="mt-4" />
      <p className="text-[0.9rem] text-navy-mid leading-[1.8] italic mb-5 flex-1">{text}</p>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[0.74rem] font-semibold text-navy tracking-[0.05em] uppercase">{author}</span>
          <span className="inline-flex items-center gap-1 bg-accent/10 text-accent text-[0.55rem] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full">
            <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor"><path d="M6.664 13.665a.5.5 0 0 1-.353-.146l-4-4a.5.5 0 0 1 .707-.707L6.664 12.46l6.329-6.329a.5.5 0 1 1 .707.707l-6.682 6.682a.5.5 0 0 1-.354.146z"/></svg>
            Verified
          </span>
        </div>
        <div className="text-[0.66rem] text-accent mt-0.5">{tag}</div>
      </div>
    </div>
  )
}

function MarqueeRow({
  row,
  duration,
  reverse,
}: {
  row: typeof reviews
  duration: number
  reverse: boolean
}) {
  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-5 w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${duration}s` }}
      >
        {row.map((review, i) => (
          <ReviewCard key={`a-${i}`} {...review} />
        ))}
        {row.map((review, i) => (
          <ReviewCard key={`b-${i}`} {...review} />
        ))}
      </div>
    </div>
  )
}

function StaticGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 px-6 md:px-16">
      {wallReviews.map((review, i) => (
        <ReviewCard key={i} {...review} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const motionOK = useMotionOK()

  return (
    <section id="reviews" className="bg-off-white pt-12 pb-16">
      <FadeUp className="text-center mb-12 px-6 md:px-16">
        <Eyebrow align="center" className="mb-5 justify-center">What Customers Are Saying</Eyebrow>
        <SectionHeading className="mb-4">
          Real results.<br /><em>Real people.</em>
        </SectionHeading>
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-0.5 text-gold text-sm">
            {'★★★★'}
            <span className="relative inline-block w-[1em] overflow-hidden">
              <span className="text-gold/20">★</span>
              <span className="absolute top-0 left-0 overflow-hidden" style={{ width: '75%' }}>★</span>
            </span>
          </div>
          <span className="text-[0.78rem] text-navy-mid font-medium">4.8 average from 200+ customers</span>
        </div>
      </FadeUp>

      {/* Featured pull-quote */}
      <Reveal className="relative max-w-[780px] mx-auto px-6 mb-16 text-center">
        <span
          aria-hidden="true"
          className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 font-serif text-[7rem] leading-none text-accent/20 select-none"
        >
          &ldquo;
        </span>
        <div className="relative">
          <p className="font-serif italic text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.4] text-navy mb-6">
            {featured.text.replace(/^"|"$/g, '')}
          </p>
          <div className="flex justify-center mb-3">
            <StarRating stars={featured.stars} size="text-base" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="text-[0.8rem] font-semibold text-navy tracking-[0.05em] uppercase">{featured.author}</span>
            <span className="inline-flex items-center gap-1 bg-accent/10 text-accent text-[0.55rem] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-full">
              <svg width="8" height="8" viewBox="0 0 16 16" fill="currentColor"><path d="M6.664 13.665a.5.5 0 0 1-.353-.146l-4-4a.5.5 0 0 1 .707-.707L6.664 12.46l6.329-6.329a.5.5 0 1 1 .707.707l-6.682 6.682a.5.5 0 0 1-.354.146z"/></svg>
              Verified
            </span>
          </div>
          <div className="text-[0.7rem] text-accent">{featured.tag}</div>
        </div>
      </Reveal>

      {/* Wall of remaining reviews */}
      {motionOK ? (
        <FadeUp delay={0.1}>
          <div
            className="flex flex-col gap-5"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)',
            }}
          >
            <MarqueeRow row={wallRowA} duration={75} reverse={false} />
            <MarqueeRow row={wallRowB} duration={60} reverse={true} />
          </div>
        </FadeUp>
      ) : (
        <StaticGrid />
      )}
    </section>
  )
}
