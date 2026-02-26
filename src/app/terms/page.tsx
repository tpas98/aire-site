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
            <p>By accessing or using the Aire website and/or purchasing our products, you agree to be legally bound by these Terms of Service and our Privacy Policy, which is incorporated herein by reference. If you do not agree to these terms, you must not use our website or purchase our products. These Terms of Service constitute a binding legal agreement between you and Aire.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">2. Products and Health Disclaimer</h2>
            <p>Aire Flow Pouches are wellness lifestyle products. <strong>THE FOLLOWING STATEMENTS HAVE NOT BEEN EVALUATED BY THE U.S. FOOD AND DRUG ADMINISTRATION. AIRE PRODUCTS ARE NOT INTENDED TO DIAGNOSE, TREAT, CURE, OR PREVENT ANY DISEASE OR MEDICAL CONDITION.</strong> Results may vary. Individual results are not guaranteed.</p>
            <p className="mt-3">Our products are intended for use by adults aged 18 and older. Do not use if you are pregnant or nursing. If you have any pre-existing medical conditions, are taking prescription medications, or have concerns about using dietary supplement ingredients, consult a qualified healthcare provider before use. Keep out of reach of children.</p>
            <p className="mt-3">By purchasing Aire products, you acknowledge that you have read and understood this health disclaimer and that Aire makes no health claims beyond what is expressly stated and legally permitted.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">3. Eligibility</h2>
            <p>By placing an order, you represent and warrant that: (a) you are at least 18 years of age; (b) you have the legal capacity to enter into a binding contract; (c) all information you provide is accurate, current, and complete; and (d) your use of our website and products complies with all applicable laws and regulations in your jurisdiction. We reserve the right to refuse service, cancel orders, or terminate accounts at our sole discretion.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">4. Orders, Pricing, and Payment</h2>
            <p>By placing an order, you offer to purchase the product(s) at the listed price, subject to acceptance by Aire. We reserve the right to refuse or cancel any order for any reason, including suspected fraud, inaccurate pricing, or product unavailability. Prices are listed in U.S. dollars and are subject to change without notice. Payment is due in full at the time of purchase.</p>
            <p className="mt-3">If we cancel your order after payment has been processed, we will issue a full refund to your original payment method within 5–10 business days.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">5. Shipping and Delivery</h2>
            <p>We ship to addresses within the fifty (50) United States only. Delivery timelines are estimates only and are not guaranteed. Aire is not responsible for delays caused by shipping carriers, natural disasters, inclement weather, or other circumstances beyond our reasonable control. Risk of loss and title for products purchased from Aire pass to you upon delivery to the carrier.</p>
            <p className="mt-3">We are not liable for orders shipped to incorrectly entered addresses. Please verify your shipping address carefully before completing your purchase.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">6. Returns and Refunds</h2>
            <p>If you are not fully satisfied with your purchase, contact us at <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a> within 30 days of the delivery date. To be eligible for a return, products must be unopened, unused, and in their original, undamaged packaging. Aire reserves the right to deny returns that do not meet these criteria.</p>
            <p className="mt-3">Approved returns will receive a refund to the original payment method within 5–10 business days of our receipt of the returned product. Return shipping costs are the customer&apos;s responsibility unless the return is due to our error (e.g., incorrect or defective product). Original shipping charges are non-refundable.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">7. Intellectual Property</h2>
            <p>All content on this website, including without limitation text, graphics, images, logos, button icons, audio clips, data compilations, and software, is the exclusive property of Aire or its content suppliers and is protected by United States and international copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to access and use this website for personal, non-commercial purposes only.</p>
            <p className="mt-3">You may not reproduce, duplicate, copy, sell, resell, or otherwise exploit any portion of this website or its content for commercial purposes without our express written permission. The Aire name, logo, and all related product names, design marks, and slogans are trademarks of Aire. Unauthorized use of any Aire trademark is strictly prohibited.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">8. Product Safety, Known Risks, and Assumption of Risk</h2>
            <p>Please read this section carefully before using Aire Flow Pouches. By purchasing and using our products, you acknowledge and accept the following:</p>

            <h3 className="font-serif text-[1.1rem] text-navy mt-6 mb-2">8a. Proper Use</h3>
            <p>Aire Flow Pouches are designed to be placed between the cheek and gum, or upper lip and gum, for a limited duration only. <strong>DO NOT swallow the pouch.</strong> DO NOT chew, tear, or cut the pouch. Remove and discard the pouch after use. Do not use more than the recommended number of pouches per day as described on the product packaging. Consult the packaging insert for full usage instructions before use.</p>

            <h3 className="font-serif text-[1.1rem] text-navy mt-6 mb-2">8b. Choking and Aspiration Hazard</h3>
            <p><strong>CHOKING HAZARD:</strong> Aire Flow Pouches present a choking and aspiration risk if swallowed or inhaled. Keep products out of reach of children and pets at all times. Do not use this product while sleeping, immediately before sleeping, or in any situation where you may be unable to consciously control retention of the pouch in your mouth. Do not use this product if you have difficulty swallowing, a history of choking incidents, or any condition affecting your ability to safely retain a small object in your mouth. In the event of accidental ingestion or if you experience difficulty breathing, call 911 or your local emergency services immediately and contact Poison Control at <strong>1-800-222-1222</strong>.</p>

            <h3 className="font-serif text-[1.1rem] text-navy mt-6 mb-2">8c. Allergic Reactions and Adverse Effects</h3>
            <p>Our products contain botanical extracts and supplement ingredients including L-Theanine, Rhodiola Rosea, Methylfolate (5-MTHF), Vitamin B6 (Pyridoxal-5-Phosphate), and Affron® Saffron Extract. Individuals may have unknown sensitivities or allergies to one or more of these ingredients. Potential adverse effects may include, but are not limited to, oral irritation or sensitivity at the site of use, allergic reaction (including rash, hives, swelling, or difficulty breathing), nausea, headache, or interactions with prescription medications. <strong>DISCONTINUE USE IMMEDIATELY</strong> and seek medical attention if you experience any adverse reaction.</p>

            <h3 className="font-serif text-[1.1rem] text-navy mt-6 mb-2">8d. Voluntary Assumption of Risk</h3>
            <p>BY PURCHASING AND USING AIRE PRODUCTS, YOU VOLUNTARILY ASSUME ALL RISKS ASSOCIATED WITH THEIR USE, INCLUDING BUT NOT LIMITED TO THE RISKS OF CHOKING, ASPIRATION, ALLERGIC REACTION, ADVERSE EFFECTS FROM SUPPLEMENT INGREDIENTS, AND INTERACTIONS WITH MEDICATIONS OR EXISTING HEALTH CONDITIONS. You acknowledge that you have read and understood all product warnings and instructions, that you have consulted a healthcare provider if you have any relevant health condition, and that you are using the product voluntarily and at your own risk.</p>
            <p className="mt-3">Aire shall not be liable for any injury, illness, adverse reaction, or other harm resulting from: (a) use of the product in a manner inconsistent with product labeling or these Terms; (b) pre-existing medical conditions or undisclosed allergies; (c) use by individuals under 18 years of age; (d) failure to discontinue use upon experiencing adverse effects; or (e) misuse, modification, or storage of the product in a manner inconsistent with our instructions.</p>

            <h3 className="font-serif text-[1.1rem] text-navy mt-6 mb-2">8e. Not a Substitute for Medical Care</h3>
            <p>Aire products are not a substitute for professional medical advice, diagnosis, or treatment. Nothing in our product labeling, website, or marketing materials constitutes medical advice. Always seek the guidance of a qualified healthcare provider with questions you may have regarding a medical condition or before starting any new supplement regimen.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">9. Prohibited Uses</h2>
            <p>You agree not to use our website or products to: (a) violate any applicable law or regulation; (b) transmit any spam, unsolicited communications, or malicious code; (c) impersonate Aire or any third party; (d) collect or harvest user data without consent; (e) engage in any activity that disrupts or interferes with the website&apos;s functionality; (f) purchase products for the purpose of unauthorized resale or distribution; or (g) make false or fraudulent purchase orders.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">10. Disclaimer of Warranties</h2>
            <p>THE WEBSITE AND ALL PRODUCTS AND SERVICES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, AIRE EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. AIRE DOES NOT WARRANT THAT THE WEBSITE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">11. Limitation of Liability</h2>
            <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, AIRE, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, SUPPLIERS, AND LICENSORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF (OR INABILITY TO USE) OUR WEBSITE, PRODUCTS, OR SERVICES — EVEN IF AIRE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
            <p className="mt-3">IN NO EVENT SHALL AIRE&apos;S TOTAL CUMULATIVE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR YOUR USE OF OUR PRODUCTS AND SERVICES EXCEED THE GREATER OF: (A) THE TOTAL AMOUNT YOU PAID TO AIRE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).</p>
            <p className="mt-3">Some jurisdictions do not allow the exclusion or limitation of incidental or consequential damages, so the above limitation may not apply to you.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">12. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless Aire, its officers, directors, employees, agents, and successors from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys&apos; fees) arising out of or in any way related to: (a) your use of or access to the website or products; (b) your violation of these Terms of Service; (c) your violation of any third-party rights, including intellectual property or privacy rights; or (d) any content you submit or transmit through our website.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">13. Force Majeure</h2>
            <p>Aire shall not be liable for any failure or delay in performance resulting from causes beyond our reasonable control, including but not limited to acts of God, natural disasters, pandemic, government actions, labor disputes, supply chain disruptions, internet or telecommunications outages, cyberattacks, or carrier failures. In such events, Aire will use commercially reasonable efforts to resume performance as soon as practicable.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">14. Governing Law and Jurisdiction</h2>
            <p>These Terms of Service and any dispute arising hereunder shall be governed by and construed in accordance with the laws of the State of Michigan, without regard to its conflict of law provisions. Subject to the binding arbitration clause below, you consent to the exclusive personal jurisdiction of the state and federal courts located in Michigan for any disputes not subject to arbitration.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">15. Binding Arbitration and Class Action Waiver</h2>
            <p><strong>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS.</strong></p>
            <p className="mt-3"><strong>AGREEMENT TO ARBITRATE:</strong> You and Aire agree that any dispute, claim, or controversy arising out of or relating to these Terms of Service, our Privacy Policy, or the purchase or use of Aire products (collectively, &ldquo;Dispute&rdquo;) shall be resolved exclusively through final and binding arbitration, rather than in court, except that either party may seek injunctive or other equitable relief in court for infringement or misuse of intellectual property rights.</p>
            <p className="mt-3"><strong>ARBITRATION PROCEDURES:</strong> Arbitration shall be conducted by the American Arbitration Association (AAA) under its Consumer Arbitration Rules, available at www.adr.org. The arbitration will take place in Michigan, or via telephone or video conference at either party&apos;s election. The arbitrator&apos;s award shall be final and binding and may be entered as a judgment in any court of competent jurisdiction.</p>
            <p className="mt-3"><strong>CLASS ACTION WAIVER:</strong> YOU AND AIRE AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, OR REPRESENTATIVE PROCEEDING. The arbitrator may not consolidate more than one person&apos;s claims and may not preside over any form of a class or representative proceeding.</p>
            <p className="mt-3"><strong>JURY TRIAL WAIVER:</strong> BY AGREEING TO ARBITRATION, BOTH PARTIES WAIVE THEIR RIGHT TO A JURY TRIAL.</p>
            <p className="mt-3"><strong>OPT-OUT:</strong> You may opt out of this arbitration agreement by sending written notice to <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a> within 30 days of your first purchase from Aire, with &ldquo;Arbitration Opt-Out&rdquo; in the subject line.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">16. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms of Service at any time at our sole discretion. When we make material changes, we will update the &ldquo;Last updated&rdquo; date and, where feasible, provide notice via email or website banner. Your continued use of our website or purchase of products after the effective date of any changes constitutes your acceptance of the updated Terms of Service.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">17. Severability</h2>
            <p>If any provision of these Terms of Service is held by a court or arbitrator to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable, while preserving the original intent of the parties.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">18. Entire Agreement</h2>
            <p>These Terms of Service, together with our Privacy Policy and any other agreements incorporated by reference, constitute the entire agreement between you and Aire with respect to your use of our website and purchase of our products, and supersede all prior and contemporaneous agreements, communications, and proposals, whether oral or written.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">19. Waiver</h2>
            <p>Aire&apos;s failure to enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision. A waiver of any provision will only be effective if made in writing and signed by an authorized representative of Aire.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">20. Contact Us</h2>
            <p>For questions about these Terms of Service, please contact us:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Email: <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a></li>
              {/* TODO: Add physical mailing address before launch — required for CAN-SPAM compliance */}
              <li>Mailing Address: [Address coming soon]</li>
            </ul>
          </section>

        </div>
      </div>
      <footer className="border-t border-navy/10 px-6 md:px-16 py-8 text-center">
        <p className="text-[0.72rem] text-muted">© 2026 Aire. All rights reserved. — <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></p>
      </footer>
    </div>
  )
}
