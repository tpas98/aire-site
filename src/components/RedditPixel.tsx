'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * Pixel ID is a public value, same as the TikTok one. Hardcoded so a deploy can
 * never ship without it; the env var overrides for a replacement pixel.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID || 'a2_jtajhxrg9oeo'

type Rdt = (...args: unknown[]) => void

/**
 * Reddit Pixel for airepouches.com (ad account "Aire Pouches", added 2026-10-08).
 *
 * shop.airepouches.com gets the same pixel through Reddit's native Shopify
 * integration, which also covers checkout and Purchase. Do not add it to the
 * theme by hand as well, or every storefront event counts twice.
 */
export default function RedditPixel() {
  const pathname = usePathname()
  const firstPath = useRef(true)

  // The snippet fires PageVisit on load; client-side route changes need their own.
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false
      return
    }
    ;(window as unknown as { rdt?: Rdt }).rdt?.('track', 'PageVisit')
  }, [pathname])

  // Outbound clicks to the store, so Reddit sees the hop even before Shopify reports.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href]') as
        | HTMLAnchorElement
        | null
      if (!anchor) return
      try {
        const url = new URL(anchor.href, window.location.href)
        if (!url.hostname.endsWith('airepouches.com') || url.hostname === window.location.hostname) return
        ;(window as unknown as { rdt?: Rdt }).rdt?.('track', 'Custom', { customEventName: 'ShopClick' })
      } catch {
        // A malformed href is not worth breaking a click over.
      }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return (
    <Script
      id="reddit-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
rdt('init',${JSON.stringify(PIXEL_ID)});
rdt('track','PageVisit');
        `.trim(),
      }}
    />
  )
}
