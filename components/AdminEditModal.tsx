'use client'
import { useState, useRef } from 'react'
import { updateProject, uploadImage, type Project } from '@/lib/supabase'
import { X, Loader2, Upload, AlertCircle } from 'lucide-react'
import { CATEGORIES, SUBCATEGORIES, type CategoryId } from '@/lib/constants'
import imageCompression from 'browser-image-compression'

export default function AdminEditModal({
  project,
  onUpdate,
  onClose,
}: {
  project: Project
  onUpdate: (updated: Project) => void
  onClose: () => void
}) {
  const [title, setTitle] = useState(project.title)
  const [description, setDescription] = useState(project.description)
  const [category, setCategory] = useState<CategoryId>(project.category as CategoryId)
  const [subcategory, setSubcategory] = useState(project.subcategory || '')
  const [altText, setAltText] = useState(project.alt_text || '')
  const [newMainFile, setNewMainFile] = useState<File | null>(null)
  const [newBeforeFile, setNewBeforeFile] = useState<File | null>(null)
  const [mainPreview, setMainPreview] = useState<string | null>(null)
  const [beforePreview, setBeforePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const mainFileRef = useRef<HTMLInputElement>(null)
  const beforeFileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (isMain) {
      setNewMainFile(file)
      const reader = new FileReader()
      reader.onload = ev => setMainPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setNewBeforeFile(file)
      const reader = new FileReader()
      reader.onload = ev => setBeforePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category) {
      setError('Title, Description, and Category are required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      let newMainUrl = project.image_url
      let newBeforeUrl = project.before_image_url

      // If a new main image is provided, upload it
      if (newMainFile) {
        const compressed = await imageCompression(newMainFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          fileType: 'image/webp',
          useWebWorker: true,
        })
        newMainUrl = await uploadImage(compressed as File)
      }

      // If a new before image is provided, upload it
      if (newBeforeFile) {
        const compressed = await imageCompression(newBeforeFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          fileType: 'image/webp',
          useWebWorker: true,
        })
        newBeforeUrl = await uploadImage(compressed as File)
      }

      const updates = {
        title: title.trim(),
        description: description.trim(),
        category,
        subcategory: subcategory.trim() || '',
        alt_text: altText.trim() || title.trim(),
        image_url: newMainUrl,
        before_image_url: newBeforeUrl,
      }

      const { data, error } = await updateProject(project.id, updates)
      if (error) throw error
      if (data) onUpdate(data)
      onClose()
    } catch (e: any) {
      setError(e.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-lg w-full p-6 relative max-h-[90vh] overflow-auto">
        <button onClick={onClose} className="absolute top-3 right-3">
          <X size={20} />
        </button>
        <h3 className="text-xl font-light mb-4" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#2C1810' }}>
          Edit Project
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 outline-none"
              style={{ background: '#FAF5E9', border: '1px solid rgba(44,24,16,0.15)' }}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Description *</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 outline-none"
              style={{ background: '#FAF5E9', border: '1px solid rgba(44,24,16,0.15)' }}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Category *</label>
            <select
              value={category}
              onChange={e => { setCategory(e.target.value as CategoryId); setSubcategory('') }}
              className="w-full px-4 py-3 outline-none"
              style={{ background: '#FAF5E9', border: '1px solid rgba(44,24,16,0.15)' }}
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Subcategory</label>
            <select
              value={subcategory}
              onChange={e => setSubcategory(e.target.value)}
              className="w-full px-4 py-3 outline-none"
              style={{ background: '#FAF5E9', border: '1px solid rgba(44,24,16,0.15)' }}
            >
              <option value="">None</option>
              {SUBCATEGORIES[category]?.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Alt Text</label>
            <input
              value={altText}
              onChange={e => setAltText(e.target.value)}
              className="w-full px-4 py-3 outline-none"
              style={{ background: '#FAF5E9', border: '1px solid rgba(44,24,16,0.15)' }}
            />
          </div>

          {/* Current Main Image */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Current Main Image</label>
            <img src={project.image_url} alt="Current main" className="max-h-32 object-contain border" />
          </div>

          {/* Replace Main Image */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Replace Main Image (optional)</label>
            <div
              className="border-2 border-dashed p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#FAF5E9] transition-colors"
              style={{ borderColor: 'rgba(201,168,76,0.4)' }}
              onClick={() => mainFileRef.current?.click()}
            >
              {mainPreview ? (
                <img src={mainPreview} alt="New main preview" className="max-h-24 object-contain" />
              ) : (
                <>
                  <Upload size={20} color="#C9A84C" />
                  <p className="text-sm" style={{ color: '#2C1810' }}>Click to select new main image</p>
                </>
              )}
              <input ref={mainFileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, true)} />
            </div>
          </div>

          {/* Current Before Image (if any) */}
          {project.before_image_url && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Current Before Image</label>
              <img src={project.before_image_url} alt="Current before" className="max-h-24 object-contain border" />
            </div>
          )}

          {/* Replace Before Image */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Replace/Add Before Image (optional)</label>
            <div
              className="border-2 border-dashed p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#FAF5E9] transition-colors"
              style={{ borderColor: 'rgba(201,168,76,0.4)' }}
              onClick={() => beforeFileRef.current?.click()}
            >
              {beforePreview ? (
                <img src={beforePreview} alt="New before preview" className="max-h-24 object-contain" />
              ) : (
                <>
                  <Upload size={20} color="#C9A84C" />
                  <p className="text-sm" style={{ color: '#2C1810' }}>Click to select new before image</p>
                </>
              )}
              <input ref={beforeFileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, false)} />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-[#2C1810] text-white text-xs uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Updating...' : 'Update Project'}
          </button>
        </div>
      </div>
    </div>
  )
}