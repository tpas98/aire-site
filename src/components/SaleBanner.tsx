import { SALE_CODE, SALE_PERCENT, SALE_URL } from '@/lib/sale'

/** Fixed 36px bar above the navbar. Render only while saleActive(). */
export default function SaleBanner() {
  return (
    <>
      {/* The navbar and banner are both fixed, so anchor jumps need the extra 36px. */}
      <style>{'html{scroll-padding-top:120px}'}</style>
      <a
        href={SALE_URL}
        className="fixed top-0 inset-x-0 z-[60] h-9 bg-navy text-white px-3 flex items-center justify-center gap-2 sm:gap-3 whitespace-nowrap overflow-hidden text-[10.5px] sm:text-xs font-medium uppercase tracking-[0.08em] sm:tracking-[0.12em] hover:bg-navy-mid transition-colors duration-200"
      >
        <span>End of Summer Sale</span>
        <span aria-hidden="true" className="text-sky-deep">·</span>
        <span>{SALE_PERCENT}% off</span>
        <span className="hidden sm:inline">everything</span>
        <span aria-hidden="true" className="text-sky-deep">·</span>
        <span>
          <span className="hidden sm:inline">Code </span>
          <span className="font-bold tracking-[0.14em] text-sky-light border border-dashed border-sky-light/60 rounded px-1.5 py-0.5">
            {SALE_CODE}
          </span>
        </span>
      </a>
    </>
  )
}
