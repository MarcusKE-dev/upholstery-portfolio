'use client'
import { useState, useEffect } from 'react'
import { getProjects, type Project } from '@/lib/supabase'
import AdminForm from '@/components/AdminForm'
import AdminTable from '@/components/AdminTable'
import AdminArtisanPhoto from '@/components/AdminArtisanPhoto'
import AdminEditModal from '@/components/AdminEditModal'
import { LogOut, LayoutDashboard, Loader2 } from 'lucide-react'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  useEffect(() => {
    if (sessionStorage.getItem('atelier_admin') === 'true') setAuthed(true)
  }, [])

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    getProjects().then(setProjects).catch(console.error).finally(() => setLoading(false))
  }, [authed])

  const handleLogin = () => {
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123')) {
      sessionStorage.setItem('atelier_admin', 'true')
      setAuthed(true); setAuthError('')
    } else {
      setAuthError('Incorrect password.')
    }
  }

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'radial-gradient(ellipse at center,#F0E6D3 0%,#FDFAF4 100%)' }}>
      <div className="w-full max-w-sm p-10 border" style={{ borderColor: 'rgba(201,168,76,0.3)', background: '#fff' }}>
        <div className="text-center mb-10">
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', color: '#2C1810', fontWeight: 300 }}>Atelier</div>
          <div style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.6rem', letterSpacing: '0.35em', color: '#C9A84C', textTransform: 'uppercase', marginTop: 4 }}>Admin Dashboard</div>
        </div>
        <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B6F5E', fontFamily: "'Jost',sans-serif", marginBottom: 6 }}>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="Enter admin password" className="w-full px-4 py-3 outline-none mb-4"
          style={{ background: '#FAF5E9', border: '1px solid rgba(44,24,16,0.15)', color: '#2C1810', fontFamily: "'Jost',sans-serif" }} />
        {authError && <p className="text-xs mb-4" style={{ color: '#8B3A3A', fontFamily: "'Jost',sans-serif" }}>{authError}</p>}
        <button onClick={handleLogin} className="w-full py-3.5 text-xs tracking-widest uppercase hover:bg-[#4A2E1E] transition-colors"
          style={{ background: '#2C1810', color: '#FAF5E9', fontFamily: "'Jost',sans-serif" }}>Sign In</button>
        <div className="mt-6 text-center">
          <a href="/" style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#8B6F5E', textTransform: 'uppercase' }}>← Back to Portfolio</a>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#FDFAF4' }}>
      <header className="sticky top-0 z-10 h-16 flex items-center justify-between px-6 lg:px-12 border-b"
        style={{ background: '#fff', borderColor: 'rgba(201,168,76,0.2)' }}>
        <div className="flex items-center gap-3">
          <LayoutDashboard size={17} color="#C9A84C" strokeWidth={1.5} />
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: '#2C1810', fontWeight: 300 }}>Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/" target="_blank" className="hidden md:block text-xs tracking-widest uppercase" style={{ color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>View Site ↗</a>
          <button onClick={() => { sessionStorage.removeItem('atelier_admin'); setAuthed(false) }}
            className="flex items-center gap-2 text-xs tracking-widest uppercase" style={{ color: '#8B3A3A', fontFamily: "'Jost',sans-serif" }}>
            <LogOut size={13} strokeWidth={1.5} />Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 lg:px-12 py-12 space-y-10">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['Total', projects.length],
            ['Residential', projects.filter(p => p.category === 'residential').length],
            ['Window', projects.filter(p => p.category === 'window').length],
            ['Bedroom', projects.filter(p => p.category === 'bedroom').length],
          ].map(([l, v]) => (
            <div key={l} className="p-5 border text-center" style={{ borderColor: 'rgba(201,168,76,0.2)', background: '#fff' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', color: '#2C1810', fontWeight: 300 }}>{v}</div>
              <div style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#8B6F5E', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        <AdminArtisanPhoto />
        <AdminForm onProjectAdded={p => setProjects(prev => [p, ...prev])} />

        {loading
          ? <div className="flex justify-center py-16"><Loader2 size={22} className="animate-spin" color="#C9A84C" /></div>
          : <AdminTable projects={projects} onDeleted={id => setProjects(prev => prev.filter(p => p.id !== id))} onEdit={setEditingProject} />
        }
      </main>

      {editingProject && (
        <AdminEditModal
          project={editingProject}
          onUpdate={(updated) => {
            setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
            setEditingProject(null)
          }}
          onClose={() => setEditingProject(null)}
        />
      )}
    </div>
  )
}