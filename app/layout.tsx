import type { Metadata } from 'next'
import { site } from '@/lib/site'
import './globals.css'
export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: { default: `${site.name} | Upholstery in Nairobi`, template: `%s | ${site.name}` },
  description: site.description,
  icons: { icon: '/icon.svg' },
  robots: site.indexable ? { index: true, follow: true } : { index: false, follow: true },
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang={site.language}><body><a className="skip-link" href="#main-content">Skip to content</a>{children}</body></html>
}
