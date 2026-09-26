import Navbar from '@/components/Navbar'
import Ticker from '@/components/Ticker'
import SaleBanner from '@/components/SaleBanner'
import { saleActive } from '@/lib/sale'
import Hero from '@/components/Hero'
import LifestyleStrip from '@/components/LifestyleStrip'
import About from '@/components/About'
import Ingredients from '@/components/Ingredients'
import ProductFeature from '@/components/ProductFeature'
import HowToUse from '@/components/HowToUse'
import Balance from '@/components/Balance'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import { CTA, Footer } from '@/components/CTAFooter'

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
        handlingTime: { '@type': 'QuantitativeValue', minValue: 7, maxValue: 10, unitCode: 'DAY' },
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

// Re-render hourly so the sale banner comes down on its own after SALE_ENDS_AT.
export const revalidate = 3600

export default function Home() {
  const sale = saleActive()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {sale && <SaleBanner />}
      <Navbar belowBanner={sale} />
      <Ticker belowBanner={sale} />
      <Hero />
      <LifestyleStrip />
      <Testimonials />
      <About />
      <Ingredients />
      <ProductFeature />
      <Balance />
      <HowToUse />
      <FAQ />
      <CTA />
      <Footer />
      <StickyMobileCTA />
    </>
  )
}
