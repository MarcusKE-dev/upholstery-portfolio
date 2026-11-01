export interface Env {
 DB: D1Database
 MEDIA: R2Bucket
 ASSETS: Fetcher
 INDEXABLE?: string
 SITE_URL?: string
 ADMIN_ORIGIN?: string
 ADMIN_ENROLLMENT_TOKEN?: string
 RESEND_API_KEY?: string
 CHARLES_EMAIL?: string
 RESEND_FROM_EMAIL?: string
 CF_PAGES_BRANCH?: string
}
export class HttpError extends Error {
 constructor(public status: number,message: string) { super(message) }
}
export const json = (body: unknown,status=200,extra: Record<string,string>={}) => Response.json(body,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff',...extra}})
export async function bounded(req: Request,max: number) {
 if (Number(req.headers.get('content-length'))>max) throw new HttpError(413,'Request is too large.')
 const reader=req.body?.getReader();if(!reader) throw new HttpError(400,'Missing body.')
 const chunks:Uint8Array[]=[];let size=0
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new HttpError(413,'Request is too large.')}chunks.push(value)}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}return bytes
}
export async function body(req:Request,max=24000):Promise<Record<string,any>> {
 if(!req.headers.get('content-type')?.startsWith('application/json'))throw new HttpError(415,'Use JSON.')
 try {const v=JSON.parse(new TextDecoder().decode(await bounded(req,max)));if(!v||typeof v!=='object'||Array.isArray(v))throw new Error();return v}catch(e){if(e instanceof HttpError)throw e;throw new HttpError(400,'Invalid JSON.')}
}
export const now=()=>Math.floor(Date.now()/1000)
export const hex=(bytes:ArrayBuffer)=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('')
export const digest=async(value:string|Uint8Array)=>hex(await crypto.subtle.digest('SHA-256',typeof value==='string'?new TextEncoder().encode(value):value as Uint8Array<ArrayBuffer>))
export const randomToken=()=>hex(crypto.getRandomValues(new Uint8Array(32)).buffer)
