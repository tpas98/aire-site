import Navbar from '@/components/Navbar'
import Ticker from '@/components/Ticker'
import Hero from '@/components/Hero'
import LifestyleStrip from '@/components/LifestyleStrip'
import About from '@/components/About'
import Ingredients from '@/components/Ingredients'
import ProductFeature from '@/components/ProductFeature'
import Testimonials from '@/components/Testimonials'
import { CTA, Footer } from '@/components/CTAFooter'

export default function Home() {
  return (
    <>
      <Navbar />
      <Ticker />
      <Hero />
      <LifestyleStrip />
      <About />
      <Ingredients />
      <ProductFeature />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  )
}
