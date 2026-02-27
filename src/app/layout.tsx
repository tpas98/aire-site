import type { Metadata } from 'next'
import './globals.css'
import EmailPopup from '@/components/EmailPopup'

export const metadata: Metadata = {
  title: 'Aire — Find Your Balance',
  description: 'The world\'s first lifestyle pouch built for calm focus. No nicotine, no caffeine, no compromise.',
  openGraph: {
    title: 'Aire — Find Your Balance',
    description: 'Science-backed calm in a pouch. Zero nicotine. Zero caffeine.',
    images: ['/images/three-cans.png'],
    siteName: 'Aire',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aire — Find Your Balance',
    description: 'Science-backed calm in a pouch. Zero nicotine. Zero caffeine.',
    images: ['/images/three-cans.png'],
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
