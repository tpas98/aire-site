'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

import { useBuyUrl, useSaleActive } from '@/lib/useSale'

const CONTACT = 'mailto:hello@airepouches.com'
const MENU_LINKS: [string, string][] = [
  ['Ingredients', '/ingredients'],
  ['Science', '/science'],
  ['FAQ', '/faq'],
  ['About', '/about'],
  ['Contact', CONTACT],
]

/**
 * Sits under the fixed SaleBanner (36px) while the sale is live.
 * `overHero`: on a page that opens on a dark full-bleed hero, the bar starts
 * clear with white type and turns into the solid white bar once you scroll.
 */
export default function Navbar({ overHero = false }: { overHero?: boolean }) {
  const sale = useSaleActive()
  const buyUrl = useBuyUrl()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(!overHero)

  useEffect(() => {
    if (!overHero) return
    const on = () => setSolid(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [overHero])
  const clear = !solid

  const openMenu = () => {
    dialogRef.current?.showModal()
    setOpen(true)
  }
  const closeMenu = () => dialogRef.current?.close()

  // The native <dialog> traps focus (the page behind is inert) and closes on
  // Escape. The close event keeps state in sync and returns focus to the button.
  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    const onClose = () => {
      setOpen(false)
      buttonRef.current?.focus()
    }
    d.addEventListener('close', onClose)
    return () => d.removeEventListener('close', onClose)
  }, [])

  // Body scroll lock while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // If the viewport grows past the mobile breakpoint, drop the sheet.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const h = () => mq.matches && dialogRef.current?.open && dialogRef.current.close()
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [])

  return (
    <motion.nav
      initial={{ transform: 'translateY(-80px)', opacity: 0 }}
      animate={{ transform: 'translateY(0px)', opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed ${sale ? 'top-9' : 'top-0'} left-0 right-0 z-50 flex items-center justify-between px-4 md:px-16 h-[64px] border-b transition-[background-color,border-color] duration-300 ${clear ? 'bg-transparent border-white/10' : 'bg-white border-sky-deep/20'}`}
    >
      <a href="/">
        <Image src="/images/logo.png" alt="Aire" width={120} height={40} className="h-7 w-auto transition-[filter] duration-300" style={clear ? { filter: 'brightness(0) invert(1)' } : { mixBlendMode: 'multiply' }} />
      </a>
      <ul className="hidden md:flex items-center gap-10 list-none">
        {[['Why Aire', '/#why'], ['Ingredients', '/#ingredients'], ['FAQ', '/#faq']].map(([item, href]) => (
          <li key={item}>
            <a href={href} className={`text-[0.78rem] font-medium tracking-[0.08em] uppercase transition-colors duration-200 ${clear ? 'text-white/85 hover:text-white' : 'text-navy-mid hover:text-accent'}`}>{item}</a>
          </li>
        ))}
        <li>
          <a href={buyUrl} className={`text-[0.78rem] font-semibold tracking-[0.08em] uppercase px-5 py-2.5 rounded-full transition-colors duration-200 ${clear ? 'bg-white/10 text-white ring-1 ring-white/35 hover:bg-white hover:text-navy' : 'bg-navy text-white hover:bg-accent'}`}>Shop Now</a>
        </li>
      </ul>

      <div className="md:hidden flex items-center gap-1">
        <a href={buyUrl} className={`text-[0.72rem] font-semibold tracking-[0.08em] uppercase px-4 py-2.5 rounded-full transition-colors duration-300 ${clear ? 'bg-white/10 text-white ring-1 ring-white/35' : 'bg-navy text-white'}`}>
          Shop Now
        </a>
        <button
          ref={buttonRef}
          type="button"
          onClick={openMenu}
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="mobile-menu"
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-300 ${clear ? 'text-white' : 'text-navy'}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id="mobile-menu"
        aria-label="Menu"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeMenu()
        }}
        className="m-0 ml-auto h-full max-h-none w-[min(86vw,340px)] bg-white p-0 text-navy shadow-[-20px_0_60px_rgba(26,46,74,0.25)] backdrop:bg-ink/50"
      >
        <div className="flex h-full flex-col px-6 pb-8 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-serif text-[1.4rem] text-navy">Menu</span>
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-navy"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <ul className="mt-6 list-none">
            <li>
              <a href={buyUrl} className="flex min-h-[52px] items-center border-b border-sky-deep/20 font-serif text-[1.5rem] text-navy">Shop</a>
            </li>
            {MENU_LINKS.map(([label, href]) => (
              <li key={label}>
                <a href={href} className="flex min-h-[52px] items-center border-b border-sky-deep/20 font-serif text-[1.5rem] text-navy">{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </dialog>
    </motion.nav>
  )
}
