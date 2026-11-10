import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import SaleBanner from '@/components/SaleBanner'
import NotFoundActions from '@/components/NotFoundActions'
import { Footer } from '@/components/CTAFooter'

export const metadata: Metadata = {
  title: 'Page not found | Aire',
  robots: { index: false, follow: true },
}

/** Site-wide 404 (rendered inside the root layout, so the SaleProvider is available). */
export default function NotFound() {
  return (
    <>
      <SaleBanner />
      <Navbar />
      <main className="flex min-h-[78vh] items-center justify-center bg-navy px-6 pb-20 pt-[150px] text-center">
        <div className="max-w-[560px]">
          <p className="mb-5 text-[0.67rem] font-semibold uppercase tracking-[0.2em] text-sky-deep">404</p>
          <h1 className="font-serif text-[clamp(2.4rem,7vw,4rem)] leading-[1.08] tracking-[-0.02em] text-white">
            This page took <em className="italic text-sky-deep">a breath.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-[420px] text-[0.96rem] font-light leading-[1.8] text-white/60">
            We couldn&apos;t find what you were looking for. Head back home, or go straight to the shop.
          </p>
          <NotFoundActions />
        </div>
      </main>
      <Footer />
    </>
  )
}
