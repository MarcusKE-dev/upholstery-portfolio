'use client'
import { useEffect, useRef } from 'react'
import { Layers, Zap, PenTool, Package, Truck, CheckCircle } from 'lucide-react'

const services = [
  {
    Icon: Layers,
    title: 'Bespoke Re-Upholstery',
    subtext: 'SOFA RETAILORING · LOOSE SLIPCOVERS',
    desc: 'Sofa and chair upholstery, loose covers and seating restoration. Discuss the covering and any underlying repairs your furniture may need.',
  },
  {
    Icon: PenTool,
    title: 'Chesterfield & Bedroom Craft',
    subtext: 'DIAMOND TUFTING · CUSTOM HEADBOARDS',
    desc: 'Upholstered beds, headboards and scatter cushions. Discuss dimensions, padding and the tufted or plain finish you prefer.',
  },
  {
    Icon: Zap,
    title: 'Structural & Foam Revival',
    subtext: 'PADDING · SEAT SUPPORT',
    desc: 'Discuss sagging cushions, frame concerns and seat support. An assessment helps distinguish filling problems from structural repairs.',
  },
  {
    Icon: Package,
    title: 'Window Drapery & Couture',
    subtext: 'ARTISANAL CURTAINS · ROLLER BLINDS',
    desc: 'Curtains, sheers and blinds selected around light, privacy and room proportions. Confirm material, measurement and fitting arrangements for your enquiry.',
  },
  {
    Icon: CheckCircle,
    title: 'Tailored Dining & Accents',
    subtext: 'DINING SUITES · PLUSH MOCKETS',
    desc: 'Dining chair upholstery, ottomans and footstools. Coordinate coverings with the seating and textiles already in your room.',
  },
  {
    Icon: Truck,
    title: 'Automotive seating',
    subtext: 'CAR SEAT COVERS',
    desc: 'For car seat covers, share the vehicle and seat details. Confirm the scope for your particular seating enquiry.',
  },
]

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'))
    }, { threshold: 0.08 })
    ref.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="services" ref={ref} className="py-16 lg:py-20 relative overflow-hidden" style={{ background: '#2C1810' }}>
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg,#C9A84C 0,#C9A84C 1px,transparent 0,transparent 50%)', backgroundSize: '20px 20px' }} />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="reveal flex items-center gap-3 mb-4">
        </div>
        <h2 className="reveal text-4xl lg:text-5xl font-light mb-16" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#FAF5E9' }}>
          What We Do
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(201,168,76,0.12)' }}>
          {services.map(({ Icon, title, subtext, desc }, i) => (
            <div key={title} className="reveal group p-8 hover:bg-[#4A2E1E] transition-colors duration-300"
              style={{ background: 'rgba(44,24,16,0.97)', transitionDelay: `${i * 0.06}s` }}>
              <Icon size={20} strokeWidth={1.5} color="#C9A84C" className="mb-5" />
              <h3 className="text-xl font-light mb-3" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#FAF5E9' }}>{title}</h3>
              <p className="text-sm font-light leading-relaxed mb-5" style={{ fontFamily: "'Jost',sans-serif", color: 'rgba(250,245,233,0.62)' }}>{desc}</p>
              <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.75rem', letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase' }}>{subtext}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}