import Image from 'next/image'

const images = [
  { src: '/images/lifestyle-lake.png', alt: 'Aire by the lake at dawn' },
  { src: '/images/lifestyle-coast.png', alt: 'Aire on the coast at sunset' },
  { src: '/images/lifestyle-studio.png', alt: 'Aire in a creative studio' },
]

export default function LifestyleStrip() {
  return (
    <div className="grid grid-cols-3 h-[400px] overflow-hidden">
      {images.map(({ src, alt }) => (
        <div key={src} className="overflow-hidden group">
          <Image
            src={src}
            alt={alt}
            width={700}
            height={400}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  )
}
