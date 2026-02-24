'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const CHECKOUT_URL = 'https://drifts-7838.myshopify.com/cart/47952645161208:1'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 h-[64px] bg-white/80 backdrop-blur-xl border-b border-sky-deep/20"
    >
      <a href="#">
        <Image src="/images/logo.png" alt="Aire" width={120} height={40} className="h-7 w-auto" style={{ mixBlendMode: 'multiply' }} />
      </a>
      <ul className="hidden md:flex items-center gap-10 list-none">
        {['Ingredients', 'Science', 'Reviews'].map((item) => (
          <li key={item}>
            <a href={`#${item.toLowerCase()}`} className="text-[0.78rem] font-medium tracking-[0.08em] uppercase text-navy-mid hover:text-accent transition-colors duration-200">{item}</a>
          </li>
        ))}
        <li>
          <a href={CHECKOUT_URL} className="text-[0.78rem] font-semibold tracking-[0.08em] uppercase bg-navy text-white px-5 py-2.5 rounded-full hover:bg-accent transition-colors duration-200">Shop Now</a>
        </li>
      </ul>
      <a href={CHECKOUT_URL} className="md:hidden text-[0.72rem] font-semibold tracking-[0.08em] uppercase bg-navy text-white px-4 py-2 rounded-full">
        Shop Now
      </a>
    </motion.nav>
  )
}
