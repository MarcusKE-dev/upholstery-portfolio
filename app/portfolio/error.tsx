'use client'
import Link from 'next/link'
export default function Error({ reset }: { reset: () => void }) { return <main id="main-content" className="public-page"><h1>Portfolio temporarily unavailable</h1><p>The project service could not be reached. This does not mean the gallery is empty.</p><button className="content-button" onClick={reset}>Try again</button><p><Link href="/contact">Discuss a project</Link> · <Link href="/">Home</Link></p></main> }
