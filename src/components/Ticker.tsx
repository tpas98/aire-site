export default function Ticker({ belowBanner = false }: { belowBanner?: boolean }) {
  const items = [
    'L-Theanine', 'Rhodiola Rosea', 'L-Tyrosine',
    'Saffron', 'Zero Nicotine',
    'Zero Caffeine', 'Calm Mint',
  ]

  const doubled = [...items, ...items]

  return (
    <div className={`${belowBanner ? 'mt-[100px]' : 'mt-[64px]'} bg-navy text-white/70 py-2.5 overflow-hidden whitespace-nowrap`} aria-hidden="true">
      <div className="inline-flex animate-ticker">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-7 text-[0.67rem] tracking-[0.17em] uppercase">{item}</span>
            <span className="text-sky-deep text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
