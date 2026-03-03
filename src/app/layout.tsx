import type { Metadata } from 'next'
import './globals.css'
import EmailPopup from '@/components/EmailPopup'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.airepouches.com'),
  title: 'Aire — Find Your Balance',
  description: 'The world\'s first lifestyle pouch built for calm focus. No nicotine, no caffeine, no compromise.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
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
      <body>
        {children}
        <EmailPopup />
      </body>
    </html>
  )
}
