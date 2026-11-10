'use client'
import { useBuyUrl, useSaleActive } from '@/lib/useSale'
import { SALE_PERCENT } from '@/lib/sale'

/** Home link + buy button for the 404 page. The buy URL carries the sale code while the sale runs. */
export default function NotFoundActions() {
  const buyUrl = useBuyUrl()
  const sale = useSaleActive()
  return (
    <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <a
        href="/"
        className="inline-block rounded-full border border-white/30 px-8 py-4 text-center text-[0.8rem] font-medium uppercase tracking-[0.08em] text-white transition-all duration-200 hover:border-white/60"
      >
        Back to home
      </a>
      <a
        href={buyUrl}
        className="btn-primary inline-block rounded-full bg-white px-8 py-4 text-center text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-navy"
      >
        {sale ? `Shop Aire · ${SALE_PERCENT}% off` : 'Shop Aire'}
      </a>
    </div>
  )
}
