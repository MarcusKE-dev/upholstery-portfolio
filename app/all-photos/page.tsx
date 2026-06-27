import { getProjects } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'All Projects – Atelier Upholstery Nairobi',
  description: 'Browse all our upholstery projects including before and after photos of bespoke furniture restoration.',
}

export default async function AllPhotosPage() {
  const projects = await getProjects().catch(() => [])

  return (
    <div className="min-h-screen bg-[#FDFAF4] py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#8B6F5E] hover:text-[#2C1810] transition mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-4xl lg:text-5xl font-light mb-8" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#2C1810' }}>
          All Projects
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white border border-[rgba(201,168,76,0.2)] overflow-hidden">
              <div className="relative aspect-square bg-[#E8DFD0]">
                <Image
                  src={project.image_url}
                  alt={project.alt_text || project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {project.before_image_url && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    Before/After
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#2C1810' }}>
                  {project.title}
                </h3>
                <p className="text-xs text-[#8B6F5E] mt-1">{project.category} {project.subcategory ? `· ${project.subcategory}` : ''}</p>
                {project.description && (
                  <p className="text-xs text-[#4A2E1E] mt-2 line-clamp-2">{project.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="text-center py-20 text-[#8B6F5E]">No projects added yet.</p>
        )}
      </div>
    </div>
  )
}