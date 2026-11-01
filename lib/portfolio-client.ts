// Compatibility for retained static design components; live public HTML is supplied by Pages Functions.
import type {Project} from './project'
export type {Project} from './project'
export async function getPublicProjects():Promise<Project[]> {
 const response=await fetch('/api/content',{cache:'no-store'});if(!response.ok)throw Error('Portfolio unavailable.')
 const {records}=await response.json()
 return records.filter((d:any)=>d.kind==='project').map((d:any)=>({id:d.slug,title:d.title,description:d.description,category:d.category.replace(/^category-/,''),subcategory:d.subcategory,image_url:d.cover,alt_text:d.title,before_image_url:d.media?.find((m:any)=>m.before)?.before,video_url:d.media?.find((m:any)=>/\.(mp4|webm)$/.test(m.url))?.url,created_at:d.updated_at}))
}
export async function getArtisanImage():Promise<string|null>{const response=await fetch('/api/content',{cache:'no-store'});if(!response.ok)return null;const {records}=await response.json();return records.find((d:any)=>d.kind==='settings')?.profile||null}
