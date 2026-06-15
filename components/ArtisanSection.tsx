'use client'
import { useEffect, useRef, useState } from 'react'
import { Award, Scissors, Star } from 'lucide-react'
import { getArtisanImage } from '@/lib/supabase'
import Image from 'next/image'

export default function ArtisanSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [artisanImage, setArtisanImage] = useState<string | null>(null)

  useEffect(() => {
    getArtisanImage()
      .then(url => {
        console.log('[ArtisanSection] loaded artisan image URL:', url)
        setArtisanImage(url)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'))
    }, { threshold: 0.12 })
    ref.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="about" ref={ref} className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="reveal flex items-center gap-3 mb-4">
          <span className="block w-8 h-px" style={{ background: '#C9A84C' }} />
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.6rem', letterSpacing: '0.35em', color: '#C9A84C', textTransform: 'uppercase' }}>The Artisan</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="reveal order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border" style={{ borderColor: 'rgba(201,168,76,0.25)' }} />
              <div className="relative aspect-[4/5] overflow-hidden" style={{ background: '#E8DFD0' }}>
                {artisanImage ? (
                  <Image
                    src={artisanImage}
                    alt="Charles – Master Upholsterer"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 40vw"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg viewBox="0 0 200 300" className="w-32 opacity-20 mb-4" fill="#2C1810">
                      <ellipse cx="100" cy="70" rx="40" ry="45" />
                      <path d="M30 300 Q30 160 100 155 Q170 160 170 300 Z" />
                    </svg>
                    <p className="text-xs tracking-widest uppercase" style={{ color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>
                      Upload artisan photo in admin
                    </p>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 border-b border-r" style={{ borderColor: '#C9A84C' }} />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="reveal text-4xl lg:text-5xl font-light leading-tight mb-6"
              style={{ fontFamily: "'Cormorant Garamond',serif", color: '#2C1810' }}>
              Two Decades of{' '}
              <em className="italic" style={{ color: '#C9A84C' }}>Quiet Excellence</em>
            </h2>
            <div className="reveal w-12 h-px mb-8" style={{ background: 'linear-gradient(90deg,#C9A84C,transparent)' }} />
            <p className="reveal text-base font-light leading-relaxed mb-5" style={{ color: '#4A2E1E', fontFamily: "'Jost',sans-serif" }}>
              With over a decade mastering upholstery in Nairobi, every piece is treated as a singular commission. We believe furniture carries memory — our work is to preserve, restore, and elevate that memory.
            </p>
            <p className="reveal text-base font-light leading-relaxed mb-10" style={{ color: '#4A2E1E', fontFamily: "'Jost',sans-serif" }}>
              Specialising in sofa repair across Nairobi and furniture restoration in Karen. We source only the finest: high-density orthopedic foam, Italian top-grain leather, Turkish velvet, and precision structural webbing.
            </p>
            <div className="reveal grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                [Award, 'Master Upholsterer', 'City & Guilds Certified'],
                [Scissors, 'Structural Specialist', 'Frame & Webbing Repair'],
                [Star, 'Premium Materials', 'Italian & Turkish Fabrics'],
              ].map(([Icon, title, sub]: any) => (
                <div key={title} className="p-5 border flex flex-col gap-2"
                  style={{ borderColor: 'rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.03)' }}>
                  <Icon size={18} color="#C9A84C" strokeWidth={1.5} />
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#2C1810', fontFamily: "'Jost',sans-serif" }}>{title}</div>
                    <div className="text-xs font-light mt-0.5" style={{ color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}