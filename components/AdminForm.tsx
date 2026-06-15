'use client'
import { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'
import { uploadImage, insertProject, type Project } from '@/lib/supabase'
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const CATS: Project['category'][] = ['Sofa','Chairs','Restorations','Living Room','Restaurant','Before & After']

export default function AdminForm({ onProjectAdded }: { onProjectAdded: (p: Project) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Project['category']>('Sofa')
  const [altText, setAltText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle'|'compressing'|'uploading'|'saving'|'done'|'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  const handleSubmit = async () => {
    if (!title || !description || !file) { setErrorMsg('Fill all fields and select an image.'); setStatus('error'); return }
    try {
      setErrorMsg('')
      setStatus('compressing')
      const compressed = await imageCompression(file, { maxSizeMB: 0.8, maxWidthOrHeight: 1600, useWebWorker: true })
      setStatus('uploading')
      const imageUrl = await uploadImage(compressed as File)
      setStatus('saving')
      const project = await insertProject({ title, description, category, image_url: imageUrl, alt_text: altText || title })
      onProjectAdded(project)
      setStatus('done')
      setTimeout(() => {
        setTitle(''); setDescription(''); setAltText(''); setFile(null); setPreview(null); setCategory('Sofa'); setStatus('idle')
        if (fileRef.current) fileRef.current.value = ''
      }, 2000)
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'An error occurred')
      setStatus('error')
    }
  }

  const inp = { background: '#FAF5E9', border: '1px solid rgba(44,24,16,0.15)', color: '#2C1810', fontFamily: "'Jost',sans-serif", fontSize: '0.875rem' }
  const lbl = { display: 'block' as const, fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: '#8B6F5E', fontFamily: "'Jost',sans-serif", marginBottom: 6 }

  return (
    <div className="p-8 border" style={{ borderColor: 'rgba(201,168,76,0.25)', background: '#fff' }}>
      <h2 className="text-2xl font-light mb-8" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#2C1810' }}>Upload New Project</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label style={lbl}>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Victorian Chesterfield Restoration" className="w-full px-4 py-3 outline-none" style={inp} />
        </div>
        <div>
          <label style={lbl}>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value as Project['category'])} className="w-full px-4 py-3 outline-none" style={inp}>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label style={lbl}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the work done, materials used…" rows={3} className="w-full px-4 py-3 outline-none resize-none" style={inp} />
        </div>
        <div className="md:col-span-2">
          <label style={lbl}>Alt Text (SEO)</label>
          <input type="text" value={altText} onChange={e => setAltText(e.target.value)} placeholder="e.g. Restored leather sofa Karen Nairobi" className="w-full px-4 py-3 outline-none" style={inp} />
        </div>
        <div className="md:col-span-2">
          <label style={lbl}>Project Image</label>
          <div className="border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#FAF5E9] transition-colors"
            style={{ borderColor: 'rgba(201,168,76,0.4)' }} onClick={() => fileRef.current?.click()}>
            {preview
              ? <img src={preview} alt="Preview" className="max-h-48 object-contain" />
              : <>
                  <Upload size={26} color="#C9A84C" strokeWidth={1.5} />
                  <p className="text-sm font-light" style={{ color: '#2C1810', fontFamily: "'Jost',sans-serif" }}>Click to select image</p>
                  <p className="text-xs" style={{ color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>JPEG, PNG, WebP · auto-compressed</p>
                </>
            }
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
          {file && <p className="mt-2 text-xs" style={{ color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>{file.name} ({(file.size / 1024).toFixed(0)} KB)</p>}
        </div>
      </div>

      {status === 'error' && <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: '#8B3A3A' }}><AlertCircle size={13} />{errorMsg}</div>}
      {status === 'done' && <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: '#3A7A3A' }}><CheckCircle size={13} />Project uploaded successfully!</div>}

      <button onClick={handleSubmit} disabled={['compressing','uploading','saving','done'].includes(status)}
        className="mt-8 w-full py-4 text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all disabled:opacity-60"
        style={{ background: '#2C1810', color: '#FAF5E9', fontFamily: "'Jost',sans-serif" }}>
        {status === 'compressing' && <><Loader2 size={13} className="animate-spin" />Compressing…</>}
        {status === 'uploading' && <><Loader2 size={13} className="animate-spin" />Uploading…</>}
        {status === 'saving' && <><Loader2 size={13} className="animate-spin" />Saving…</>}
        {status === 'done' && <><CheckCircle size={13} />Saved!</>}
        {(status === 'idle' || status === 'error') && <>Upload Project</>}
      </button>
    </div>
  )
}