import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ArtisanSection from '@/components/ArtisanSection'
import HomePortfolio from '@/components/HomePortfolio'
import Footer from '@/components/Footer'
import StructuredData from '@/components/StructuredData'
import Link from 'next/link'
import { absoluteUrl, pageMetadata, site } from '@/lib/site'
import ServicesSection from '@/components/ServicesSection'
import Contact from '@/components/Contact'
import WhatsAppFloat from '@/components/WhatsAppFloat'

export const dynamic = 'force-static'
export const metadata = pageMetadata('Upholstery & Furniture Restoration in Nairobi', 'Explore furniture upholstery, sofa restoration, upholstered beds, curtains and interior furnishings in Nairobi, Kenya. Browse work and discuss your project.', '/')

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <ArtisanSection />
        <HomePortfolio />
        <ServicesSection />
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16"><h2 className="font-serif text-4xl mb-5">Plan your next furnishing project</h2><p className="mb-5">Compare materials, understand repair options and prepare a useful enquiry.</p><div className="flex flex-wrap gap-8"><Link className="underline" href="/services">Explore services</Link><Link className="underline" href="/guides">Read the guides</Link><Link className="underline" href="/process">Prepare an enquiry</Link></div></section>
        <Contact />
      </main>
      <Footer />
      <StructuredData data={{ '@type': 'Organization', name: site.name, url: absoluteUrl('/'), description: site.description }} />
      <StructuredData data={{ '@type': 'WebSite', name: site.name, url: absoluteUrl('/'), inLanguage: site.language }} />
      <WhatsAppFloat />
    </>
  )
}