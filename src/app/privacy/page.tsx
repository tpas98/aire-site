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
            <p>Aire (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, place an order, or otherwise interact with us. Please read this policy carefully. By using our website or purchasing our products, you consent to the practices described herein.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Personal Information:</strong> Name, email address, shipping address, billing address, and phone number when you place an order or create an account.</li>
              <li><strong>Payment Information:</strong> Credit card or payment details processed securely through Shopify Payments and other third-party payment processors. We do not store full payment card details on our servers.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our website, including IP address, browser type and version, pages visited, referring URLs, and time spent on pages.</li>
              <li><strong>Device Information:</strong> Device identifiers, operating system, and browser settings.</li>
              <li><strong>Communications:</strong> Any messages, inquiries, or feedback you send us directly.</li>
              <li><strong>Marketing Preferences:</strong> Your preferences for receiving marketing communications from us.</li>
            </ul>
            <p className="mt-3">We collect information directly from you, automatically through cookies and tracking technologies, and from third-party service providers such as our e-commerce platform (Shopify) and analytics providers.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Process and fulfill your orders and send order confirmations, shipping updates, and receipts</li>
              <li>Respond to customer service inquiries and provide support</li>
              <li>Send marketing communications and promotional offers (with your consent — see Section 9 for opt-out)</li>
              <li>Improve our website, products, and customer experience</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Prevent fraud and enforce our Terms of Service</li>
              <li>Comply with applicable legal obligations</li>
              <li>Communicate changes to our products, policies, or terms</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">4. Sharing Your Information</h2>
            <p>We do not sell your personal information to third parties. We may share your information with trusted service providers only as necessary to operate our business, including:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>E-commerce and fulfillment platforms (e.g., Shopify) to process orders and manage our store</li>
              <li>Shipping and logistics carriers to deliver your orders</li>
              <li>Payment processors (e.g., Shopify Payments, Stripe) to handle transactions securely</li>
              <li>Email and marketing platforms to send order updates and promotional communications</li>
              <li>Analytics providers (e.g., Google Analytics) to help us understand website usage</li>
              <li>Legal and compliance advisors when required</li>
              <li>Law enforcement or regulatory authorities when required by applicable law, court order, or to protect our legal rights</li>
            </ul>
            <p className="mt-3">All service providers are contractually required to handle your data securely and only for the purposes we specify.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">5. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar tracking technologies on our website. Cookies are small text files stored on your device. We use the following types:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function, including shopping cart and checkout functionality. These cannot be disabled without affecting site functionality.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (e.g., Google Analytics). These are used in aggregate, anonymized form.</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track the effectiveness of marketing campaigns.</li>
            </ul>
            <p className="mt-3">You can control or disable cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our website. Most browsers also offer a &ldquo;Do Not Track&rdquo; option — please see Section 12 below.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">6. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include SSL/TLS encryption for data in transit, access controls limiting employee access to personal data, and use of PCI-DSS compliant payment processors. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
            <p className="mt-3">In the event of a data breach that is likely to result in a risk to your rights and freedoms, we will notify affected individuals and applicable regulatory authorities as required by law.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">7. Data Retention</h2>
            <p>We retain your personal information for the following periods:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Order and transaction data: 7 years (for tax and legal compliance purposes)</li>
              <li>Account information: For as long as your account is active, plus 2 years after closure</li>
              <li>Marketing preferences and email lists: Until you opt out or unsubscribe</li>
              <li>Customer support communications: 3 years</li>
              <li>Website usage data (analytics): Up to 26 months</li>
            </ul>
            <p className="mt-3">After the applicable retention period, we will securely delete or anonymize your personal information unless longer retention is required by law.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">8. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Right to Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Right to Deletion:</strong> Request deletion of your personal information, subject to certain exceptions</li>
              <li><strong>Right to Restrict Processing:</strong> Request that we limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to certain types of processing, including direct marketing</li>
              <li><strong>Right to Opt Out of Sale/Sharing:</strong> See California Rights section below</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us at <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a>. We will respond within 30 days (45 days for California residents). We may ask you to verify your identity before processing your request.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">9. Marketing Communications &amp; Opt-Out</h2>
            <p>We send marketing emails only with your consent. You may opt out of marketing communications at any time by:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Clicking the &ldquo;Unsubscribe&rdquo; link at the bottom of any marketing email</li>
              <li>Emailing us at <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a> with &ldquo;Unsubscribe&rdquo; in the subject line</li>
            </ul>
            <p className="mt-3">Opting out of marketing communications will not affect transactional communications related to your orders (order confirmations, shipping updates, etc.).</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">10. California Residents — CCPA/CPRA Rights</h2>
            <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA):</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Right to Know:</strong> You may request disclosure of the categories and specific pieces of personal information we have collected about you in the past 12 months, and the purposes for which it was used.</li>
              <li><strong>Right to Delete:</strong> You may request deletion of your personal information, subject to certain exceptions.</li>
              <li><strong>Right to Correct:</strong> You may request correction of inaccurate personal information.</li>
              <li><strong>Right to Opt Out of Sale or Sharing:</strong> We do not sell your personal information for monetary compensation. We do not share your personal information with third parties for cross-context behavioral advertising without your consent.</li>
              <li><strong>Right to Limit Use of Sensitive Personal Information:</strong> You may direct us to limit use of sensitive personal information to what is necessary to provide our products and services.</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA/CPRA rights.</li>
            </ul>
            <p className="mt-3">To submit a California privacy request, email <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a> with &ldquo;California Privacy Request&rdquo; in the subject line. We will acknowledge receipt within 10 business days and respond substantively within 45 days.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">11. California Shine the Light Disclosure</h2>
            <p>California Civil Code Section 1798.83 (&ldquo;Shine the Light&rdquo; law) permits California residents to request information about our disclosure of personal information to third parties for direct marketing purposes. We do not disclose personal information to third parties for their direct marketing purposes without your prior consent.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">12. Do Not Track</h2>
            <p>Some browsers include a &ldquo;Do Not Track&rdquo; (DNT) feature that signals to websites that you do not want your online activity tracked. Our website does not currently respond to DNT signals. You may control tracking through your cookie settings as described in Section 5.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">13. Children&apos;s Privacy</h2>
            <p>Our website and products are intended for individuals 18 years of age and older. We do not knowingly collect personal information from individuals under 18. If you are a parent or guardian and believe we have inadvertently collected personal information from a minor, please contact us immediately at <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a> and we will delete such information promptly.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">14. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make material changes, we will update the &ldquo;Last updated&rdquo; date at the top of this policy and, where feasible, notify you by email or prominent notice on our website prior to the change becoming effective. Your continued use of our website after the effective date constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">15. Contact Us</h2>
            <p>For questions, concerns, or to exercise your privacy rights, please contact us:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Email: <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a></li>
              {/* TODO: Add physical mailing address before launch — required for CAN-SPAM compliance */}
              <li>Mailing Address: [Address coming soon]</li>
            </ul>
          </section>

        </div>
      </div>
      <footer className="border-t border-navy/10 px-6 md:px-16 py-8 text-center">
        <p className="text-[0.72rem] text-muted">© 2026 Aire. All rights reserved. — <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></p>
      </footer>
    </div>
  )
}
