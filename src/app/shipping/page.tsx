import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Shipping & Returns — Aire",
  description: "Shipping information and return policy for Aire wellness pouches.",
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white text-navy-mid font-sans text-[0.97rem] leading-relaxed">
      <header className="flex items-center justify-between px-6 md:px-16 py-6 border-b border-navy/10">
        <Link href="/">
          <Image src="/images/logo.png" alt="Aire" width={90} height={36} style={{ mixBlendMode: 'multiply' }} />
        </Link>
        <Link href="/" className="text-sm text-accent hover:underline">← Back to Home</Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 md:px-16 py-16">
        <h1 className="font-serif text-[2.4rem] text-navy mb-2">Shipping &amp; Returns</h1>
        <p className="text-muted mb-12">Simple, transparent policies — no fine print surprises.</p>

        <div className="space-y-10">

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Shipping</h2>
            <p className="mb-4">We currently ship to all 50 U.S. states. International shipping is not available at this time.</p>
            <p className="mb-4"><strong className="text-navy">Processing time:</strong> Orders are processed within 1–2 business days after payment is confirmed. You&apos;ll receive a confirmation email with tracking information once your order ships.</p>
            <p className="mb-4"><strong className="text-navy">Delivery time:</strong> Standard shipping takes 5–7 business days from the date of shipment. Delivery times may vary depending on your location and carrier conditions.</p>
            <p><strong className="text-navy">Shipping cost:</strong> We offer free standard shipping on all orders.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Order Tracking</h2>
            <p>Once your order ships, you&apos;ll receive an email with a tracking number. You can use this to monitor your delivery status. If you haven&apos;t received tracking information within 3 business days of placing your order, please contact us at <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a>.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Returns</h2>
            <p className="mb-4">We want you to love Aire. If you&apos;re not completely satisfied, we accept returns within 30 days of delivery for a full refund.</p>
            <p className="mb-4"><strong className="text-navy">Eligibility:</strong> To be eligible for a return, items must be unopened and in their original packaging. Opened or used products cannot be returned for hygiene reasons, unless the product is defective.</p>
            <p><strong className="text-navy">How to initiate a return:</strong> Email us at <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a> with your order number and reason for return. We&apos;ll provide you with a return shipping label and instructions within 1–2 business days.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Refunds</h2>
            <p className="mb-4">Once we receive your returned item, we&apos;ll inspect it and process your refund within 5–7 business days. Refunds are issued to the original payment method. Please allow an additional 3–5 business days for the refund to appear on your statement, depending on your bank or card issuer.</p>
            <p>Original shipping costs are non-refundable unless the return is due to a defective or incorrect product.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Damaged or Defective Products</h2>
            <p>If your order arrives damaged or you receive a defective product, please contact us within 7 days of delivery at <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a>. Include your order number and a photo of the issue, and we&apos;ll send a free replacement or issue a full refund — your choice.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Lost Packages</h2>
            <p>If your tracking shows delivered but you haven&apos;t received your package, please check with neighbors and your building&apos;s mail area first. If you still can&apos;t locate it, contact us within 7 days and we&apos;ll work with the carrier to resolve the issue or send a replacement.</p>
          </section>

          <section>
            <h2 className="font-serif text-[1.4rem] text-navy mb-3">Questions?</h2>
            <p>For any shipping or return questions, reach out to <a href="mailto:hello@aire.com" className="text-accent hover:underline">hello@aire.com</a>. We typically respond within 24–48 hours.</p>
          </section>

        </div>
      </div>

      <footer className="border-t border-navy/10 px-6 md:px-16 py-8 text-center">
        <p className="text-[0.72rem] text-muted">© 2026 Aire. All rights reserved. — <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link> · <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></p>
      </footer>
    </div>
  )
}
