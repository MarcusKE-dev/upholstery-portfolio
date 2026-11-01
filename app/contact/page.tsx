import PublicPage from '@/components/PublicPage'
import Contact from '@/components/Contact'
import { pageMetadata } from '@/lib/site'
export const metadata = pageMetadata('Contact and upholstery enquiries in Nairobi', "Contact Charles' Interiors about upholstery, furniture restoration, beds or window furnishings in Nairobi. Prepare photos and measurements for your enquiry.", '/contact')
export default function Page() { return <PublicPage title="Discuss your project" intro="For upholstery and furnishing enquiries in Nairobi, Kenya, describe the item, its condition and the result you have in mind. Confirm arrangements for your location directly." path="/contact"><Contact /></PublicPage> }
