import Link from "next/link"
import Image from "next/image"
import Eyebrow from "@/components/ui/Eyebrow"

export const metadata = {
  title: "Shipping & Returns | Aire | Free Shipping Over $50",
  description: "Free shipping on orders over $50. Aire wellness pouches ship within 1–2 business days. Free replacements for damaged or defective items.",
  alternates: { canonical: 'https://www.airepouches.com/shipping' },
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white text-navy-mid font-sans text-[0.95rem] leading-[1.8]">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 h-16 bg-white/80 backdrop-blur-xl border-b border-navy/10">
        <Link href="/">
          <Image src="/images/logo.png" alt="Aire" width={90} height={36} style={{ mixBlendMode: 'multiply' }} className="h-7 w-auto" />
        </Link>
        <Link href="/" className="text-sm text-accent hover:underline">← Back to Home</Link>
      </header>

      <div className="max-w-[720px] mx-auto px-6 md:px-16 pt-32 pb-16">
        <Eyebrow className="mb-5">Policies</Eyebrow>
        <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] text-navy tracking-[-0.02em] mb-3">Shipping &amp; Returns</h1>
        <p className="text-muted mb-12">Simple, transparent policies. No fine print surprises.</p>

        <div className="space-y-10">

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Shipping</h2>
            <p className="mb-4">We currently ship to all 50 U.S. states. International shipping is not available at this time.</p>
            <p className="mb-4"><strong className="text-navy">Processing time:</strong> Orders are processed within 1–2 business days after payment is confirmed. You&apos;ll receive a confirmation email with tracking information once your order ships.</p>
            <p className="mb-4"><strong className="text-navy">Delivery time:</strong> Standard shipping takes 5–7 business days from the date of shipment. Delivery times may vary depending on your location and carrier conditions.</p>
            <p><strong className="text-navy">Shipping cost:</strong> Shipping rates are calculated at checkout based on your location and order size.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Order Tracking</h2>
            <p>Once your order ships, you&apos;ll receive an email with a tracking number. You can use this to monitor your delivery status. If you haven&apos;t received tracking information within 3 business days of placing your order, please contact us at <a href="mailto:hello@airepouches.com" className="text-accent hover:underline">hello@airepouches.com</a>.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Returns</h2>
            <p className="mb-4">Because our pouches are a consumable wellness product, we&apos;re unable to accept returns or exchanges, and opened products cannot be returned for hygiene reasons.</p>
            <p>If your order arrives damaged, defective, or incorrect, we&apos;ll make it right — see <strong className="text-navy">Damaged or Defective Products</strong> below.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Refunds</h2>
            <p className="mb-4">Refunds are issued only for damaged, defective, or incorrect items (see below). Once we confirm the issue, your refund is processed within 5–7 business days to the original payment method. Please allow an additional 3–5 business days for the refund to appear on your statement, depending on your bank or card issuer.</p>
            <p>Shipping costs are non-refundable unless the refund is due to a defective or incorrect product.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Damaged or Defective Products</h2>
            <p>If your order arrives damaged or you receive a defective product, please contact us within 7 days of delivery at <a href="mailto:hello@airepouches.com" className="text-accent hover:underline">hello@airepouches.com</a>. Include your order number and a photo of the issue, and we&apos;ll send a free replacement or issue a full refund. Your choice.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Lost Packages</h2>
            <p>If your tracking shows delivered but you haven&apos;t received your package, please check with neighbors and your building&apos;s mail area first. If you still can&apos;t locate it, contact us within 7 days and we&apos;ll work with the carrier to resolve the issue or send a replacement.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Questions?</h2>
            <p>For any shipping or return questions, reach out to <a href="mailto:hello@airepouches.com" className="text-accent hover:underline">hello@airepouches.com</a>. We typically respond within 24–48 hours.</p>
          </section>

        </div>
      </div>

      <footer className="border-t border-navy/10 px-6 md:px-16 py-8 text-center">
        <p className="text-[0.72rem] text-muted">© 2026 Aire. All rights reserved. · <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link> · <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></p>
      </footer>
    </div>
  )
}
