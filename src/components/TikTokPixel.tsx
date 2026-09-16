'use client'

import Script from 'next/script'
import { useEffect } from 'react'

/**
 * Pixel ID is a public value — it ships in the client bundle and is readable in
 * view-source, same as a GA measurement ID. Hardcoded so a deploy can never ship
 * without it; the env var overrides for a staging or replacement pixel.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || 'DA8DN9BC77U3MKV9QD10'

/**
 * TikTok Pixel for airepouches.com.
 *
 * Set NEXT_PUBLIC_TIKTOK_PIXEL_ID in Vercel (and .env.local for dev). With no ID
 * set this renders nothing, so local dev and previews stay clean.
 *
 * The same pixel ID must also be installed on shop.airepouches.com via the TikTok
 * for Business Shopify app. Both are subdomains of airepouches.com, so the _ttp
 * cookie is shared and a session survives the hop to checkout.
 *
 * Shop Pay checkouts render on shop.app, where no browser pixel can follow. That
 * gap is covered server-side by Shopify's Events API — turn it on.
 */
export default function TikTokPixel() {
  // Outbound clicks to the store are the funnel step this site is otherwise blind to.
  useEffect(() => {
    if (!PIXEL_ID) return

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href]') as
        | HTMLAnchorElement
        | null
      if (!anchor) return

      try {
        const url = new URL(anchor.href, window.location.href)
        const leavingForStore =
          url.hostname.endsWith('airepouches.com') && url.hostname !== window.location.hostname
        if (!leavingForStore) return

        const ttq = (window as unknown as { ttq?: { track?: (e: string, p?: object) => void } }).ttq
        ttq?.track?.('ClickButton', {
          content_type: 'product',
          content_name: 'Aire Calm Mint Pouches - 4 Pack',
          content_id: 'AIRE-CALMMINT-4PK',
        })
      } catch {
        // A malformed href is not worth breaking a click over.
      }
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  if (!PIXEL_ID) return null

  return (
    <Script
      id="tiktok-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load(${JSON.stringify(PIXEL_ID)});
  ttq.page();
}(window, document, 'ttq');
        `.trim(),
      }}
    />
  )
}
