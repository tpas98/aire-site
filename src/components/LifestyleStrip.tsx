'use client'
import Image from 'next/image'

const images = [
  { src: '/images/lifestyle-lake.png', alt: 'Aire by the lake at dawn' },
  { src: '/images/lifestyle-coast.png', alt: 'Aire on the coast at sunset' },
  { src: '/images/lifestyle-studio.png', alt: 'Aire in a creative studio' },
  { src: '/images/lifestyle-lake.png', alt: 'Aire by the lake at dawn' },
  { src: '/images/lifestyle-coast.png', alt: 'Aire on the coast at sunset' },
  { src: '/images/lifestyle-studio.png', alt: 'Aire in a creative studio' },
]

export default function LifestyleStrip() {
  return (
    <section className="bg-white py-16 overflow-hidden">
      <div className="text-center mb-10 px-6">
        <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-navy tracking-[-0.02em] mb-3">
          All-Day Balance
        </h2>
        <p className="text-[0.95rem] text-navy-mid font-light">
          Bringing you back to the moment when it matters most
        </p>
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
