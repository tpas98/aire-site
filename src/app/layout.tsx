import type { Metadata } from 'next'
import './globals.css'
import EmailPopup from '@/components/EmailPopup'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.airepouches.com'),
  title: 'Aire — Find Your Balance',
  description: 'The world\'s first lifestyle pouch built for calm focus. No nicotine, no caffeine, no compromise.',
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
    title: 'Aire — Find Your Balance',
    description: 'Science-backed calm in a pouch. Zero nicotine. Zero caffeine.',
    images: ['/images/three-cans-new.png'],
    siteName: 'Aire',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aire — Find Your Balance',
    description: 'Science-backed calm in a pouch. Zero nicotine. Zero caffeine.',
    images: ['/images/three-cans-new.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" scroll-behavior="auto">
      <head>
        <link rel="shortcut icon" type="image/png" href="/aire-icon-32.png" />
      </head>
      <body>
        {children}
        <EmailPopup />
      </body>
    </html>
  )
}
