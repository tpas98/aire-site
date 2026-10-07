import Dag, { Eyebrow } from './Dag'
import { faqs } from '../content'

export default function DiscoverFAQ() {
  return (
    <section id="faq" className="bg-white py-24 md:py-36">
      <div className="mx-auto max-w-[760px] px-6">
        <Eyebrow>Questions</Eyebrow>
        <h2 className="mb-8 font-serif text-[clamp(2.2rem,7vw,3.6rem)] leading-[1.04] tracking-[-0.02em] text-navy">Fair questions.</h2>
        <div className="border-t border-navy/10">
          {faqs.map((f) => (
            <details key={f.q} className="group border-b border-navy/10">
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center py-4 justify-between gap-6 text-[1.05rem] font-medium text-navy [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <span aria-hidden="true" className="relative block h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-45">
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-navy" />
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-navy" />
                </span>
              </summary>
              <p className="pb-5 pt-1 font-light leading-[1.7] text-navy-mid">
                <Dag>{f.a}</Dag>
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
