import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/portfolio-client'
import { projectPath } from '@/lib/public-projects'
import { CATEGORIES } from '@/lib/constants'
export default function PortfolioGrid({ projects }: { projects: Project[] }) { return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">{projects.map(p => <article key={p.id}><figure><div className="relative aspect-[4/3] bg-[#E8DFD0]"><Image src={p.image_url} alt={p.alt_text || p.title} fill className="object-cover" sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw" /></div><figcaption><h2 className="font-serif text-2xl mt-4">{projectPath(p.id) ? <Link href={projectPath(p.id)!}>{p.title}</Link> : p.title}</h2><p className="text-sm mt-2">{CATEGORIES.find(c => c.id === p.category)?.label ?? 'Upholstery and furnishings'}</p>{p.description && <p className="mt-3">{p.description}</p>}</figcaption></figure></article>)}</div> }
