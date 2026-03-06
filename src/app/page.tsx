import Navbar from '@/components/Navbar'
import Ticker from '@/components/Ticker'
import Hero from '@/components/Hero'
import LifestyleStrip from '@/components/LifestyleStrip'
import About from '@/components/About'
import Ingredients from '@/components/Ingredients'
import ProductFeature from '@/components/ProductFeature'
import HowToUse from '@/components/HowToUse'
import Balance from '@/components/Balance'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import StickyMobileCTA from '@/components/StickyMobileCTA'
import { CTA, Footer } from '@/components/CTAFooter'

export default function Home() {
  return (
    <>
      <Navbar />
      <Ticker />
      <Hero />
      <LifestyleStrip />
      <Testimonials />
      <About />
      <Ingredients />
      <ProductFeature />
      <Balance />
      <HowToUse />
      <FAQ />
      <CTA />
      <Footer />
      <StickyMobileCTA />
    </>
  )
}
