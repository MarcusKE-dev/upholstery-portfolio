import type { Metadata } from 'next'

const configured = process.env.NEXT_PUBLIC_SITE_URL
function productionOrigin(value: string | undefined): string | null {
  if (!value) return null
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_SITE_URL must be an HTTPS origin without a path, credentials, query or fragment.')
  }
  return url.origin
}
const origin = productionOrigin(configured)
export const site = {
  name: "Charles' Interiors",
  description: 'Furniture upholstery, restoration, upholstered beds, curtains and interior furnishings in Nairobi, Kenya.',
  origin: origin ?? 'http://localhost:3000',
  indexable: Boolean(origin) && process.env.SITE_INDEXABLE === 'true',
  language: 'en-KE', locale: 'en_KE', area: 'Nairobi, Kenya',
  email: 'charlieluner@gmail.com',
  phone: /^\d{10,15}$/.test(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '') ? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER! : null,
  image: '/opengraph-image',
} as const
export const absoluteUrl = (path = '/') => new URL(path, site.origin).toString()
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title: path === '/' ? { absolute: `${title} | ${site.name}` } : title, description, alternates: { canonical: absoluteUrl(path) },
    openGraph: { title, description, url: absoluteUrl(path), siteName: site.name, locale: site.locale, type: 'website', images: [{ url: absoluteUrl(site.image), width: 1200, height: 630, alt: site.name }] },
    twitter: { card: 'summary_large_image', title, description, images: [absoluteUrl(site.image)] },
  }
}
