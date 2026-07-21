import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import InquiryForm from './InquiryForm'

export default function Contact() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254XXXXXXXXX'
  const waLink = `https://wa.me/${number}?text=Hi%2C%20I%20am%20interested%20in%20your%20services.`

  return (
    <section id="contact" className="py-16 lg:py-20" style={{ background: '#FAF5E9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-px" style={{ background: '#C9A84C' }} />
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: '0.6rem', letterSpacing: '0.35em', color: '#C9A84C', textTransform: 'uppercase' }}>Contact</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h2 className="text-4xl lg:text-5xl font-light mb-6" style={{ fontFamily: "'Cormorant Garamond',serif", color: '#2C1810' }}>
              Let&apos;s Begin Your <br />
              <em className="italic" style={{ color: '#C9A84C' }}>Restoration</em>
            </h2>
            <p className="text-base font-light leading-relaxed mb-8 max-w-md" style={{ color: '#4A2E1E', fontFamily: "'Jost',sans-serif" }}>
              Every project begins with a conversation. Tell us about your piece and we will guide you to the best solution.
            </p>
            <div className="space-y-4 mb-8">
              {/* Address – kept as text */}
              <div className="flex items-start gap-4">
                <MapPin size={15} color="#C9A84C" strokeWidth={1.5} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm font-light" style={{ color: '#4A2E1E', fontFamily: "'Jost',sans-serif" }}>
                  Nairobi, Kenya · Karen · Lavington · Westlands
                </span>
              </div>

              {/* Phone – now clickable tel link */}
              <div className="flex items-start gap-4">
                <Phone size={15} color="#C9A84C" strokeWidth={1.5} className="mt-0.5 flex-shrink-0" />
                <a href={`tel:+${number}`} className="text-sm font-light hover:underline" style={{ color: '#4A2E1E', fontFamily: "'Jost',sans-serif" }}>
                  +{number}
                </a>
              </div>

              {/* Email – now clickable mailto link */}
              <div className="flex items-start gap-4">
                <Mail size={15} color="#C9A84C" strokeWidth={1.5} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:charlieluner@gmail.com" className="text-sm font-light hover:underline" style={{ color: '#4A2E1E', fontFamily: "'Jost',sans-serif" }}>
                  charlieluner@gmail.com
                </a>
              </div>

              {/* Hours – kept as text */}
              <div className="flex items-start gap-4">
                <Clock size={15} color="#C9A84C" strokeWidth={1.5} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm font-light" style={{ color: '#4A2E1E', fontFamily: "'Jost',sans-serif" }}>
                  Mon – Sat · 8:00 AM – 6:00 PM
                </span>
              </div>
            </div>

            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 min-h-[44px] text-xs tracking-widest uppercase"
              style={{ background: '#25D366', color: '#fff', fontFamily: "'Jost',sans-serif" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
          <InquiryForm />
        </div>
      </div>
    </section>
  )
}