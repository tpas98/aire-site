import Image from 'next/image'
import FadeUp from './FadeUp'

export function CTA() {
  return (
    <section id="shop" className="bg-navy py-36 px-16 text-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-sky-deep/6 blur-3xl" />
      </div>
      <FadeUp className="relative z-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="block w-5 h-px bg-sky-deep" />
          <span className="text-[0.67rem] font-semibold tracking-[0.2em] uppercase text-sky-deep">Ready to Feel the Difference</span>
          <span className="block w-5 h-px bg-sky-deep" />
        </div>
        <h2 className="font-serif text-[clamp(2rem,3.8vw,3.4rem)] leading-[1.12] text-white tracking-[-0.02em] max-w-[640px] mx-auto mb-5">
          Your <em className="italic text-sky-deep">balance</em> is<br />one pouch away.
        </h2>
        <p className="text-[0.96rem] text-white/48 font-light leading-[1.84] max-w-[440px] mx-auto mb-8">
          Join the Aire community. Free shipping on orders over $50. 30-day satisfaction guarantee.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="#"
            className="inline-block bg-white text-navy px-8 py-4 rounded-full text-[0.8rem] font-semibold tracking-[0.08em] uppercase hover:bg-sky-light hover:-translate-y-0.5 transition-all duration-200"
          >
            Order Now — $39.99 / 4-Pack
          </a>
          <a
            href="#ingredients"
            className="inline-block bg-transparent text-white/62 border border-white/20 px-8 py-4 rounded-full text-[0.8rem] font-medium tracking-[0.08em] uppercase hover:border-white/50 hover:text-white transition-all duration-200"
          >
            Learn the Science
          </a>
        </div>
      </FadeUp>
    </section>
  )
}

const footerLinks = {
  Explore: ['Home', 'Shop Aire', 'The Science', 'About Us'],
  Support: ['FAQ', 'Shipping & Returns', 'Contact Us'],
  Legal: ['Privacy Policy', 'Terms of Service'],
}

export function Footer() {
  return (
    <footer className="bg-navy border-t border-white/5 px-16 pt-16 pb-10 text-white/44">
      <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 mb-12">
        <div>
          <Image
            src="/images/logo.png"
            alt="Aire"
            width={100}
            height={36}
            className="h-7 w-auto mb-4 opacity-75"
            style={{ filter: 'brightness(0) invert(1)', mixBlendMode: 'normal' }}
          />
          <p className="text-[0.82rem] leading-[1.75] mb-5">
            The calm pouch built for modern life.<br />No nicotine. No caffeine. Just balance.
          </p>
          <div className="flex gap-3">
            {['IG', '𝕏'].map((s) => (
              <a
                key={s}
                href="#"
                className="w-8 h-8 rounded-full border border-white/12 flex items-center justify-center text-[0.7rem] text-white/38 hover:border-sky-deep hover:text-sky-deep transition-all duration-200"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
        {Object.entries(footerLinks).map(([heading, links]) => (
          <div key={heading}>
            <h4 className="text-[0.64rem] font-semibold tracking-[0.15em] uppercase text-white/26 mb-4">{heading}</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[0.81rem] text-white/42 hover:text-sky-deep transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 pt-6 flex justify-between items-start gap-8 flex-wrap text-[0.71rem]">
        <span>© 2026 Aire. All rights reserved.</span>
        <span className="text-[0.62rem] text-white/20 max-w-[540px] leading-relaxed">
          † These statements have not been evaluated by the Food and Drug Administration.
          This product is not intended to diagnose, treat, cure, or prevent any disease.
        </span>
      </div>
    </footer>
  )
}
