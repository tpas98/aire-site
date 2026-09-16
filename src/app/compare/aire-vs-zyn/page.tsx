import Link from "next/link"
import Image from "next/image"

import { CHECKOUT_URL } from '@/lib/checkout'

const rows: [string, string, string][] = [
  ["Nicotine", "None", "3mg or 6mg per pouch"],
  ["Caffeine", "None", "None"],
  ["Active ingredients", "L-Theanine, Rhodiola Rosea, Saffron (Affron®), L-Tyrosine", "Nicotine, flavoring, sweetener"],
  ["Addiction potential", "Non-habit-forming", "Nicotine is addictive"],
  ["Use before bed", "Yes — no stimulant", "Nicotine is a stimulant and can disrupt sleep"],
  ["What it's for", "Calm, mood, and stress resilience†", "Nicotine delivery"],
  ["Regulatory category", "Dietary supplement", "Tobacco-derived nicotine product"],
  ["Age restriction", "Adults", "21+ in the United States"],
  ["Pouches per can", "15", "15"],
  ["Price", "$45.99 per 4-pack (60 pouches)", "Varies by retailer"],
]

const faqs = [
  {
    q: "Does Aire contain any nicotine?",
    a: "No. Aire contains zero nicotine and zero tobacco.",
  },
  {
    q: "Will Aire keep me awake the way Zyn can?",
    a: "No. Aire contains no nicotine and no caffeine, so there is no stimulant to disrupt sleep. Many customers use it in the evening.",
  },
  {
    q: "Can I use Aire alongside nicotine pouches?",
    a: "Yes. Many customers alternate between the two while reducing nicotine use. Aire does not interact with nicotine.",
  },
  {
    q: "Is Aire a way to quit Zyn?",
    a: "Aire is not a nicotine replacement therapy and is not approved as a cessation product. It contains no nicotine, so it does not treat withdrawal. What it offers is the same ritual and format without the nicotine. If you are trying to quit nicotine, talk to a healthcare provider about approaches with clinical evidence behind them.",
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export const metadata = {
  title: "Aire vs. Zyn: A Nicotine-Free Pouch Compared | Aire",
  description:
    "How Aire compares to Zyn nicotine pouches: ingredients, addiction potential, sleep impact, and who each is for. Aire contains zero nicotine and zero caffeine.",
  alternates: { canonical: 'https://airepouches.com/compare/aire-vs-zyn' },
  openGraph: {
    title: "Aire vs. Zyn",
    description: "A nicotine-free pouch compared to Zyn, honestly.",
    images: ['/images/three-cans-full-frame-2026.png'],
  },
}

export default function AireVsZynPage() {
  return (
    <div className="min-h-screen bg-white text-navy-mid font-sans text-[0.97rem] leading-relaxed">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <header className="flex items-center justify-between px-6 md:px-16 py-6 border-b border-navy/10">
        <Link href="/">
          <Image src="/images/logo.png" alt="Aire" width={90} height={36} style={{ mixBlendMode: 'multiply' }} />
        </Link>
        <Link href="/" className="text-sm text-accent hover:underline">← Back to Home</Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 md:px-16 py-16">
        <h1 className="font-serif text-[2.4rem] text-navy mb-2">Aire vs. Zyn</h1>
        <p className="text-muted mb-12">Same format. Almost nothing else in common.</p>

        <div className="space-y-10">
          <section>
            <p>
              <strong className="text-navy">The short answer:</strong> Zyn is a nicotine pouch. Aire is not —
              it contains no nicotine and no caffeine, and it is not designed to deliver a stimulant. They
              share a format and very little else. If you want a pouch without nicotine, Aire is the direct
              substitute in that format.†
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-4">Side by side</h2>
            <div className="overflow-x-auto border border-navy/15 rounded-xl">
              <table className="w-full text-left text-[0.86rem]">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="py-3 px-4 font-semibold"> </th>
                    <th className="py-3 px-4 font-semibold">Aire</th>
                    <th className="py-3 px-4 font-semibold">Zyn</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, aire, zyn], i) => (
                    <tr key={label} className={i % 2 ? 'bg-off-white' : 'bg-white'}>
                      <td className="py-3 px-4 font-semibold text-navy align-top">{label}</td>
                      <td className="py-3 px-4 align-top">{aire}</td>
                      <td className="py-3 px-4 align-top">{zyn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Who each one is for</h2>
            <p className="mb-4">
              <strong className="text-navy">Zyn</strong> is for adults who want nicotine without smoking or
              chewing tobacco. It is a nicotine product and carries nicotine&apos;s risks, including dependence.
            </p>
            <p>
              <strong className="text-navy">Aire</strong> is for people who like the pouch format but do not
              want a stimulant — whether they are cutting back on nicotine, avoiding caffeine, or simply want
              something they can use in the evening without affecting sleep.†
            </p>
          </section>

          {faqs.map(({ q, a }) => (
            <section key={q}>
              <h2 className="font-serif text-[1.4rem] text-navy mb-3">{q}</h2>
              <p>{a}</p>
            </section>
          ))}

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Try Aire</h2>
            <p className="mb-5">
              60 pouches for $45.99. Free shipping on orders over $50. See the{' '}
              <Link href="/ingredients" className="text-accent hover:underline">full ingredient amounts</Link>{' '}
              and <Link href="/science" className="text-accent hover:underline">the research</Link> first if
              you&apos;d like.
            </p>
            <a
              href={CHECKOUT_URL}
              className="inline-block bg-navy text-white px-8 py-4 rounded-full text-[0.8rem] font-semibold tracking-[0.08em] uppercase hover:bg-accent transition-colors duration-200"
            >
              Order a 4-Pack — $45.99
            </a>
          </section>
        </div>

        <p className="mt-12 text-[0.72rem] text-muted leading-relaxed">
          Zyn is a trademark of its respective owner and is not affiliated with Aire. Comparison information is
          based on publicly available product information.
        </p>
        <p className="mt-3 text-[0.72rem] text-muted leading-relaxed">
          † These statements have not been evaluated by the Food and Drug Administration. This product is not
          intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>

      <footer className="border-t border-navy/10 px-6 md:px-16 py-8 text-center">
        <p className="text-[0.72rem] text-muted">© 2026 Aire. All rights reserved. · <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link> · <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></p>
      </footer>
    </div>
  )
}
