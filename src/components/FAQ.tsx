'use client'
import { useState } from 'react'
import FadeUp from './FadeUp'

const faqs = [
  {
    q: 'What is Aire?',
    a: 'Aire is a premium wellness oral pouch designed for calm focus. Each pouch contains 5 science-backed ingredients — L-Theanine, Rhodiola Rosea, Methylfolate, Vitamin B6, and Affron® Saffron — that work together to support mood, mental clarity, and stress resilience. 100% nicotine-free and caffeine-free.',
  },
  {
    q: 'What does it taste like?',
    a: 'Aire comes in Calm Mint — a smooth, refreshing mint flavor that\'s not overpowering. It\'s designed to be pleasant and subtle so you can use it comfortably throughout the day.',
  },
  {
    q: 'How quickly does it work?',
    a: 'Most people feel the effects within 5–15 minutes. Place the pouch between your upper lip and gum and the ingredients absorb through your gum tissue. A gentle tingle lets you know it\'s working. Enjoy for up to 60 minutes.',
  },
  {
    q: 'Is Aire a nicotine replacement?',
    a: 'Aire is not marketed as a nicotine replacement therapy. It\'s a wellness pouch for anyone who wants calm focus — whether you\'re replacing a nicotine habit or simply looking for a healthier daily ritual. Many customers are former Zyn and nicotine pouch users who wanted a clean alternative.',
  },
  {
    q: 'How many pouches can I use per day?',
    a: 'We recommend 4–5 pouches throughout the day. One in the morning for a focused start, another mid-morning, one after lunch, and one in the evening to unwind. No nicotine or caffeine means no crash or dependency risk.',
  },
  {
    q: 'What\'s your return policy?',
    a: 'We offer a 30-day satisfaction guarantee. If you\'re not happy with Aire, contact us at hello@aire.com within 30 days of delivery and we\'ll make it right.',
  },
  {
    q: 'Where do you ship?',
    a: 'We currently ship within the United States. Most orders ship within 1–2 business days and arrive within 3–5 business days. Free shipping on orders over $50.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-sky-deep/15">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-[0.95rem] font-medium text-navy pr-4">{q}</span>
        <span className={`text-accent text-xl flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'max-h-[300px] pb-5' : 'max-h-0'}`}
      >
        <p className="text-[0.88rem] text-navy-mid leading-[1.8] font-light">{a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  return (
    <section id="faq" className="bg-off-white py-24 px-6 md:px-16">
      <div className="max-w-[720px] mx-auto">
        <FadeUp>
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-5 h-px bg-accent" />
            <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-accent">Common Questions</span>
          </div>
          <h2 className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] text-navy tracking-[-0.02em] mb-10">
            Everything you need<br /><em className="italic text-accent">to know.</em>
          </h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div>
            {faqs.map(({ q, a }) => (
              <FAQItem key={q} q={q} a={a} />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
