export const dynamic='force-static'
import type {MetadataRoute} from 'next'
import {site,absoluteUrl} from '@/lib/site'
import {guides,services} from '@/lib/content'
export default function sitemap():MetadataRoute.Sitemap {
 if(!site.indexable)return []
 return ['/', '/portfolio','/services','/about','/contact','/process','/guides',...services.map(s=>`/services/${s.slug}`),...guides.map(g=>`/guides/${g.slug}`)].map(path=>({url:absoluteUrl(path)}))
}
