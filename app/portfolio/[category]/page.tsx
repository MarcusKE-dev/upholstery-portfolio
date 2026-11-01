import {notFound} from 'next/navigation'
export const dynamicParams=false
export function generateStaticParams(){return [{category:'_template'}]}
export default function Page(){notFound()}
