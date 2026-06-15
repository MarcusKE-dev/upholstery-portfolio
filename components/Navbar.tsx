'use client'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = ['#about', '#portfolio', '#services', '#testimonials', '#contact']
  const labels = ['Artisan', 'Portfolio', 'Services', 'Testimonials', 'Contact']

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'shadow-sm border-b' : ''
      }`}
      style={{
        background: scrolled ? 'rgba(253,250,244,0.96)' : 'transparent',
        borderColor: '#E8DFD0',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <a href="/" className="flex flex-col leading-none">
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', fontWeight: 500 }}>
            Charles'
                  </span>
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.6rem', letterSpacing: '0.3em', color: '#C9A84C', textTransform: 'uppercase' }}>
            Interiors · Nairobi
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((href, i) => (
            <a key={href} href={href}
              className="text-xs uppercase tracking-widest font-light hover:text-yellow-600 transition-colors"
              style={{ fontFamily: "'Jost',sans-serif", color: '#2C1810' }}>
              {labels[i]}
            </a>
          ))}
          <a href="#contact"
            className="px-5 py-2.5 text-xs uppercase tracking-widest border transition-all hover:bg-[#2C1810] hover:text-[#FAF5E9] text-[#2C1810]"
            style={{ borderColor: '#C9A84C', fontFamily: "'Jost',sans-serif" }}>
            Book Consultation
          </a>
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} color="#2C1810" /> : <Menu size={22} color="#2C1810" />}
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-80' : 'max-h-0'}`}
        style={{ background: '#FDFAF4', borderBottom: open ? '1px solid #E8DFD0' : 'none' }}>
        <nav className="px-6 py-6 flex flex-col gap-5">
          {links.map((href, i) => (
            <a key={href} href={href} onClick={() => setOpen(false)}
              className="text-xs uppercase tracking-widest font-light"
              style={{ fontFamily: "'Jost',sans-serif", color: '#2C1810' }}>
              {labels[i]}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}