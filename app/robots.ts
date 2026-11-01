export const dynamic='force-static'
import type { MetadataRoute } from 'next'
import { absoluteUrl, site } from '@/lib/site'
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: '/', disallow: ['/api/'] }, ...(site.indexable ? { sitemap: absoluteUrl('/sitemap.xml') } : {}) } }
