import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Atelier Upholstery Nairobi | Bespoke Furniture Restoration',
  description:
    'Luxury upholstery and furniture restoration in Nairobi. Sofa repair Nairobi, furniture restoration Karen. High-density orthopedic foam, Italian top-grain leather, Turkish velvet, diamond tufting.',
  keywords: [
    'upholstery Nairobi', 'sofa repair Nairobi', 'furniture restoration Karen',
    'high-density orthopedic foam', 'Italian top-grain leather', 'Turkish velvet',
    'diamond tufting', 'structural webbing', 'bespoke upholstery Kenya',
  ],
  openGraph: {
    title: 'Atelier Upholstery Nairobi – Bespoke Furniture Restoration',
    description: 'Expert upholstery and furniture restoration in Nairobi. Before & after photos, premium materials, and master craftsmanship.',
    url: 'https://your-domain.com',
    siteName: 'Atelier Upholstery',
    images: [
      {
        url: 'https://your-domain.com/og-image.jpg', // replace with actual OG image
        width: 1200,
        height: 630,
        alt: 'Atelier Upholstery',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atelier Upholstery Nairobi – Bespoke Furniture Restoration',
    description: 'Expert upholstery and furniture restoration in Nairobi. Before & after photos, premium materials, and master craftsmanship.',
    images: ['https://your-domain.com/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://your-domain.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}