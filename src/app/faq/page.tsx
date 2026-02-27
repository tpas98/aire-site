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
            <p>Aire is a premium wellness oral pouch designed for calm focus. Each pouch contains 5 science-backed ingredients — L-Theanine, Rhodiola Rosea, Methylfolate, Vitamin B6, and Affron® Saffron — that work together to support mood, mental clarity, and stress resilience. Aire is 100% nicotine-free and caffeine-free.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">How do I use Aire pouches?</h2>
            <p>Place one pouch between your upper lip and gum. Leave it in for 20–40 minutes while the ingredients absorb. No chewing required — just place it and go about your day. Most people feel the effects within 5–15 minutes.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">How many pouches are in each can?</h2>
            <p>Each can of Aire Flow Pouches contains 15 pouches. A 4-pack ($39.99) gives you 60 pouches total.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">What does Aire taste like?</h2>
            <p>Aire Flow Pouches come in Calm Mint — a smooth, refreshing mint flavor that&apos;s not overpowering. It&apos;s designed to be pleasant and subtle so you can use it comfortably throughout the day.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Is Aire a nicotine replacement or cessation product?</h2>
            <p>Aire is not marketed as a nicotine replacement therapy or smoking cessation product. It&apos;s a wellness pouch designed for anyone looking for calm focus — whether you&apos;re replacing a nicotine habit or simply looking for a healthier daily ritual. Many of our customers are former Zyn and nicotine pouch users who wanted a clean alternative.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">What are the active ingredients?</h2>
            <p>Each Aire pouch contains five active ingredients: L-Theanine (75mg) for calm alertness, Rhodiola Rosea for stress resilience, Methylfolate (active B9) for neurotransmitter support, Vitamin B6 in its active P-5-P form for serotonin and dopamine synthesis, and Affron® — a patented saffron extract clinically shown to support mood balance.</p>
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
            <p>We recommend using 4–6 pouches throughout the day for best results. Use one in the morning for a focused start, another mid-morning to stay locked in, one after lunch to power through the afternoon, and one in the evening to unwind. Do not exceed 5 pouches per day. There&apos;s no nicotine or caffeine, so there&apos;s no crash or dependency risk.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Where do you ship?</h2>
            <p>We currently ship within the United States only. For full details on shipping times and our return policy, visit our <Link href="/shipping" className="text-accent hover:underline">Shipping &amp; Returns</Link> page.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">How do I contact Aire?</h2>
            <p>Have a question that&apos;s not covered here? Reach out to us at <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a> and we&apos;ll get back to you within 24–48 hours.</p>
          </section>

        </div>
      </div>

      <footer className="border-t border-navy/10 px-6 md:px-16 py-8 text-center">
        <p className="text-[0.72rem] text-muted">© 2026 Aire. All rights reserved. — <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link> · <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></p>
      </footer>
    </div>
  )
}
