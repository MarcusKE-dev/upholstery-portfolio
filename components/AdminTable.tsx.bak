'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteProject, type Project } from '@/lib/supabase'

export default function AdminTable({ projects, onDeleted }: { projects: Project[], onDeleted: (id: string) => void }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (p: Project) => {
    if (confirmId !== p.id) { setConfirmId(p.id); return }
    try {
      setDeletingId(p.id); setError(null)
      await deleteProject(p.id, p.image_url)
      onDeleted(p.id)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    } finally {
      setDeletingId(null); setConfirmId(null)
    }
  }

  if (projects.length === 0)
    return <div className="text-center py-16 border text-sm" style={{ borderColor: 'rgba(201,168,76,0.2)', color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>No projects yet.</div>

  return (
    <div className="border" style={{ borderColor: 'rgba(201,168,76,0.25)' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(201,168,76,0.2)', background: '#FAF5E9' }}>
        <h3 className="text-xl font-light" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#2C1810' }}>All Projects ({projects.length})</h3>
      </div>
      {error && <div className="px-6 py-3 text-sm" style={{ background: '#FFF5F5', color: '#8B3A3A' }}>{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(201,168,76,0.06)', borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
              {['Image','Title','Category','Date','Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3" style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B6F5E', fontFamily: "'Jost',sans-serif", fontWeight: 400 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-b hover:bg-[#FAF5E9] transition-colors" style={{ borderColor: 'rgba(44,24,16,0.06)' }}>
                <td className="px-5 py-4">
                  <div className="relative w-16 h-12 overflow-hidden bg-[#E8DFD0]">
                    <Image src={p.image_url} alt={p.alt_text} fill className="object-cover" sizes="64px" />
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm font-light" style={{ color: '#2C1810', fontFamily: "'Jost',sans-serif" }}>{p.title}</div>
                  <div className="text-xs mt-0.5 line-clamp-1" style={{ color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>{p.description}</div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2 py-1" style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', fontFamily: "'Jost',sans-serif" }}>{p.category}</span>
                </td>
                <td className="px-5 py-4 text-xs" style={{ color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>
                  {new Date(p.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => handleDelete(p)} disabled={deletingId === p.id}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-widest transition-all"
                    style={{ border: `1px solid ${confirmId === p.id ? '#8B3A3A' : 'rgba(139,58,58,0.3)'}`, color: '#8B3A3A', background: confirmId === p.id ? 'rgba(139,58,58,0.08)' : 'transparent', fontFamily: "'Jost',sans-serif" }}>
                    {deletingId === p.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                    {confirmId === p.id ? 'Confirm?' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}