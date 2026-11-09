'use client'
import { SALE_CODE, SALE_PERCENT, SALE_URL } from '@/lib/sale'
import { useSaleActive } from '@/lib/useSale'

/** Fixed 36px bar above the navbar. Renders only while the sale is live (re-checked on the client). */
export default function SaleBanner() {
  if (!useSaleActive()) return null
  return (
    <>
      {/* The navbar and banner are both fixed, so anchor jumps need the extra 36px. */}
      <style>{'html{scroll-padding-top:120px}'}</style>
      <a
        href={SALE_URL}
        aria-label={`Black Friday Sale · ${SALE_PERCENT}% off · ${SALE_CODE}`}
        className="fixed top-0 inset-x-0 z-[60] h-9 bg-navy text-white px-3 flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap overflow-hidden text-[10.5px] sm:text-xs font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] hover:bg-navy-mid transition-colors duration-200"
        style={{ color: '#fff', fontWeight: 700 }}
      >
        <span>Black Friday Sale</span>
        <span aria-hidden="true" className="text-white/75">·</span>
        <span>{SALE_PERCENT}% off</span>
        <span aria-hidden="true" className="text-white/75">·</span>
        <span>
          <span className="hidden sm:inline">Code </span>
          <span className="font-bold tracking-[0.14em] text-white border border-dashed border-white/75 rounded px-1.5 py-0.5">
            {SALE_CODE}
          </span>
        </span>
      </a>
    </>
  )
}
