'use client'
import { ArrowDown } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 60% 40%, #F0E6D3 0%, #EAD9C0 40%, #FDFAF4 100%)' }} />

      {[15, 35, 65, 85].map((p, i) => (
        <div key={i} className="absolute top-0 bottom-0 border-l pointer-events-none"
          style={{ left: `${p}%`, borderColor: 'rgba(201,168,76,0.07)' }} />
      ))}

<div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-10 lg:pt-32 lg:pb-12">        

        <h1 className="stagger max-w-4xl" style={{ animationDelay: '0.35s' }}>
          <span className="block leading-none tracking-tight mb-2"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(3rem,8vw,6rem)', color: '#2C1810', fontWeight: 300 }}>
            Bespoke Interior
          </span>
          <span className="block leading-none tracking-tight italic"
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(3rem,8vw,6rem)', color: '#C9A84C', fontWeight: 300 }}>
            for the Modern Home.
          </span>
        </h1>

        <p className="stagger mt-8 max-w-md text-base font-light leading-relaxed"
          style={{ animationDelay: '0.5s', color: '#4A2E1E', fontFamily: "'Jost',sans-serif" }}>
Every commission is treated as a singular work — built by hand,
finished to museum standard, and made to outlast its generation.

        </p>

        <div className="stagger mt-12 flex flex-wrap gap-4" style={{ animationDelay: '0.65s' }}>
          <a href="#portfolio"
            className="inline-flex items-center gap-3 px-8 py-4 text-xs tracking-widest uppercase transition-all hover:bg-[#4A2E1E]"
            style={{ background: '#2C1810', color: '#FAF5E9', fontFamily: "'Jost',sans-serif" }}>
            View Our Work <ArrowDown size={13} />
          </a>
        <a href="#contact"
  className="inline-flex items-center px-8 py-4 text-xs tracking-widest uppercase border transition-all hover:bg-[#2C1810] hover:text-[#FAF5E9] text-[#2C1810]"
  style={{ borderColor: '#2C1810', fontFamily: "'Jost',sans-serif" }}>
  Book Consultation
</a>
        </div>

        <div className="stagger mt-20 grid grid-cols-3 max-w-sm gap-8" style={{ animationDelay: '0.8s' }}>
          {[['10+', 'Years of Craft'], ['500+', 'Pieces Restored'], ['100%', 'Handcrafted']].map(([n, l]) => (
            <div key={n}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.875rem', color: '#2C1810', fontWeight: 300 }}>{n}</div>
              <div style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}