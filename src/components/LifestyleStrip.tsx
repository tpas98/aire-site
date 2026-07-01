'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import Eyebrow from './ui/Eyebrow'
import SectionHeading from './ui/SectionHeading'
import { useMotionOK } from '@/lib/motion'

const images = [
  { src: '/images/lifestyle-wild-01-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a coastal lookout at golden hour' },
  { src: '/images/lifestyle-wild-02-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a quiet lake dock with morning mist' },
  { src: '/images/lifestyle-wild-03-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a creative studio desk' },
  { src: '/images/lifestyle-wild-04-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a hiking overlook with a daypack' },
  { src: '/images/lifestyle-wild-05-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a rooftop garden work table' },
  { src: '/images/lifestyle-wild-06-airecomplex-2026.png', alt: 'Open Aire Calm Mint tin on a beach towel near the water' },
  { src: '/images/lifestyle-wild-07-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a bright morning kitchen counter' },
  { src: '/images/lifestyle-wild-08-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a cafe table with a relaxed customer nearby' },
  { src: '/images/lifestyle-wild-09-airecomplex-2026.png', alt: 'Aire Calm Mint tin on a park bench after a run' },
  { src: '/images/lifestyle-wild-10-airecomplex-2026.png', alt: 'Aire Calm Mint tin in a scenic road trip moment' },
]

const rowA = images.slice(0, 5)
const rowB = images.slice(5, 10)

// Editorial width/height rhythm, cycled per image.
const widths = [300, 420, 340, 460, 320]
const heights = [300, 340]

function ParallaxImage({
  src,
  alt,
  width,
  height,
  direction,
}: {
  src: string
  alt: string
  width: number
  height: number
  direction: 1 | -1
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [direction * -12, direction * 12])

  return (
    <div
      ref={ref}
      className="flex-shrink-0 overflow-hidden rounded-aire-lg"
      style={{ width, height }}
    >
      <motion.div style={{ y, scale: 1.08 }} className="w-full h-full">
        <Image
          src={src}
          alt={alt}
          width={700}
          height={400}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  )
}

function DesktopRow({
  row,
  xFrom,
  xTo,
  sectionRef,
  parallaxDirection,
}: {
  row: typeof images
  xFrom: string
  xTo: string
  sectionRef: React.RefObject<HTMLElement>
  parallaxDirection: 1 | -1
}) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [xFrom, xTo])

  return (
    <motion.div style={{ x }} className="flex gap-6">
      {row.map(({ src, alt }, i) => (
        <ParallaxImage
          key={src}
          src={src}
          alt={alt}
          width={widths[i % widths.length]}
          height={heights[i % heights.length]}
          direction={i % 2 === 0 ? parallaxDirection : (-parallaxDirection as 1 | -1)}
        />
      ))}
    </motion.div>
  )
}

function MobileRow() {
  return (
    <div
      className="flex gap-4 overflow-x-auto px-6 pb-2"
      style={{
        scrollSnapType: 'x mandatory',
        maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
      }}
    >
      {images.map(({ src, alt }) => (
        <div
          key={src}
          className="flex-shrink-0 overflow-hidden rounded-aire-lg"
          style={{ width: '78vw', height: '58vw', maxHeight: 300, scrollSnapAlign: 'center' }}
        >
          <Image
            src={src}
            alt={alt}
            width={700}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

export default function LifestyleStrip() {
  const sectionRef = useRef<HTMLElement>(null)
  const motionOK = useMotionOK()

  return (
    <section ref={sectionRef} className="bg-white pt-16 pb-8 overflow-hidden">
      <div className="text-center mb-10 px-6">
        <Eyebrow align="center" className="mb-5 justify-center">All-Day Balance</Eyebrow>
        <SectionHeading className="mb-3">
          Bringing you back to the <em>moment when it matters most.</em>
        </SectionHeading>
      </div>

      {motionOK ? (
        <>
          {/* Desktop: counter-sliding parallax rows */}
          <div className="hidden md:flex md:flex-col gap-6">
            <DesktopRow row={rowA} xFrom="0%" xTo="-8%" sectionRef={sectionRef} parallaxDirection={1} />
            <DesktopRow row={rowB} xFrom="-8%" xTo="0%" sectionRef={sectionRef} parallaxDirection={-1} />
          </div>
          {/* Mobile: single swipeable snap row */}
          <div className="md:hidden">
            <MobileRow />
          </div>
        </>
      ) : (
        // Reduced motion (any viewport): single swipeable snap row, no parallax/transforms
        <MobileRow />
      )}
    </section>
  )
}
