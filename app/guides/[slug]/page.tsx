import Link from 'next/link'
import { notFound } from 'next/navigation'
import PublicPage, { ContactCTA } from '@/components/PublicPage'
import ContentSections from '@/components/ContentSections'
import StructuredData from '@/components/StructuredData'
import { guides, services } from '@/lib/content'
import { absoluteUrl, pageMetadata } from '@/lib/site'
export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params: pending }: { params: Promise<{ slug: string }> }) { const params = await pending; const a = guides.find(a => a.slug === params.slug); if (!a) return {}; const m = pageMetadata(a.title, a.description, `/guides/${a.slug}`); return { ...m, openGraph: { ...m.openGraph, type: 'article', publishedTime: a.published } } }
export default async function Page({ params: pending }: { params: Promise<{ slug: string }> }) { const params = await pending;
  const a = guides.find(a => a.slug === params.slug); if (!a) notFound()
  const service = services.find(s => s.slug === a.service)!
  return <PublicPage title={a.title} intro={a.intro} path={`/guides/${a.slug}`} parent={{ label: 'Guides', path: '/guides' }}><article className="guide-article"><p className="article-date">Published <time dateTime={a.published}>{new Date(`${a.published}T12:00:00Z`).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Nairobi' })}</time></p>{a.table && <div className="table-scroll"><table><caption>Points to compare</caption><thead><tr>{a.table.head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{a.table.rows.map((r, i) => <tr key={i}>{r.map((v, j) => j === 0 ? <th scope="row" key={j}>{v}</th> : <td key={j}>{v}</td>)}</tr>)}</tbody></table></div>}<ContentSections sections={a.sections} />{a.sources && <section className="editorial"><h2>Technical references</h2><ul>{a.sources.map(s => <li key={s.url}><a href={s.url}>{s.label}</a></li>)}</ul><p>Product-specific instructions apply to the specified material. A reference does not imply Charles&apos; Interiors supplies that brand.</p></section>}<section className="editorial"><h2>Continue planning</h2><p><Link href={`/services/${service.slug}`}>{service.title}</Link> · <Link href="/process">Prepare an enquiry</Link></p><ul>{guides.filter(g => g.slug !== a.slug && (g.service === a.service || g.slug === 'upholstery-fabric-care')).slice(0, 3).map(g => <li key={g.slug}><Link href={`/guides/${g.slug}`}>{g.title}</Link></li>)}</ul></section></article><ContactCTA /><StructuredData data={{ '@type': 'Article', headline: a.title, description: a.description, datePublished: a.published, mainEntityOfPage: absoluteUrl(`/guides/${a.slug}`) }} /></PublicPage>
}
