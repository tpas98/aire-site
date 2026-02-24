import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Terms of Service — Aire',
  description: 'Terms of Service for Aire wellness pouches.',
}

export default function TermsOfService() {
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
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-navy tracking-[-0.02em] mb-3">Terms of Service</h1>
        <p className="text-[0.85rem] text-muted mb-12">Last updated: February 2026</p>

        <div className="prose prose-slate max-w-none space-y-10 text-[0.95rem] text-navy-mid leading-[1.85]">

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the Aire website and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or purchase our products.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">2. Products and Health Disclaimer</h2>
            <p>Aire products are wellness lifestyle pouches and are not intended to diagnose, treat, cure, or prevent any disease or medical condition. These statements have not been evaluated by the Food and Drug Administration.</p>
            <p className="mt-3">Our products are intended for use by adults aged 18 and older. If you are pregnant, nursing, have a medical condition, or are taking medications, consult your healthcare provider before use.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">3. Orders and Payment</h2>
            <p>By placing an order, you represent that you are at least 18 years of age and that the information you provide is accurate and complete. We reserve the right to refuse or cancel any order at our discretion. Payment is due at the time of purchase.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">4. Shipping and Delivery</h2>
            <p>We ship to addresses within the United States. Delivery times are estimates and not guaranteed. Aire is not responsible for delays caused by shipping carriers, weather, or other circumstances beyond our control. Risk of loss passes to you upon delivery to the carrier.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">5. Returns and Refunds</h2>
            <p>If you are not satisfied with your purchase, please contact us within 30 days of receipt. We will work with you to resolve any issues. Returned products must be unopened and in original condition. Shipping costs for returns are the responsibility of the customer unless the return is due to our error.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">6. Intellectual Property</h2>
            <p>All content on this website, including text, images, logos, and design, is the property of Aire and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">7. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Aire shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our products or website. Our total liability shall not exceed the amount you paid for the product giving rise to the claim.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">8. Governing Law</h2>
            <p>These Terms of Service are governed by the laws of the United States and the state in which Aire is incorporated, without regard to conflict of law principles. Any disputes shall be resolved in the appropriate courts of that jurisdiction.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">9. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms of Service at any time. Changes will be effective upon posting to our website. Your continued use of our website after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">10. Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us at <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a>.</p>
          </section>

        </div>
      </div>
      <footer className="border-t border-navy/10 px-6 md:px-16 py-8 text-center">
        <p className="text-[0.72rem] text-muted">© 2026 Aire. All rights reserved. — <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></p>
      </footer>
    </div>
  )
}
