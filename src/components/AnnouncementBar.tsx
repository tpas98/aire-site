export default function AnnouncementBar() {
  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-9 bg-accent px-2 sm:px-3 flex items-center justify-center whitespace-nowrap overflow-hidden">
      <p className="text-center text-navy">
        <span className="sm:hidden text-[9.5px] font-medium uppercase tracking-[0.01em] leading-none">
          Sold out — ships in 3 wks ·{' '}
          <span className="font-bold tracking-[0.03em] underline decoration-navy/40 underline-offset-2">
            FREESHIP
          </span>{' '}
          = free ship
        </span>
        <span className="hidden sm:inline text-xs font-medium uppercase tracking-[0.06em]">
          Currently sold out — new batch on the way. Orders placed now ship within 3 weeks. Use code{' '}
          <span className="font-bold tracking-[0.1em] underline decoration-navy/40 underline-offset-2">
            FREESHIP
          </span>{' '}
          at checkout for free shipping.
        </span>
      </p>
    </div>
  )
}
