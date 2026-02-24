import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Privacy Policy — Aire',
  description: 'Privacy Policy for Aire wellness pouches.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-off-white">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-sky-deep/20 px-6 md:px-16 h-[64px] flex items-center justify-between">
        <Link href="/">
          <Image src="/images/logo.png" alt="Aire" width={120} height={40} className="h-7 w-auto" style={{ mixBlendMode: 'multiply' }} />
        </Link>
        <Link href="/" className="text-[0.78rem] font-medium text-navy-mid hover:text-accent transition-colors duration-200">
          ← Back to Home
        </Link>
      </nav>
      <div className="max-w-[780px] mx-auto px-6 py-20">
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-navy tracking-[-0.02em] mb-3">Privacy Policy</h1>
        <p className="text-[0.85rem] text-muted mb-12">Last updated: February 2026</p>

        <div className="prose prose-slate max-w-none space-y-10 text-[0.95rem] text-navy-mid leading-[1.85]">

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">1. Introduction</h2>
            <p>Aire ("we," "our," or "us") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or purchase our products. Please read this policy carefully.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, shipping address, billing address, and phone number when you place an order.</li>
              <li><strong>Payment Information:</strong> Credit card or payment details processed securely through our payment processor. We do not store full payment card details.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our website, including IP address, browser type, pages visited, and time spent on pages.</li>
              <li><strong>Communications:</strong> Any messages or inquiries you send us directly.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to customer service inquiries</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and product offerings</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">4. Sharing Your Information</h2>
            <p>We do not sell your personal information. We may share your information with trusted third parties only as necessary to operate our business, including:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Shipping and fulfillment partners to deliver your orders</li>
              <li>Payment processors to handle transactions securely</li>
              <li>Analytics providers to help us understand website usage</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">5. Cookies</h2>
            <p>We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences. Disabling cookies may affect certain features of our website.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">6. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">7. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">8. Children's Privacy</h2>
            <p>Our website and products are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date. Your continued use of our website after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us at <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a>.</p>
          </section>

        </div>
      </div>
      <footer className="border-t border-navy/10 px-6 md:px-16 py-8 text-center">
        <p className="text-[0.72rem] text-muted">© 2026 Aire. All rights reserved. — <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></p>
      </footer>
    </div>
  )
}
