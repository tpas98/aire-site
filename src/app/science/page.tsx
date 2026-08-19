import Link from "next/link"
import Image from "next/image"

const evidence = [
  {
    name: "L-Theanine",
    claim:
      "Promotes a relaxed but alert state. In human studies, L-theanine has been associated with increased alpha-wave activity in the brain — an EEG pattern linked to relaxed alertness rather than drowsiness.",
    cite: "Nobre AC, Rao A, Owen GN. L-theanine, a natural constituent in tea, and its effect on mental state. Asia Pac J Clin Nutr. 2008;17(S1):167–168.",
    pmid: "18296328",
  },
  {
    name: "Rhodiola Rosea",
    claim:
      "In a double-blind, placebo-controlled crossover trial, a standardized rhodiola extract (SHR-5) was associated with reduced stress-induced fatigue and improved mental performance in healthy physicians working night duty.",
    cite: "Darbinyan V, et al. Rhodiola rosea in stress induced fatigue — a double blind cross-over study of a standardized extract SHR-5 on the mental performance of healthy physicians during night duty. Phytomedicine. 2000;7(5):365–371.",
    pmid: "11081987",
  },
  {
    name: "Saffron (Affron®)",
    claim:
      "Affron® is a patented, standardized Crocus sativus extract studied in randomized, double-blind, placebo-controlled trials for its effects on mood and general wellbeing in adults, including adults experiencing low mood.",
    cite: "Lopresti AL, et al. An Examination into the Effects of a Saffron Extract (Affron) on Mood and General Wellbeing in Adults Experiencing Low Mood: A Randomized, Double-Blind, Placebo-Controlled Trial. J Nutr. 2025.",
    pmid: "40414301",
  },
  {
    name: "L-Tyrosine",
    claim:
      "A review of the human literature found that tyrosine supplementation tends to support cognitive performance specifically under stress or high cognitive demand — when neurotransmitter turnover is elevated — rather than producing a general effect at rest.",
    cite: "Jongkees BJ, Hommel B, Kühn S, Colzato LS. Effect of tyrosine supplementation on clinical and healthy populations under stress or cognitive demands — A review. J Psychiatr Res. 2015;70:50–57.",
    pmid: "26424423",
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'The Science Behind Aire',
  url: 'https://airepouches.com/science',
  description: 'Published human research behind each Aire ingredient, with citations and stated limitations.',
  publisher: { '@type': 'Organization', name: 'Aire', url: 'https://airepouches.com' },
  citation: evidence.map((e) => ({
    '@type': 'ScholarlyArticle',
    name: e.cite,
    url: `https://pubmed.ncbi.nlm.nih.gov/${e.pmid}/`,
  })),
}

export const metadata = {
  title: "The Science Behind Aire | Research on L-Theanine, Rhodiola, Saffron & L-Tyrosine",
  description:
    "The published human research behind each Aire ingredient — with PubMed citations and an honest account of what the evidence does and does not show.",
  alternates: { canonical: 'https://airepouches.com/science' },
  openGraph: {
    title: "The Science Behind Aire",
    description: "Human research per ingredient, with citations and stated limitations.",
    images: ['/images/three-cans-full-frame-2026.png'],
  },
}

export default function SciencePage() {
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
        <h1 className="font-serif text-[2.4rem] text-navy mb-2">The science behind Aire</h1>
        <p className="text-muted mb-12">What the research shows — and what it doesn&apos;t.</p>

        <div className="space-y-10">
          <section>
            <p>
              Aire contains four active ingredients. Below is what the published human research actually shows
              for each one, followed by a plain account of what that evidence does <em>not</em> establish.†
            </p>
          </section>

          {evidence.map((e) => (
            <section key={e.name}>
              <h2 className="font-serif text-[1.4rem] text-navy mb-3">{e.name}</h2>
              <p className="mb-3">{e.claim}†</p>
              <p className="text-[0.8rem] text-muted">
                {e.cite}{' '}
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${e.pmid}/`}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  PMID {e.pmid}
                </a>
              </p>
            </section>
          ))}

          <section className="bg-off-white rounded-xl p-6 md:p-8">
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">What this evidence does and does not show</h2>
            <p className="mb-4">
              We would rather state the limits plainly than let the citations imply more than they support.
            </p>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                These studies tested the <strong className="text-navy">individual ingredients</strong>,
                generally as oral capsules or tablets. None of them tested Aire, and none tested this
                specific combination.
              </li>
              <li>
                Study doses often differ from the amount delivered by a single pouch. Ingredient research is
                the rationale for the formula, not a claim about the finished product.
              </li>
              <li>
                Aire is absorbed buccally — through gum tissue — which is a different route of administration
                than the oral capsules used in most of this research.
              </li>
              <li>
                Aire is a <strong className="text-navy">dietary supplement</strong>. It is not a drug, not a
                nicotine replacement therapy, and not a smoking or nicotine cessation product.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Before you use Aire</h2>
            <p>
              Consult your healthcare provider before use if you are pregnant, nursing, taking medication, or
              managing a medical condition — particularly SSRIs, anti-anxiety medication, or blood thinners.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">See the amounts</h2>
            <p>
              Per-pouch amounts for every active are published on the{' '}
              <Link href="/ingredients" className="text-accent hover:underline">ingredients page</Link>.
            </p>
          </section>
        </div>

        <p className="mt-12 text-[0.72rem] text-muted leading-relaxed">
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
