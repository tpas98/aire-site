import Link from "next/link"
import Image from "next/image"

// No per-active milligrams: the can label declares only the 185 mg AireComplex
// Blend. Publish an individual amount only once it is on the label.
const actives = [
  {
    name: "L-Theanine",
    kind: "Amino acid",
    source: "Naturally found in green tea (Camellia sinensis)",
    detail:
      "Promotes a relaxed but alert mental state. In human studies it has been associated with increased alpha-wave activity, an EEG pattern linked to calm focus rather than drowsiness.",
  },
  {
    name: "Rhodiola Rosea",
    kind: "Adaptogenic herb",
    source: "Root extract of Rhodiola rosea",
    detail:
      "The one true adaptogen in the formula. Supports resilience to mental fatigue and stress, helping sustain clarity across a long day.",
  },
  {
    name: "Saffron (Affron®)",
    kind: "Botanical extract",
    source: "Patented, standardized extract of Crocus sativus",
    detail:
      "Supports mood and emotional balance. Affron® is one of the more rigorously studied saffron extracts, with multiple randomized placebo-controlled trials behind it.",
  },
  {
    name: "L-Tyrosine",
    kind: "Amino acid",
    source: "Produced by the body from phenylalanine",
    detail:
      "A precursor to dopamine and norepinephrine. Supports focus and motivation specifically under demanding or stressful conditions.",
  },
]

const other = [
  "Microcrystalline Cellulose",
  "Mint Extract",
  "Menthol",
  "Leaf Alcohol",
  "Maltitol (sweetener)",
  "Cooling Agent",
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Aire Ingredients & Dosages',
  url: 'https://airepouches.com/ingredients',
  description: 'The four actives in the 185 mg AireComplex Blend in every Aire nicotine-free, caffeine-free wellness pouch.',
  isPartOf: { '@type': 'WebSite', name: 'Aire', url: 'https://airepouches.com' },
}

export const metadata = {
  title: "Aire Ingredients | What's In a Nicotine-Free Wellness Pouch",
  description:
    "Full ingredient list for Aire wellness pouches: L-Theanine, Rhodiola Rosea, Affron® saffron and L-Tyrosine in a 185 mg blend per pouch. No nicotine, no caffeine.",
  alternates: { canonical: 'https://airepouches.com/ingredients' },
  openGraph: {
    title: "Aire Ingredients",
    description: "Every active in an Aire pouch: four ingredients in a 185 mg blend.",
    images: ['/images/three-cans-full-frame-2026.png'],
  },
}

export default function IngredientsPage() {
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
        <h1 className="font-serif text-[2.4rem] text-navy mb-2">What&apos;s in an Aire pouch</h1>
        <p className="text-muted mb-12">Four actives in one 185 mg blend. No nicotine, no caffeine.</p>

        <div className="space-y-10">
          <section>
            <p className="mb-4">
              Each Aire pouch contains the AireComplex Blend: 185 mg of four active ingredients,
              L-Theanine, Rhodiola Rosea, Saffron and L-Tyrosine. There is no nicotine, no caffeine and
              no sugar.†
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-5">The four actives</h2>
            <div className="space-y-7">
              {actives.map((a) => (
                <div key={a.name} className="border-l-2 border-sky-deep/50 pl-5">
                  <h3 className="text-navy font-semibold text-[1.05rem]">
                    {a.name}
                  </h3>
                  <p className="text-[0.8rem] text-muted mt-0.5">{a.kind} · {a.source}</p>
                  <p className="mt-2">{a.detail}†</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Other ingredients</h2>
            <ul className="list-disc pl-5 space-y-1">
              {other.map((o) => <li key={o}>{o}</li>)}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">What Aire does not contain</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>No nicotine</li>
              <li>No caffeine</li>
              <li>No sugar</li>
              <li>No tobacco</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">A note on terminology</h2>
            <p>
              Only Rhodiola Rosea is an adaptogen. L-Theanine and L-Tyrosine are amino acids, and saffron is a
              botanical extract. We mention this because the word &ldquo;adaptogen&rdquo; gets applied loosely
              across this category, and we would rather be precise than impressive.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Format and how to use</h2>
            <p className="mb-4">
              15 pouches per can, 4 cans per pack — 60 pouches total. Flavor: Calm Mint.
            </p>
            <p>
              Place one pouch between your upper lip and gum. No chewing needed. Ingredients absorb through gum
              tissue, and most people notice effects within 5–15 minutes. Enjoy for up to 60 minutes, then
              discard. Do not chew or swallow. We recommend 4–6 pouches throughout the day.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">The research behind each ingredient</h2>
            <p>
              Every claim above traces to published human research. We list the studies — and what they do
              <em> not</em> establish — on <Link href="/science" className="text-accent hover:underline">the science page</Link>.
            </p>
          </section>
        </div>

        <p className="mt-12 text-[0.72rem] text-muted leading-relaxed">
          † These statements have not been evaluated by the Food and Drug Administration. This product is not
          intended to diagnose, treat, cure, or prevent any disease. Aire is a dietary supplement, not a
          nicotine replacement therapy or cessation product.
        </p>
      </div>

      <footer className="border-t border-navy/10 px-6 md:px-16 py-8 text-center">
        <p className="text-[0.72rem] text-muted">© 2026 Aire. All rights reserved. · <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link> · <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></p>
      </footer>
    </div>
  )
}
