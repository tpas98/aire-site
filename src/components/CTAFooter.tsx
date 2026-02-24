'use client'
import Image from 'next/image'
import FadeUp from './FadeUp'
import { motion } from 'framer-motion'

const grain = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"

const trust = [
  { icon: '🚚', label: 'Free Shipping Over $50' },
  { icon: '🧪', label: '5 Clinically-Studied Ingredients' },
  { icon: '✦', label: 'Zero Nicotine. Zero Caffeine.' },
]

const footerLinks = {
  Explore: ['Home', 'Shop Aire', 'The Science', 'About Us'],
  Support: ['FAQ', 'Shipping & Returns', 'Contact Us'],
  Legal: ['Privacy Policy', 'Terms of Service'],
}

export function CTA() {
  return (
    <section id="shop" className="bg-navy py-24 px-6 md:px-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{ backgroundImage: grain, backgroundRepeat: 'repeat', backgroundSize: '128px' }} />
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <FadeUp>
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-5 h-px bg-sky-deep" />
            <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-sky-deep">Ready to Feel the Difference</span>
          </div>
          <h2 className="font-serif text-[clamp(2.2rem,4vw,3.8rem)] leading-[1.1] text-white tracking-[-0.02em] mb-5">
            Your <em className="italic text-sky-deep">balance</em> is<br />one pouch away.
          </h2>
          <p className="text-[0.96rem] text-white/55 font-light leading-[1.84] max-w-[400px] mb-8">
            Join the Aire community. Science-backed calm, delivered to your door.
          </p>
          <div className="flex flex-col gap-3 mb-8">
            {trust.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-[0.83rem] text-white/60">
                <span className="text-sky-deep">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#" className="btn-primary inline-block bg-white text-navy px-8 py-4 rounded-full text-[0.8rem] font-semibold tracking-[0.08em] uppercase text-center">
              Order Now — $39.99 / 4-Pack
            </a>
            <a href="#ingredients" className="inline-block text-white border border-white/30 px-8 py-4 rounded-full text-[0.8rem] font-medium tracking-[0.08em] uppercase hover:border-white/60 transition-all duration-200 text-center">
              Learn the Science
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-navy border-t border-white/5 px-6 md:px-16 pt-16 pb-10 text-white/44">
      <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-8 md:gap-12 mb-12">
        <div className="col-span-2 md:col-span-1">
          <Image src="/images/logo.png" alt="Aire" width={100} height={36} className="h-7 w-auto mb-4 opacity-75"
            style={{ filter: 'brightness(0) invert(1)', mixBlendMode: 'normal' }} />
          <p className="text-[0.82rem] leading-[1.75] mb-5">The calm pouch built for modern life.<br />No nicotine. No caffeine. Just balance.</p>
          <div className="flex gap-3">
            {['IG', '𝕏'].map((s) => (
              <a key={s} href="#" className="w-8 h-8 rounded-full border border-white/12 flex items-center justify-center text-[0.7rem] text-white/38 hover:border-sky-deep hover:text-sky-deep transition-all duration-200">{s}</a>
            ))}
          </div>
        </div>
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="text-[0.64rem] font-semibold tracking-[0.15em] uppercase text-white/26 mb-4">{heading}</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link}><a href="#" className="text-[0.81rem] text-white/42 hover:text-sky-deep transition-colors duration-200">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between gap-4 text-[0.71rem]">
        <span>© 2026 Aire. All rights reserved.</span>
        <span className="text-[0.62rem] text-white/20 max-w-[540px] leading-relaxed">† These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</span>
      </div>
    </footer>
  )
}
