'use client'
import Image from 'next/image'

const images = [
  { src: '/images/lifestyle-wild-01-sidefix-2026.png', alt: 'Aire Calm Mint tin on a coastal lookout at golden hour' },
  { src: '/images/lifestyle-wild-02-sidefix-2026.png', alt: 'Aire Calm Mint tin on a quiet lake dock with morning mist' },
  { src: '/images/lifestyle-wild-03-sidefix-2026.png', alt: 'Aire Calm Mint tin on a creative studio desk' },
  { src: '/images/lifestyle-wild-04-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a hiking overlook with a daypack' },
  { src: '/images/lifestyle-wild-05-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a rooftop garden work table' },
  { src: '/images/lifestyle-wild-06-airecomplex-2026.png', alt: 'Open Aire Calm Mint tin on a beach towel near the water' },
  { src: '/images/lifestyle-wild-07-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a bright morning kitchen counter' },
  { src: '/images/lifestyle-wild-08-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a cafe table with a relaxed customer nearby' },
  { src: '/images/lifestyle-wild-09-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a park bench after a run' },
  { src: '/images/lifestyle-wild-10-airecomplex-2026.png', alt: 'Aire Calm Mint tin in a scenic road trip moment' },
]

export default function LifestyleStrip() {
  return (
    <section className="bg-white pt-16 pb-8 overflow-hidden">
      <div className="text-center mb-10 px-6">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="block w-5 h-px bg-accent" />
          <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">All-Day Balance</span>
          <span className="block w-5 h-px bg-accent" />
        </div>
        <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-navy tracking-[-0.02em] mb-3">
          Bringing you back to the <em className="italic text-navy-mid">moment when it matters most.</em>
        </h2>
      </div>
      <div className="overflow-hidden">
        <div className="lifestyle-track flex" style={{ width: 'max-content' }}>
          {images.map(({ src, alt }, i) => (
            <div key={`a-${i}`} className="flex-shrink-0 w-[400px] h-[300px] overflow-hidden mx-2.5 rounded-xl">
              <Image
                src={src}
                alt={alt}
                width={700}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
          {images.map(({ src, alt }, i) => (
            <div key={`b-${i}`} className="flex-shrink-0 w-[400px] h-[300px] overflow-hidden mx-2.5 rounded-xl">
              <Image
                src={src}
                alt={alt}
                width={700}
                height={400}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
