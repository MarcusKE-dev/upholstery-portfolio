'use client'
import { useState, useEffect } from 'react'
import imageCompression from 'browser-image-compression'
import { uploadImage, getArtisanImage, updateArtisanImage } from '@/lib/supabase'
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function AdminArtisanPhoto() {
    const [currentImage, setCurrentImage] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [status, setStatus] = useState<'idle' | 'compressing' | 'uploading' | 'saving' | 'done' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(true)

    const loadImage = async () => {
        setLoading(true)
        try {
            const url = await getArtisanImage()
            console.log('[AdminArtisanPhoto] loaded URL:', url)
            setCurrentImage(url)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadImage()
    }, [])

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f)
        const reader = new FileReader()
        reader.onload = ev => setPreview(ev.target?.result as string)
        reader.readAsDataURL(f)
    }

   const handleUpload = async () => {
  if (!file) { setErrorMsg('Please select an image first.'); setStatus('error'); return; }
  try {
    setErrorMsg('');
    setStatus('uploading'); // skip compression step
    const imageUrl = await uploadImage(file); // upload original file
    setStatus('saving');
    const { error } = await updateArtisanImage(imageUrl);
    if (error) throw new Error(error.message);
    await loadImage();
    setStatus('done');
    setFile(null);
    setPreview(null);
    setTimeout(() => setStatus('idle'), 2000);
  } catch (e: unknown) {
    console.error('Upload error:', e);
    setErrorMsg(e instanceof Error ? e.message : 'Upload failed');
    setStatus('error');
  }
};

    const inpStyle: React.CSSProperties = {
        background: '#FAF5E9',
        border: '1px solid rgba(44,24,16,0.15)',
        color: '#2C1810',
        fontFamily: "'Jost',sans-serif",
        fontSize: '0.875rem',
    }
    const lblStyle: React.CSSProperties = {
        display: 'block',
        fontSize: '0.6rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: '#8B6F5E',
        fontFamily: "'Jost',sans-serif",
        marginBottom: 6,
    }

    if (loading) {
        return (
            <div className="p-8 border" style={{ borderColor: 'rgba(201,168,76,0.25)', background: '#fff' }}>
                <div className="flex justify-center py-8">
                    <Loader2 size={22} className="animate-spin" color="#C9A84C" />
                </div>
            </div>
        )
    }

    return (
        <div className="p-8 border" style={{ borderColor: 'rgba(201,168,76,0.25)', background: '#fff' }}>
            <h3 className="text-xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#2C1810' }}>
                Artisan Profile Photo
            </h3>

            {currentImage && (
                <div className="mb-6">
                    <label style={lblStyle}>Current Photo</label>
                    <div className="relative w-40 h-40 overflow-hidden rounded-sm border" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
                        <Image src={currentImage} alt="Artisan" fill className="object-cover" />
                    </div>
                </div>
            )}

            <div>
                <label style={lblStyle}>Upload New Photo</label>
                <div
                    className="border-2 border-dashed p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-[#FAF5E9] transition-colors"
                    style={{ borderColor: 'rgba(201,168,76,0.4)' }}
                    onClick={() => document.getElementById('artisan-file-input')?.click()}
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="max-h-32 object-contain" />
                    ) : (
                        <>
                            <Upload size={26} color="#C9A84C" strokeWidth={1.5} />
                            <p className="text-sm font-light" style={{ color: '#2C1810', fontFamily: "'Jost',sans-serif" }}>
                                Click to select image
                            </p>
                            <p className="text-xs" style={{ color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>
                                JPEG, PNG, WebP · auto‑compressed to WebP ≤ 800px
                            </p>
                        </>
                    )}
                    <input
                        id="artisan-file-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFile}
                    />
                </div>
                {file && (
                    <p className="mt-2 text-xs" style={{ color: '#8B6F5E', fontFamily: "'Jost',sans-serif" }}>
                        {file.name} ({(file.size / 1024).toFixed(0)} KB)
                    </p>
                )}
            </div>

            {status === 'error' && (
                <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: '#8B3A3A' }}>
                    <AlertCircle size={13} />
                    {errorMsg}
                </div>
            )}
            {status === 'done' && (
                <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: '#3A7A3A' }}>
                    <CheckCircle size={13} />
                    Artisan photo updated successfully!
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!file || ['compressing', 'uploading', 'saving', 'done'].includes(status)}
                className="mt-6 w-full py-3 text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all disabled:opacity-60"
                style={{ background: '#2C1810', color: '#FAF5E9', fontFamily: "'Jost',sans-serif" }}
            >
                {status === 'compressing' && <><Loader2 size={13} className="animate-spin" />Compressing…</>}
                {status === 'uploading' && <><Loader2 size={13} className="animate-spin" />Uploading…</>}
                {status === 'saving' && <><Loader2 size={13} className="animate-spin" />Saving…</>}
                {status === 'done' && <><CheckCircle size={13} />Saved!</>}
                {(status === 'idle' || status === 'error') && <>Upload Artisan Photo</>}
            </button>
        </div>
    )
}