import type { Section } from './content'
// Explicit editorial approval only; no fabricated cases or category evidence.
export const caseStudies: Record<string,{id:string;sections:Section[];summary:string;service:string}>={}
export const portfolioCategories:Record<string,{id:string;title:string;intro:string}>={}
export const projectPath=(id:string)=>{const e=Object.entries(caseStudies).find(([,v])=>v.id===id);return e?`/projects/${e[0]}`:null}
