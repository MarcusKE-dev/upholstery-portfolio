import { notFound } from 'next/navigation'
import Link from 'next/link'
import PublicPage, { ContactCTA } from '@/components/PublicPage'
import ContentSections from '@/components/ContentSections'
import StructuredData from '@/components/StructuredData'
import { services, guides } from '@/lib/content'
import { absoluteUrl, pageMetadata, site } from '@/lib/site'
export function generateStaticParams() { return services.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params: pending }: { params: Promise<{ slug: string }> }) { const params = await pending; const s = services.find(s => s.slug === params.slug); return s ? pageMetadata(s.title, s.description, `/services/${s.slug}`) : {} }
export default async function Page({ params: pending }: { params: Promise<{ slug: string }> }) { const params = await pending;
  const s = services.find(s => s.slug === params.slug); if (!s) notFound()
  return <PublicPage title={s.title} intro={s.intro} path={`/services/${s.slug}`} parent={{ label: 'Services', path: '/services' }}><ContentSections sections={s.sections} /><section className="editorial"><h2>Questions about this service</h2>{s.faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}<h2>Before you decide</h2><ul>{s.related.map(slug => { const a = guides.find(a => a.slug === slug)!; return <li key={slug}><Link href={`/guides/${slug}`}>{a.title}</Link></li> })}</ul><p><Link href="/portfolio">View available portfolio photographs</Link></p></section><ContactCTA /><StructuredData data={{ '@type': 'Service', name: s.title, description: s.intro, url: absoluteUrl(`/services/${s.slug}`), areaServed: 'Nairobi, Kenya', provider: { '@type': 'Organization', name: site.name, url: site.origin } }} /></PublicPage>
}
