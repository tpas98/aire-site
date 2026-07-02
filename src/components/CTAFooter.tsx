'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import Eyebrow from './ui/Eyebrow'
import WordReveal from './ui/WordReveal'
import Magnetic from './ui/Magnetic'
import { fadeUpWithDelay, useMotionOK } from '@/lib/motion'

const CHECKOUT_URL = 'https://drifts-7838.myshopify.com/cart/47952645161208:1'

const grain = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")"

const trust = [
  { label: 'Free Shipping Over $50' },
  { label: '4 Clinically-Studied Ingredients' },
  { label: 'Zero Nicotine. Zero Caffeine.' },
]

const footerLinks = {
  Explore: [
    { label: 'Home', href: '/' },
    { label: 'Shop Aire', href: CHECKOUT_URL },
    { label: 'The Science', href: '/#ingredients' },
    { label: 'About Us', href: '/#science' },
  ],
  Support: [
    { label: 'FAQ', href: '/#faq' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Contact Us', href: 'mailto:hello@airepouches.com' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const motionOK = useMotionOK()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const canY = useTransform(scrollYProgress, [0, 1], [70, -30])
  const parallaxOn = motionOK && isDesktop

  return (
    <section
      ref={sectionRef}
      id="shop"
      className="min-h-[92vh] flex items-center justify-center bg-navy py-24 px-6 md:px-16 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{ backgroundImage: grain, backgroundRepeat: 'repeat', backgroundSize: '128px' }} />
      <div className="relative z-10 max-w-[720px] mx-auto flex flex-col items-center text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Eyebrow tone="dark" align="center" className="mb-6">Ready to Feel the Difference</Eyebrow>
        </motion.div>

        <div style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
          <WordReveal
            as="h2"
            className="font-serif leading-[1.1] text-white tracking-[-0.02em] mb-5"
            delay={0.1}
            wordStagger={0.045}
            emClassName="italic text-sky-deep"
            lines={[
              { words: [{ text: 'Your' }, { text: 'balance', em: true }, { text: 'is' }] },
              { words: [{ text: 'one' }, { text: 'pouch' }, { text: 'away.' }] },
            ]}
          />
        </div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpWithDelay(0.2)}
          className="text-[0.96rem] text-white/55 font-light leading-[1.84] max-w-[400px] mb-8"
        >
          Join the Aire community. Science-backed botanicals and adaptogens, delivered to your door.
        </motion.p>

        {/* Floating can: outer = scroll parallax, inner = 7s float loop */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpWithDelay(0.3)}
          className="mb-8"
        >
          <motion.div
            style={parallaxOn ? { y: canY } : undefined}
            className="relative max-w-[460px]"
          >
            <motion.div
              className="relative"
              animate={{ y: [0, -18, 0], rotate: [0, 1.2, -1.2, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-[-10%] bg-[radial-gradient(circle_at_52%_44%,rgba(255,255,255,0.12)_0%,rgba(126,194,223,0.12)_22%,rgba(126,194,223,0.04)_34%,rgba(126,194,223,0)_62%)] blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[14%] bottom-[4%] h-[18%] rounded-full bg-[radial-gradient(circle,rgba(5,12,22,0.30)_0%,rgba(5,12,22,0.14)_44%,rgba(5,12,22,0)_76%)] blur-2xl"
              />
              <Image src="/images/open-can-updated-cutout-2026-site-safe.png" alt="Aire tin open showing pouches" width={1212} height={776}
                className="relative z-10 w-full max-w-[240px] md:max-w-[460px] object-contain [filter:drop-shadow(0_20px_26px_rgba(5,12,22,0.18))_drop-shadow(0_40px_80px_rgba(5,12,22,0.16))]" />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpWithDelay(0.4)}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {/* padding kept under half the gap-4 (16px) row spacing so neither
              button's expanded hit area reaches into its neighbor's */}
          <Magnetic className="inline-block" padding={7}>
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block bg-white text-navy px-8 py-4 rounded-full text-[0.8rem] font-semibold tracking-[0.08em] uppercase text-center">
              Order Now - $45.99 / 4-Pack
            </a>
          </Magnetic>
          <Magnetic className="inline-block" padding={7}>
            <a href="#ingredients" className="inline-block text-white border border-white/30 px-8 py-4 rounded-full text-[0.8rem] font-medium tracking-[0.08em] uppercase hover:border-white/60 transition-all duration-200 text-center">
              Learn the Science
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpWithDelay(0.48)}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 mb-8 text-[0.83rem] text-white/60"
        >
          {trust.map(({ label }, i) => (
            <span key={label} className="flex items-center gap-3 sm:gap-5">
              {i !== 0 && <span aria-hidden="true" className="hidden sm:inline text-sky-deep/40">◆</span>}
              <span>{label}</span>
            </span>
          ))}
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUpWithDelay(0.55)}
          className="text-[0.65rem] text-white/25 leading-relaxed max-w-[420px]"
        >
          † These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
        </motion.p>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-navy border-t border-white/10 px-6 md:px-16 pt-16 pb-10">
      <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-8 md:gap-12 mb-12">
        <div className="col-span-2 md:col-span-1">
          <Image src="/images/logo.png" alt="Aire" width={100} height={36} className="h-7 w-auto mb-4"
            style={{ filter: 'brightness(0) invert(1)' }} />
          <p className="text-[0.82rem] text-white/50 leading-[1.75] mb-5">The lifestyle pouch promoting peak enjoyment from every pursuit.<br />No nicotine. No caffeine. Pure balance.</p>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/airepouches"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Aire on Instagram"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/40 hover:border-sky-deep hover:text-sky-deep transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="text-[0.64rem] font-semibold tracking-[0.15em] uppercase text-white/30 mb-4">{heading}</h4>
            <ul className="space-y-2.5">
              {links.map(({ label, href }) => (
                <li key={label}><a href={href} className="text-[0.81rem] text-white/50 hover:text-sky-deep transition-colors duration-200">{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-4">
        <span className="text-[0.71rem] text-white/40">© 2026 Aire. All rights reserved.</span>
        <span className="text-[0.62rem] text-white/25 max-w-[540px] leading-relaxed">† These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.</span>
      </div>
    </footer>
  )
}
