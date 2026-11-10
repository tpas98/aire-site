'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { Analytics, track } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

/**
 * Site measurement: Vercel Web Analytics, Speed Insights and Microsoft Clarity.
 *
 * Nothing here loads until the browser is idle (or 3s after load at the latest),
 * so it stays out of the Lighthouse critical path. Clarity project ymyj97gtte is
 * the same project that already runs on shop.airepouches.com, so a session that
 * hops to the store continues as one recording. Clarity is skipped on localhost
 * only; Vercel previews are allowed so the tag can be verified there.
 *
 * Also records a `buy_click` custom event for any click on a link that leaves for
 * the Shopify store, with a `location` property derived from where the link sits.
 */
const CLARITY_ID = 'ymyj97gtte'

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
}

function buyLocation(anchor: HTMLAnchorElement): string {
  // Fixed-position bars (mobile sticky CTA) first, then landmarks, then section ids.
  for (let el: HTMLElement | null = anchor; el && el !== document.body; el = el.parentElement) {
    if (getComputedStyle(el).position === 'fixed') {
      return el.tagName === 'NAV' || el.tagName === 'HEADER' ? 'nav' : 'sticky'
    }
  }
  if (anchor.closest('nav, header')) return 'nav'
  if (anchor.closest('footer')) return 'footer'
  const section = anchor.closest('section')
  if (section?.id) return section.id
  const labelled = section?.getAttribute('aria-labelledby')
  if (labelled) return labelled.replace(/-title$/, '')
  if (section) {
    const all = Array.from(document.querySelectorAll('main section, section'))
    return all.indexOf(section) === 0 ? 'hero' : 'section'
  }
  return 'other'
}

export default function Measurement() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const w = window as IdleWindow
    const go = () => setReady(true)
    if (w.requestIdleCallback) w.requestIdleCallback(go, { timeout: 3000 })
    else setTimeout(go, 3000)
  }, [])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href]') as
        | HTMLAnchorElement
        | null
      if (!anchor) return
      try {
        const url = new URL(anchor.href, window.location.href)
        const isBuy =
          url.pathname.startsWith('/discount/') || url.hostname === 'shop.airepouches.com'
        if (!isBuy) return
        track('buy_click', { location: buyLocation(anchor), path: window.location.pathname })
      } catch {
        // Never let measurement break a click.
      }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  if (!ready) return null

  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Script
        id="ms-clarity"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
(function(c,l,a,r,i,t,y){
  if(/^(localhost|127\\.0\\.0\\.1|\\[::1\\])$/.test(l.location.hostname))return;
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"clarity","script",${JSON.stringify(CLARITY_ID)});
          `.trim(),
        }}
      />
    </>
  )
}
