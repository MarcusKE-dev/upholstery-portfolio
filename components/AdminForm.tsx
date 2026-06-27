'use client'
import { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'
import { uploadImage, insertProject, type Project } from '@/lib/supabase'
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { CATEGORIES, SUBCATEGORIES, type CategoryId } from '@/lib/constants'

export default function AdminForm({ onProjectAdded }: { onProjectAdded: (p: Project) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<CategoryId>('residential')
  const [subcategory, setSubcategory] = useState('')
  const [altText, setAltText] = useState('')
  const [file, setFile] = useState<File | null>(null)          // main/after image
  const [beforeFile, setBeforeFile] = useState<File | null>(null) // before image (optional)
  const [preview, setPreview] = useState<string | null>(null)
  const [beforePreview, setBeforePreview] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle'|'compressing'|'uploading'|'saving'|'done'|'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const beforeFileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, isBefore: boolean) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (isBefore) {
      setBeforeFile(f)
      const reader = new FileReader()
      reader.onload = ev => setBeforePreview(ev.target?.result as string)
      reader.readAsDataURL(f)
    } else {
      setFile(f)
      const reader = new FileReader()
      reader.onload = ev => setPreview(ev.target?.result as string)
      reader.readAsDataURL(f)
    }
  }

  const handleSubmit = async () => {
    // Only require the main image
    if (!file) {
      setErrorMsg('Please select a main image.')
      setStatus('error')
      return
    }

    try {
      setErrorMsg('')
      setStatus('compressing')

      // Compress main image
      const compressedMain = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        fileType: 'image/webp',
        useWebWorker: true,
      })

      // Compress before image if provided
      let beforeImageUrl: string | null = null
      if (beforeFile) {
        const compressedBefore = await imageCompression(beforeFile, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          fileType: 'image/webp',
          useWebWorker: true,
        })
        setStatus('uploading')
        beforeImageUrl = await uploadImage(compressedBefore as File)
      }

      setStatus('uploading')
      const mainImageUrl = await uploadImage(compressedMain as File)

      setStatus('saving')
      // Build project object with defaults for missing fields
      const finalTitle = title.trim() || 'Untitled'
      const finalDescription = description.trim() || ''
      const finalCategory = category || 'residential'
      const finalSubcategory = subcategory || ''
      const finalAlt = altText.trim() || finalTitle

      const projectData = {
        title: finalTitle,
        description: finalDescription,
        category: finalCategory,
        subcategory: finalSubcategory,
        image_url: mainImageUrl,
        before_image_url: beforeImageUrl,
        alt_text: finalAlt,
      }

      const { data, error } = await insertProject(projectData)

      if (error) throw new Error(`Database insert failed: ${error.message} (code: ${error.code})`)

      if (data) {
        onProjectAdded(data)
        // Reset form
        setTitle('')
        setDescription('')
        setCategory('residential')
        setSubcategory('')
        setAltText('')
        setFile(null)
        setBeforeFile(null)
        setPreview(null)
        setBeforePreview(null)
        setStatus('done')
        setTimeout(() => setStatus('idle'), 2000)
      }
    } catch (e: unknown) {
      console.error(e)
      setErrorMsg(e instanceof Error ? e.message : 'Upload failed')
      setStatus('error')
    }
  }

  return (
    <div className="border p-6" style={{ borderColor: 'rgba(201,168,76,0.25)', background: '#fff' }}>
      <h3 className="text-xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#2C1810' }}>
        Add New Project
      </h3>

      <div className="space-y-4">
        {/* Title - optional */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Title (optional)</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-3 outline-none"
            style={{ background: '#FAF5E9', border: '1px solid rgba(44,24,16,0.15)', fontFamily: "'Jost',sans-serif" }}
            placeholder="e.g. Classic Chesterfield Sofa"
          />
        </div>

        {/* Description - optional */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Description (optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 outline-none"
            style={{ background: '#FAF5E9', border: '1px solid rgba(44,24,16,0.15)', fontFamily: "'Jost',sans-serif" }}
            placeholder="Brief description of the project..."
          />
        </div>

        {/* Category - optional, default residential */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Category (optional)</label>
          <select
            value={category}
            onChange={e => { setCategory(e.target.value as CategoryId); setSubcategory('') }}
            className="w-full px-4 py-3 outline-none"
            style={{ background: '#FAF5E9', border: '1px solid rgba(44,24,16,0.15)', fontFamily: "'Jost',sans-serif" }}
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Subcategory - optional */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Subcategory (optional)</label>
          <select
            value={subcategory}
            onChange={e => setSubcategory(e.target.value)}
            className="w-full px-4 py-3 outline-none"
            style={{ background: '#FAF5E9', border: '1px solid rgba(44,24,16,0.15)', fontFamily: "'Jost',sans-serif" }}
          >
            <option value="">None</option>
            {SUBCATEGORIES[category as CategoryId]?.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Alt Text - optional */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Alt Text (optional)</label>
          <input
            type="text"
            value={altText}
            onChange={e => setAltText(e.target.value)}
            className="w-full px-4 py-3 outline-none"
            style={{ background: '#FAF5E9', border: '1px solid rgba(44,24,16,0.15)', fontFamily: "'Jost',sans-serif" }}
            placeholder="SEO-friendly description"
          />
        </div>

        {/* Main Image Upload */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Main Image (required)</label>
          <div
            className="border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#FAF5E9] transition-colors"
            style={{ borderColor: 'rgba(201,168,76,0.4)' }}
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Main preview" className="max-h-32 object-contain" />
            ) : (
              <>
                <Upload size={26} color="#C9A84C" strokeWidth={1.5} />
                <p className="text-sm font-light" style={{ color: '#2C1810', fontFamily: "'Jost',sans-serif" }}>
                  Click to select main image
                </p>
                <p className="text-xs" style={{ color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>
                  JPEG, PNG, WebP · auto‑compressed to WebP ≤ 1200px
                </p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFile(e, false)}
            />
          </div>
          {file && (
            <p className="mt-2 text-xs" style={{ color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>
              {file.name} ({(file.size / 1024).toFixed(0)} KB)
            </p>
          )}
        </div>

        {/* Before Image Upload (optional) */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#8B6F5E] mb-1">Before Image (optional)</label>
          <div
            className="border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#FAF5E9] transition-colors"
            style={{ borderColor: 'rgba(201,168,76,0.3)' }}
            onClick={() => beforeFileRef.current?.click()}
          >
            {beforePreview ? (
              <img src={beforePreview} alt="Before preview" className="max-h-32 object-contain" />
            ) : (
              <>
                <Upload size={22} color="#C9A84C" strokeWidth={1.5} />
                <p className="text-sm font-light" style={{ color: '#2C1810', fontFamily: "'Jost',sans-serif" }}>
                  Click to select before photo (optional)
                </p>
              </>
            )}
            <input
              ref={beforeFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleFile(e, true)}
            />
          </div>
          {beforeFile && (
            <p className="mt-2 text-xs" style={{ color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>
              {beforeFile.name} ({(beforeFile.size / 1024).toFixed(0)} KB)
            </p>
          )}
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-sm" style={{ color: '#8B3A3A' }}>
            <AlertCircle size={13} />
            {errorMsg}
          </div>
        )}
        {status === 'done' && (
          <div className="flex items-center gap-2 text-sm" style={{ color: '#3A7A3A' }}>
            <CheckCircle size={13} />
            Project added successfully!
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={['compressing', 'uploading', 'saving', 'done'].includes(status)}
          className="w-full py-3 text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all disabled:opacity-60"
          style={{ background: '#2C1810', color: '#FAF5E9', fontFamily: "'Jost',sans-serif" }}
        >
          {status === 'compressing' && <><Loader2 size={13} className="animate-spin" />Compressing…</>}
          {status === 'uploading' && <><Loader2 size={13} className="animate-spin" />Uploading…</>}
          {status === 'saving' && <><Loader2 size={13} className="animate-spin" />Saving…</>}
          {status === 'done' && <><CheckCircle size={13} />Saved!</>}
          {(status === 'idle' || status === 'error') && <>Add Project</>}
        </button>
      </div>
    </div>
  )
}