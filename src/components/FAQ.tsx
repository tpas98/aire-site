'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Eyebrow from './ui/Eyebrow'
import SectionHeading from './ui/SectionHeading'
import { fadeUpWithDelay, EASE } from '@/lib/motion'

const faqs = [
  {
    q: 'What is Aire?',
    a: 'Aire is a premium oral pouch designed to support individuals in finding calmness, clarity, and mental presence.† Each pouch contains 4 science-backed ingredients: L-Theanine, Rhodiola Rosea, L-Tyrosine, and Saffron, working together to support mood, mental clarity, and stress resilience.† 100% nicotine-free and caffeine-free.',
  },
  {
    q: 'What does it taste like?',
    a: 'Aire comes in Calm Mint, a smooth, refreshing mint flavor that\'s not overpowering. It\'s designed to be pleasant and subtle so you can use it comfortably throughout the day.',
  },
  {
    q: 'How quickly does it work?',
    a: 'Most people feel the effects within 5–15 minutes. Place the pouch between your upper lip and gum. The botanicals and adaptogens absorb through your gum tissue. A gentle tingle lets you know it\'s working. Enjoy for up to 60 minutes.',
  },
  {
    q: 'Is Aire a nicotine replacement?',
    a: 'Aire is not marketed as a nicotine replacement therapy. It\'s a wellness pouch for anyone who wants support in finding their balance, whether you\'re replacing a nicotine habit or simply looking for a healthier daily ritual. Many customers are former Zyn and nicotine pouch users who wanted a clean alternative.',
  },
  {
    q: 'How many pouches can I use per day?',
    a: 'We recommend 4–6 pouches throughout the day. No nicotine or caffeine means no crash, dependency risk, or sleep consequences.',
  },
  {
    q: 'What\'s your return policy?',
    a: 'Because our pouches are a consumable wellness product, we don\'t accept returns or exchanges. If your order arrives damaged, defective, or incorrect, email us at hello@airepouches.com within 7 days of delivery and we\'ll send a free replacement or full refund.',
  },
  {
    q: 'Where do you ship?',
    a: 'We currently ship within the United States. Most orders ship within 1–2 business days and arrive within 3–5 business days. Free shipping on orders over $50.',
  },
  {
    q: 'What\'s in a can? And what\'s in a pouch?',
    a: 'supplement-facts',
  },
]

function SupplementFacts() {
  return (
    <div className="text-[0.88rem] text-navy-mid leading-[1.8] font-light">
      <p className="mb-4">Each can of Aire contains 15 pouches. Here are the full supplement facts per pouch:</p>
      <div className="border border-navy/20 rounded-xl overflow-hidden mb-4 max-w-[420px]">
        <div className="bg-navy text-white px-4 py-3">
          <div className="text-[0.95rem] font-bold tracking-wide">Supplement Facts</div>
          <div className="text-[0.72rem] text-white/70 mt-0.5">Serving Size: 1 Pouch &nbsp;|&nbsp; Servings Per Container: 15</div>
        </div>
        <div className="bg-white">
          <div className="grid grid-cols-[1fr_auto] px-4 py-2 border-b-2 border-navy/30 text-[0.72rem] font-bold text-navy uppercase tracking-wide">
            <span>Amount Per Serving</span>
            <span>% DV</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] px-4 py-2.5 border-b border-navy/10 text-[0.82rem]">
            <div>
              <span className="font-bold text-navy">AireComplex Blend</span>
            </div>
            <span className="text-navy-mid">*</span>
          </div>
          <div className="px-4 py-2 text-[0.75rem] text-navy-mid border-b border-navy/10 pl-8">
            L-Theanine, Rhodiola Rosea Extract, L-Tyrosine, Saffron
          </div>
          <div className="px-4 py-2.5 text-[0.7rem] text-navy-mid leading-relaxed">
            <p>*Daily Value (DV) not established</p>
          </div>
        </div>
      </div>
      <p className="text-[0.78rem] text-navy-mid"><strong className="text-navy">Other Ingredients:</strong> Microcrystalline Cellulose, Mint Extract, Menthol, Leaf Alcohol, Sweetener, Malitol, Cooling Agent</p>
    </div>
  )
}

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const isSupplementFacts = a === 'supplement-facts'
  return (
    <div className="border-b border-sky-deep/15">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="font-serif text-[1.05rem] md:text-[1.15rem] text-navy pr-4">{q}</span>
        <span
          className="text-accent text-xl flex-shrink-0"
          style={{
            display: 'inline-block',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: `transform 0.3s cubic-bezier(${EASE.join(',')})`,
          }}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6">
              {isSupplementFacts ? (
                <SupplementFacts />
              ) : (
                <p className="text-[0.88rem] text-navy-mid leading-[1.8] font-light">{a}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" data-morph data-morph-key="faq" className="bg-off-white pt-16 pb-24 px-6 md:px-16">
      <div className="max-w-[760px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Eyebrow className="mb-5">Common Questions</Eyebrow>
          <motion.div variants={fadeUpWithDelay(0)}>
            <SectionHeading className="text-[clamp(1.9rem,3vw,2.8rem)] leading-[1.15] tracking-[-0.02em] mb-10">
              Everything you need<br /><em>to know.</em>
            </SectionHeading>
          </motion.div>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpWithDelay(0.1)}
        >
          <div>
            {faqs.map(({ q, a }, i) => (
              <FAQItem
                key={q}
                q={q}
                a={a}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
          <p className="mt-8 text-[0.68rem] text-muted leading-relaxed">
            † These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
