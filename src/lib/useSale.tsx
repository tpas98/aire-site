'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { buyUrl } from '@/lib/checkout'
import { msUntilSaleChange, saleActive } from '@/lib/sale'

/**
 * Pages are cached (revalidate = 3600), so the sale flag baked into the HTML can
 * be up to an hour old. The server passes its value in as `initial` so first
 * paint and hydration match; on mount the client re-checks the real clock and
 * schedules a re-check at the next start or end boundary.
 */
const SaleContext = createContext<boolean | null>(null)

export function SaleProvider({ initial, children }: { initial: boolean; children: ReactNode }) {
  const [sale, setSale] = useState(initial)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const sync = () => {
      const now = new Date()
      setSale(saleActive(now))
      const ms = msUntilSaleChange(now)
      // setTimeout caps at 2^31-1 ms; re-check on that cadence for far boundaries.
      if (ms !== null) timer = setTimeout(sync, Math.min(ms + 50, 2 ** 31 - 1))
    }
    sync()
    return () => clearTimeout(timer)
  }, [])
  return <SaleContext.Provider value={sale}>{children}</SaleContext.Provider>
}

/** True while the BF40 sale is live, correct at the moment of viewing. */
export function useSaleActive(): boolean {
  const v = useContext(SaleContext)
  return v ?? saleActive()
}

/** Buy-button href for the current sale state. */
export function useBuyUrl(): string {
  return buyUrl(useSaleActive())
}
