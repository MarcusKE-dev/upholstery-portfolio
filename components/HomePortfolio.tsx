import Link from 'next/link'
import DynamicPortfolio from './DynamicPortfolio'
export default function HomePortfolio(){return <section id="portfolio" className="py-16 lg:py-20 bg-[#FAF5E9]"><div className="max-w-7xl mx-auto px-6 lg:px-12"><div className="flex flex-wrap justify-between items-center gap-6 mb-10"><h2 className="font-serif text-4xl">Selected work</h2><Link href="/portfolio" className="content-button">Browse the portfolio</Link></div><DynamicPortfolio home /></div></section>}
