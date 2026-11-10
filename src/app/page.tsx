/**
 * Homepage (since 2026-10-07): the education-first page built as /discover.
 * Sections and copy live in src/app/discover/ (no route there; /discover
 * 308-redirects here). The previous homepage is kept at /classic, noindex.
 */
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import SaleBanner from '@/components/SaleBanner'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import { Footer } from '@/components/CTAFooter'
import { SALE_CODE, SALE_PERCENT } from '@/lib/sale'
import { faqs, hero } from './discover/content'
import Hero from './discover/sections/Hero'
import PouchAisle from './discover/sections/PouchAisle'
import CaseForCalm from './discover/sections/CaseForCalm'
import Inside from './discover/sections/Inside'
import ProductFilm from './discover/sections/ProductFilm'
import Aisle from './discover/sections/Aisle'
import HowItWorks from './discover/sections/HowItWorks'
import Moments from './discover/sections/Moments'
import Reviews from './discover/sections/Reviews'
import DiscoverFAQ from './discover/sections/DiscoverFAQ'
import Offer from './discover/sections/Offer'

const strip = (s: string) => s.replace(/†/g, '')

export const metadata: Metadata = {
  title: 'Aire | Calm focus in a pouch. No nicotine, no caffeine.',
  description: strip(hero.sub),
  alternates: { canonical: 'https://airepouches.com' },
  openGraph: {
    title: 'Aire | Calm focus in a pouch. No nicotine, no caffeine.',
    description: strip(hero.sub),
    url: 'https://airepouches.com',
    images: ['/images/three-cans-full-frame-2026.png'],
  },
}

// Structured Data: Product schema.
// Lives HERE, not in layout.tsx — it was previously rendered on every route,
// including /privacy and /terms, which is a structured-data violation.
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Aire Calm Mint Pouches - 4 Pack',
  description: 'Nicotine-free, caffeine-free wellness pouches with L-Theanine, Rhodiola Rosea, Saffron, and L-Tyrosine. 60 pouches (15 per can x 4 cans). Calm Mint flavor.',
  brand: { '@type': 'Brand', name: 'Aire' },
  image: 'https://airepouches.com/images/three-cans-full-frame-2026.png',
  sku: 'AIRE-CALMMINT-4PK',
  mpn: 'AIRE-CM-4PK',
  // TODO: add `gtin13` once the product has a barcode.
  category: 'Health & Wellness > Dietary Supplements',
  offers: {
    '@type': 'Offer',
    price: '45.99',
    priceCurrency: 'USD',
    priceValidUntil: '2027-08-19',
    availability: 'https://schema.org/InStock',
    url: 'https://shop.airepouches.com/products/aire',
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '0',
        currency: 'USD',
      },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'US',
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
        transitTime: { '@type': 'QuantitativeValue', minValue: 5, maxValue: 7, unitCode: 'DAY' },
      },
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'US',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 7,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
      merchantReturnLink: 'https://airepouches.com/shipping',
    },
  },
  // ---------------------------------------------------------------------
  // aggregateRating REMOVED ON PURPOSE.
  //
  // It previously declared ratingValue 4.8 / reviewCount 200 while the page
  // shows 10 undated testimonials with no Review markup. Google requires the
  // reviews backing an aggregate to be available on the page, so it was not
  // substantiated as-is. Leaving it risked a structured-data manual action,
  // and the "Verified" badges without purchase records are separate FTC
  // exposure (16 CFR Part 465).
  //
  // To restore: install a review app (Judge.me / Loox / Okendo) on Shopify,
  // collect verified-purchase reviews, and let the app emit both
  // aggregateRating and the individual Review objects.
  // ---------------------------------------------------------------------
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

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <SaleBanner />
      <Navbar overHero />
      <main>
        <Hero />
        <PouchAisle />
        <CaseForCalm />
        <Inside />
        <ProductFilm />
        <Aisle />
        <HowItWorks />
        <Moments />
        <Reviews />
        <DiscoverFAQ />
        <Offer />
      </main>
      <Footer />
      <StickyMobileCTA saleOffer={{ label: 'Black Friday', price: `${SALE_PERCENT}% off · ${SALE_CODE}`, cta: 'Try Aire' }} />
    </>
  )
}
