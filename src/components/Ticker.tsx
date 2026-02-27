export default function Ticker() {
  const items = [
    '75mg L-Theanine', 'Rhodiola Rosea', 'Methylfolate',
    'Vitamin B6', 'Affron® Saffron', 'Zero Nicotine',
    'Zero Caffeine', 'Calm Mint · Flow Pouches', 'Find Your Balance',
  ]

  const doubled = [...items, ...items]

  return (
    <div className="mt-[68px] bg-navy text-white/70 py-2.5 overflow-hidden whitespace-nowrap">
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
