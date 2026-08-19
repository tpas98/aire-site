import Link from "next/link"
import Image from "next/image"

// TODO: add founders here and the section renders automatically.
const founders: { name: string; role: string; bio: string }[] = []

const schema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: 'https://airepouches.com/about',
  mainEntity: {
    '@type': 'Organization',
    name: 'Aire',
    legalName: 'Drifts LLC',
    url: 'https://airepouches.com',
    email: 'hello@airepouches.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'New York',
      addressRegion: 'NY',
      addressCountry: 'US',
    },
  },
}

export const metadata = {
  title: "About Aire | Nicotine-Free Wellness Pouches by Drifts LLC",
  description:
    "Aire is a nicotine-free, caffeine-free wellness pouch made by Drifts LLC in New York. Why we built it, what we believe, and what we won't do.",
  alternates: { canonical: 'https://airepouches.com/about' },
  openGraph: {
    title: "About Aire",
    description: "Why we built a pouch with no nicotine and no caffeine.",
    images: ['/images/three-cans-full-frame-2026.png'],
  },
}

export default function AboutPage() {
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
        <h1 className="font-serif text-[2.4rem] text-navy mb-2">About Aire</h1>
        <p className="text-muted mb-12">Built for the gap nobody filled.</p>

        <div className="space-y-10">
          <section>
            <p>
              Aire makes nicotine-free, caffeine-free wellness pouches. The company is Drifts LLC, based in
              New York, NY. We sell direct at airepouches.com and ship within the United States.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Why we built it</h2>
            <p className="mb-4">
              Every pouch on the market was one of three things: nicotine-loaded and addictive, caffeine-heavy
              and anxiety-inducing, or a single-note nootropic aimed only at focus. None of them worked across
              a whole day without a trade-off you eventually pay for.
            </p>
            <p>
              So we built Aire from scratch — a pouch for people who want to stay grounded without dependency
              and without a crash. Four active ingredients, published amounts, no proprietary blend.†
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">What we won&apos;t do</h2>
            <ul className="list-disc pl-5 space-y-3">
              <li>
                We don&apos;t market Aire as a nicotine cessation product. It&apos;s a dietary supplement, and
                we say so everywhere.
              </li>
              <li>
                We don&apos;t hide doses behind a proprietary blend. Every active and its amount is published
                on the <Link href="/ingredients" className="text-accent hover:underline">ingredients page</Link>.
              </li>
              <li>
                We don&apos;t overstate the research. Our{' '}
                <Link href="/science" className="text-accent hover:underline">science page</Link> lists the
                studies behind each ingredient <em>and</em> what they don&apos;t establish.
              </li>
            </ul>
          </section>

          {founders.length > 0 && (
            <section>
              <h2 className="font-serif text-[1.4rem] text-navy mb-4">Who&apos;s behind Aire</h2>
              <div className="space-y-5">
                {founders.map((f) => (
                  <div key={f.name}>
                    <h3 className="text-navy font-semibold">{f.name} — {f.role}</h3>
                    <p className="mt-1">{f.bio}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section id="contact">
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Contact</h2>
            <p>
              Email <a href="mailto:hello@airepouches.com" className="text-accent hover:underline">hello@airepouches.com</a>.
              We reply to most messages within one business day. Aire is made by Drifts LLC, New York, NY,
              United States.
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
