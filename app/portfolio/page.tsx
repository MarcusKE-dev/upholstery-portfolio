import PublicPage,{ContactCTA} from '@/components/PublicPage'
import DynamicPortfolio from '@/components/DynamicPortfolio'
import {pageMetadata} from '@/lib/site'
export const metadata=pageMetadata('Upholstery and furnishing portfolio','Browse available upholstery and furnishing photographs from the project gallery. Discuss your own furniture or window furnishing enquiry.','/portfolio')
export default function Page(){return <PublicPage title="Upholstery and furnishing portfolio" intro="Browse available photographs from the project gallery. Each entry contains the information recorded with that item. For a similar enquiry, describe your furniture and the changes you want rather than assuming identical materials or arrangements." path="/portfolio"><DynamicPortfolio/><ContactCTA/></PublicPage>}
