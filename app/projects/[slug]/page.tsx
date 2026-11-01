import PublicPage,{ContactCTA} from '@/components/PublicPage'
// Internal export template. Pages Functions resolves live IDs and approved legacy slugs.
export const dynamicParams=false
export function generateStaticParams(){return [{slug:'_template'}]}
export default function Page(){return <PublicPage title="Project photographs" intro="Photographs and details recorded with this portfolio item." path="/projects/_template" parent={{label:'Portfolio',path:'/portfolio'}}><div id="project-detail" suppressHydrationWarning/><ContactCTA/></PublicPage>}
