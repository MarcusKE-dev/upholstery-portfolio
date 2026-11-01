import Link from 'next/link'
import { site } from '@/lib/site'
export default function Footer() {
  return <footer className="site-footer py-10 px-6 border-t"><div className="max-w-7xl mx-auto space-y-5">
    <p className="font-serif text-2xl">{site.name}</p>
    <p>Upholstery, furniture restoration and interior furnishings in Nairobi, Kenya.</p>
    <nav aria-label="Footer" className="flex flex-wrap gap-6"><Link href="/portfolio">Portfolio</Link><Link href="/services">Services</Link><Link href="/guides">Guides</Link><Link href="/process">Discussing a project</Link><Link href="/contact">Contact</Link></nav>
    <p className="text-sm">© {new Date().getFullYear()} {site.name}</p>
  </div></footer>
}
