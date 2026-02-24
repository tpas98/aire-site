'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function EmailPopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const dismissed = sessionStorage.getItem('aire-popup-dismissed')
    if (dismissed) return
    const timer = setTimeout(() => setVisible(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    sessionStorage.setItem('aire-popup-dismissed', 'true')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Failed')
      setSubmitted(true)
      setTimeout(() => {
        setVisible(false)
        sessionStorage.setItem('aire-popup-dismissed', 'true')
      }, 2500)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
          />
          <motion.div
            className="fixed z-[100] bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[480px] w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-navy rounded-t-3xl md:rounded-3xl px-8 py-10 relative overflow-hidden">
              <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
              <button
                onClick={handleDismiss}
                className="absolute top-4 right-5 text-white/30 hover:text-white/60 transition-colors text-xl leading-none"
              >
                ✕
              </button>
              {!submitted ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="block w-5 h-px bg-accent" />
                    <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-accent">Welcome to Aire</span>
                  </div>
                  <h2 className="font-serif text-[1.9rem] leading-[1.1] text-white tracking-[-0.02em] mb-2">
                    Find Your Flow.<br />
                    <em className="italic text-sky-deep">Save 10%.</em>
                  </h2>
                  <p className="text-[0.85rem] text-white/50 font-light leading-[1.7] mb-6">
                    Join the Aire community and get 10% off your first order — plus early access to new drops.
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-[0.85rem] text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-white text-navy px-6 py-3 rounded-full text-[0.78rem] font-semibold tracking-[0.08em] uppercase hover:bg-accent hover:text-white transition-colors whitespace-nowrap disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Claim 10% Off'}
                    </button>
                  </form>
                  {error && <p className="mt-3 text-[0.75rem] text-red-400">{error}</p>}
                  <button
                    onClick={handleDismiss}
                    className="mt-4 text-[0.72rem] text-white/25 hover:text-white/40 transition-colors w-full text-center"
                  >
                    No thanks, I'll pay full price
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-3xl mb-4">✦</div>
                  <h3 className="font-serif text-[1.6rem] text-white mb-2">You're in.</h3>
                  <p className="text-[0.85rem] text-white/50 font-light">Check your inbox for your 10% off code.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
