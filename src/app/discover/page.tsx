import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import SaleBanner from '@/components/SaleBanner'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import { Footer } from '@/components/CTAFooter'
import { saleActive } from '@/lib/sale'
import { faqs, hero } from './content'
import Hero from './sections/Hero'
import ProductFilm from './sections/ProductFilm'
import PouchAisle from './sections/PouchAisle'
import CaseForCalm from './sections/CaseForCalm'
import Inside from './sections/Inside'
import Aisle from './sections/Aisle'
import HowItWorks from './sections/HowItWorks'
import Moments from './sections/Moments'
import Reviews from './sections/Reviews'
import DiscoverFAQ from './sections/DiscoverFAQ'
import Offer from './sections/Offer'

const strip = (s: string) => s.replace(/†/g, '')

export const metadata: Metadata = {
  title: 'Aire | Calm focus in a pouch. No nicotine, no caffeine.',
  description: strip(hero.sub),
  alternates: { canonical: 'https://airepouches.com/discover' },
  openGraph: {
    title: 'Aire | Calm focus in a pouch. No nicotine, no caffeine.',
    description: strip(hero.sub),
    url: 'https://airepouches.com/discover',
    images: ['/images/three-cans-full-frame-2026.png'],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: strip(f.q),
    acceptedAnswer: { '@type': 'Answer', text: strip(f.a) },
  })),
}

export const revalidate = 3600

export default function DiscoverPage() {
  const sale = saleActive()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {sale && <SaleBanner />}
      <Navbar belowBanner={sale} />
      <main>
        <Hero />
        <ProductFilm />
        <PouchAisle />
        <CaseForCalm />
        <Inside />
        <Aisle />
        <HowItWorks />
        <Moments />
        <Reviews />
        <DiscoverFAQ />
        <Offer />
      </main>
      <Footer />
      <StickyMobileCTA label="New customers, code FIRST30" price="30% off first order" cta="Try Aire" />
    </>
  )
}
