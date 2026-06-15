'use client'
import Image from 'next/image'
import { Tag } from 'lucide-react'
import type { Project } from '@/lib/supabase'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card group relative overflow-hidden cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E8DFD0]">
        <Image src={project.image_url} alt={project.alt_text || project.title}
          fill className="object-cover"
          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" />
        <div className="overlay absolute inset-0 flex flex-col justify-end p-5"
          style={{ background: 'linear-gradient(to top,rgba(44,24,16,0.92) 0%,rgba(44,24,16,0.3) 60%,transparent 100%)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Tag size={10} color="#C9A84C" />
            <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.6rem', letterSpacing: '0.25em', color: '#C9A84C', textTransform: 'uppercase' }}>
              {project.category}
            </span>
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', color: '#FAF5E9', fontWeight: 300 }}>
            {project.title}
          </h3>
          <p className="text-xs font-light leading-relaxed mt-1 line-clamp-2"
            style={{ color: 'rgba(250,245,233,0.7)', fontFamily: "'Jost',sans-serif" }}>
            {project.description}
          </p>
        </div>
      </div>
      <div className="px-1 pt-3 pb-1" style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", color: '#2C1810', fontWeight: 300 }}>{project.title}</h3>
        <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', color: '#C9A84C', textTransform: 'uppercase' }}>
          {project.category}
        </span>
      </div>
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div>
      <div className="aspect-[4/3] skeleton" />
      <div className="pt-3 pb-1 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/3" />
      </div>
    </div>
  )
}