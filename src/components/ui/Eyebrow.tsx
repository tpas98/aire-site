'use client'

interface EyebrowProps {
  children: React.ReactNode
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  className?: string
}

/**
 * Small uppercase section label with a hairline rule, sitting above headings.
 * tone 'light' (default): accent text + accent/40 hairline, for use on light backgrounds.
 * tone 'dark': sky-deep text + sky-deep/40 hairline, for use on navy/dark backgrounds.
 * align 'center' draws a hairline on both sides; 'left' (default) draws one leading hairline.
 */
export default function Eyebrow({
  children,
  tone = 'light',
  align = 'left',
  className = '',
}: EyebrowProps) {
  const textColor = tone === 'dark' ? 'text-sky-deep' : 'text-accent'
  const lineColor = tone === 'dark' ? 'bg-sky-deep/40' : 'bg-accent/40'
  const justify = align === 'center' ? 'justify-center' : ''

  return (
    <div className={`flex items-center gap-3 ${justify} ${className}`}>
      <span className={`block w-8 h-px ${lineColor}`} aria-hidden="true" />
      <span className={`text-eyebrow font-semibold uppercase ${textColor}`}>{children}</span>
      {align === 'center' && <span className={`block w-8 h-px ${lineColor}`} aria-hidden="true" />}
    </div>
  )
}
