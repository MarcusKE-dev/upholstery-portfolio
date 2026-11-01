import Link from 'next/link'
import Navbar from './Navbar'
import Footer from './Footer'
import StructuredData from './StructuredData'
import { absoluteUrl } from '@/lib/site'
export function ContactCTA() {
  return <aside className="contact-cta"><h2>Discuss your furniture or furnishing project</h2><p>Share photographs, approximate measurements and what you would like to change. Ask which options suit your piece before deciding on the work.</p><Link className="content-button" href="/contact">Make an enquiry</Link></aside>
}
export default function PublicPage({ title, intro, path, parent, children }: { title: string; intro: string; path: string; parent?: { label: string; path: string }; children: React.ReactNode }) {
  const crumbs = [{ label: 'Home', path: '/' }, ...(parent ? [parent] : []), { label: title, path }]
  return <><Navbar /><main id="main-content" className="public-page"><nav aria-label="Breadcrumb"><ol className="breadcrumbs">{crumbs.map((c, i) => <li key={c.path}>{i < crumbs.length - 1 ? <Link href={c.path}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>)}</ol></nav>
    <header className="page-intro"><span className="eyebrow">Charles&apos; Interiors <span aria-hidden="true">·</span> Nairobi</span><h1>{title}</h1><p>{intro}</p></header>{children}
    <StructuredData data={{ '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: absoluteUrl(c.path) })) }} />
  </main><Footer /></>
}
