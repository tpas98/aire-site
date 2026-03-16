import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "FAQ — Aire",
  description: "Frequently asked questions about Aire wellness pouches.",
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white text-navy-mid font-sans text-[0.97rem] leading-relaxed">
      <header className="flex items-center justify-between px-6 md:px-16 py-6 border-b border-navy/10">
        <Link href="/">
          <Image src="/images/logo.png" alt="Aire" width={90} height={36} style={{ mixBlendMode: 'multiply' }} />
        </Link>
        <Link href="/" className="text-sm text-accent hover:underline">← Back to Home</Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 md:px-16 py-16">
        <h1 className="font-serif text-[2.4rem] text-navy mb-2">Frequently Asked Questions</h1>
        <p className="text-muted mb-12">Everything you need to know about Aire.</p>

        <div className="space-y-10">

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">What is Aire?</h2>
            <p>Aire is a premium oral pouch designed to support individuals in finding calmness, clarity, and mental presence.† Each pouch contains 4 science-backed ingredients — L-Theanine, Rhodiola Rosea, Vitamin B9, and Affron® Saffron — working together to support mood, mental clarity, and stress resilience.† 100% nicotine-free and caffeine-free.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">How do I use Aire pouches?</h2>
            <p>Most people feel the effects within 5–15 minutes. Place the pouch between your upper lip and gum. The botanicals and adaptogens absorb through your gum tissue. A gentle tingle lets you know it&apos;s working. Enjoy for up to 60 minutes.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">What&apos;s in a can? And what&apos;s in a pouch?</h2>
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
                    <span className="font-medium text-navy">Folate</span>
                    <span className="text-navy-mid"> (150 mcg L-Methylfolate)</span>
                    <span className="ml-2">255mcg DFE</span>
                  </div>
                  <span className="text-navy-mid">64%*</span>
                </div>
                <div className="grid grid-cols-[1fr_auto] px-4 py-2.5 border-b border-navy/10 text-[0.82rem]">
                  <div>
                    <span className="font-bold text-navy">AireComplex Blend</span>
                    <span className="ml-2">115mg</span>
                  </div>
                  <span className="text-navy-mid">**</span>
                </div>
                <div className="px-4 py-2 text-[0.75rem] text-navy-mid border-b border-navy/10 pl-8">
                  L-Theanine, Rhodiola Rosea Extract, Saffron (Affron®)
                </div>
                <div className="px-4 py-2.5 text-[0.7rem] text-navy-mid leading-relaxed">
                  <p>*Percent Daily Values (%DV) based on a 2,000-calorie diet</p>
                  <p>**Daily Value (DV) not established</p>
                </div>
              </div>
            </div>
            <p><strong className="text-navy">Other Ingredients:</strong> Microcrystalline Cellulose, Mint Extract, Menthol, Leaf Alcohol, Sweetener, Malitol, Cooling Agent</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">How many pouches are in each can?</h2>
            <p>Each can of Aire contains 15 pouches. A 4-pack ($45.99) gives you 60 pouches total.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">What does Aire taste like?</h2>
            <p>Aire comes in Calm Mint — a smooth, refreshing mint flavor that&apos;s not overpowering. It&apos;s designed to be pleasant and subtle so you can use it comfortably throughout the day.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Is Aire a nicotine replacement or cessation product?</h2>
            <p>Aire is not marketed as a nicotine replacement therapy. It&apos;s a wellness pouch for anyone who wants support in finding their balance — whether you&apos;re replacing a nicotine habit or simply looking for a healthier daily ritual. Many customers are former Zyn and nicotine pouch users who wanted a clean alternative.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">What are the active ingredients?</h2>
            <p>Each Aire pouch contains four active ingredients: L-Theanine for calm alertness,† Rhodiola Rosea for stress resilience,† Folate (active B9) for neurotransmitter support,† and Affron® — a patented saffron extract to support mood balance.†</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Are there any side effects?</h2>
            <p>Aire is made with well-studied, naturally derived ingredients and is generally well-tolerated. Some people may experience mild gum sensitivity when first using oral pouches. If you have any medical conditions, are pregnant or nursing, or take prescription medication, we recommend consulting your healthcare provider before use.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Is Aire FDA approved?</h2>
            <p>Aire is classified as a dietary supplement and is manufactured in an FDA-registered, GMP-certified facility. Like all dietary supplements, Aire has not been evaluated by the FDA to diagnose, treat, cure, or prevent any disease.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Can I use Aire with other supplements or medications?</h2>
            <p>While Aire&apos;s ingredients are generally considered safe, we recommend consulting your healthcare provider before combining with other supplements or medications — especially if you take SSRIs, anti-anxiety medication, or blood thinners.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">How many pouches can I use per day?</h2>
            <p>We recommend 4–6 pouches throughout the day. No nicotine or caffeine means no crash, dependency risk, or sleep consequences.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Where do you ship?</h2>
            <p>We currently ship within the United States. Most orders ship within 1–2 business days and arrive within 3–5 business days. Free shipping on orders over $50.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">How do I contact Aire?</h2>
            <p>Have a question that&apos;s not covered here? Reach out to us at <a href="mailto:hello@airepouches.com" className="text-accent hover:underline">hello@airepouches.com</a> and we&apos;ll get back to you within 24–48 hours.</p>
          </section>

        </div>

        <p className="mt-12 text-[0.72rem] text-muted leading-relaxed">
          † These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>

      <footer className="border-t border-navy/10 px-6 md:px-16 py-8 text-center">
        <p className="text-[0.72rem] text-muted">© 2026 Aire. All rights reserved. — <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link> · <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></p>
      </footer>
    </div>
  )
}
