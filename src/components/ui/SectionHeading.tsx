import React from 'react'

interface SectionHeadingProps {
  children: React.ReactNode
  tone?: 'light' | 'dark'
  as?: React.ElementType
  className?: string
}

/**
 * Serif display heading. Wrap a phrase in <em> to get the italic brand accent
 * — navy-mid on light sections, sky-deep on dark/navy sections.
 *
 *   <SectionHeading>Real results.<br/><em>Real people.</em></SectionHeading>
 */
export default function SectionHeading({
  children,
  tone = 'light',
  as: Tag = 'h2',
  className = '',
}: SectionHeadingProps) {
  const emColor = tone === 'dark' ? '[&_em]:text-sky-deep' : '[&_em]:text-navy-mid'
  const baseColor = tone === 'dark' ? 'text-white' : 'text-navy'

  return (
    <Tag
      className={`font-serif text-h2 ${baseColor} [&_em]:italic ${emColor} ${className}`}
    >
      {children}
    </Tag>
  )
}
