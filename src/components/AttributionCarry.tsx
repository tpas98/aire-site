'use client'

import { useEffect } from 'react'

/** Ad-click and campaign parameters worth keeping on the way to the store. */
const KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'rdt_cid',
  'ttclid',
  'fbclid',
  'gclid',
]

const STORAGE_KEY = 'aire_attribution'

/**
 * Carries the landing page's UTM and click-ID parameters onto every link to
 * shop.airepouches.com.
 *
 * Why: the buy buttons point at a fixed URL, so an ad click that landed on
 * airepouches.com?utm_source=reddit reached Shopify with no tags, and the order
 * was attributed to airepouches.com. Every order before 2026-10-08 shows up that
 * way. The parameters are kept for the session, so a visitor who reads /science
 * before buying is still credited to the ad.
 *
 * Shopify's /discount/<code>?redirect=… link passes extra parameters through to
 * the redirect target (checked with curl 2026-10-08), so appending works there too.
 */
export default function AttributionCarry() {
  useEffect(() => {
    let stored: Record<string, string> = {}
    try {
      stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
    } catch {
      stored = {}
    }

    const landing = new URLSearchParams(window.location.search)
    const fresh = KEYS.filter((k) => landing.get(k))
    if (fresh.length) {
      // A new ad click replaces the old campaign rather than mixing with it.
      stored = Object.fromEntries(fresh.map((k) => [k, landing.get(k) as string]))
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
      } catch {
        // Private mode: still carry this page's parameters below.
      }
    }

    if (!Object.keys(stored).length) return

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a[href]') as
        | HTMLAnchorElement
        | null
      if (!anchor) return
      try {
        const url = new URL(anchor.href, window.location.href)
        if (!url.hostname.endsWith('airepouches.com') || url.hostname === window.location.hostname) return
        let changed = false
        for (const [k, v] of Object.entries(stored)) {
          if (!url.searchParams.has(k)) {
            url.searchParams.set(k, v)
            changed = true
          }
        }
        if (changed) anchor.href = url.toString()
      } catch {
        // Leave the link as it was.
      }
    }

    // Capture phase, so the href is rewritten before the browser follows it.
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return null
}
