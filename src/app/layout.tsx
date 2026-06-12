import type { Metadata } from 'next'
import './globals.css'
import EmailPopup from '@/components/EmailPopup'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.airepouches.com'),
  title: 'Aire | Nicotine-Free Wellness Pouches | Find Your Balance',
  description: 'Aire is the nicotine-free, caffeine-free wellness pouch with Rhodiola Rosea, L-Theanine, Saffron, and L-Tyrosine. Science-backed calm, clarity, and balance in every pouch.',
  keywords: ['wellness pouches', 'nicotine free pouches', 'nicotine alternative', 'pouches for calm', 'pouches for focus', 'adaptogens', 'rhodiola rosea', 'l-theanine', 'saffron pouch', 'non addictive pouches'],
  alternates: {
    canonical: 'https://www.airepouches.com',
  },
  icons: {
    icon: [
      { url: '/aire-icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/aire-icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/aire-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/aire-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/aire-icon-32.png',
    apple: '/aire-apple-icon.png',
  },
  openGraph: {
    title: 'Aire | Nicotine-Free Wellness Pouches | Find Your Balance',
    description: 'Science-backed calm in a pouch. Rhodiola Rosea, L-Theanine, Saffron & L-Tyrosine. Zero nicotine. Zero caffeine.',
    images: ['/images/three-cans-new.png'],
    siteName: 'Aire',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aire | Nicotine-Free Wellness Pouches | Find Your Balance',
    description: 'Science-backed calm in a pouch. Rhodiola Rosea, L-Theanine, Saffron & L-Tyrosine. Zero nicotine. Zero caffeine.',
    images: ['/images/three-cans-new.png'],
  },
}

// Structured Data: Organization schema
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Aire',
  legalName: 'Drifts LLC',
  url: 'https://www.airepouches.com',
  logo: 'https://www.airepouches.com/images/logo.png',
  description: 'Nicotine-free, caffeine-free wellness oral pouches with adaptogens for calm, clarity, and balance.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'New York',
    addressRegion: 'NY',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@airepouches.com',
    contactType: 'customer service',
  },
  sameAs: [
    'https://www.instagram.com/airepouches',
  ],
}

// Structured Data: Product schema
const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Aire Calm Mint Pouches - 4 Pack',
  description: 'Nicotine-free wellness pouches with Rhodiola Rosea, L-Theanine, Affron® Saffron, and L-Tyrosine. 60 pouches (15 per can × 4 cans). Calm Mint flavor.',
  brand: { '@type': 'Brand', name: 'Aire' },
  image: 'https://www.airepouches.com/images/three-cans-new.png',
  offers: {
    '@type': 'Offer',
    price: '45.99',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://www.airepouches.com',
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
        transitTime: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 5, unitCode: 'DAY' },
      },
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    bestRating: '5',
    reviewCount: '200',
  },
  category: 'Health & Wellness > Dietary Supplements',
}

export const viewport = {
  themeColor: '#1a2e4a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" type="image/png" href="/aire-icon-32.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      </head>
      <body>
        {children}
        <EmailPopup />
      </body>
    </html>
  )
}
