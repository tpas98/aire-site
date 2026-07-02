'use client'
import { useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'
import { EASE } from '@/lib/motion'
import Magnetic from './ui/Magnetic'

const CHECKOUT_URL = 'https://drifts-7838.myshopify.com/cart/47952645161208:1'

export default function Navbar() {
  const [condensed, setCondensed] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (v) => {
    setCondensed(v > 24)
  })

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        height: condensed ? 54 : 64,
        backgroundColor: condensed ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.8)',
        boxShadow: condensed ? '0 1px 24px rgba(26,46,74,0.08)' : '0 0 0 rgba(26,46,74,0)',
      }}
      transition={{ duration: 0.3, ease: EASE }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 backdrop-blur-xl border-b border-sky-deep/20"
    >
      <a href="/">
        <motion.div
          animate={{ scale: condensed ? 0.92 : 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          style={{ transformOrigin: 'left center' }}
        >
          <Image src="/images/logo.png" alt="Aire" width={120} height={40} className="h-7 w-auto" style={{ mixBlendMode: 'multiply' }} />
        </motion.div>
      </a>
      <ul className="hidden md:flex items-center gap-10 list-none">
        {['Ingredients', 'Science', 'Reviews'].map((item) => (
          <li key={item}>
            <a href={`#${item.toLowerCase()}`} className="text-[0.78rem] font-medium tracking-[0.08em] uppercase text-navy-mid hover:text-accent transition-colors duration-200">{item}</a>
          </li>
        ))}
        <li>
          <Magnetic strength={8} padding={16}>
            <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="text-[0.78rem] font-semibold tracking-[0.08em] uppercase bg-navy text-white px-5 py-2.5 rounded-full hover:bg-accent transition-colors duration-200">Shop Now</a>
          </Magnetic>
        </li>
      </ul>
      <a href={CHECKOUT_URL} target="_blank" rel="noopener noreferrer" className="md:hidden text-[0.72rem] font-semibold tracking-[0.08em] uppercase bg-navy text-white px-4 py-2 rounded-full">
        Shop Now
      </a>
    </motion.nav>
  )
}
