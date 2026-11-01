import type { Section } from '@/lib/content'
export default function ContentSections({ sections }: { sections: Section[] }) {
  return <div className="editorial">{sections.map(s => <section key={s.heading}><h2>{s.heading}</h2>{s.paragraphs.map(p => <p key={p}>{p}</p>)}</section>)}</div>
}
