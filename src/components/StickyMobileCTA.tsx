'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { buyUrl } from '@/lib/checkout'

/** Defaults are the homepage bar; /discover passes offer-led copy. */
export default function StickyMobileCTA({
  label = '4-Pack · 60 Pouches',
  price = '$45.99',
  cta = 'Order Now',
}: { label?: string; price?: string; cta?: string } = {}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (~600px)
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[80] md:hidden"
        >
          <div className="bg-navy border-t border-white/10 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[0.72rem] text-white/50 font-light">{label}</span>
              <span className="text-[1rem] text-white font-semibold">{price}</span>
            </div>
            <a
              href={buyUrl()}
              className="bg-white text-navy px-6 py-3 rounded-full text-[0.75rem] font-semibold tracking-[0.08em] uppercase whitespace-nowrap"
            >
              {cta}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
