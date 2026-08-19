import type { Metadata } from 'next'
import './globals.css'
import EmailPopup from '@/components/EmailPopup'

export const metadata: Metadata = {
  metadataBase: new URL('https://airepouches.com'),
  title: 'Aire | Nicotine-Free Wellness Pouches | Find Your Balance',
  description: 'Aire is the nicotine-free, caffeine-free wellness pouch with Rhodiola Rosea, L-Theanine, Saffron, and L-Tyrosine. Science-backed calm, clarity, and balance in every pouch.',
  keywords: ['wellness pouches', 'nicotine free pouches', 'nicotine alternative', 'pouches for calm', 'pouches for focus', 'adaptogens', 'rhodiola rosea', 'l-theanine', 'saffron pouch', 'non addictive pouches'],
  alternates: {
    canonical: 'https://airepouches.com',
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
    images: ['/images/three-cans-full-frame-2026.png'],
    siteName: 'Aire',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aire | Nicotine-Free Wellness Pouches | Find Your Balance',
    description: 'Science-backed calm in a pouch. Rhodiola Rosea, L-Theanine, Saffron & L-Tyrosine. Zero nicotine. Zero caffeine.',
    images: ['/images/three-cans-full-frame-2026.png'],
  },
}

// Structured Data: Organization schema
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Aire',
  legalName: 'Drifts LLC',
  url: 'https://airepouches.com',
  logo: 'https://airepouches.com/images/logo.png',
  description: 'Nicotine-free, caffeine-free wellness oral pouches with L-Theanine, Rhodiola Rosea, Saffron, and L-Tyrosine for calm, clarity, and balance.',
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
    areaServed: 'US',
  },
  // Add every profile you control. Consistent cross-linking is the strongest
  // entity signal available to a small brand.
  sameAs: [
    'https://www.instagram.com/airepouches',
    // 'https://x.com/airepouches',
    // 'https://www.linkedin.com/company/aire-pouches',
    // 'https://www.tiktok.com/@airepouches',
  ],
}

// Structured Data: WebSite schema (helps engines resolve the canonical host)
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Aire',
  url: 'https://airepouches.com',
  publisher: { '@type': 'Organization', name: 'Aire', url: 'https://airepouches.com' },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        {children}
        <EmailPopup />
      </body>
    </html>
  )
}
