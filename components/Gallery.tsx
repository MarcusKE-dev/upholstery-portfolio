'use client'
import { useState, useEffect } from 'react'
import { getProjects, type Project } from '@/lib/supabase'
import ProjectCard, { ProjectCardSkeleton } from './ProjectCard'

const CATS = [
  { id: 'all',        label: 'All Work' },
  { id: 'residential', label: 'Bespoke Seating' },
  { id: 'window',      label: 'Window Dressings' },
  { id: 'bedroom',     label: 'Beds & Accents' },
  { id: 'automotive',  label: 'Car Seat Covers' },
]

const SUBCATEGORIES: Record<string, string[]> = {
  residential: ['Sofas', 'Dining Sets', 'Loose Covers', 'Mockets/Ottomans'],
  window:      ['Curtains', 'Blinds', 'Sheers'],
  bedroom:     ['Chester Beds', 'Scatter Cushions'],
  automotive:  ['Car Seat Covers'],
}

export default function Gallery() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('all')
  const [subFilter, setSubFilter] = useState('all')

  useEffect(() => {
    getProjects().then(setProjects).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  const filtered = projects.filter(p => {
    const categoryMatch = filter === 'all' || p.category === filter
    const subMatch = subFilter === 'all' || p.subcategory === subFilter
    return categoryMatch && subMatch
  })

  return (
    <section id="portfolio" className="py-16 lg:py-20" style={{ background: '#FAF5E9' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-px" style={{ background: '#C9A84C' }} />
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.6rem', letterSpacing: '0.35em', color: '#C9A84C', textTransform: 'uppercase' }}>Portfolio</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,5vw,3rem)', color: '#2C1810', fontWeight: 300 }}>
            Selected Works
          </h2>
        </div>

        {/* Primary filter tabs */}
        <div className="flex flex-wrap gap-2 mb-3">
          {CATS.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setFilter(cat.id); setSubFilter('all') }}
              className="px-4 py-2 text-xs tracking-widest uppercase transition-all duration-200"
              style={{
                fontFamily: "'Jost',sans-serif",
                background: filter === cat.id ? '#2C1810' : 'transparent',
                color: filter === cat.id ? '#FAF5E9' : '#2C1810',
                border: `1px solid ${filter === cat.id ? '#2C1810' : 'rgba(44,24,16,0.2)'}`,
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sub‑category pills (only if a specific category is active) */}
        {filter !== 'all' && SUBCATEGORIES[filter] && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setSubFilter('all')}
              className="px-3 py-1 text-xs rounded-full transition-all"
              style={{
                fontFamily: "'Jost',sans-serif",
                background: subFilter === 'all' ? '#C9A84C' : 'transparent',
                color: subFilter === 'all' ? '#fff' : '#C9A84C',
                border: '1px solid #C9A84C',
              }}
            >
              All
            </button>
            {SUBCATEGORIES[filter].map(sub => (
              <button
                key={sub}
                onClick={() => setSubFilter(sub)}
                className="px-3 py-1 text-xs rounded-full transition-all"
                style={{
                  fontFamily: "'Jost',sans-serif",
                  background: subFilter === sub ? '#C9A84C' : 'transparent',
                  color: subFilter === sub ? '#fff' : '#C9A84C',
                  border: '1px solid #C9A84C',
                }}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-center py-16 text-sm" style={{ color: '#8B3A3A' }}>{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)
            : filtered.length === 0
            ? <p className="col-span-full text-center py-24" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#8B6F5E', fontSize: '1.25rem' }}>
                No projects in this category yet.
              </p>
            : filtered.map(p => <ProjectCard key={p.id} project={p} />)
          }
        </div>

        {!loading && projects.length > 0 && (
          <div className="text-center mt-16">
           <a href="#contact"
  className="inline-flex px-8 py-4 text-xs tracking-widest uppercase border transition-all hover:bg-[#2C1810] hover:text-[#FAF5E9] text-[#2C1810]"
  style={{ borderColor: '#2C1810', fontFamily: "'Jost',sans-serif" }}>
  Discuss Your Project
</a>
          </div>
        )}
      </div>
    </section>
  )
}